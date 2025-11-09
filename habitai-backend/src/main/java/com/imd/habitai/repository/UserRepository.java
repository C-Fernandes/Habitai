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


    /**
     * Busca um usuário pelo email, mas SOMENTE se ele estiver ativo.
     * (Para Login)
     */
    Optional<User> findByEmailAndIsActiveTrue(String email);

    /**
     * Busca um usuário pelo CPF, mas SOMENTE se ele estiver ativo.
     * (Para getByCpf)
     */
    Optional<User> findByCpfAndIsActiveTrue(String cpf);

    /**
     * Busca um usuário pelo ID, mas SOMENTE se ele estiver ativo.
     * (Para getById, getMe, update)
     */
    Optional<User> findByIdAndIsActiveTrue(Long id);

    /**
     * Busca todos os usuários, mas SOMENTE os que estiverem ativos.
     * (Para getAll)
     */
    List<User> findAllByIsActiveTrue();
}
