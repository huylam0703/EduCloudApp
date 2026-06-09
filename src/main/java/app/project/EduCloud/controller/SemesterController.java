package app.project.EduCloud.controller;

import app.project.EduCloud.dto.request.Semesters.SemesterRequest;
import app.project.EduCloud.dto.response.Auth.ApiResponse;
import app.project.EduCloud.dto.response.Semeters.SemesterResponse;
import app.project.EduCloud.service.Semester.SemesterService;
import jakarta.validation.Valid;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@Slf4j
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@RequestMapping("/semester")
public class SemesterController {
    SemesterService semesterService;

    @PostMapping("/create")
    public ResponseEntity<ApiResponse<SemesterResponse>> createSemester(
            @RequestBody @Valid SemesterRequest request) {
        log.info("Create Semester request: {}", request);

        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.<SemesterResponse>builder()
                        .code(1000)
                        .message("Successfully created Semester")
                        .result(semesterService.createSemester(request))
                        .build());
    }

    @GetMapping("/{semesterId}")
    public ResponseEntity<ApiResponse<SemesterResponse>> getSemesterById(@PathVariable String semesterId) {
        log.info("Get Semester by id: {}", semesterId);
        return ResponseEntity.status(HttpStatus.OK)
                .body(ApiResponse.<SemesterResponse>builder()
                        .code(1000)
                        .message("Successfully Get Semesters")
                        .result(semesterService.getSemesterById(semesterId))
                        .build());
    }

    @GetMapping("/semesters")
    public ResponseEntity<ApiResponse<List<SemesterResponse>>> getAllSemester(){
        return ResponseEntity.status(HttpStatus.OK)
                .body(ApiResponse.<List<SemesterResponse>>builder()
                        .code(1000)
                        .message("Successfully created Semester")
                        .result(semesterService.getAllSemester())
                        .build());
    }

    @DeleteMapping("/{semesterId}")
    public ResponseEntity<ApiResponse<String>> deleteSemester(@PathVariable String semesterId) {
        log.info("Delete Semester by id: {}", semesterId);
        semesterService.deleteSemester(semesterId);

        return ResponseEntity.status(HttpStatus.ACCEPTED)
                .body(ApiResponse.<String>builder()
                        .code(1000)
                        .result("Semester deleted")
                        .build());
    }

}
