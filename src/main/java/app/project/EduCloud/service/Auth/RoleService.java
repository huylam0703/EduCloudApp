package app.project.EduCloud.service.Auth;

import app.project.EduCloud.dto.request.Auth.RoleRequest;
import app.project.EduCloud.dto.response.Auth.RoleResponse;

import java.util.List;

public interface RoleService {

    RoleResponse create(RoleRequest request);

    List<RoleResponse> getAllRoles();

}
