package app.project.EduCloud.service.User;

import app.project.EduCloud.dto.request.User.UserCreationRequest;
import app.project.EduCloud.dto.request.User.UserUpdateRequest;
import app.project.EduCloud.dto.response.PageResponse;
import app.project.EduCloud.dto.response.User.StorageUsageResponse;
import app.project.EduCloud.dto.response.User.UserResponse;

import java.util.List;

public interface UserService {
    UserResponse createUser(UserCreationRequest request);

    UserResponse getUserById(String userId);

    PageResponse<UserResponse> getAllUsers(int pageNo, int pageSize);

    UserResponse updateUser(UserUpdateRequest request, String userId);

    void deleteUser(String userId);

    public UserResponse getMyInfo();

    StorageUsageResponse getMyStorageUsage();
}
