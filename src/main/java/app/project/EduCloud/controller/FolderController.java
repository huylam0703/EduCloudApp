package app.project.EduCloud.controller;

import app.project.EduCloud.dto.request.Folder.FolderRequest;
import app.project.EduCloud.dto.request.Folder.RenameFolderRequest;
import app.project.EduCloud.dto.response.Auth.ApiResponse;
import app.project.EduCloud.dto.response.Folder.FolderBaseResponse;
import app.project.EduCloud.dto.response.Folder.FolderResponse;
import app.project.EduCloud.dto.response.Folder.FolderTreeResponse;
import app.project.EduCloud.service.Folder.FolderService;
import jakarta.validation.Valid;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@Slf4j
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@RequestMapping("/folder")
public class FolderController {
    FolderService folderService;

    @PostMapping("create")
    public ResponseEntity<ApiResponse<FolderResponse>> createFolder(@RequestBody @Valid FolderRequest request) {

        log.info("Create folder request: {}", request);

        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.<FolderResponse>builder()
                        .code(1000)
                        .message("create folder success")
                        .result(folderService.createFolder(request))
                        .build());
    }

    @GetMapping("getDetail/{folderId}")
    public ResponseEntity<ApiResponse<FolderResponse>> getDetailFolder(@PathVariable String folderId) {

        log.info("get detail folder folderId: {}", folderId);

        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.<FolderResponse>builder()
                        .code(1000)
                        .message("get detail folder success")
                        .result(folderService.getDetailFolder(folderId))
                        .build());
    }

    @GetMapping("getAll")
    public ResponseEntity<ApiResponse<List<FolderBaseResponse>>> getAllFolder() {

        log.info("get all folder");

        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.<List<FolderBaseResponse>>builder()
                        .code(1000)
                        .message("get all folder success")
                        .result(folderService.getAllFolders())
                        .build());
    }

    @GetMapping("treeFolder")
    public ResponseEntity<ApiResponse<List<FolderTreeResponse>>> getMyFolderTree() {

        log.info("get all tree folder");

        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.<List<FolderTreeResponse>>builder()
                        .code(1000)
                        .message("get all folder success")
                        .result(folderService.getMyFolderTree())
                        .build());
    }

    @PatchMapping("/rename/{folderId}")
    public ResponseEntity<ApiResponse<FolderBaseResponse>> renameFolder(@PathVariable String folderId,
                                                                    @RequestBody @Valid RenameFolderRequest request) {

        log.info("rename folder folderId: {}", folderId);

        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.<FolderBaseResponse>builder()
                        .code(1000)
                        .message("rename folder success")
                        .result(folderService.renameFolder(folderId, request))
                        .build());
    }

    @DeleteMapping("/delete/{folderId}")
    public ResponseEntity<ApiResponse<String>> renameFolder(@PathVariable String folderId) {

        log.info("delete folder folderId: {}", folderId);
        folderService.deleteFolder(folderId);

        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.<String>builder()
                        .code(1000)
                        .result("delete folder success")
                        .build());
    }
}
