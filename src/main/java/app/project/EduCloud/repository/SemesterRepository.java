package app.project.EduCloud.repository;

import app.project.EduCloud.entity.Semesters;
import lombok.AccessLevel;
import lombok.experimental.FieldDefaults;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface SemesterRepository extends JpaRepository<Semesters, String> {

}
