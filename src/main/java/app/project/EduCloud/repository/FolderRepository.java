package app.project.EduCloud.repository;

import app.project.EduCloud.entity.Folder;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import jakarta.transaction.Transactional;

import java.util.List;

@Repository
public interface FolderRepository extends JpaRepository<Folder, String> {
    List<Folder> findByUser_IdAndParentFolderIsNull(String userId);
    @Transactional
    void deleteByUser_Id(String userId);
}
