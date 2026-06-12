package app.project.EduCloud.dto.response.Folder;

import lombok.*;
import lombok.experimental.FieldDefaults;

import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class FolderTreeResponse {
    private String id;
    private String folderName;
    private String parentId;
    private List<FolderTreeResponse> children;
}
