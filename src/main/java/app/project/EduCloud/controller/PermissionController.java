package app.project.EduCloud.controller;

import app.project.EduCloud.dto.request.Auth.PermissionRequest;
import app.project.EduCloud.dto.response.Auth.ApiResponse;
import app.project.EduCloud.dto.response.Auth.PermissionResponse;
import app.project.EduCloud.service.Auth.PermissionService;
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
@RequestMapping("/permission")
public class PermissionController {
    PermissionService permissionService;

    @PostMapping
    public ResponseEntity<ApiResponse<PermissionResponse>> create (@RequestBody PermissionRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.<PermissionResponse>builder()
                        .code(1000)
                        .message("create permission")
                        .result(permissionService.create(request))
                        .build());
    }

    @GetMapping
    ResponseEntity<ApiResponse<List<PermissionResponse>>> getAllPermissions () {
        return ResponseEntity.status(HttpStatus.OK)
                .body(ApiResponse.<List<PermissionResponse>>builder()
                        .code(1000)
                        .message("get all permissions")
                        .result(permissionService.getAllPermissions())
                        .build());
    }

    @DeleteMapping("/{permissionId}")
    ResponseEntity<ApiResponse<Void>> delete (@PathVariable String permissionId) {
        permissionService.delete(permissionId);
        return ResponseEntity.status(HttpStatus.OK).body(ApiResponse.<Void>builder()
                        .code(1000)
                        .message("delete permission")
                .build());
    }

}
