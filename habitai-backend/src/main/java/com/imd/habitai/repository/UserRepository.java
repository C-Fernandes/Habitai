package com.imd.habitai.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.imd.habitai.model.User;

@Repository
public interface UserRepository  extends JpaRepository<User, Long>{
boolean existsByEmail(String email);
    boolean existsByCpf(String cpf);
}
