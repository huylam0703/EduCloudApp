package app.project.EduCloud.mapper;

import app.project.EduCloud.dto.response.Folder.FolderBaseResponse;
import app.project.EduCloud.dto.response.Folder.FolderResponse;
import app.project.EduCloud.dto.response.Folder.FolderTreeResponse;
import app.project.EduCloud.entity.Folder;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface FolderMapper {
    @Mapping(source = "parentFolder.id", target = "parentFolderId")
    @Mapping(source = "user.id", target = "userId")
    FolderResponse toFolderResponse(Folder folder);

    @Mapping(source = "user.id", target = "userId")
    FolderBaseResponse toFolderBaseResponse(Folder folder);

    FolderTreeResponse toFolderTreeResponse(Folder folder);
}
