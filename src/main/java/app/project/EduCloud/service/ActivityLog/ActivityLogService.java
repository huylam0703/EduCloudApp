package app.project.EduCloud.service.ActivityLog;

import app.project.EduCloud.dto.request.ActivityLog.ActivityLogCreateRequest;
import app.project.EduCloud.dto.response.ActivityLog.ActivityLogResponse;
import app.project.EduCloud.dto.response.PageResponse;
import app.project.EduCloud.entity.User;
import app.project.EduCloud.enums.ActivityAction;
import app.project.EduCloud.enums.ActivityEntityType;

public interface ActivityLogService {

    PageResponse<ActivityLogResponse> getAllLogs(
            int pageNo,
            int pageSize,
            String userId,
            ActivityAction action,
            ActivityEntityType entityType
    );

    void saveLog(
            User user,
            ActivityAction action,
            ActivityEntityType entityType,
            String entityId,
            String description
    );
}