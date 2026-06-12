package app.project.EduCloud.mapper;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import app.project.EduCloud.dto.request.Notification.NotificationCreateRequest;
import app.project.EduCloud.dto.response.Notification.NotificationResponse;
import app.project.EduCloud.entity.Notification;

@Mapper(componentModel = "spring")
public interface NotificationMapper {

    NotificationResponse toNotificationResponse(Notification notification);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "user", ignore = true)
    @Mapping(target = "read", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    Notification toNotification(NotificationCreateRequest request);
}
