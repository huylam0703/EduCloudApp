package app.project.EduCloud.mapper;

import app.project.EduCloud.dto.response.Semeters.SemesterResponse;
import app.project.EduCloud.entity.Semesters;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface SemesterMapper {
    SemesterResponse toSemesterResponse(Semesters semesters);
}
