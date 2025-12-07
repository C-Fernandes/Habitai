package com.imd.habitai.service;

import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.imd.habitai.dto.request.LoginRequest;
import com.imd.habitai.dto.request.UserRegisterRequest;
import com.imd.habitai.error.BusinessExceptionError;
import com.imd.habitai.model.User;
import com.imd.habitai.repository.UserRepository;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;

    // Construtor ATUALIZADO
    public AuthService(UserRepository userRepository,
            PasswordEncoder passwordEncoder,
            JwtService jwtService,
            AuthenticationManager authenticationManager) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
        this.authenticationManager = authenticationManager;
    }

    public User register(User user, String confirmPassword) {
        if (!user.getPassword().equals(confirmPassword)) {
            throw new IllegalArgumentException("As senhas não conferem.");
        }
        if (userRepository.existsByEmail(user.getEmail())) {
            throw new BusinessExceptionError("O email informado já está em uso.");
        }
        if (userRepository.existsByCpf(user.getCpf())) {
            throw new BusinessExceptionError("O CPF informado já está em uso.");
        }
        user.setPassword(passwordEncoder.encode(user.getPassword()));

        return userRepository.save(user);
    }

    public String login(LoginRequest request) {

        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.getEmail(),
                        request.getPassword()));

        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("User not found after authentication"));

        String jwtToken = jwtService.generateToken(user);

        return jwtToken;
    }

}
