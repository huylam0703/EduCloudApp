package app.project.EduCloud.entity;

import app.project.EduCloud.enums.DocumentVisibility;
import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDateTime;

@Entity
@Table(name = "tbl_document")
@Builder
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class Document {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    String id;

    @Column(name = "document_name", nullable = false, columnDefinition = "NVARCHAR(255)")
    String documentName;

    @Column(name = "file_url", nullable = false, columnDefinition = "TEXT")
    String fileUrl;

    @Column(name = "file_key", nullable = false, columnDefinition = "NVARCHAR(1000)")
    String fileKey;

    @Column(name = "file_size", nullable = false)
    Long fileSize;

    @Column(name = "file_type", nullable = false)
    String fileType;

    @Column(name = "mime_type")
    String mimeType;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "major_id")
    Major major;


    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "subject_id")
    Subject subject;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "folder_id")
    Folder folder;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "uploaded_by", nullable = false)
    User uploadedBy;

    @Enumerated(EnumType.STRING)
    @Column(name = "visibility", nullable = false)
    DocumentVisibility visibility;

    @Column(name = "download_count")
    Integer downloadCount;

    @Column(name = "created_at")
    LocalDateTime createdAt;

    @Column(name = "updated_at")
    LocalDateTime updatedAt;

    @Column(name = "deleted_at")
    LocalDateTime deletedAt;
}
