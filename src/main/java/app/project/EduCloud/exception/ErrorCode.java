package app.project.EduCloud.exception;

import org.springframework.http.HttpStatus;
import org.springframework.http.HttpStatusCode;

import lombok.Getter;

@Getter
public enum ErrorCode {
    UNCATEGORIZED_EXCEPTION(9999, "uncategorized exception", HttpStatus.INTERNAL_SERVER_ERROR),
    INVALID_KEY(9998, "invalid key", HttpStatus.BAD_REQUEST),
    ROLE_NOT_FOUND(9997, "role not found", HttpStatus.NOT_FOUND),
    ACCESS_DENIED(9996, "access denied", HttpStatus.FORBIDDEN),

    //User
    USER_EXISTS(1001, "username already exists", HttpStatus.BAD_REQUEST),
    USER_NOT_FOUND(1002, "user not found", HttpStatus.NOT_FOUND),
    USER_NOT_EXISTS(1003, "user not exists", HttpStatus.BAD_REQUEST),
    UNAUTHENTICATED(1004, "unauthenticated", HttpStatus.UNAUTHORIZED),
    UNAUTHORIZED(1005, "You do not have permission", HttpStatus.FORBIDDEN),
    //--
    FIRST_NAME(1011, "The first name should not be left blank", HttpStatus.BAD_REQUEST),
    LAST_NAME(1012, "The last name should not be left blank", HttpStatus.BAD_REQUEST),
    USERNAME_UNVALID(1013, "username must be least {min} characters", HttpStatus.BAD_REQUEST),
    PASSWORD_UNVALID(1014, "password must be least {min} characters", HttpStatus.BAD_REQUEST),
    EMAIL_UNVALID(1015, "email invalid format", HttpStatus.BAD_REQUEST),
    IDENTITY_NUMBER_UNVALID(1016, "identity number must be least {min} characters", HttpStatus.BAD_REQUEST),

    //Auth
    AUTH_USERNAME(1101, "username should not be left blank", HttpStatus.BAD_REQUEST),
    AUTH_PASSWORD(1102, "password should not be left blank", HttpStatus.BAD_REQUEST),


    //MasterData
    MAJOR_VIBE_FAILED(1201, "Seed major failed", HttpStatus.EXPECTATION_FAILED),


    //Semesters
    SEMESTER_NOT_FOUND(1302, "semester not found", HttpStatus.NOT_FOUND),

    //Major
    MAJOR_NOT_FOUND(1401, "major not found", HttpStatus.BAD_REQUEST),

    //SUBJECT
    SUBJECT_NOT_FOUND(1402, "subject not found", HttpStatus.BAD_REQUEST),
    FOLDER_NAME_REQUIRED(1403, "folder name is required", HttpStatus.BAD_REQUEST),
    FOLDER_NOT_FOUND(1404, "folder not found", HttpStatus.BAD_REQUEST),

    //Cloud
    FILE_NOT_EXISTS(1501, "file not exists", HttpStatus.BAD_REQUEST),
    FOLDER_ACCESS_DENIED(1501, "folder access denied", HttpStatus.FORBIDDEN),
    PUBLIC_DOCUMENT_REQUIRED_METADATA(1502, "public document required meta data", HttpStatus.BAD_REQUEST),
    DOCUMENT_NOT_FOUND(1503, "document not found", HttpStatus.BAD_REQUEST),
    FILE_KEY_INVALID(1504, "file key is invalid", HttpStatus.BAD_REQUEST),
    FILE_NOT_FOUND_IN_STORAGE(1505, "file not found in storage", HttpStatus.BAD_REQUEST),
    FILE_DOWNLOAD_FAILED(1506, "file download failed", HttpStatus.INTERNAL_SERVER_ERROR),
    FILE_PREVIEW_NOT_SUPPORTED(1507, "file preview not support", HttpStatus.BAD_REQUEST),
    NOTIFICATION_NOT_FOUND(1601, "Notification not found",HttpStatus.NOT_FOUND),
    HAVE_NOT_NOTIFICATION(1602, "Have not notification", HttpStatus.BAD_REQUEST),
    NOTIFICATION_TEMPLATE_NOT_FOUND(1602, "notification template not found", HttpStatus.NOT_FOUND),
    ;

    


    private int code;
    private String message;
    private HttpStatusCode httpStatusCode;

    ErrorCode(int code, String message, HttpStatusCode httpStatusCode) {
        this.code = code;
        this.message = message;
        this.httpStatusCode = httpStatusCode;
    }
}
