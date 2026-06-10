package app.project.EduCloud.dto.request.Folder;

import jakarta.validation.constraints.NotBlank;
import lombok.*;
import lombok.experimental.FieldDefaults;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class FolderRequest {
    @NotBlank(message = "FOLDER_NAME_REQUIRED")
    String folderName;

    // null = tạo folder gốc
    // có value = tạo folder con
    String parentFolderId;
}
