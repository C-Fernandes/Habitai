package com.imd.habitai.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

import com.imd.habitai.error.BusinessException;
import com.imd.habitai.error.EntityNotFound;
import com.imd.habitai.model.User;
import com.imd.habitai.repository.UserRepository;

@Service
public class UserService {
    private final UserRepository userRepository;

    @Autowired
    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public List<User> getAll() {
        return userRepository.findAll();
    }

    public User getById(Long id) {
        return userRepository.findById(id)
                .orElseThrow(() -> new EntityNotFound("Usuário não encontrado"));
    }

    public User update(Long id, User userData) {
        User existingUser = getById(id);

        if (!StringUtils.hasText(userData.getName())) {
            throw new BusinessException("O nome não pode ser vazio.");
        }

        existingUser.setName(userData.getName());
        existingUser.setPhone(userData.getPhone());
        return userRepository.save(existingUser);
    }

    public User create(User user, String confirmPassword) {
        if (!StringUtils.hasText(user.getPassword())) {
            throw new IllegalArgumentException("A senha não pode ser nula ou vazia.");
        }
        if (!user.getPassword().equals(confirmPassword)) {
            throw new IllegalArgumentException("As senhas não conferem.");
        }
        if (!StringUtils.hasText(user.getName())) {
            throw new IllegalArgumentException("O nome é obrigatório.");
        }
        if (!StringUtils.hasText(user.getEmail())) {
            throw new IllegalArgumentException("O email é obrigatório.");
        }
        if (!StringUtils.hasText(user.getCpf())) {
            throw new IllegalArgumentException("O CPF é obrigatório.");
        }
        if (userRepository.existsByEmail(user.getEmail())) {
            throw new BusinessException("O email informado já está em uso.");
        }
        if (userRepository.existsByCpf(user.getCpf())) {
            throw new BusinessException("O CPF informado já está em uso.");
        }

        return userRepository.save(user);
    }

}
