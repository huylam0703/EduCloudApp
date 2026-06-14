package app.project.EduCloud.dto.response.CloudStorage;

import java.time.LocalDateTime;

import app.project.EduCloud.enums.CloudProviderName;
import app.project.EduCloud.enums.CloudStorageStatus;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.experimental.FieldDefaults;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class CloudStorageInfoResponse {

    String id;

    CloudProviderName providerName;

    String endpointUrl;

    String bucketName;

    CloudStorageStatus status;

    Long totalFiles;

    Long usedBytes;

    String usedSize;

    LocalDateTime createdAt;

    LocalDateTime checkedAt;
}