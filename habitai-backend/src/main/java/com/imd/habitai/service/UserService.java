package com.imd.habitai.service;

import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

import com.imd.habitai.error.BusinessExceptionError;
import com.imd.habitai.error.EntityNotFoundError;
import com.imd.habitai.error.InvalidCredentialsError;
import com.imd.habitai.model.User;
import com.imd.habitai.repository.UserRepository;

import jakarta.persistence.EntityNotFoundException;

@Service
public class UserService {
    private final UserRepository userRepository;

    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public List<User> getAll() {
        return userRepository.findAll();
    }

    public User getById(Long id) {
        return userRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundError("Usuário não encontrado"));
    }

    public User update(Long id, User userData) {
        User existingUser = getById(id);

        if (!StringUtils.hasText(userData.getName())) {
            throw new BusinessExceptionError("O nome não pode ser vazio.");
        }

        existingUser.setName(userData.getName());
        existingUser.setPhone(userData.getPhone());
        return userRepository.save(existingUser);
    }

    public User create(User user, String confirmPassword) {
        if (!user.getPassword().equals(confirmPassword)) {
            throw new IllegalArgumentException("As senhas não conferem.");
        }
        if (userRepository.existsByEmail(user.getEmail())) {
            throw new BusinessExceptionError("O email informado já está em uso.");
        }
        if (userRepository.existsByCpf(user.getCpf())) {
            throw new BusinessExceptionError("O CPF informado já está em uso.");
        }

        return userRepository.save(user);
    }

    public User login(String email, String password) {
        System.out.println(email);
        System.out.println(password);
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new InvalidCredentialsError("Email ou senha inválidos."));
        if (user.getPassword().equals(password)) {
            return user;
        } else {
            throw new InvalidCredentialsError("Email ou senha inválidos.");
        }
    }
}
