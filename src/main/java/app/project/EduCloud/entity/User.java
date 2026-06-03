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

    @ManyToMany
    Set<Role> roles;
}
