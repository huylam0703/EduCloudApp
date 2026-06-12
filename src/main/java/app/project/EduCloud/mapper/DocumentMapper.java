package app.project.EduCloud.mapper;

import app.project.EduCloud.dto.response.Document.DocumentResponse;
import app.project.EduCloud.entity.Document;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface DocumentMapper {
    @Mapping(source = "major.id", target = "majorId")
    @Mapping(source = "major.majorCode", target = "majorCode")
    @Mapping(source = "major.majorName", target = "majorName")

    @Mapping(source = "subject.id", target = "subjectId")
    @Mapping(source = "subject.subjectCode", target = "subjectCode")
    @Mapping(source = "subject.subjectName", target = "subjectName")

    @Mapping(source = "folder.id", target = "folderId")
    @Mapping(source = "folder.folderName", target = "folderName")

    @Mapping(source = "uploadedBy.id", target = "uploadedById")
    @Mapping(source = "uploadedBy.username", target = "uploadedByName")
    DocumentResponse toDocumentResponse(Document document);
}
