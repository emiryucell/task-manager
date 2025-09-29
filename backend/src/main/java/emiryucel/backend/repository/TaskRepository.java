package emiryucel.backend.repository;

import emiryucel.backend.model.Task;
import emiryucel.backend.model.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface TaskRepository extends JpaRepository<Task, UUID> {
    Page<Task> findByUser_Username(String username, Pageable pageable);
    Optional<Task> findByTaskIdAndUser_Username(UUID taskId, String username);
    // Optional: For direct user object queries if preferred later
    // Page<Task> findByUser(User user, Pageable pageable);
    // Optional<Task> findByTaskIdAndUser(UUID taskId, User user);
} 