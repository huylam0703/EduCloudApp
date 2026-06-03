package app.project.EduCloud.service.Semester;

import app.project.EduCloud.dto.request.Semesters.SemesterRequest;
import app.project.EduCloud.dto.response.Semeters.SemesterResponse;

public interface SemesterService {
    SemesterResponse createSemester(SemesterRequest request);
}
