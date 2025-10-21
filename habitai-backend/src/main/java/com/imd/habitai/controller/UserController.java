package com.imd.habitai.controller;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.imd.habitai.dto.request.UserLoginRequest;
import com.imd.habitai.dto.request.UserRegisterRequest;
import com.imd.habitai.dto.response.UserResponse;
import com.imd.habitai.mapper.UserMapper;
import com.imd.habitai.model.User;
import com.imd.habitai.service.UserService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/users")
public class UserController {
    private final UserService userService;
    private final UserMapper userMapper;

    public UserController(UserService userService,UserMapper userMapper) {
        this.userService = userService;
        this.userMapper = userMapper;
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
        @Valid @RequestBody UserRegisterRequest updateRequest
    ) {
        User userData = userMapper.toEntity(updateRequest);
        User updatedUser = userService.update(id, userData);
        UserResponse responseDTO = userMapper.toResponse(updatedUser);
        return ResponseEntity.ok(responseDTO);
    }

    @PostMapping
    private ResponseEntity<UserResponse> create(@Valid @RequestBody UserRegisterRequest userRequest) {
        User user = userService.create(userMapper.toEntity(userRequest), userRequest.confirmPassword());
        return new ResponseEntity<>(userMapper.toResponse(user), HttpStatus.CREATED);
    }

    @PostMapping("/login")
    public ResponseEntity<UserResponse> login(@RequestBody UserLoginRequest loginRequest) {
        User user = userService.login(loginRequest.email(), loginRequest.password());
        
        UserResponse responseDTO = userMapper.toResponse(user);
        return ResponseEntity.ok(responseDTO);
    }
}
