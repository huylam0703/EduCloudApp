package app.project.EduCloud.mapper;

import app.project.EduCloud.dto.request.ActivityLog.ActivityLogCreateRequest;
import app.project.EduCloud.dto.response.ActivityLog.ActivityLogResponse;
import app.project.EduCloud.entity.ActivityLog;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface ActivityLogMapper {

    @Mapping(target = "userId", source = "user.id")
    @Mapping(target = "username", source = "user.username")
    ActivityLogResponse toActivityLogResponse(ActivityLog activityLog);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "user", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    ActivityLog toActivityLog(ActivityLogCreateRequest request);
}