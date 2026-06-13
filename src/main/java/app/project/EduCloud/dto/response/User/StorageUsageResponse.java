package app.project.EduCloud.dto.response.User;

import lombok.*;
import lombok.experimental.FieldDefaults;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class StorageUsageResponse {
    Long usedBytes;
    Long limitBytes;
    Long remainingBytes;
    Double usedPercent;
}
