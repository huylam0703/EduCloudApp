package app.project.EduCloud.service.Notification;

import app.project.EduCloud.dto.request.Notification.NotificationCreateRequest;
import app.project.EduCloud.dto.request.Notification.NotificationSendTemplateRequest;
import app.project.EduCloud.dto.response.Notification.NotificationResponse;
import app.project.EduCloud.dto.response.Notification.NotificationTemplateResponse;
import app.project.EduCloud.dto.response.PageResponse;
import app.project.EduCloud.entity.User;
import app.project.EduCloud.enums.NotificationType;

import java.util.List;

public interface NotificationService {

    PageResponse<NotificationResponse> getMyNotifications(int pageNo, int pageSize);

    long countUnread();

    NotificationResponse markAsRead(String notificationId);

    void markAllAsRead();

    void deleteNotification(String notificationId);

    void deleteAllMyNotifications();

    List<NotificationTemplateResponse> getAdminNotificationTemplates();

    NotificationResponse sendByTemplate(NotificationSendTemplateRequest request);

    NotificationResponse createNotification(
            User user,
            NotificationType type,
            String title,
            String message
    );
}