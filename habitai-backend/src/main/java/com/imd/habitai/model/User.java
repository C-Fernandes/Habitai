package com.imd.habitai.model;

import jakarta.persistence.*;
import java.util.List;

@Entity
@Table(name = "users")
public class User {

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

    private String profilePictureUrl;
    
    @OneToMany(mappedBy = "owner")
    private List<Property> ownedProperties;

    @OneToMany(mappedBy = "owner")
    private List<Contract> contractsAsOwner;

    @OneToMany(mappedBy = "tenant")
    private List<Contract> contractsAsTenant;
    
    @OneToMany(mappedBy = "prospect")
    private List<Visit> scheduledVisits;

    @OneToMany(mappedBy = "agent")
    private List<Visit> accompaniedVisits;
}
