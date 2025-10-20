package com.imd.habitai.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Entity
@Table(name = "addresses")
@Data
public class Address {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    @Size(max = 100)
    @NotBlank(message = "A rua (street) não pode estar em branco.")
    private String street;

    @Column(nullable = false)
    @NotBlank(message = "O número (number) não pode estar em branco.")
    private String number;

    @Size(max = 100)
    private String complement;

    @Column(nullable = false)
    @NotBlank(message = "O bairro (neighborhood) não pode estar em branco.")
    private String neighborhood;
    
    @Column(nullable = false)
    @NotBlank(message = "A cidade (city) não pode estar em branco.")
    private String city;

    @Column(nullable = false)
    @NotBlank(message = "O estado (state) não pode estar em branco.")
    private String state;

    @Column(nullable = false)
    @Pattern(regexp = "^\\d{5}-\\d{3}$", message = "O CEP deve estar no formato 00000-000.")
    private String cep;     
    
    @OneToOne(mappedBy = "address")
    private Property property;
}