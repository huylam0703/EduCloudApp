package app.project.EduCloud.dto.response.AdminDashboard;

import lombok.*;
import lombok.experimental.FieldDefaults;

import java.util.List;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class AdminDashboardResponse {
    long totalUsers;
    long totalDocuments;

    long totalStorageBytes;
    String totalStorageDisplay;

    long totalUploads;
    long totalDownloads;
    long deletedDocuments;

    List<ChartItemResponse> uploadLast7Days;
    List<MajorDistributionResponse> majorDistribution;
}