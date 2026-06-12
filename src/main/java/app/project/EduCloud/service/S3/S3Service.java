package app.project.EduCloud.service.S3;

import app.project.EduCloud.dto.response.S3.S3UploadResponse;
import org.springframework.web.multipart.MultipartFile;

public interface S3Service {

    S3UploadResponse uploadFile(MultipartFile file, String folder);

    byte[] downloadFile(String key);

    void deleteFile(String key);

}
