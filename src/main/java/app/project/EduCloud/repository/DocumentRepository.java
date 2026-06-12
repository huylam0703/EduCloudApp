package app.project.EduCloud.repository;

import app.project.EduCloud.entity.Document;
import app.project.EduCloud.entity.Folder;
import app.project.EduCloud.enums.DocumentVisibility;
import app.project.EduCloud.enums.FileType;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface DocumentRepository extends JpaRepository<Document, String> {

    List<Document> findByUploadedBy_Id(String userId);

    @Query("""
    SELECT d
    FROM Document d
    WHERE d.visibility = :visibility
      AND d.deletedAt IS NULL
      AND (:majorId IS NULL OR d.major.id = :majorId)
      AND (:fileType IS NULL OR d.fileType = :fileType)
""")
    Page<Document> findPublicDocuments(
            @Param("visibility") DocumentVisibility visibility,
            @Param("majorId") String majorId,
            @Param("fileType") String fileType,
            Pageable pageable
    );

    List<Document> findByFolder(Folder folder);
}
