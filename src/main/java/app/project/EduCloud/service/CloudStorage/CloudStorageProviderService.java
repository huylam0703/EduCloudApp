package app.project.EduCloud.service.CloudStorage;

import app.project.EduCloud.dto.request.CloudStorage.CloudStorageProviderCreateRequest;
import app.project.EduCloud.dto.response.CloudStorage.CloudStorageInfoResponse;
import app.project.EduCloud.dto.response.CloudStorage.CloudStorageProviderResponse;

public interface CloudStorageProviderService {

    CloudStorageProviderResponse createProvider(CloudStorageProviderCreateRequest request);

    CloudStorageInfoResponse getCloudStorageInfo();
}