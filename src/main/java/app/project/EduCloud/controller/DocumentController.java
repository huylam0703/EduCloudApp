package app.project.EduCloud.controller;

import app.project.EduCloud.Utils.FileTypeUtils;
import app.project.EduCloud.dto.request.Document.DocumentRequest;
import app.project.EduCloud.dto.response.Auth.ApiResponse;
import app.project.EduCloud.dto.response.Document.DocumentResponse;
import app.project.EduCloud.dto.response.Document.DownloadFileResponse;
import app.project.EduCloud.dto.response.PageResponse;
import app.project.EduCloud.enums.FileType;
import app.project.EduCloud.exception.AppException;
import app.project.EduCloud.exception.ErrorCode;
import app.project.EduCloud.service.Document.DocumentService;
import jakarta.validation.Valid;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.*;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.util.List;

import static app.project.EduCloud.Utils.FileTypeUtils.normalizeFileName;

@RestController
@RequiredArgsConstructor
@Slf4j
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@RequestMapping("/document")
public class DocumentController {
    DocumentService documentService;

    @PostMapping(value = "/upload",
            consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<ApiResponse<DocumentResponse>> upload(@ModelAttribute DocumentRequest request){
        log.info("Upload Document");

        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.<DocumentResponse>builder()
                        .code(1000)
                        .message("upload document success")
                        .result(documentService.uploadDocument(request))
                        .build());
    }

    @GetMapping("/allDocument")
    public ResponseEntity<ApiResponse<PageResponse<DocumentResponse>>> getAllDocument(@RequestParam(defaultValue = "1") int pageNo,
                                                                                      @RequestParam(defaultValue = "10") int pageSize){
        log.info("Get All Document");

        return ResponseEntity.status(HttpStatus.OK)
                .body(ApiResponse.<PageResponse<DocumentResponse>>builder()
                        .code(1000)
                        .message("Get All Document")
                        .result(documentService.getAllDocuments(pageNo, pageSize))
                        .build());
    }

    @GetMapping("/MyDocument")
    public ResponseEntity<ApiResponse<List<DocumentResponse>>> getAllMyDocument(){
        log.info("Get All My Document");

        return ResponseEntity.status(HttpStatus.OK)
                .body(ApiResponse.<List<DocumentResponse>>builder()
                        .code(1000)
                        .message("Get All My Document")
                        .result(documentService.getAllMyDocuments())
                        .build());
    }

    @GetMapping("/public")
    public ResponseEntity<ApiResponse<PageResponse<DocumentResponse>>> getDocumentPublic(@RequestParam(defaultValue = "1") int pageNo,
                                                                         @RequestParam(defaultValue = "10") int pageSize,
                                                                         @RequestParam(required = false) String majorId,
                                                                         @RequestParam(required = false) String fileType) {
        return ResponseEntity.status(HttpStatus.OK)
                .body(ApiResponse.<PageResponse<DocumentResponse>>builder()
                        .code(1000)
                        .message("Get public Document")
                        .result(documentService.getDocumentPublic(pageNo, pageSize, majorId, fileType))
                        .build());
    }

    @PatchMapping("/rename/{documentId}")
    public ResponseEntity<ApiResponse<DocumentResponse>> renameDocument(@RequestBody @Valid DocumentRequest request,
                                                                        @PathVariable String documentId){
        log.info("Rename Document");

        return ResponseEntity.status(HttpStatus.OK)
                .body(ApiResponse.<DocumentResponse>builder()
                        .code(1000)
                        .message("Rename Document success")
                        .result(documentService.renameDocument(request,documentId))
                        .build());
    }

    @DeleteMapping("/delete/{documentId}")
    public ResponseEntity<ApiResponse<String>> deleteDocument(@PathVariable String documentId){
        log.info("Delete Document");

        documentService.deleteDocument(documentId);

        return ResponseEntity.status(HttpStatus.OK)
                .body(ApiResponse.<String>builder()
                        .code(1000)
                        .result("Delete Document success")
                        .build());
    }

    @PatchMapping("/move/{documentId}")
    public ResponseEntity<ApiResponse<DocumentResponse>> moveDocument(@PathVariable String documentId,
                                                                      @RequestParam String folderId){
        log.info("Move Document");

        return ResponseEntity.status(HttpStatus.OK)
                .body(ApiResponse.<DocumentResponse>builder()
                        .code(1000)
                        .message("Move Document success")
                        .result(documentService.moveDocument(documentId,folderId))
                        .build());
    }


    @GetMapping("/download/{documentId}")
    public ResponseEntity<byte[]> downloadDocument(@PathVariable String documentId) {
        DownloadFileResponse response = documentService.downloadDocument(documentId);

        String contentType = response.getContentType();
        if (contentType == null || contentType.isBlank()) {
            contentType = "application/octet-stream";
        }

        String fileName = response.getOriginalFileName();
        if (fileName == null || fileName.isBlank()) {
            fileName = "download-file";
        }

        String fallbackFileName = FileTypeUtils.normalizeFileName(fileName);
        String encodedFileName = URLEncoder.encode(fileName, StandardCharsets.UTF_8)
                .replace("+", "%20");

        String contentDisposition = "attachment; filename=\"" + fallbackFileName + "\"; filename*=UTF-8''" + encodedFileName;

        return ResponseEntity.ok()
                .contentType(MediaType.parseMediaType(contentType))
                .header(HttpHeaders.CONTENT_DISPOSITION, contentDisposition)
                .body(response.getData());
    }

    @PatchMapping("/change/{documentId}")
    public ResponseEntity<ApiResponse<DocumentResponse>> changeToPrivateDocument(@PathVariable String documentId){
        log.info("Change Document");

        return ResponseEntity.status(HttpStatus.OK)
                .body(ApiResponse.<DocumentResponse>builder()
                        .code(1000)
                        .message("Change Document success")
                        .result(documentService.changeToPrivateDocument(documentId))
                        .build());
    }

    @GetMapping("/detail/{documentId}")
    public ResponseEntity<ApiResponse<DocumentResponse>> detailDocument(@PathVariable String documentId){
        log.info("Detail Document");

        return ResponseEntity.status(HttpStatus.OK)
                .body(ApiResponse.<DocumentResponse>builder()
                        .code(1000)
                        .message("Detail Document success")
                        .result(documentService.getDetailResponse(documentId))
                        .build());
    }

    @GetMapping("/preview/{documentId}")
    public ResponseEntity<byte[]> previewDocument(@PathVariable String documentId) {
        DownloadFileResponse response = documentService.downloadDocument(documentId);

        String contentType = response.getContentType();

        if (contentType == null || contentType.isBlank()) {
            contentType = "application/octet-stream";
        }

        if (!FileTypeUtils.isPreviewSupported(contentType)) {
            throw new AppException(ErrorCode.FILE_PREVIEW_NOT_SUPPORTED);
        }

        return ResponseEntity.ok()
                .contentType(MediaType.parseMediaType(contentType))
                .header(HttpHeaders.CONTENT_DISPOSITION, "inline")
                .body(response.getData());
    }
}
