package app.project.EduCloud.mapper;

import app.project.EduCloud.dto.response.CloudStorage.CloudStorageProviderResponse;
import app.project.EduCloud.entity.CloudStorageProvider;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface CloudStorageProviderMapper {

    CloudStorageProviderResponse toResponse(CloudStorageProvider cloudStorageProvider);
}