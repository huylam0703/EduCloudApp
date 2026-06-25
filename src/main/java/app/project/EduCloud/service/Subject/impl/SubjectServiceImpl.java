package app.project.EduCloud.service.Subject.impl;

import app.project.EduCloud.dto.request.Subject.SubjectRequest;
import app.project.EduCloud.dto.request.Subject.SubjectUpdateRequest;
import app.project.EduCloud.dto.response.Subject.SubjectResponse;
import app.project.EduCloud.entity.Major;
import app.project.EduCloud.entity.Subject;
import app.project.EduCloud.exception.AppException;
import app.project.EduCloud.exception.ErrorCode;
import app.project.EduCloud.mapper.SubjectMapper;
import app.project.EduCloud.repository.MajorRepository;
import app.project.EduCloud.repository.SubjectRepository;
import app.project.EduCloud.service.Subject.SubjectService;
import jakarta.transaction.Transactional;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import org.apache.poi.ss.usermodel.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Service
@Slf4j
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class SubjectServiceImpl implements SubjectService {
    SubjectRepository subjectRepository;
    SubjectMapper subjectMapper;
    MajorRepository majorRepository;


    @Override
    @PreAuthorize("hasRole('ADMIN')")
    public SubjectResponse addSubject(SubjectRequest request, String majorId) {
        Major major = majorRepository.findById(majorId)
                .orElseThrow(()-> new AppException(ErrorCode.MAJOR_NOT_FOUND));

        Subject subject = Subject.builder()
                .major(major)
                .subjectName(request.getSubjectName())
                .subjectCode(generateSubjectCode(major.getMajorCode()))
                .description(request.getDescription())
                .createdAt(LocalDateTime.now())
                .build();
        Subject savedSubject = subjectRepository.save(subject);

        return subjectMapper.toSubjectResponse(savedSubject);
    }

    @Override
    @PreAuthorize("hasRole('ADMIN')")
    public SubjectResponse updateSubject(SubjectUpdateRequest request, String subjectId) {
        Subject subject = subjectRepository.findById(subjectId)
                .orElseThrow(()-> new AppException(ErrorCode.SUBJECT_NOT_FOUND));

        subjectMapper.updateUser(request, subject);

        return subjectMapper.toSubjectResponse(subjectRepository.save(subject));
    }

    @Override
    @PreAuthorize("hasRole('ADMIN')")
    public void deleteSubject(String subjectId) {
        subjectRepository.deleteById(subjectId);
    }

    @Override
    @PreAuthorize("hasRole('ADMIN')")
    public SubjectResponse getDetailSubject(String subjectId) {
        Subject subject = subjectRepository.findById(subjectId)
                .orElseThrow(()-> new AppException(ErrorCode.SUBJECT_NOT_FOUND));

        return subjectMapper.toSubjectResponse(subject);
    }

    @Override
    public List<SubjectResponse> getSubjectsByMajor(String majorId) {
        return subjectRepository.findByMajor_Id(majorId)
                .stream()
                .map(subjectMapper::toSubjectResponse)
                .toList();
    }

    @Override
    @PreAuthorize("hasRole('ADMIN')")
    @Transactional
    public String importSubjects(MultipartFile file) {
        int created = 0;
        int skipped = 0;
        int errors = 0;

        DataFormatter formatter = new DataFormatter();

        try (Workbook workbook = WorkbookFactory.create(file.getInputStream())) {

            Sheet sheet = workbook.getSheetAt(0);

            // Bỏ dòng header, bắt đầu từ dòng 2
            for (int i = 1; i <= sheet.getLastRowNum(); i++) {
                Row row = sheet.getRow(i);

                if (row == null) {
                    continue;
                }

                try {
                    String majorCode = formatter.formatCellValue(row.getCell(0)).trim();
                    String subjectCode = formatter.formatCellValue(row.getCell(3)).trim();
                    String subjectName = formatter.formatCellValue(row.getCell(4)).trim();
                    String subjectDescription = formatter.formatCellValue(row.getCell(5)).trim();

                    if (majorCode.isEmpty() || subjectCode.isEmpty() || subjectName.isEmpty()) {
                        skipped++;
                        continue;
                    }

                    if (subjectRepository.existsBySubjectCode(subjectCode)) {
                        skipped++;
                        continue;
                    }

                    Major major = majorRepository.findByMajorCode(majorCode)
                            .orElse(null);

                    if (major == null) {
                        skipped++;
                        continue;
                    }

                    Subject subject = Subject.builder()
                            .subjectCode(subjectCode)
                            .subjectName(subjectName)
                            .description(subjectDescription)
                            .major(major)
                            .createdAt(LocalDateTime.now())
                            .build();

                    subjectRepository.save(subject);
                    created++;

                } catch (Exception e) {
                    errors++;
                }
            }

            return "Import thành công. Created: " + created
                    + ", Skipped: " + skipped
                    + ", Errors: " + errors;

        } catch (Exception e) {
            throw new RuntimeException("Import file Excel thất bại: " + e.getMessage());
        }
    }

    private String generateSubjectCode(String majorCode) {
        return majorCode + "-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase();
    }
}
