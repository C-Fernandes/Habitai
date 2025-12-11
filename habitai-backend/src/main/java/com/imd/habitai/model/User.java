package com.imd.habitai.model;

import jakarta.persistence.*;
import lombok.Data;

import java.util.Collection;
import java.util.List;

import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

@Entity
@Table(name = "users")
@Data
public class User implements UserDetails {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false, unique = true)
    private String email;

    @Column(nullable = false, unique = true)
    private String cpf;

    private String phone;

    @Column(nullable = false)
    private boolean isActive = true;
    @Column(nullable = false)
    private String password;
    @OneToMany(mappedBy = "owner")
    private List<Contract> contractsAsOwner;

    @OneToMany(mappedBy = "tenant")
    private List<Contract> contractsAsTenant;

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return List.of();
    }

    @Override
    public String getUsername() {
        return this.email;
    }
}
