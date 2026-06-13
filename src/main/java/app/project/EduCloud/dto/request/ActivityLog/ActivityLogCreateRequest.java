package app.project.EduCloud.dto.request.ActivityLog;

import app.project.EduCloud.enums.ActivityAction;
import app.project.EduCloud.enums.ActivityEntityType;
import jakarta.validation.constraints.NotNull;
import lombok.*;
import lombok.experimental.FieldDefaults;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class ActivityLogCreateRequest {

    String userId;

    @NotNull
    ActivityAction action;

    @NotNull
    ActivityEntityType entityType;

    String entityId;

    String description;
}