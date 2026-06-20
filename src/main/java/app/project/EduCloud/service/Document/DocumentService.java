package app.project.EduCloud.service.Document;

import app.project.EduCloud.dto.request.Document.DocumentRequest;
import app.project.EduCloud.dto.response.Document.DocumentResponse;
import app.project.EduCloud.dto.response.Document.DownloadFileResponse;
import app.project.EduCloud.dto.response.PageResponse;

import java.util.List;


public interface DocumentService {

    DocumentResponse uploadDocument(DocumentRequest request);

    PageResponse<DocumentResponse> getAllDocuments(int pageNo, int pageSize);

    List<DocumentResponse> getAllMyDocuments();

    PageResponse<DocumentResponse> getDocumentPublic(int pageNo, int pageSize, String majorId, String subjectId, String fileType);

    DocumentResponse renameDocument(DocumentRequest request, String documentId);

    void deleteDocument(String documentId);

    DocumentResponse moveDocument(String documentId, String folderId);

    DownloadFileResponse downloadDocument(String documentId);

    // doi tu public sang private
    DocumentResponse changeToPrivateDocument(String documentId);

    //get detail
    DocumentResponse getDetailResponse(String documentId);

}
