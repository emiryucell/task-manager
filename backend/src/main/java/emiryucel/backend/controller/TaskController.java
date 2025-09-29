package emiryucel.backend.controller;

import emiryucel.backend.model.Role;
import emiryucel.backend.model.User;
import emiryucel.backend.model.dto.TaskRequest;
import emiryucel.backend.model.dto.TaskResponse;
import emiryucel.backend.service.TaskService;
import jakarta.validation.Valid;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/tasks")
public class TaskController {

    private final TaskService taskService;

    public TaskController(TaskService taskService) {
        this.taskService = taskService;
    }

    @PostMapping
    public ResponseEntity<TaskResponse> createTask(@Valid @RequestBody TaskRequest taskRequest,@AuthenticationPrincipal User currentUser) {
        String username = currentUser.getUsername();
        TaskResponse createdTask = taskService.createTask(taskRequest, username);
        return new ResponseEntity<>(createdTask, HttpStatus.CREATED);
    }

    @PutMapping("/{taskId}")
    public ResponseEntity<TaskResponse> updateTask(@PathVariable UUID taskId, @Valid @RequestBody TaskRequest taskRequest,@AuthenticationPrincipal User currentUser) {

        String username = currentUser.getUsername();
        TaskResponse updatedTask = taskService.updateTask(taskId, taskRequest, username);
        return ResponseEntity.ok(updatedTask);
    }

    @DeleteMapping("/{taskId}")
    public ResponseEntity<Void> deleteTask(@PathVariable UUID taskId,@AuthenticationPrincipal User currentUser) {
        String username = currentUser.getUsername();
        taskService.deleteTask(taskId, username);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/{taskId}")
    public ResponseEntity<TaskResponse> getTaskById(@PathVariable UUID taskId,@AuthenticationPrincipal User currentUser) {
        String username = currentUser.getUsername();
        TaskResponse task = taskService.getTaskById(taskId, username);
        return ResponseEntity.ok(task);
    }

    @GetMapping
    public ResponseEntity<Page<TaskResponse>> getAllTasks(Pageable pageable,@AuthenticationPrincipal User currentUser) {
        String username = currentUser.getUsername();
        Page<TaskResponse> tasks = taskService.getAllTasks(username, pageable);
        return ResponseEntity.ok(tasks);
    }


} 