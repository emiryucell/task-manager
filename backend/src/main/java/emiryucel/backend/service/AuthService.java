package emiryucel.backend.service;

import emiryucel.backend.model.dto.LoginRequest;
import emiryucel.backend.model.dto.LoginResponse;

public interface AuthService {
    LoginResponse login(LoginRequest loginRequest);
} 