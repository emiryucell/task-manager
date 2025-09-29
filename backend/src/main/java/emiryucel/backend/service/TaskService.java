package emiryucel.backend.service;

import emiryucel.backend.model.dto.TaskRequest;
import emiryucel.backend.model.dto.TaskResponse;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.UUID;

public interface TaskService {
    TaskResponse createTask(TaskRequest taskRequest, String username);
    TaskResponse updateTask(UUID taskId, TaskRequest taskRequest, String username);
    void deleteTask(UUID taskId, String username);
    TaskResponse getTaskById(UUID taskId, String username);
    Page<TaskResponse> getAllTasks(String username, Pageable pageable);
} 