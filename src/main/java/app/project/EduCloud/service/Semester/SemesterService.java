package app.project.EduCloud.service.Semester;

import app.project.EduCloud.dto.request.Semesters.SemesterRequest;
import app.project.EduCloud.dto.response.Semeters.SemesterResponse;

import java.util.List;

public interface SemesterService {
    SemesterResponse createSemester(SemesterRequest request);

    SemesterResponse getSemesterById(String semesterId);

    List<SemesterResponse> getAllSemester();

    void deleteSemester(String semesterId);
}
