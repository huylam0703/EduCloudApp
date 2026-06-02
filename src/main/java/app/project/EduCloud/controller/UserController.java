package app.project.EduCloud.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import app.project.EduCloud.dto.request.User.UserCreationRequest;
import app.project.EduCloud.dto.request.User.UserUpdateRequest;
import app.project.EduCloud.dto.response.Auth.ApiResponse;
import app.project.EduCloud.dto.response.User.UserResponse;
import app.project.EduCloud.service.User.UserService;
import jakarta.validation.Valid;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;

@RestController
@RequiredArgsConstructor
@Slf4j
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@RequestMapping("/users")
public class UserController {
    UserService userService;

    @PostMapping
    public ResponseEntity<ApiResponse<UserResponse>> createUser(@RequestBody @Valid UserCreationRequest request){

        log.info("Create user with username={}", request.getUsername());

        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.<UserResponse>builder()
                        .code(1000)
                        .result(userService.createUser(request))
                        .message("User created")
                        .build());
    }

    @GetMapping("/{userId}")
    public ResponseEntity<ApiResponse<UserResponse>> getUser(@PathVariable String userId){
        log.info("Get user with userId={}", userId);
        return ResponseEntity.status(HttpStatus.OK)
                .body(ApiResponse.<UserResponse>builder()
                        .code(1000)
                        .result(userService.getUserById(userId))
                        .message("User get")
                        .build());
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<UserResponse>>> getAllUser(){
        log.info("Get all users");

         var authentication = SecurityContextHolder.getContext().getAuthentication();

         log.info("username: {}", authentication.getName());
        authentication.getAuthorities().forEach(g -> log.info(g.getAuthority()));


        return ResponseEntity.status(HttpStatus.OK)
                .body(ApiResponse.<List<UserResponse>>builder()
                        .code(1000)
                        .result(userService.getAllUsers())
                        .message("All users")
                        .build());
    }

    @PutMapping("/{userId}")
    public ResponseEntity<ApiResponse<UserResponse>> updateUser(@PathVariable String userId,
                                                                @RequestBody @Valid UserUpdateRequest request){
        log.info("Update user with userId={}", userId);

        return ResponseEntity.status(HttpStatus.ACCEPTED)
                .body(ApiResponse.<UserResponse>builder()
                        .code(1000)
                        .result(userService.updateUser(request, userId))
                        .message("User updated")
                        .build());
    }

    @DeleteMapping("/{userId}")
    public ResponseEntity<ApiResponse<String>> deleteUser(@PathVariable String userId){
        log.info("Delete user with userId={}", userId);
        userService.deleteUser(userId);

        return ResponseEntity.status(HttpStatus.ACCEPTED)
                .body(ApiResponse.<String>builder()
                        .code(1000)
                        .result("User deleted")
                        .build());
    }

    @GetMapping("/myInfo")
    public ResponseEntity<ApiResponse<UserResponse>> getMyInfo(){
        log.info("Get My Info");
        return ResponseEntity.status(HttpStatus.OK)
                .body(ApiResponse.<UserResponse>builder()
                        .code(1000)
                        .result(userService.getMyInfo())
                        .message("User get")
                        .build());
    }
}
