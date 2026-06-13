package app.project.EduCloud.service.Document.impl;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import app.project.EduCloud.Utils.FileTypeUtils;
import app.project.EduCloud.dto.request.Document.DocumentRequest;
import app.project.EduCloud.dto.response.Document.DocumentResponse;
import app.project.EduCloud.dto.response.Document.DownloadFileResponse;
import app.project.EduCloud.dto.response.PageResponse;
import app.project.EduCloud.dto.response.S3.S3UploadResponse;
import app.project.EduCloud.entity.Document;
import app.project.EduCloud.entity.Folder;
import app.project.EduCloud.entity.Major;
import app.project.EduCloud.entity.Subject;
import app.project.EduCloud.entity.User;
import app.project.EduCloud.enums.ActivityAction;
import app.project.EduCloud.enums.ActivityEntityType;
import app.project.EduCloud.enums.DocumentVisibility;
import app.project.EduCloud.enums.FileType;
import app.project.EduCloud.enums.NotificationType;
import app.project.EduCloud.exception.AppException;
import app.project.EduCloud.exception.ErrorCode;
import app.project.EduCloud.mapper.DocumentMapper;
import app.project.EduCloud.repository.DocumentRepository;
import app.project.EduCloud.repository.FolderRepository;
import app.project.EduCloud.repository.MajorRepository;
import app.project.EduCloud.repository.SubjectRepository;
import app.project.EduCloud.repository.UserRepository;
import app.project.EduCloud.service.ActivityLog.ActivityLogService;
import app.project.EduCloud.service.Document.DocumentService;
import app.project.EduCloud.service.Notification.NotificationService;
import app.project.EduCloud.service.S3.S3Service;
import jakarta.transaction.Transactional;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;

@Service
@Slf4j
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class DocumentServiceImpl implements DocumentService {
    DocumentRepository documentRepository;
    DocumentMapper documentMapper;
    S3Service s3Service;
    UserRepository userRepository;
    FolderRepository folderRepository;
    MajorRepository majorRepository;
    SubjectRepository subjectRepository;
    NotificationService notificationService;
    ActivityLogService activityLogService;

    private static final long DEFAULT_STORAGE_LIMIT = 5L * 1024 * 1024 * 1024;

    @Override
    @Transactional
    @PreAuthorize("hasRole('USER')")
    public DocumentResponse uploadDocument(DocumentRequest request) {
        MultipartFile file = request.getFile();

        User user = getCurrentUser();

        if (file == null || file.isEmpty()) {
            throw new AppException(ErrorCode.FILE_NOT_EXISTS);
        }

        long fileSize = file.getSize();

        long usedStorage = user.getStorageUsedBytes() == null
                ? 0L
                : user.getStorageUsedBytes();

        long limitStorage = user.getStorageLimitBytes() == null
                ? DEFAULT_STORAGE_LIMIT
                : user.getStorageLimitBytes();

        if (usedStorage + fileSize > limitStorage) {
            throw new AppException(ErrorCode.STORAGE_LIMIT_EXCEEDED);
        }

        Folder folder = null;
        if (request.getFolderId() != null && !request.getFolderId().isBlank()) {
            folder = folderRepository.findById(request.getFolderId())
                    .orElseThrow(() -> new AppException(ErrorCode.FOLDER_NOT_FOUND));

            if (!folder.getUser().getId().equals(user.getId())) {
                throw new AppException(ErrorCode.FOLDER_ACCESS_DENIED);
            }
        }

        DocumentVisibility visibility = request.getVisibility() != null
                ? request.getVisibility()
                : DocumentVisibility.PRIVATE;

        Major major = null;
        Subject subject = null;

        if (visibility == DocumentVisibility.PUBLIC) {
            if (request.getMajorId() == null || request.getMajorId().isBlank()
                    || request.getSubjectId() == null || request.getSubjectId().isBlank()) {
                throw new AppException(ErrorCode.PUBLIC_DOCUMENT_REQUIRED_METADATA);
            }

            major = majorRepository.findById(request.getMajorId())
                    .orElseThrow(() -> new AppException(ErrorCode.MAJOR_NOT_FOUND));

            subject = subjectRepository.findById(request.getSubjectId())
                    .orElseThrow(() -> new AppException(ErrorCode.SUBJECT_NOT_FOUND));
        }

        FileType fileType = FileTypeUtils.getFileType(file.getOriginalFilename());

        S3UploadResponse s3UploadResponse = s3Service.uploadFile(file, "documents");

        Document document = Document.builder()
                .documentName(file.getOriginalFilename())
                .uploadedBy(user)
                .subject(subject)
                .folder(folder)
                .major(major)
                .fileUrl(s3UploadResponse.fileUrl())
                .fileKey(s3UploadResponse.fileKey())
                .fileType(fileType.name())
                .mimeType(file.getContentType())
                .fileSize(fileSize)
                .visibility(request.getVisibility() != null
                                ? request.getVisibility() : DocumentVisibility.PRIVATE)
                .downloadCount(0)
                .createdAt(LocalDateTime.now())
                .build();

        documentRepository.save(document);

        user.setStorageUsedBytes(usedStorage + fileSize);
        userRepository.save(user);
        
        activityLogService.saveLog(
        user,
        ActivityAction.UPLOAD_DOCUMENT,
        ActivityEntityType.DOCUMENT,
        document.getId(),
        "Upload tài liệu \"" + document.getDocumentName() + "\""
);

        notificationService.createNotification(
        user,
        NotificationType.SUCCESS,
        "Upload thành công",
        "Tài liệu \"" + document.getDocumentName() + "\" đã được tải lên."
);
        return documentMapper.toDocumentResponse(document);
    }

    @Override
    @PreAuthorize("hasRole('ADMIN')")
    public PageResponse<DocumentResponse> getAllDocuments(int pageNo, int pageSize) {
        if(pageNo > 0){
            pageNo = pageNo - 1;
        }

        Pageable pageable = PageRequest.of(pageNo, pageSize);

        Page<Document> documents;

        documents = documentRepository.findAll(pageable);

        List<DocumentResponse> documentResponses = documents.getContent()
                .stream()
                .map(documentMapper::toDocumentResponse)
                .toList();

        return PageResponse.<DocumentResponse>builder()
                .content(documentResponses)
                .pageNo(pageNo)
                .pageSize(pageSize)
                .totalElements(documents.getTotalElements())
                .totalPages(documents.getTotalPages())
                .last(documents.isLast())
                .build();
    }

    @Override
    @PreAuthorize("hasRole('USER')")
    public List<DocumentResponse> getAllMyDocuments() {

        User currentUser = getCurrentUser();
        String currentUserId = currentUser.getId();

        return documentRepository.findByUploadedBy_Id(currentUserId)
                .stream()
                .map(documentMapper::toDocumentResponse)
                .toList();
    }

    @Override
    @PreAuthorize("hasRole('USER')")
    public PageResponse<DocumentResponse> getDocumentPublic(
            int pageNo,
            int pageSize,
            String majorId,
            String fileType
    ) {

        Pageable pageable = PageRequest.of(
                pageNo - 1,
                pageSize,
                Sort.by(Sort.Direction.DESC, "createdAt")
        );

        Page<Document> documents =
                documentRepository.findPublicDocuments(
                        DocumentVisibility.PUBLIC,
                        majorId,
                        fileType,
                        pageable
                );

        List<DocumentResponse> responses = documents
                .getContent()
                .stream()
                .map(documentMapper::toDocumentResponse)
                .toList();

        return PageResponse.<DocumentResponse>builder()
                .content(responses)
                .pageNo(pageNo)
                .pageSize(pageSize)
                .totalElements(documents.getTotalElements())
                .totalPages(documents.getTotalPages())
                .last(documents.isLast())
                .build();
    }

    @Override
    @PreAuthorize("hasRole('USER')")
    public DocumentResponse renameDocument(DocumentRequest request, String documentId) {
        User userCurrent = getCurrentUser();

        Document document;
        document = documentRepository.findById(documentId)
                .orElseThrow(() -> new AppException(ErrorCode.DOCUMENT_NOT_FOUND));

        if(!userCurrent.getId().equals(document.getUploadedBy().getId())) {
            throw new AppException(ErrorCode.UNAUTHORIZED);
        }

        document.setDocumentName(request.getDocumentName());

        documentRepository.save(document);

        return documentMapper.toDocumentResponse(document);


    }

    @Override
    @Transactional
    @PreAuthorize("hasAnyRole('USER', 'ADMIN')")
    public void deleteDocument(String documentId) {
        Document document = documentRepository.findById(documentId)
                .orElseThrow(() -> new AppException(ErrorCode.DOCUMENT_NOT_FOUND));
        User currentUser = getCurrentUser();

        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        boolean isAdmin = authentication.getAuthorities()
                .stream()
                .anyMatch(auth -> auth.getAuthority().equals("ROLE_ADMIN"));

        String username = authentication.getName();

        boolean isOwner = document.getUploadedBy().getUsername().equals(username);

        if (!isAdmin && !isOwner) {
            throw new AppException(ErrorCode.UNAUTHORIZED);
        }

        Long fileSize = document.getFileSize() == null ? 0L : document.getFileSize();

        User owner = document.getUploadedBy();

        Long ownerUsedStorage = owner.getStorageUsedBytes() == null
                ? 0L
                : owner.getStorageUsedBytes();

        s3Service.deleteFile(document.getFileKey());

        documentRepository.delete(document);

        owner.setStorageUsedBytes(Math.max(0L, ownerUsedStorage - fileSize));
        userRepository.save(owner);

        activityLogService.saveLog(
        currentUser,
        ActivityAction.DELETE_DOCUMENT,
        ActivityEntityType.DOCUMENT,
        document.getId(),
        "Delete tài liệu \"" + document.getDocumentName() + "\""
        );
    }

    @Override
    @PreAuthorize("hasRole('USER')")
    public DocumentResponse moveDocument(String documentId, String folderId) {
        Document document = documentRepository.findById(documentId)
                .orElseThrow(() -> new AppException(ErrorCode.DOCUMENT_NOT_FOUND));

        Folder folder = folderRepository.findById(folderId)
                .orElseThrow(() -> new AppException(ErrorCode.FOLDER_NOT_FOUND));
        document.setFolder(folder);
        document.setUpdatedAt(LocalDateTime.now());

        Document savedDocument = documentRepository.save(document);

        return documentMapper.toDocumentResponse(savedDocument);
    }

    @Override
    @PreAuthorize("hasRole('USER')")
    public DownloadFileResponse downloadDocument(String documentId) {
        User currentUser = getCurrentUser();

        Document document = documentRepository.findById(documentId)
                .orElseThrow(() -> new AppException(ErrorCode.DOCUMENT_NOT_FOUND));

        boolean isOwner = document.getUploadedBy().getId().equals(currentUser.getId());
        boolean isPublic = document.getVisibility() == DocumentVisibility.PUBLIC;

        if (!isOwner && !isPublic) {
            throw new AppException(ErrorCode.ACCESS_DENIED);
        }

        byte[] data = s3Service.downloadFile(document.getFileKey());

        document.setDownloadCount(
        document.getDownloadCount() == null ? 1 : document.getDownloadCount() + 1
);
        documentRepository.save(document);

        activityLogService.saveLog(
        currentUser,
        ActivityAction.DOWNLOAD_DOCUMENT,
        ActivityEntityType.DOCUMENT,
        document.getId(),
        "Download tài liệu \"" + document.getDocumentName() + "\""
);

        if (!isOwner) {
        notificationService.createNotification(
                document.getUploadedBy(),
                NotificationType.DOWNLOAD,
                "Tải xuống",
                "Tài liệu \"" + document.getDocumentName() + "\" vừa được tải xuống."
        );
        }

        return DownloadFileResponse.builder()
                .originalFileName(document.getDocumentName())
                .contentType(document.getMimeType())
                .data(data)
                .build();
    }

    @Override
    @PreAuthorize("hasRole('USER')")
    public DocumentResponse changeToPrivateDocument(String documentId) {

        User currentUser = getCurrentUser();
        Document document = documentRepository.findById(documentId)
                .orElseThrow(() -> new AppException(ErrorCode.DOCUMENT_NOT_FOUND));

        boolean isOwner = document.getUploadedBy().getId().equals(currentUser.getId());

        if (!isOwner) {
            throw new AppException(ErrorCode.ACCESS_DENIED);
        }
        document.setVisibility(DocumentVisibility.PRIVATE);
        document.setUpdatedAt(LocalDateTime.now());
        documentRepository.save(document);

        return documentMapper.toDocumentResponse(document);
    }

    @Override
    @PreAuthorize("hasRole('USER')")
    public DocumentResponse getDetailResponse(String documentId) {
        User currentUser = getCurrentUser();
        Document document = documentRepository.findById(documentId)
                .orElseThrow(() -> new AppException(ErrorCode.DOCUMENT_NOT_FOUND));

        boolean isOwner = document.getUploadedBy().getId().equals(currentUser.getId());
        boolean isPublic = document.getVisibility() == DocumentVisibility.PUBLIC;

        if (!isOwner && !isPublic) {
            throw new AppException(ErrorCode.ACCESS_DENIED);
        }

        return documentMapper.toDocumentResponse(document);
    }

    private User getCurrentUser() {
        var context = SecurityContextHolder.getContext();

        String username = context.getAuthentication().getName();

        return userRepository.findByUsername(username)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_EXISTS));
    }
}
