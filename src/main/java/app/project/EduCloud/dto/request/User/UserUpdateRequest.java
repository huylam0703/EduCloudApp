package app.project.EduCloud.dto.request.User;

import com.fasterxml.jackson.annotation.JsonFormat;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDate;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class UserUpdateRequest {

    @NotBlank(message = "FIRST_NAME")
    String firstName;

    @NotBlank(message = "LAST_NAME")
    String lastName;

    @JsonFormat(pattern = "yyyy-MM-dd")
    LocalDate dob;

    @Email(message = "EMAIL_UNVALID")
    String email;

    @Size(min = 10, max = 15, message = "PHONE_NUMBER_UNVALID")
    String phoneNumber;

    List<String> roles;
}
