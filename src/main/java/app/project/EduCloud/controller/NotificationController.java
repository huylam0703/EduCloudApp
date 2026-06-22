package app.project.EduCloud.controller;

import app.project.EduCloud.dto.request.Notification.NotificationBroadcastTemplateRequest;
import app.project.EduCloud.dto.request.Notification.NotificationSendTemplateRequest;
import app.project.EduCloud.dto.response.Notification.NotificationTemplateResponse;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import app.project.EduCloud.dto.request.Notification.NotificationCreateRequest;
import app.project.EduCloud.dto.response.Auth.ApiResponse;
import app.project.EduCloud.dto.response.Notification.NotificationResponse;
import app.project.EduCloud.dto.response.PageResponse;
import app.project.EduCloud.service.Notification.NotificationService;
import jakarta.validation.Valid;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;

import java.util.List;

@RestController
@RequiredArgsConstructor
@Slf4j
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@RequestMapping("/notification")
public class NotificationController {

    NotificationService notificationService;

    @GetMapping("/me")
    public ResponseEntity<ApiResponse<PageResponse>> getMyNotifications(
            @RequestParam(defaultValue = "1") int pageNo,
            @RequestParam(defaultValue = "10") int pageSize
    ) {
        log.info("Get My Notifications");

        return ResponseEntity.status(HttpStatus.OK)
                .body(ApiResponse.<PageResponse>builder()
                        .code(1000)
                        .message("Get My Notifications success")
                        .result(notificationService.getMyNotifications(pageNo, pageSize))
                        .build());
    }

    @GetMapping("/unread-count")
    public ResponseEntity<ApiResponse<Long>> countUnread() {
        return ResponseEntity.status(HttpStatus.OK)
                .body(ApiResponse.<Long>builder()
                        .code(1000)
                        .message("Count unread notifications success")
                        .result(notificationService.countUnread())
                        .build());
    }

    @PatchMapping("/read/{notificationId}")
    public ResponseEntity<ApiResponse<NotificationResponse>> markAsRead(
            @PathVariable String notificationId
    ) {
        return ResponseEntity.status(HttpStatus.OK)
                .body(ApiResponse.<NotificationResponse>builder()
                        .code(1000)
                        .message("Mark notification as read success")
                        .result(notificationService.markAsRead(notificationId))
                        .build());
    }

    @PatchMapping("/read-all")
    public ResponseEntity<ApiResponse<String>> markAllAsRead() {
        notificationService.markAllAsRead();

        return ResponseEntity.status(HttpStatus.OK)
                .body(ApiResponse.<String>builder()
                        .code(1000)
                        .message("Mark all notifications as read success")
                        .result("Success")
                        .build());
    }

    @DeleteMapping("/delete/{notificationId}")
    public ResponseEntity<ApiResponse<String>> deleteNotification(
            @PathVariable String notificationId
    ) {
        notificationService.deleteNotification(notificationId);

        return ResponseEntity.status(HttpStatus.OK)
                .body(ApiResponse.<String>builder()
                        .code(1000)
                        .message("Delete notification success")
                        .result("Success")
                        .build());
    }

    @DeleteMapping("/delete-all")
    public ResponseEntity<ApiResponse<String>> deleteAllMyNotifications() {
        notificationService.deleteAllMyNotifications();

        return ResponseEntity.status(HttpStatus.OK)
                .body(ApiResponse.<String>builder()
                        .code(1000)
                        .message("Delete all notifications success")
                        .result("Success")
                        .build());
    }


    @GetMapping("/templates")
    public ResponseEntity<ApiResponse<List<NotificationTemplateResponse>>> getAdminNotificationTemplates() {
        return ResponseEntity.status(HttpStatus.OK)
                .body(ApiResponse.<List<NotificationTemplateResponse>>builder()
                        .code(1000)
                        .message("Get notification templates success")
                        .result(notificationService.getAdminNotificationTemplates())
                        .build());
    }

    @PostMapping("/send-template")
    public ResponseEntity<ApiResponse<NotificationResponse>> sendByTemplate(
            @RequestBody @Valid NotificationSendTemplateRequest request
    ) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.<NotificationResponse>builder()
                        .code(1000)
                        .message("Send notification by template success")
                        .result(notificationService.sendByTemplate(request))
                        .build());
    }

    @PostMapping("/send-template/all")
    public ResponseEntity<ApiResponse<Integer>> sendTemplateToAllUsers(
            @RequestBody @Valid NotificationBroadcastTemplateRequest request
    ) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.<Integer>builder()
                        .code(1000)
                        .message("Send notification template to all users success")
                        .result(notificationService.sendTemplateToAllUsers(request))
                        .build());
    }
}