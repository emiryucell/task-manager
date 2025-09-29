package emiryucel.backend.service.impl;

import emiryucel.backend.model.Role;
import emiryucel.backend.model.Task;
import emiryucel.backend.model.User;
import emiryucel.backend.model.dto.TaskRequest;
import emiryucel.backend.model.dto.TaskResponse;
import emiryucel.backend.repository.TaskRepository;
import emiryucel.backend.repository.UserRepository;
import emiryucel.backend.service.TaskService;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

@Service
public class TaskServiceImpl implements TaskService {

    private final TaskRepository taskRepository;
    private final UserRepository userRepository;

    public TaskServiceImpl(TaskRepository taskRepository, UserRepository userRepository) {
        this.taskRepository = taskRepository;
        this.userRepository = userRepository;
    }

    private User getUserByUsername(String username) {
        return userRepository.findByUsername(username)
                .orElseThrow(() -> new EntityNotFoundException("User not found with username: " + username));
    }


    @Override
    @Transactional
    public TaskResponse createTask(TaskRequest taskRequest, String currentUsername) {
        User currentUser = getUserByUsername(currentUsername);

        Task task = Task.builder()
                .taskName(taskRequest.getTaskName())
                .taskDescription(taskRequest.getTaskDescription())
                .user(currentUser)
                .taskDate(taskRequest.getTaskDate())
                .durationInHour(taskRequest.getDurationInHour())
                .build();
        Task savedTask = taskRepository.save(task);
        return mapTaskToResponse(savedTask);
    }

    @Override
    @Transactional
    public TaskResponse updateTask(UUID taskId, TaskRequest taskRequest, String currentUsername) {
        User currentUser = getUserByUsername(currentUsername);
        Task taskToUpdate = taskRepository.findById(taskId)
                .orElseThrow(() -> new EntityNotFoundException("Task not found with id: " + taskId));

        if (!taskToUpdate.getUser().getUsername().equals(currentUsername) && currentUser.getRole() != Role.ADMIN) {
            throw new AccessDeniedException("You are not authorized to update this task.");
        }

        taskToUpdate.setTaskName(taskRequest.getTaskName());
        taskToUpdate.setTaskDescription(taskRequest.getTaskDescription());
        taskToUpdate.setTaskDate(taskRequest.getTaskDate());
        taskToUpdate.setDurationInHour(taskRequest.getDurationInHour());
        
        Task updatedTask = taskRepository.save(taskToUpdate);
        return mapTaskToResponse(updatedTask);
    }

    @Override
    @Transactional
    public void deleteTask(UUID taskId, String currentUsername) {
        User currentUser = getUserByUsername(currentUsername);
        Task taskToDelete = taskRepository.findById(taskId)
                .orElseThrow(() -> new EntityNotFoundException("Task not found with id: " + taskId));

        if (!taskToDelete.getUser().getUsername().equals(currentUsername) && currentUser.getRole() != Role.ADMIN) {
            throw new AccessDeniedException("You are not authorized to delete this task.");
        }
        taskRepository.delete(taskToDelete);
    }

    @Override
    @Transactional(readOnly = true)
    public TaskResponse getTaskById(UUID taskId, String currentUsername) {
        User currentUser = getUserByUsername(currentUsername);
        Task task = taskRepository.findById(taskId)
                .orElseThrow(() -> new EntityNotFoundException("Task not found with id: " + taskId));
        
        if (!task.getUser().getUsername().equals(currentUsername) && currentUser.getRole() != Role.ADMIN) {
            throw new AccessDeniedException("You are not authorized to view this task.");
        }
        return mapTaskToResponse(task);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<TaskResponse> getAllTasks(String currentUsername, Pageable pageable) {
        Page<Task> tasksPage = taskRepository.findByUser_Username(currentUsername, pageable);
        return tasksPage.map(this::mapTaskToResponse);
    }

    private TaskResponse mapTaskToResponse(Task task) {
        return TaskResponse.builder()
                .taskId(task.getTaskId())
                .taskName(task.getTaskName())
                .taskDescription(task.getTaskDescription())
                .username(task.getUser().getUsername())
                .taskDate(task.getTaskDate())
                .durationInHour(task.getDurationInHour())
                .build();
    }
} 