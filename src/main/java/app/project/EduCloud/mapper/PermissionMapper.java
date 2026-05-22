package app.project.EduCloud.mapper;

import app.project.EduCloud.dto.request.Auth.PermissionRequest;
import app.project.EduCloud.dto.response.Auth.PermissionResponse;
import app.project.EduCloud.entity.Permission;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface PermissionMapper {
    Permission toPermission(PermissionRequest request);

    PermissionResponse toPermissionResponse(Permission permission);

}
