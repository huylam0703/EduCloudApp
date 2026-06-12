package app.project.EduCloud.dto.response.Document;

import lombok.*;
import lombok.experimental.FieldDefaults;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class DownloadFileResponse {
    String originalFileName;
    String contentType;
    byte[] data;
}
