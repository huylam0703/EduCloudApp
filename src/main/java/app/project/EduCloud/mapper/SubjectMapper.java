package app.project.EduCloud.mapper;

import app.project.EduCloud.dto.request.Subject.SubjectUpdateRequest;
import app.project.EduCloud.dto.response.Subject.SubjectResponse;
import app.project.EduCloud.entity.Subject;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;

@Mapper(componentModel = "spring")
public interface SubjectMapper {
    Subject toSubject(Subject subject);

    @Mapping(source = "major.majorCode", target = "majorCode")
    SubjectResponse toSubjectResponse(Subject subject);

    void updateUser(SubjectUpdateRequest request, @MappingTarget Subject subject);
}
