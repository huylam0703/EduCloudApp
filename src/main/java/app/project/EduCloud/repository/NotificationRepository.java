package app.project.EduCloud.repository;

import app.project.EduCloud.entity.Notification;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface NotificationRepository extends JpaRepository<Notification, String> {

    Page<Notification> findByUser_Id(String userId, Pageable pageable);

    List<Notification> findByUser_IdOrderByCreatedAtDesc(String userId);

    long countByUser_IdAndReadFalse(String userId);

    void deleteByUser_Id(String userId);
}