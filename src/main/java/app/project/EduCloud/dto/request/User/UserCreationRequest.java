package app.project.EduCloud.dto.request.User;

import com.fasterxml.jackson.annotation.JsonFormat;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDate;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class UserCreationRequest {

    @NotBlank(message = "FIRST_NAME")
    String firstName;

    @NotBlank(message = "LAST_NAME")
    String lastName;

    @JsonFormat(pattern = "yyyy-MM-dd")
    LocalDate dob;

    @Size(min = 6, message = "USERNAME_UNVALID")
    String username;

    @Size(min = 8,message = "PASSWORD_UNVALID")
    String password;

    @Email(message = "EMAIL_UNVALID")
    String email;

    @Min(value = 12, message = "IDENTITY_NUMBER_UNVALID")
    String identityNumber;
}
