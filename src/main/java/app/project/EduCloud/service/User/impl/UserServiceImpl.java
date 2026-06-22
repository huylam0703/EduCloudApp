package app.project.EduCloud.service.User.impl;

import app.project.EduCloud.dto.request.User.UserCreationRequest;
import app.project.EduCloud.dto.request.User.UserUpdateRequest;
import app.project.EduCloud.dto.response.PageResponse;
import app.project.EduCloud.dto.response.User.StorageUsageResponse;
import app.project.EduCloud.dto.response.User.UserResponse;
import app.project.EduCloud.entity.Role;
import app.project.EduCloud.entity.User;
import app.project.EduCloud.exception.AppException;
import app.project.EduCloud.exception.ErrorCode;
import app.project.EduCloud.mapper.UserMapper;
import app.project.EduCloud.repository.RoleRepository;
import app.project.EduCloud.repository.UserRepository;
import app.project.EduCloud.service.User.UserService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.HashSet;
import java.util.List;

@Service
@Slf4j
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class UserServiceImpl implements UserService {
    UserRepository userRepository;
    RoleRepository roleRepository;
    UserMapper userMapper;
    PasswordEncoder passwordEncoder;

    private static final long DEFAULT_STORAGE_LIMIT = 5L * 1024 * 1024 * 1024;


    @Override
    public UserResponse createUser(UserCreationRequest request) {
        if(userRepository.existsByUsername(request.getUsername())) {
            throw new AppException(ErrorCode.USER_EXISTS);
        }

        User user = userMapper.toUser(request);

        user.setPassword(passwordEncoder.encode(request.getPassword()));

        Role userRole = roleRepository.findById("USER")
                .orElseThrow(() -> new AppException(ErrorCode.ROLE_NOT_FOUND));

        HashSet<Role> roles = new HashSet<>();
        roles.add(userRole);
        user.setRoles(roles);

        return userMapper.toUserResponse(userRepository.save(user));
    }

    @Override
    @PreAuthorize("hasRole('ADMIN')")
    public UserResponse getUserById(String userId) {
        return userMapper.toUserResponse(userRepository.findById(userId)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND)));
    }

    @Override
    @PreAuthorize("hasRole('ADMIN')")
    public PageResponse<UserResponse> getAllUsers(int pageNo, int pageSize) {

        if(pageNo > 0){
            pageNo = pageNo - 1;
        }

        Pageable pageable = PageRequest.of(pageNo, pageSize);

        Page<User> users;

        users = userRepository.findAll(pageable);

        List<UserResponse> userResponses = users.getContent()
                .stream()
                .map(userMapper::toUserResponse)
                .toList();

        return PageResponse.<UserResponse>builder()
                .content(userResponses)
                .pageNo(pageNo)
                .pageSize(pageSize)
                .totalElements(users.getTotalElements())
                .totalPages(users.getTotalPages())
                .last(users.isLast())
                .build();
    }

    @Override
    @PreAuthorize("hasRole('USER')")
    public UserResponse updateUser(UserUpdateRequest request, String userId) {

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND));

        userMapper.updateUser(request, user);

        var roles = roleRepository.findAllById(request.getRoles());
        user.setRoles(new HashSet<>(roles));

        return userMapper.toUserResponse(userRepository.save(user));
    }

    @Override
    @PreAuthorize("hasRole('ADMIN')")
    public void deleteUser(String userId) {
        userRepository.deleteById(userId);
    }

    @Override
    @PreAuthorize("isAuthenticated()")
    public UserResponse getMyInfo() {
        var context = SecurityContextHolder.getContext();
        String name = context.getAuthentication().getName();

        User user = userRepository.findByUsername(name)
                .orElseThrow(()->new AppException(ErrorCode.USER_NOT_EXISTS));

        return userMapper.toUserResponse(user);
    }

    @Override
    @PreAuthorize("isAuthenticated()")
    public StorageUsageResponse getMyStorageUsage() {
        User user = getCurrentUser();

        long used = user.getStorageUsedBytes() == null
                ? 0L
                : user.getStorageUsedBytes();

        long limit = user.getStorageLimitBytes() == null
                ? DEFAULT_STORAGE_LIMIT
                : user.getStorageLimitBytes();

        long remaining = Math.max(0L, limit - used);

        double usedPercent = limit == 0
                ? 0D
                : used * 100.0 / limit;

        return StorageUsageResponse.builder()
                .usedBytes(used)
                .limitBytes(limit)
                .remainingBytes(remaining)
                .usedPercent(usedPercent)
                .build();
    }

    private User getCurrentUser() {
        var context = SecurityContextHolder.getContext();

        String username = context.getAuthentication().getName();

        return userRepository.findByUsername(username)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_EXISTS));
    }
}
