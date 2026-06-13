package app.project.EduCloud.dto.request.Notification;

import app.project.EduCloud.enums.NotificationTemplateCode;
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
public class NotificationSendTemplateRequest {

    @NotBlank
    String userId;

    @NotNull
    NotificationTemplateCode templateCode;
}
