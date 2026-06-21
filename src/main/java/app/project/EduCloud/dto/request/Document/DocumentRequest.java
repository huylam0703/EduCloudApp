package app.project.EduCloud.dto.request.Document;

import app.project.EduCloud.enums.DocumentVisibility;
import lombok.*;
import lombok.experimental.FieldDefaults;
import org.aspectj.apache.bcel.classfile.Module;
import org.springframework.web.multipart.MultipartFile;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class DocumentRequest {
    MultipartFile file;

    String documentName;

    String majorId;

    String subjectId;

    String folderId;

    DocumentVisibility visibility;
}
