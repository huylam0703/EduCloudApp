package app.project.EduCloud.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import app.project.EduCloud.dto.response.Auth.ApiResponse;
import app.project.EduCloud.dto.response.Major.MajorResponse;
import app.project.EduCloud.service.Major.MajorService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;

@RestController
@RequiredArgsConstructor
@Slf4j
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@RequestMapping("/base")
public class BaseController {
    MajorService majorService;

    @GetMapping("/majors")
    public ResponseEntity<ApiResponse<List<MajorResponse>>> getMajors(@RequestParam(required = false) String searchString){
        return ResponseEntity.status(HttpStatus.OK)
                .body(ApiResponse.<List<MajorResponse>>builder()
                        .code(1000)
                        .result(majorService.GetAllMajor(searchString))
                        .message("Major")
                        .build());
    }
}
