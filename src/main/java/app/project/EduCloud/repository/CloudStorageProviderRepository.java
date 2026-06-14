package app.project.EduCloud.repository;

import app.project.EduCloud.entity.CloudStorageProvider;
import app.project.EduCloud.enums.CloudProviderName;
import app.project.EduCloud.enums.CloudStorageStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;
import java.util.UUID;

public interface CloudStorageProviderRepository extends JpaRepository<CloudStorageProvider, UUID> {

    boolean existsByProviderName(CloudProviderName providerName);

    Optional<CloudStorageProvider> findByProviderName(CloudProviderName providerName);

    Optional<CloudStorageProvider> findByProviderNameAndStatus(
            CloudProviderName providerName,
            CloudStorageStatus status
    );
}