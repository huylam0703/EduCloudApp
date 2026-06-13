package app.project.EduCloud.repository;

import app.project.EduCloud.entity.ActivityLog;
import app.project.EduCloud.enums.ActivityAction;
import app.project.EduCloud.enums.ActivityEntityType;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface ActivityLogRepository extends JpaRepository<ActivityLog, String> {

    Page<ActivityLog> findByUser_Id(String userId, Pageable pageable);

    @Query("""
            SELECT a FROM ActivityLog a
            WHERE (:userId IS NULL OR a.user.id = :userId)
              AND (:action IS NULL OR a.action = :action)
              AND (:entityType IS NULL OR a.entityType = :entityType)
            """)
    Page<ActivityLog> searchLogs(
            @Param("userId") String userId,
            @Param("action") ActivityAction action,
            @Param("entityType") ActivityEntityType entityType,
            Pageable pageable
    );
}