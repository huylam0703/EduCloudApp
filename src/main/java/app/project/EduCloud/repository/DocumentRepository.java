package app.project.EduCloud.repository;

import app.project.EduCloud.entity.Document;
import app.project.EduCloud.entity.Folder;
import app.project.EduCloud.enums.DocumentVisibility;
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
      AND (:majorId IS NULL OR :majorId = '' OR d.major.id = :majorId)
      AND (:subjectId IS NULL OR :subjectId = '' OR d.subject.id = :subjectId)
      AND (:fileType IS NULL OR :fileType = '' OR UPPER(d.fileType) = UPPER(:fileType))
""")
    Page<Document> findPublicDocuments(
            @Param("visibility") DocumentVisibility visibility,
            @Param("majorId") String majorId,
            @Param("subjectId") String subjectId,
            @Param("fileType") String fileType,
            Pageable pageable
    );

    List<Document> findByFolder(Folder folder);

    @Query("""
        SELECT COALESCE(SUM(d.fileSize), 0)
        FROM Document d
    """)
    long sumTotalStorageBytes();

    @Query("""
        SELECT d.major.majorName, COUNT(d.id)
        FROM Document d
        WHERE d.major IS NOT NULL
        GROUP BY d.major.majorName
    """)
    List<Object[]> countDocumentsByMajor();
}
