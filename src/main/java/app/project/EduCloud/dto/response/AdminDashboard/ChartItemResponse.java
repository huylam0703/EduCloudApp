package app.project.EduCloud.dto.response.AdminDashboard;

import lombok.*;
import lombok.experimental.FieldDefaults;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class ChartItemResponse {
    String label;
    long value;
}
