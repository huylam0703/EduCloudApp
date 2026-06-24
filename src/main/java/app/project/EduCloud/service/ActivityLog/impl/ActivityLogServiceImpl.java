package app.project.EduCloud.service.ActivityLog.impl;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Service;

import app.project.EduCloud.dto.response.ActivityLog.ActivityLogResponse;
import app.project.EduCloud.dto.response.PageResponse;
import app.project.EduCloud.entity.ActivityLog;
import app.project.EduCloud.entity.User;
import app.project.EduCloud.enums.ActivityAction;
import app.project.EduCloud.enums.ActivityEntityType;
import app.project.EduCloud.mapper.ActivityLogMapper;
import app.project.EduCloud.repository.ActivityLogRepository;
import app.project.EduCloud.repository.UserRepository;
import app.project.EduCloud.service.ActivityLog.ActivityLogService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class ActivityLogServiceImpl implements ActivityLogService {

    ActivityLogRepository activityLogRepository;
    ActivityLogMapper activityLogMapper;
    UserRepository userRepository;

    @Override
    @PreAuthorize("hasRole('ADMIN')")
    public PageResponse<ActivityLogResponse> getAllLogs(
            int pageNo,
            int pageSize,
            String userId,
            ActivityAction action,
            ActivityEntityType entityType
    ) {
        int safePageNo = pageNo < 1 ? 1 : pageNo;
        int safePageSize = pageSize < 1 ? 10 : pageSize;

        Pageable pageable = PageRequest.of(
                safePageNo - 1,
                safePageSize,
                Sort.by(Sort.Direction.DESC, "createdAt")
        );

        Page<ActivityLog> page = activityLogRepository.searchLogs(
                userId,
                action,
                entityType,
                pageable
        );

        List<ActivityLogResponse> responses = page.getContent()
                .stream()
                .map(activityLogMapper::toActivityLogResponse)
                .toList();

        return PageResponse.<ActivityLogResponse>builder()
                .content(responses)
                .pageNo(safePageNo)
                .pageSize(safePageSize)
                .totalElements(page.getTotalElements())
                .totalPages(page.getTotalPages())
                .last(page.isLast())
                .build();
    }

    @Override
    public void saveLog(
            User user,
            ActivityAction action,
            ActivityEntityType entityType,
            String entityId,
            String description
    ) {
        ActivityLog activityLog = ActivityLog.builder()
                .user(user)
                .action(action)
                .entityType(entityType)
                .entityId(entityId)
                .description(description)
                .createdAt(LocalDateTime.now())
                .build();

        activityLogRepository.save(activityLog);
    }
}