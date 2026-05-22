package app.project.EduCloud.service.Auth;

import app.project.EduCloud.dto.request.Auth.PermissionRequest;
import app.project.EduCloud.dto.response.Auth.PermissionResponse;

import java.util.List;

public interface PermissionService {

    PermissionResponse create(PermissionRequest request);

    List<PermissionResponse> getAllPermissions();

    void delete(String permission);
}
