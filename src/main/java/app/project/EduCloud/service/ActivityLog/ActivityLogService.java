package app.project.EduCloud.service.ActivityLog;

import app.project.EduCloud.dto.response.ActivityLog.ActivityLogResponse;
import app.project.EduCloud.dto.response.PageResponse;
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
}