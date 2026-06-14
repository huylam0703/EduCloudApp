package app.project.EduCloud.controller;

import app.project.EduCloud.dto.response.AdminDashboard.AdminDashboardResponse;
import app.project.EduCloud.dto.response.Auth.ApiResponse;
import app.project.EduCloud.service.AdminDashboard.DashboardService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/admin/dashboard")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@Slf4j
public class AdminDashboardController {

    DashboardService dashboardService;

    @GetMapping
    public ResponseEntity<ApiResponse<AdminDashboardResponse>> getAdminDashboard() {
        log.info("Get admin dashboard");

        return ResponseEntity.status(HttpStatus.OK)
                .body(ApiResponse.<AdminDashboardResponse>builder()
                        .code(1000)
                        .message("Get admin dashboard success")
                        .result(dashboardService.getAdminDashboard())
                        .build());
    }
}
