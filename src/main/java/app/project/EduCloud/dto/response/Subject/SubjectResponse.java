package app.project.EduCloud.dto.response.Subject;

import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class SubjectResponse {
    String majorCode;
    String subjectCode;
    String subjectName;
    String description;
    LocalDateTime createdAt;

}
