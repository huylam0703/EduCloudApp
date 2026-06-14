package app.project.EduCloud.service.CloudStorage.impl;

import java.time.LocalDateTime;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import app.project.EduCloud.dto.request.CloudStorage.CloudStorageProviderCreateRequest;
import app.project.EduCloud.dto.response.CloudStorage.CloudStorageInfoResponse;
import app.project.EduCloud.dto.response.CloudStorage.CloudStorageProviderResponse;
import app.project.EduCloud.entity.CloudStorageProvider;
import app.project.EduCloud.enums.CloudProviderName;
import app.project.EduCloud.enums.CloudStorageStatus;
import app.project.EduCloud.exception.AppException;
import app.project.EduCloud.exception.ErrorCode;
import app.project.EduCloud.mapper.CloudStorageProviderMapper;
import app.project.EduCloud.repository.CloudStorageProviderRepository;
import app.project.EduCloud.service.CloudStorage.CloudStorageProviderService;
import lombok.RequiredArgsConstructor;
import software.amazon.awssdk.core.exception.SdkClientException;
import software.amazon.awssdk.services.s3.S3Client;
import software.amazon.awssdk.services.s3.model.ListObjectsV2Request;
import software.amazon.awssdk.services.s3.model.ListObjectsV2Response;
import software.amazon.awssdk.services.s3.model.S3Exception;
import software.amazon.awssdk.services.s3.model.S3Object;

@Service
@RequiredArgsConstructor
public class CloudStorageProviderServiceImpl implements CloudStorageProviderService {

    private final CloudStorageProviderRepository cloudStorageProviderRepository;
    private final CloudStorageProviderMapper cloudStorageProviderMapper;
    private final S3Client s3Client;

    @Override
    @Transactional
    public CloudStorageProviderResponse createProvider(CloudStorageProviderCreateRequest request) {
        if (cloudStorageProviderRepository.existsByProviderName(CloudProviderName.AWS_S3)) {
            throw new AppException(ErrorCode.CLOUD_STORAGE_PROVIDER_EXISTED);
        }

        CloudStorageProvider provider = CloudStorageProvider.builder()
                .providerName(CloudProviderName.AWS_S3)
                .endpointUrl(request.getEndpointUrl())
                .bucketName(request.getBucketName())
                .status(CloudStorageStatus.ACTIVE)
                .build();

        return cloudStorageProviderMapper.toResponse(
                cloudStorageProviderRepository.save(provider)
        );
    }

    @Override
    public CloudStorageInfoResponse getCloudStorageInfo() {
        CloudStorageProvider provider = cloudStorageProviderRepository
                .findByProviderNameAndStatus(CloudProviderName.AWS_S3, CloudStorageStatus.ACTIVE)
                .orElseThrow(() -> new AppException(ErrorCode.CLOUD_STORAGE_PROVIDER_NOT_FOUND));

        S3BucketUsage usage = scanS3Bucket(provider.getBucketName());

        return CloudStorageInfoResponse.builder()
                .id(provider.getId())
                .providerName(provider.getProviderName())
                .endpointUrl(provider.getEndpointUrl())
                .bucketName(provider.getBucketName())
                .status(provider.getStatus())
                .totalFiles(usage.totalFiles())
                .usedBytes(usage.usedBytes())
                .usedSize(formatBytes(usage.usedBytes()))
                .createdAt(provider.getCreatedAt())
                .checkedAt(LocalDateTime.now())
                .build();
    }

    private S3BucketUsage scanS3Bucket(String bucketName) {
        if (bucketName == null || bucketName.isBlank()) {
            throw new AppException(ErrorCode.AWS_S3_BUCKET_SCAN_FAILED);
        }

        long totalFiles = 0L;
        long usedBytes = 0L;
        String continuationToken = null;

        try {
            do {
                ListObjectsV2Request request = ListObjectsV2Request.builder()
                        .bucket(bucketName)
                        .continuationToken(continuationToken)
                        .build();

                ListObjectsV2Response response = s3Client.listObjectsV2(request);

                for (S3Object object : response.contents()) {
                    if (object.key() != null && object.key().endsWith("/")) {
                        continue;
                    }

                    totalFiles++;
                    usedBytes += object.size() == null ? 0L : object.size();
                }

                continuationToken = response.nextContinuationToken();

                if (!Boolean.TRUE.equals(response.isTruncated())) {
                    break;
                }

            } while (continuationToken != null);

            return new S3BucketUsage(totalFiles, usedBytes);

        } catch (S3Exception | SdkClientException exception) {
            throw new AppException(ErrorCode.AWS_S3_BUCKET_SCAN_FAILED);
        }
    }

    private String formatBytes(long bytes) {
        if (bytes < 1024) {
            return bytes + " B";
        }

        double kb = bytes / 1024.0;
        if (kb < 1024) {
            return String.format("%.2f KB", kb);
        }

        double mb = kb / 1024.0;
        if (mb < 1024) {
            return String.format("%.2f MB", mb);
        }

        double gb = mb / 1024.0;
        return String.format("%.2f GB", gb);
    }

    private record S3BucketUsage(long totalFiles, long usedBytes) {
    }
}