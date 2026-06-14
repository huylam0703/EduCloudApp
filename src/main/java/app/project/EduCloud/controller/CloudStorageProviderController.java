package app.project.EduCloud.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import app.project.EduCloud.dto.request.CloudStorage.CloudStorageProviderCreateRequest;
import app.project.EduCloud.dto.response.Auth.ApiResponse;
import app.project.EduCloud.dto.response.CloudStorage.CloudStorageInfoResponse;
import app.project.EduCloud.dto.response.CloudStorage.CloudStorageProviderResponse;
import app.project.EduCloud.service.CloudStorage.CloudStorageProviderService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@RestController
@RequestMapping("/cloud-storage")
@RequiredArgsConstructor
@Slf4j
public class CloudStorageProviderController {

    private final CloudStorageProviderService cloudStorageProviderService;

    @PostMapping("/provider")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<CloudStorageProviderResponse>> createProvider(
            @RequestBody @Valid CloudStorageProviderCreateRequest request) {

        log.info("Create AWS S3 cloud storage provider");

        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.<CloudStorageProviderResponse>builder()
                        .code(1000)
                        .message("Create cloud storage provider success")
                        .result(cloudStorageProviderService.createProvider(request))
                        .build());
    }

    @GetMapping("/info")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<CloudStorageInfoResponse>> getCloudStorageInfo() {

        log.info("Get AWS S3 cloud storage info");

        return ResponseEntity.status(HttpStatus.OK)
                .body(ApiResponse.<CloudStorageInfoResponse>builder()
                        .code(1000)
                        .message("Get cloud storage info success")
                        .result(cloudStorageProviderService.getCloudStorageInfo())
                        .build());
    }
}