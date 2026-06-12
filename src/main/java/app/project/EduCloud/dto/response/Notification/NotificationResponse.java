package app.project.EduCloud.dto.response.Notification;

import app.project.EduCloud.enums.NotificationType;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class NotificationResponse {

    String id;
    String title;
    String message;
    NotificationType type;
    Boolean read;
    LocalDateTime createdAt;
}