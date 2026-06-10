package app.project.EduCloud.dto.response.Folder;

import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class FolderBaseResponse {
    String id;

    String folderName;

    String parentFolderId;

    String userId;

    LocalDateTime createdAt;

    LocalDateTime updatedAt;
}
