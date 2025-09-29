package emiryucel.backend.config;

import emiryucel.backend.model.Role;
import emiryucel.backend.model.Task;
import emiryucel.backend.model.User;
import emiryucel.backend.repository.TaskRepository;
import emiryucel.backend.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Component
public class DataInitializer implements CommandLineRunner {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final TaskRepository taskRepository;

    public DataInitializer(UserRepository userRepository, PasswordEncoder passwordEncoder, TaskRepository taskRepository) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.taskRepository = taskRepository;
    }

    @Override
    @Transactional
    public void run(String... args) {
        if (userRepository.count() == 0) {
            User adminUser = User.builder()
                .username("admin")
                .password(passwordEncoder.encode("admin123"))
                .role(Role.ADMIN)
                .build();

            User readerUser = User.builder()
                .username("reader")
                .password(passwordEncoder.encode("reader123"))
                .role(Role.READER)
                .build();
            
            userRepository.saveAll(List.of(adminUser, readerUser));
            System.out.println("Initial users created: admin and reader");

            if (taskRepository.count() == 0) {
                List<Task> readerTasks = new ArrayList<>();
                for (int i = 1; i <= 25; i++) {
                    Task task = Task.builder()
                        .taskName("Reader Task " + i)
                        .taskDescription("This is detailed description for Reader Task " + i + ". It needs to be long enough.")
                        .user(readerUser)
                        .taskDate(LocalDateTime.now().plusDays(i % 7))
                        .durationInHour(2 + (i % 5))
                        .build();
                    readerTasks.add(task);
                }
                taskRepository.saveAll(readerTasks);
                System.out.println("Created " + readerTasks.size() + " initial tasks for user: reader");
            }
        }
    }
} 