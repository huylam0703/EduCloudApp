package app.project.EduCloud.service.Subject;

import app.project.EduCloud.dto.request.Subject.SubjectRequest;
import app.project.EduCloud.dto.request.Subject.SubjectUpdateRequest;
import app.project.EduCloud.dto.response.Subject.SubjectResponse;

import java.util.List;

public interface SubjectService {

    SubjectResponse addSubject(SubjectRequest request, String majorId);

    SubjectResponse updateSubject(SubjectUpdateRequest request, String subjectId);

    void deleteSubject(String subjectId);

    SubjectResponse getDetailSubject(String subjectId);

    List<SubjectResponse> getSubjectsByMajor(String majorId);
}
