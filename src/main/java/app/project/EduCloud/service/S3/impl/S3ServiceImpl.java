package app.project.EduCloud.service.S3.impl;

import app.project.EduCloud.dto.response.S3.S3UploadResponse;
import app.project.EduCloud.exception.AppException;
import app.project.EduCloud.exception.ErrorCode;
import app.project.EduCloud.service.S3.S3Service;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import software.amazon.awssdk.core.ResponseBytes;
import software.amazon.awssdk.core.exception.SdkClientException;
import software.amazon.awssdk.core.sync.RequestBody;
import software.amazon.awssdk.services.s3.S3Client;
import software.amazon.awssdk.services.s3.model.*;

import java.io.IOException;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.util.UUID;

@Service
@Slf4j
public class S3ServiceImpl implements S3Service {

    @Autowired
    S3Client s3Client;

    @Value("${cloud.aws.bucket-name}")
    private String bucketName;

    @Value("${cloud.aws.region.static}")
    private String region;


    @Override
    public S3UploadResponse uploadFile(MultipartFile file, String folder) {
        try {
            String originalFilename = file.getOriginalFilename();

            if (originalFilename == null || originalFilename.isBlank()) {
                throw new RuntimeException("FILE_NAME_INVALID");
            }

            String extension = "";
            int dotIndex = originalFilename.lastIndexOf(".");
            if (dotIndex != -1) {
                extension = originalFilename.substring(dotIndex);
            }

            String fileKey = folder + "/" + UUID.randomUUID() + extension;

            PutObjectRequest putObjectRequest = PutObjectRequest.builder()
                    .bucket(bucketName)
                    .key(fileKey)
                    .contentType(file.getContentType())
                    .contentLength(file.getSize())
                    .build();

            s3Client.putObject(
                    putObjectRequest,
                    RequestBody.fromBytes(file.getBytes())
            );

            String fileUrl = buildFileUrl(fileKey);

            return new S3UploadResponse(fileKey, fileUrl);

        } catch (IOException e) {
            log.error("Upload file to S3 failed", e);
            throw new RuntimeException("UPLOAD_FILE_FAILED");
        }
    }

    @Override
    public byte[] downloadFile(String key) {
        if (key == null || key.isBlank()) {
            throw new AppException(ErrorCode.FILE_KEY_INVALID);
        }

        try {
            System.out.println("DOWNLOAD S3 KEY: " + key);

            GetObjectRequest getObjectRequest = GetObjectRequest.builder()
                    .bucket(bucketName)
                    .key(key)
                    .build();

            ResponseBytes<GetObjectResponse> objectAsBytes =
                    s3Client.getObjectAsBytes(getObjectRequest);

            return objectAsBytes.asByteArray();

        } catch (NoSuchKeyException e) {
            throw new AppException(ErrorCode.FILE_NOT_FOUND_IN_STORAGE);

        } catch (S3Exception e) {
            System.out.println("S3 ERROR CODE: " + e.awsErrorDetails().errorCode());
            System.out.println("S3 ERROR MESSAGE: " + e.awsErrorDetails().errorMessage());
            throw new AppException(ErrorCode.FILE_DOWNLOAD_FAILED);

        } catch (SdkClientException e) {
            System.out.println("AWS SDK CLIENT ERROR: " + e.getMessage());
            throw new AppException(ErrorCode.FILE_DOWNLOAD_FAILED);
        }
    }

    @Override
    public void deleteFile(String key) {
        DeleteObjectRequest deleteObjectRequest = DeleteObjectRequest.builder()
                .bucket(bucketName)
                .key(key)
                .build();

        s3Client.deleteObject(deleteObjectRequest);
    }

    private String buildFileUrl(String fileKey) {
        String encodedKey = URLEncoder.encode(fileKey, StandardCharsets.UTF_8)
                .replace("+", "%20")
                .replace("%2F", "/");

        return "https://" + bucketName + ".s3." + region + ".amazonaws.com/" + encodedKey;
    }
}
