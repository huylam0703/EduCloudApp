package app.project.EduCloud.dto.response.Document;

import app.project.EduCloud.enums.DocumentVisibility;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class DocumentResponse {
    String id;

    String documentName;

    String fileUrl;

    String fileKey;

    Long fileSize;

    String fileType;

    String mimeType;

    String majorId;

    String majorCode;

    String majorName;

    String subjectId;

    String subjectCode;

    String subjectName;

    String folderId;

    String folderName;

    String uploadedById;

    String uploadedByName;

    DocumentVisibility visibility;

    Integer downloadCount;

    LocalDateTime createdAt;

    LocalDateTime updatedAt;
}
