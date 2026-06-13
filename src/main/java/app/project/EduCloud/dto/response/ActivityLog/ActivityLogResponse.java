package app.project.EduCloud.dto.response.ActivityLog;

import app.project.EduCloud.enums.ActivityAction;
import app.project.EduCloud.enums.ActivityEntityType;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class ActivityLogResponse {

    String id;

    String userId;

    String username;

    ActivityAction action;

    ActivityEntityType entityType;

    String entityId;

    String description;

    LocalDateTime createdAt;
}