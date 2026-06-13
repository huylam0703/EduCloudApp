package app.project.EduCloud.dto.response.Notification;

import app.project.EduCloud.enums.NotificationType;
import lombok.*;
import lombok.experimental.FieldDefaults;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class NotificationTemplateResponse {
    String code;

    String label;

    String title;

    String message;

    NotificationType type;
}
