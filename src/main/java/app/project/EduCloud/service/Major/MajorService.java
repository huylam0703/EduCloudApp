package app.project.EduCloud.service.Major;

import java.util.List;

import app.project.EduCloud.dto.response.Major.MajorResponse;

public interface MajorService {
    void seedMajors();

    List<MajorResponse> GetAllMajor(String searchString);
}
