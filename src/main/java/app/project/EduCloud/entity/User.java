package app.project.EduCloud.entity;

import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDate;
import java.util.Set;

@Entity
@Table(name = "tbl_user")
@Builder
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    String id;
    
    @Column(columnDefinition = "NVARCHAR(150)")
    String firstName;
    @Column(columnDefinition = "NVARCHAR(150)")
    String lastName;
    
    LocalDate dob;
    String username;
    String password;
    String email;
    String phoneNumber;

    @Builder.Default
    @Column(name = "storage_used_bytes", nullable = false)
    Long storageUsedBytes = 0L;

    @Builder.Default
    @Column(name = "storage_limit_bytes", nullable = false)
    Long storageLimitBytes = 5L * 1024 * 1024 * 1024;

    @ManyToMany
    Set<Role> roles;
}
