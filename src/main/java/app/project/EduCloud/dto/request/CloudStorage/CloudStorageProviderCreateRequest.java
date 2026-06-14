package app.project.EduCloud.dto.request.CloudStorage;

import app.project.EduCloud.enums.CloudStorageStatus;
import jakarta.validation.constraints.NotBlank;
import lombok.*;
import lombok.experimental.FieldDefaults;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class CloudStorageProviderCreateRequest {

    @NotBlank(message = "ENDPOINT_URL_REQUIRED")
    String endpointUrl;

    @NotBlank(message = "BUCKET_NAME_REQUIRED")
    String bucketName;
}