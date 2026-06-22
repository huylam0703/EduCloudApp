package app.project.EduCloud.dto.response.User;

import app.project.EduCloud.dto.response.Auth.RoleResponse;
import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDate;
import java.util.Set;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class UserResponse {
    String id;
    String firstName;
    String lastName;
    String fullName;
    @JsonFormat(pattern = "yyyy-MM-dd")
    LocalDate dob;
    String username;
    String email;
    String phoneNumber;
    Long storageUsedBytes;
    Set<RoleResponse> roles;
}
