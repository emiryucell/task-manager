package emiryucel.backend.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
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
@Entity
public class Task {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID taskId;
    
    @NotBlank(message = "Task name is required")
    private String taskName;
    
    @NotBlank(message = "Task description is required")
    @Size(min = 10, message = "Task description must be at least 10 characters")
    private String taskDescription;
    
    @ManyToOne(fetch = FetchType.LAZY) 
    @JoinColumn(name = "user_id", nullable = false) 
    private User user;
    
    private LocalDateTime taskDate;
    
    @Min(value = 2, message = "Duration must be at least 2 hours")
    private int durationInHour;
} 