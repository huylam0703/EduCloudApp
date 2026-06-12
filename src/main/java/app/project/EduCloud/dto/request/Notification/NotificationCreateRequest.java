package app.project.EduCloud.dto.request.Notification;

import app.project.EduCloud.enums.NotificationType;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.*;
import lombok.experimental.FieldDefaults;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class NotificationCreateRequest {

    @NotBlank
    String userId;

    @NotBlank
    String title;

    @NotBlank
    String message;

    @NotNull
    NotificationType type;
}