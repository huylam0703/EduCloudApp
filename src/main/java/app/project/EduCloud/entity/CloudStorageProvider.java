package app.project.EduCloud.entity;

import java.time.LocalDateTime;

import app.project.EduCloud.enums.CloudProviderName;
import app.project.EduCloud.enums.CloudStorageStatus;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.PrePersist;
import jakarta.persistence.Table;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.experimental.FieldDefaults;

@Entity
@Table(name = "cloud_storage_providers")
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class CloudStorageProvider {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    String id;

    @Enumerated(EnumType.STRING)
    @Column(name = "provider_name", nullable = false, unique = true, length = 100)
    CloudProviderName providerName;

    @Column(name = "endpoint_url", columnDefinition = "NVARCHAR(MAX)")
    String endpointUrl;

    @Column(name = "bucket_name", length = 255)
    String bucketName;

    @Enumerated(EnumType.STRING)
    @Column(name = "status", length = 50)
    CloudStorageStatus status;

    @Column(name = "created_at")
    LocalDateTime createdAt;

    @PrePersist
    void prePersist() {
        if (providerName == null) {
            providerName = CloudProviderName.AWS_S3;
        }

        if (status == null) {
            status = CloudStorageStatus.ACTIVE;
        }

        if (createdAt == null) {
            createdAt = LocalDateTime.now();
        }
    }
}