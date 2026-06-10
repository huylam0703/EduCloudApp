package app.project.EduCloud.dto.request.Subject;

import lombok.*;
import lombok.experimental.FieldDefaults;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class SubjectUpdateRequest {

    String subjectName;
    String description;

}
