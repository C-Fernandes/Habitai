package com.imd.habitai.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.imd.habitai.model.User;

@Repository
public interface UserRepository  extends JpaRepository<User, Long>{
    boolean existsByEmail(String email);
    boolean existsByCpf(String cpf);
    Optional<User> findByEmail(String email);


    Optional<User> findByEmailAndIsActiveTrue(String email);

    
    Optional<User> findByCpfAndIsActiveTrue(String cpf);

    Optional<User> findByIdAndIsActiveTrue(Long id);

    
    List<User> findAllByIsActiveTrue();
}
