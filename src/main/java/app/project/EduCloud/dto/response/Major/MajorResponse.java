package app.project.EduCloud.dto.response.Major;

import lombok.*;
import lombok.experimental.FieldDefaults;


@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class MajorResponse {
    String id;
    String majorName;
    String majorCode;
    String description;
}
