package app.project.EduCloud.exception;

import app.project.EduCloud.dto.response.Auth.ApiResponse;
import jakarta.validation.ConstraintViolation;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.util.Map;
import java.util.Objects;

@RestControllerAdvice
@Slf4j
public class GlobalException {

    private static final String MIN_ATTRIBUTE = "min";


    @ExceptionHandler(value = Exception.class)
    ResponseEntity<ApiResponse> exception(Exception e) {

        log.error("Unexpected error", e);

        ApiResponse apiResponse = new ApiResponse();
        apiResponse.setMessage(e.getMessage()); // tạm thời để debug
        apiResponse.setCode(ErrorCode.UNCATEGORIZED_EXCEPTION.getCode());

        return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body(apiResponse);
    }

    @ExceptionHandler(value = AppException.class)
    ResponseEntity<ApiResponse> handleAppException(AppException e) {
        ErrorCode errorCode = e.getErrorCode();
        ApiResponse apiResponse = new ApiResponse();
        apiResponse.setCode(errorCode.getCode());
        apiResponse.setMessage(errorCode.getMessage());
        return ResponseEntity.status(errorCode.getHttpStatusCode()).body(apiResponse);
    }

    @ExceptionHandler(value = MethodArgumentNotValidException.class)
    ResponseEntity<ApiResponse> handleMethodArgumentNotValidException(MethodArgumentNotValidException e) {

        String enumKey = e.getFieldError().getDefaultMessage();

        ErrorCode errorCode = ErrorCode.INVALID_KEY;

        Map<String, Object> attributes = null;

        try {
            errorCode = ErrorCode.valueOf(enumKey);

            var constrainViolation = e.getBindingResult()
                    .getAllErrors()
                    .get(0)
                    .unwrap(ConstraintViolation.class);

            attributes = constrainViolation.getConstraintDescriptor().getAttributes();
            log.info(attributes.toString());
        }catch (IllegalArgumentException ex){

        }

        ApiResponse apiResponse = new ApiResponse();
        apiResponse.setCode(errorCode.getCode());
        apiResponse.setMessage(
                Objects.nonNull(attributes)
                    ? mapAttribute(errorCode.getMessage(), attributes)
                        : errorCode.getMessage()
        );
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(apiResponse);

    }

    @ExceptionHandler(value = AccessDeniedException.class)
    ResponseEntity<ApiResponse> handleAccessDeniedException(AccessDeniedException exception) {
        ErrorCode errorCode = ErrorCode.UNAUTHORIZED;
        return ResponseEntity.status(errorCode.getHttpStatusCode())
                .body(ApiResponse.builder()
                        .code(errorCode.getCode())
                        .message(errorCode.getMessage())
                        .build());
    }

    private String mapAttribute(String message, Map<String, Object> attributes) {
        String minValue = String.valueOf(attributes.get(MIN_ATTRIBUTE));
        return message.replace("{" + MIN_ATTRIBUTE + "}", minValue);
    }
}
