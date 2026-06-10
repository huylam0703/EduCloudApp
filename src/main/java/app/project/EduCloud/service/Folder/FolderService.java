package app.project.EduCloud.service.Folder;

import app.project.EduCloud.dto.request.Folder.FolderRequest;
import app.project.EduCloud.dto.request.Folder.RenameFolderRequest;
import app.project.EduCloud.dto.response.Folder.FolderBaseResponse;
import app.project.EduCloud.dto.response.Folder.FolderResponse;

import java.util.List;

public interface FolderService {

    FolderResponse createFolder(FolderRequest request);

    FolderResponse getDetailFolder(String folderId);

    List<FolderBaseResponse> getAllFolders();

    FolderBaseResponse renameFolder(String folderId, RenameFolderRequest request);

    void deleteFolder(String folderId);
}
