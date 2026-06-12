package app.project.EduCloud.dto.response.Folder;

import app.project.EduCloud.dto.response.Document.DocumentResponse;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDateTime;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class FolderResponse {
    String id;

    String folderName;

    String parentFolderId;

    String userId;

    LocalDateTime createdAt;

    LocalDateTime updatedAt;

    List<FolderResponse> children;

    List<DocumentResponse> documents;
}
