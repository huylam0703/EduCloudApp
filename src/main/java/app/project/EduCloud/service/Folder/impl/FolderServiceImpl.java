package app.project.EduCloud.service.Folder.impl;

import app.project.EduCloud.dto.request.Folder.FolderRequest;
import app.project.EduCloud.dto.request.Folder.RenameFolderRequest;
import app.project.EduCloud.dto.response.Folder.FolderBaseResponse;
import app.project.EduCloud.dto.response.Folder.FolderResponse;
import app.project.EduCloud.dto.response.Folder.FolderTreeResponse;
import app.project.EduCloud.entity.Folder;
import app.project.EduCloud.entity.User;
import app.project.EduCloud.exception.AppException;
import app.project.EduCloud.exception.ErrorCode;
import app.project.EduCloud.mapper.DocumentMapper;
import app.project.EduCloud.mapper.FolderMapper;
import app.project.EduCloud.repository.DocumentRepository;
import app.project.EduCloud.repository.FolderRepository;
import app.project.EduCloud.repository.UserRepository;
import app.project.EduCloud.service.Folder.FolderService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
@Slf4j
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class FolderServiceImpl implements FolderService {
    FolderRepository folderRepository;
    FolderMapper folderMapper;
    UserRepository userRepository;
    DocumentRepository documentRepository;
    DocumentMapper documentMapper;


    @Override
    @PreAuthorize("hasRole('USER')")
    public FolderResponse createFolder(FolderRequest request) {
        Folder folder;
        if(request.getParentFolderId() == null){
            folder = Folder.builder()
                    .folderName(request.getFolderName())
                    .parentFolder(null)
                    .user(getCurrentUser())
                    .createdAt(LocalDateTime.now())
                    .build();
        }else {
            Folder parentFolder = folderRepository.findById(request.getParentFolderId())
                    .orElseThrow(()-> new AppException(ErrorCode.FOLDER_NOT_FOUND));

            folder = Folder.builder()
                    .folderName(request.getFolderName())
                    .parentFolder(parentFolder)
                    .user(getCurrentUser())
                    .createdAt(LocalDateTime.now())
                    .build();
        }
        Folder saveFolder = folderRepository.save(folder);

        return folderMapper.toFolderResponse(saveFolder);
    }

    @Override
    @PreAuthorize("hasRole('USER')")
    public FolderResponse getDetailFolder(String folderId) {
        Folder folder = folderRepository.findById(folderId)
                .orElseThrow(()-> new AppException(ErrorCode.FOLDER_NOT_FOUND));

        FolderResponse folderResponse = folderMapper.toFolderResponse(folder);

        folderResponse.setDocuments(documentRepository.findByFolder(folder)
                .stream()
                .map(documentMapper::toDocumentResponse)
                .toList());

        return folderResponse;
    }

    @Override
    @PreAuthorize("hasRole('USER')")
    public List<FolderBaseResponse> getAllFolders() {

        return folderRepository.findByUser_IdAndParentFolderIsNull(getCurrentUser().getId())
                .stream()
                .map(folderMapper::toFolderBaseResponse)
                .toList();
    }

    @Override
    @PreAuthorize("hasRole('USER')")
    public FolderBaseResponse renameFolder(String folderId, RenameFolderRequest request) {
        Folder folder = folderRepository.findById(folderId)
                .orElseThrow(()-> new AppException(ErrorCode.FOLDER_NOT_FOUND));

        folder.setFolderName(request.getFolderName());
        folder.setUpdatedAt(LocalDateTime.now());

        Folder saveFolder = folderRepository.save(folder);
        return folderMapper.toFolderBaseResponse(saveFolder);
    }

    @Override
    @PreAuthorize("hasRole('USER')")
    public void deleteFolder(String folderId) {
        folderRepository.deleteById(folderId);
    }

    @Override
    @PreAuthorize("hasRole('USER')")
    public List<FolderTreeResponse> getMyFolderTree() {
        return folderRepository.findByUser_IdAndParentFolderIsNull(getCurrentUser().getId())
                .stream()
                .map(folderMapper::toFolderTreeResponse)
                .toList();
    }


    private User getCurrentUser() {
        var context = SecurityContextHolder.getContext();

        String username = context.getAuthentication().getName();

        return userRepository.findByUsername(username)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_EXISTS));
    }
}
