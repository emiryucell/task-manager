package emiryucel.backend.model.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.UUID;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TaskResponse {
    private UUID taskId;
    private String taskName;
    private String taskDescription;
    private String username;
    private LocalDateTime taskDate;
    private int durationInHour;
} 