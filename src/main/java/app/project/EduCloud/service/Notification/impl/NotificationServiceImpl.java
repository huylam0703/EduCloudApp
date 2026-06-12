package app.project.EduCloud.service.Notification.impl;

import java.time.LocalDateTime;
import java.util.List;

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
    @PreAuthorize("hasRole('ADMIN')")
    public NotificationResponse createForUser(NotificationCreateRequest request) {
        User user = userRepository.findById(request.getUserId())
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND));

        return createNotification(
                user,
                request.getType(),
                request.getTitle(),
                request.getMessage()
        );
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

    private User getCurrentUser() {
        String username = SecurityContextHolder.getContext()
                .getAuthentication()
                .getName();

        return userRepository.findByUsername(username)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_EXISTS));
    }
}