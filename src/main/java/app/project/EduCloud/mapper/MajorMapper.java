package app.project.EduCloud.mapper;

import org.mapstruct.Mapper;

import app.project.EduCloud.dto.response.Major.MajorResponse;
import app.project.EduCloud.entity.Major;

@Mapper(componentModel = "spring")
public interface MajorMapper {
    MajorResponse toMajorResponse(Major major);
}
