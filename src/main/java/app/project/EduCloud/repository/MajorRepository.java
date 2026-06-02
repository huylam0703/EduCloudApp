package app.project.EduCloud.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import app.project.EduCloud.entity.Major;

public interface MajorRepository extends JpaRepository<Major, String>{
    Boolean existsByMajorName(String majorName);

    Optional<Major> findByMajorCode(String majorCode);

    @Query("SELECT m.majorCode FROM Major m")
    List<String> findAllMajorCodes();

    //============
    //search major
    //============
    @Query(value = """
       SELECT *
       FROM major m
       WHERE (:searchString IS NULL
              OR :searchString = ''
              OR m.majorCode LIKE N'%' + :searchString + N'%' COLLATE Latin1_General_CI_AI
              OR m.majorName LIKE N'%' + :searchString + N'%' COLLATE Latin1_General_CI_AI)
       """, nativeQuery = true)
    List<Major> findByMajorCodeContainingIgnoreCaseOrMajorNameContainingIgnoreCase(@Param("searchString") String searchString);
}
