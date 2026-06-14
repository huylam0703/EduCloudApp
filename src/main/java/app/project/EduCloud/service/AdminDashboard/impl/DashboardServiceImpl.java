package app.project.EduCloud.service.AdminDashboard.impl;

import app.project.EduCloud.dto.response.AdminDashboard.AdminDashboardResponse;
import app.project.EduCloud.dto.response.AdminDashboard.ChartItemResponse;
import app.project.EduCloud.dto.response.AdminDashboard.MajorDistributionResponse;
import app.project.EduCloud.entity.ActivityLog;
import app.project.EduCloud.enums.ActivityAction;
import app.project.EduCloud.enums.ActivityEntityType;
import app.project.EduCloud.repository.ActivityLogRepository;
import app.project.EduCloud.repository.DocumentRepository;
import app.project.EduCloud.repository.UserRepository;
import app.project.EduCloud.service.AdminDashboard.DashboardService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.DayOfWeek;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class DashboardServiceImpl implements DashboardService {
    UserRepository userRepository;
    DocumentRepository documentRepository;
    ActivityLogRepository activityLogRepository;


    @Override
    @Transactional(readOnly = true)
    @PreAuthorize("hasRole('ADMIN')")
    public AdminDashboardResponse getAdminDashboard() {
        long totalUsers = userRepository.count();

        long totalDocuments = documentRepository.count();

        long totalStorageBytes = documentRepository.sumTotalStorageBytes();

        long totalUploads = activityLogRepository.countByActionAndEntityType(
                ActivityAction.UPLOAD_DOCUMENT,
                ActivityEntityType.DOCUMENT
        );

        long totalDownloads = activityLogRepository.countByActionAndEntityType(
                ActivityAction.DOWNLOAD_DOCUMENT,
                ActivityEntityType.DOCUMENT
        );

        long deletedDocuments = activityLogRepository.countByActionAndEntityType(
                ActivityAction.DELETE_DOCUMENT,
                ActivityEntityType.DOCUMENT
        );

        return AdminDashboardResponse.builder()
                .totalUsers(totalUsers)
                .totalDocuments(totalDocuments)
                .totalStorageBytes(totalStorageBytes)
                .totalStorageDisplay(formatBytes(totalStorageBytes))
                .totalUploads(totalUploads)
                .totalDownloads(totalDownloads)
                .deletedDocuments(deletedDocuments)
                .uploadLast7Days(getUploadLast7Days())
                .majorDistribution(getMajorDistribution())
                .build();
    }

    private List<ChartItemResponse> getUploadLast7Days() {
        LocalDate today = LocalDate.now();
        LocalDate startDate = today.minusDays(6);

        LocalDateTime start = startDate.atStartOfDay();
        LocalDateTime end = today.plusDays(1).atStartOfDay();

        List<ActivityLog> logs =
                activityLogRepository.findByActionAndEntityTypeAndCreatedAtBetween(
                        ActivityAction.UPLOAD_DOCUMENT,
                        ActivityEntityType.DOCUMENT,
                        start,
                        end
                );

        Map<LocalDate, Long> uploadMap = logs.stream()
                .collect(Collectors.groupingBy(
                        log -> log.getCreatedAt().toLocalDate(),
                        Collectors.counting()
                ));

        List<ChartItemResponse> result = new ArrayList<>();

        for (int i = 0; i < 7; i++) {
            LocalDate date = startDate.plusDays(i);

            result.add(ChartItemResponse.builder()
                    .label(toVietnameseDayLabel(date))
                    .value(uploadMap.getOrDefault(date, 0L))
                    .build());
        }

        return result;
    }

    private List<MajorDistributionResponse> getMajorDistribution() {
        List<Object[]> rows = documentRepository.countDocumentsByMajor();

        return rows.stream()
                .map(row -> MajorDistributionResponse.builder()
                        .name(row[0] == null ? "Không xác định" : row[0].toString())
                        .value((Long) row[1])
                        .build())
                .toList();
    }

    private String toVietnameseDayLabel(LocalDate date) {
        DayOfWeek day = date.getDayOfWeek();

        return switch (day) {
            case MONDAY -> "T2";
            case TUESDAY -> "T3";
            case WEDNESDAY -> "T4";
            case THURSDAY -> "T5";
            case FRIDAY -> "T6";
            case SATURDAY -> "T7";
            case SUNDAY -> "CN";
        };
    }

    private String formatBytes(long bytes) {
        if (bytes >= 1024L * 1024 * 1024) {
            double gb = bytes / 1024.0 / 1024.0 / 1024.0;
            return String.format("%.1f GB", gb);
        }

        if (bytes >= 1024L * 1024) {
            double mb = bytes / 1024.0 / 1024.0;
            return String.format("%.1f MB", mb);
        }

        if (bytes >= 1024L) {
            double kb = bytes / 1024.0;
            return String.format("%.1f KB", kb);
        }

        return bytes + " B";
    }
}
