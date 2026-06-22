package app.project.EduCloud.service.Notification.impl;

import java.time.LocalDateTime;
import java.util.List;

import app.project.EduCloud.dto.request.Notification.NotificationBroadcastTemplateRequest;
import app.project.EduCloud.dto.request.Notification.NotificationSendTemplateRequest;
import app.project.EduCloud.dto.response.Notification.NotificationTemplateResponse;
import app.project.EduCloud.enums.NotificationTemplateCode;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import app.project.EduCloud.dto.request.Notification.NotificationCreateRequest;
import app.project.EduCloud.dto.response.Notification.NotificationResponse;
import app.project.EduCloud.dto.response.PageResponse;
import app.project.EduCloud.entity.Notification;
import app.project.EduCloud.entity.User;
import app.project.EduCloud.enums.NotificationType;
import app.project.EduCloud.exception.AppException;
import app.project.EduCloud.exception.ErrorCode;
import app.project.EduCloud.mapper.NotificationMapper;
import app.project.EduCloud.repository.NotificationRepository;
import app.project.EduCloud.repository.UserRepository;
import app.project.EduCloud.service.Notification.NotificationService;
import jakarta.transaction.Transactional;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class NotificationServiceImpl implements NotificationService {

    NotificationRepository notificationRepository;
    UserRepository userRepository;
    NotificationMapper notificationMapper;

    @Override
    @PreAuthorize("hasRole('USER')")
    public PageResponse<NotificationResponse> getMyNotifications(int pageNo, int pageSize) {
        User currentUser = getCurrentUser();

        if (pageNo > 0) {
            pageNo = pageNo - 1;
        }

        Pageable pageable = PageRequest.of(
                pageNo,
                pageSize,
                Sort.by(Sort.Direction.DESC, "createdAt")
        );

        Page<Notification> page = notificationRepository.findByUser_Id(
                currentUser.getId(),
                pageable
        );

        List<NotificationResponse> responses = page.getContent()
                .stream()
                .map(notificationMapper::toNotificationResponse)
                .toList();

        return PageResponse.<NotificationResponse>builder()
                .content(responses)
                .pageNo(pageNo)
                .pageSize(pageSize)
                .totalElements(page.getTotalElements())
                .totalPages(page.getTotalPages())
                .last(page.isLast())
                .build();
    }

    @Override
    @PreAuthorize("hasRole('USER')")
    public long countUnread() {
        User currentUser = getCurrentUser();
        return notificationRepository.countByUser_IdAndReadFalse(currentUser.getId());
    }

    @Override
    @PreAuthorize("hasRole('USER')")
    public NotificationResponse markAsRead(String notificationId) {
        User currentUser = getCurrentUser();

        Notification notification = notificationRepository.findById(notificationId)
                .orElseThrow(() -> new AppException(ErrorCode.NOTIFICATION_NOT_FOUND));

        if (!notification.getUser().getId().equals(currentUser.getId())) {
            throw new AppException(ErrorCode.UNAUTHORIZED);
        }

        notification.setRead(true);
        return notificationMapper.toNotificationResponse(notificationRepository.save(notification));
    }

    @Override
    @PreAuthorize("hasRole('USER')")
    public void markAllAsRead() {
        User currentUser = getCurrentUser();

        List<Notification> notifications =
                notificationRepository.findByUser_IdOrderByCreatedAtDesc(currentUser.getId());

        notifications.forEach(notification -> notification.setRead(true));
        notificationRepository.saveAll(notifications);
    }

    @Override
    @PreAuthorize("hasRole('USER')")
    public void deleteNotification(String notificationId) {
        User currentUser = getCurrentUser();

        Notification notification = notificationRepository.findById(notificationId)
                .orElseThrow(() -> new AppException(ErrorCode.NOTIFICATION_NOT_FOUND));

        if (!notification.getUser().getId().equals(currentUser.getId())) {
            throw new AppException(ErrorCode.UNAUTHORIZED);
        }

        notificationRepository.delete(notification);
    }

    @Override
    @Transactional
    @PreAuthorize("hasRole('USER')")
    public void deleteAllMyNotifications() {
        User currentUser = getCurrentUser();
        notificationRepository.deleteByUser_Id(currentUser.getId());
    }


    @Override
    public NotificationResponse createNotification(
            User user,
            NotificationType type,
            String title,
            String message
    ) {
        Notification notification = Notification.builder()
                .user(user)
                .title(title)
                .message(message)
                .type(type)
                .read(false)
                .createdAt(LocalDateTime.now())
                .build();

        return notificationMapper.toNotificationResponse(notificationRepository.save(notification));
    }

    @Override
    @PreAuthorize("hasRole('ADMIN')")
    public List<NotificationTemplateResponse> getAdminNotificationTemplates() {
        return List.of(
                NotificationTemplateResponse.builder()
                        .code("ADMIN_NOTICE")
                        .label("Thông báo quản trị")
                        .title("Thông báo quản trị")
                        .message("Admin gửi thông báo mới đến bạn. Vui lòng kiểm tra nội dung.")
                        .type(NotificationType.INFO)
                        .build(),

                NotificationTemplateResponse.builder()
                        .code("VIOLATION_WARNING")
                        .label("Cảnh báo vi phạm")
                        .title("Cảnh báo vi phạm")
                        .message("Tài liệu của bạn có nội dung chưa phù hợp với quy định của hệ thống.")
                        .type(NotificationType.WARNING)
                        .build(),

                NotificationTemplateResponse.builder()
                        .code("MAINTENANCE")
                        .label("Bảo trì hệ thống")
                        .title("Bảo trì hệ thống")
                        .message("Hệ thống sẽ bảo trì trong thời gian tới. Vui lòng lưu lại công việc trước thời gian bảo trì.")
                        .type(NotificationType.INFO)
                        .build(),

                NotificationTemplateResponse.builder()
                        .code("SYSTEM_UPDATE")
                        .label("Cập nhật hệ thống")
                        .title("Cập nhật hệ thống")
                        .message("Hệ thống vừa cập nhật một số tính năng mới để cải thiện trải nghiệm sử dụng.")
                        .type(NotificationType.INFO)
                        .build()
        );
    }

    @Override
    @PreAuthorize("hasRole('ADMIN')")
    public NotificationResponse sendByTemplate(NotificationSendTemplateRequest request) {
        User user = userRepository.findById(request.getUserId())
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND));

        NotificationTemplateResponse template = findTemplateByCode(request.getTemplateCode());

        return createNotification(
                user,
                template.getType(),
                template.getTitle(),
                template.getMessage()
        );
    }

    @Override
    @Transactional
    @PreAuthorize("hasRole('ADMIN')")
    public int sendTemplateToAllUsers(NotificationBroadcastTemplateRequest request) {
        NotificationTemplateResponse template = findTemplateByCode(request.getTemplateCode());

        List<User> users = userRepository.findAll();

        List<Notification> notifications = users.stream()
                .map(user -> Notification.builder()
                        .user(user)
                        .title(template.getTitle())
                        .message(template.getMessage())
                        .type(template.getType())
                        .read(false)
                        .createdAt(LocalDateTime.now())
                        .build())
                .toList();

        notificationRepository.saveAll(notifications);

        return notifications.size();
    }

    private User getCurrentUser() {
        String username = SecurityContextHolder.getContext()
                .getAuthentication()
                .getName();

        return userRepository.findByUsername(username)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_EXISTS));
    }

    private NotificationTemplateResponse findTemplateByCode(NotificationTemplateCode templateCode) {
        return getAdminNotificationTemplates()
                .stream()
                .filter(template -> template.getCode().equals(templateCode.name()))
                .findFirst()
                .orElseThrow(() -> new AppException(ErrorCode.NOTIFICATION_TEMPLATE_NOT_FOUND));
    }
}