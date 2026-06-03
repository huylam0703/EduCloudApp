package app.project.EduCloud.service.Semester.impl;

import app.project.EduCloud.dto.request.Semesters.SemesterRequest;
import app.project.EduCloud.dto.response.Semeters.SemesterResponse;
import app.project.EduCloud.entity.Semesters;
import app.project.EduCloud.mapper.SemesterMapper;
import app.project.EduCloud.repository.SemesterRepository;
import app.project.EduCloud.service.Semester.SemesterService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
@Slf4j
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class SemesterServiceImpl implements SemesterService {
    SemesterRepository semesterRepository;
    SemesterMapper semesterMapper;


    @Override
    @PreAuthorize("hasRole('USER')")
    public SemesterResponse createSemester(SemesterRequest request) {

        Semesters semesters = Semesters.builder()
                .semesterName(request.getSemesterName())
                .academicYear(request.getAcademicYear())
                .createdAt(LocalDateTime.now())
                .build();

        return semesterMapper.toSemesterResponse(semesterRepository.save(semesters));
    }
}
