package com.imd.habitai.dto.request;

import org.hibernate.validator.constraints.br.CPF;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

public record UserRegisterRequest (
    @NotBlank(message = "O nome não pode estar em branco.")
    @Size(min = 2, max = 100, message = "O nome deve ter entre 2 e 100 caracteres.")
    String name,

    @NotBlank(message = "O email não pode estar em branco.")
    @Size(min = 5, max = 100, message = "O email deve ter entre 5 e 100 caracteres.")
    @Email(message = "O email informado é inválido.")
    String email,

    @NotBlank(message = "O CPF não pode estar em branco.")
    @Size(min = 11, max = 14, message = "O CPF deve ter entre 11 e 14 caracteres.")
    @CPF(message = "O CPF informado é inválido.")
    String cpf,

    @NotBlank(message = "O telefone não pode estar em branco.")
    @Size(min = 10, max = 15, message = "O telefone deve ter entre 10 e 15 caracteres.")
    @Pattern(
        regexp = "^\\d{10,11}$", 
        message = "O número de telefone deve conter apenas dígitos (10 para fixo, 11 para celular) no formato 84900000000, por exemplo.")
    String phone,

    @NotBlank(message = "A senha não pode estar em branco.")
    @Size(min = 3, max = 100, message = "A senha deve ter entre 3 e 100 caracteres.")
    String password, 

    @NotBlank(message = "A confirmação de senha não pode estar em branco.")
    @Size(min = 3, max = 100, message = "A confirmação de senha deve ter entre 3 e 100 caracteres.")
    String confirmPassword
) {}
