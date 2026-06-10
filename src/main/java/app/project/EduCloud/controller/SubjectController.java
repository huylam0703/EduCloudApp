package app.project.EduCloud.controller;

import app.project.EduCloud.dto.request.Subject.SubjectRequest;
import app.project.EduCloud.dto.request.Subject.SubjectUpdateRequest;
import app.project.EduCloud.dto.response.Auth.ApiResponse;
import app.project.EduCloud.dto.response.Subject.SubjectResponse;
import app.project.EduCloud.service.Subject.SubjectService;
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
@RequestMapping("/subject")
public class SubjectController {
    SubjectService subjectService;

    @PostMapping("/add/{majorId}")
    public ResponseEntity<ApiResponse<SubjectResponse>> addSubject(@RequestBody @Valid SubjectRequest request,
                                                                   @PathVariable String majorId){

        log.info("add subject");

        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.<SubjectResponse>builder()
                        .code(1000)
                        .message("add subject success")
                        .result(subjectService.addSubject(request, majorId))
                        .build());
    }

    @PutMapping("/update/{subjectId}")
    public ResponseEntity<ApiResponse<SubjectResponse>> updateSubject(@PathVariable String subjectId,
                                                                      @RequestBody @Valid SubjectUpdateRequest request){

        log.info("update subject");

        return ResponseEntity.status(HttpStatus.OK)
                .body(ApiResponse.<SubjectResponse>builder()
                        .code(1000)
                        .message("update subject success")
                        .result(subjectService.updateSubject(request,subjectId))
                        .build());
    }

    @DeleteMapping("/delete/{subjectId}")
    public ResponseEntity<ApiResponse<String>> deleteSubject(@PathVariable String subjectId){

        log.info("delete subject");
        subjectService.deleteSubject(subjectId);

        return ResponseEntity.status(HttpStatus.OK)
                .body(ApiResponse.<String>builder()
                        .code(1000)
                        .result("delete subject success")
                        .build());
    }

    @GetMapping("/getDetail/{subjectId}")
    public ResponseEntity<ApiResponse<SubjectResponse>> getDetailSubject(@PathVariable String subjectId){

        log.info("get detail subject");

        return ResponseEntity.status(HttpStatus.OK)
                .body(ApiResponse.<SubjectResponse>builder()
                        .code(1000)
                        .message("get detail subject success")
                        .result(subjectService.getDetailSubject(subjectId))
                        .build());
    }
    @GetMapping("/getAll/{majorId}")
    public ResponseEntity<ApiResponse<List<SubjectResponse>>> getSubjetByMajor(@PathVariable String majorId){

        log.info("get detail subject");

        return ResponseEntity.status(HttpStatus.OK)
                .body(ApiResponse.<List<SubjectResponse>>builder()
                        .code(1000)
                        .message("get detail subject success")
                        .result(subjectService.getSubjectsByMajor(majorId))
                        .build());
    }
}
