package app.project.EduCloud.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import app.project.EduCloud.dto.response.ActivityLog.ActivityLogResponse;
import app.project.EduCloud.dto.response.Auth.ApiResponse;
import app.project.EduCloud.dto.response.PageResponse;
import app.project.EduCloud.enums.ActivityAction;
import app.project.EduCloud.enums.ActivityEntityType;
import app.project.EduCloud.service.ActivityLog.ActivityLogService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;

@RestController
@RequiredArgsConstructor
@Slf4j
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@RequestMapping("/activity-log")
public class ActivityLogController {

    ActivityLogService activityLogService;

    @GetMapping("/all")
    public ResponseEntity<ApiResponse<PageResponse<ActivityLogResponse>>> getAllLogs(
            @RequestParam(defaultValue = "1") int pageNo,
            @RequestParam(defaultValue = "10") int pageSize,
            @RequestParam(required = false) String userId,
            @RequestParam(required = false) ActivityAction action,
            @RequestParam(required = false) ActivityEntityType entityType
    ) {
        log.info("Get all activity logs");

        return ResponseEntity.status(HttpStatus.OK)
                .body(ApiResponse.<PageResponse<ActivityLogResponse>>builder()
                        .code(1000)
                        .message("Get all activity logs success")
                        .result(activityLogService.getAllLogs(
                                pageNo,
                                pageSize,
                                userId,
                                action,
                                entityType
                        ))
                        .build());
    }

}