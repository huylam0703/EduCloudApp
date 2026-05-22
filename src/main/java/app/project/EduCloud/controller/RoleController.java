package app.project.EduCloud.controller;

import app.project.EduCloud.dto.request.Auth.RoleRequest;
import app.project.EduCloud.dto.response.Auth.ApiResponse;
import app.project.EduCloud.dto.response.Auth.RoleResponse;
import app.project.EduCloud.service.Auth.RoleService;
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
@RequestMapping("/roles")
public class RoleController {
    RoleService roleService;

    @PostMapping
    public ResponseEntity<ApiResponse<RoleResponse>> create (@RequestBody RoleRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.<RoleResponse>builder()
                        .code(1000)
                        .message("create permission")
                        .result(roleService.create(request))
                        .build());
    }

    @GetMapping
    ResponseEntity<ApiResponse<List<RoleResponse>>> getAllRole () {
        return ResponseEntity.status(HttpStatus.OK)
                .body(ApiResponse.<List<RoleResponse>>builder()
                        .code(1000)
                        .message("get all permissions")
                        .result(roleService.getAllRoles())
                        .build());
    }


}
