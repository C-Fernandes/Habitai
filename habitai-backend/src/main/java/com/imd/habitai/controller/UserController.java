package com.imd.habitai.controller;

import java.lang.Long;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.imd.habitai.dto.request.LoginRequest;
import com.imd.habitai.dto.request.UserLoginRequest;
import com.imd.habitai.dto.request.UserRegisterRequest;
import com.imd.habitai.dto.response.UserAuthResponse;
import com.imd.habitai.dto.response.UserResponse;
import com.imd.habitai.mapper.UserMapper;
import com.imd.habitai.model.User;
import com.imd.habitai.service.AuthService;
import com.imd.habitai.service.UserService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/users")
public class UserController {
    private final UserService userService;
    private final UserMapper userMapper;
    private final AuthService authService;

    public UserController(UserService userService, UserMapper userMapper, AuthService authService) {
        this.userService = userService;
        this.userMapper = userMapper;
        this.authService = authService;
    }

    @GetMapping("/{id}")
    public ResponseEntity<UserResponse> getUserById(@PathVariable Long id) {
        User user = userService.getById(id);
        UserResponse responseDTO = userMapper.toResponse(user);
        return ResponseEntity.ok(responseDTO);
    }

    @GetMapping
    public ResponseEntity<List<UserResponse>> getAllUsers() {
        List<User> users = userService.getAll();
        List<UserResponse> responseDTOs = users.stream()
                .map(userMapper::toResponse)
                .collect(Collectors.toList());
        return ResponseEntity.ok(responseDTOs);
    }

    @PutMapping("/{id}")
    public ResponseEntity<UserResponse> update(
            @PathVariable Long id,
            @Valid @RequestBody UserRegisterRequest updateRequest) {
        User userData = userMapper.toEntity(updateRequest);
        User updatedUser = userService.update(id, userData);
        UserResponse responseDTO = userMapper.toResponse(updatedUser);
        return ResponseEntity.ok(responseDTO);
    }

    @PostMapping("/register")
    public ResponseEntity<User> register(@RequestBody UserRegisterRequest request) {
        User registeredUser = authService.register(userMapper.toEntity(request), request.confirmPassword());
        return ResponseEntity.ok(registeredUser);
    }

    @PostMapping("/login")
    public ResponseEntity<String> login(@RequestBody LoginRequest request) {
        return ResponseEntity.ok(authService.login(request));
    }

    @GetMapping("/me")
    public ResponseEntity<UserResponse> me(
            @AuthenticationPrincipal User user) {
        UserResponse response = userMapper.toResponse(user);
        return ResponseEntity.ok(response);
    };

    @DeleteMapping("/me")
    public ResponseEntity<Void> deactivateAccount(@RequestParam Long id) {
        userService.deactivateUser(id);
        return ResponseEntity.noContent().build();
    }

}
