package app.project.EduCloud.mapper;

import app.project.EduCloud.dto.request.Auth.RoleRequest;
import app.project.EduCloud.dto.response.Auth.RoleResponse;
import app.project.EduCloud.entity.Role;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface RoleMapper {
    @Mapping(target = "permissions", ignore = true)
    Role toRole(RoleRequest request);

    RoleResponse toRoleResponse(Role role);

}
