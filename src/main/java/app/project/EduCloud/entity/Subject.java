package app.project.EduCloud.entity;

import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDateTime;

@Entity
@Table(name = "tbl_subject")
@Builder
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class Subject {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    String id;

    @Column(name = "subject_code", nullable = false, unique = true)
    String subjectCode;

    @Column(name = "subject_name", nullable = false, columnDefinition = "NVARCHAR(100)")
    String subjectName;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "major_id")
    Major major;

    @Column(columnDefinition = "TEXT")
    String description;

    @Column(name = "created_at")
    LocalDateTime createdAt;
}
