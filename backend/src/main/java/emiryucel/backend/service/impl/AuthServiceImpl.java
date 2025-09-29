package emiryucel.backend.service.impl;

import emiryucel.backend.model.User;
import emiryucel.backend.model.dto.LoginRequest;
import emiryucel.backend.model.dto.LoginResponse;
import emiryucel.backend.repository.UserRepository;
import emiryucel.backend.security.JwtTokenProvider;
import emiryucel.backend.service.AuthService;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class AuthServiceImpl implements AuthService {

    private final JwtTokenProvider tokenProvider;
    private final UserRepository userRepository;
    private final AuthenticationManager authenticationManager;


    public AuthServiceImpl(AuthenticationManager authenticationManager, JwtTokenProvider tokenProvider, UserRepository userRepository) {
       this.authenticationManager=authenticationManager;
        this.tokenProvider = tokenProvider;
        this.userRepository = userRepository;
    }

    @Override
    public LoginResponse login(LoginRequest loginRequest) {
        try {
            authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(
                            loginRequest.getUsername(),
                            loginRequest.getPassword()
                    )
            );
            User authenticatedUser= userRepository.findByUsername(loginRequest.getUsername())
                    .orElseThrow(() -> new BadCredentialsException("User not found") {
                    });
            return new LoginResponse(tokenProvider.generateToken(authenticatedUser));

        } catch (AuthenticationException e) {
            throw new BadCredentialsException("Invalid username or password");
        }
    }
} 