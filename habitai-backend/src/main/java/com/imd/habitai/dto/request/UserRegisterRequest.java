package com.imd.habitai.dto.request;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class UserRegisterRequest {
    String name;
    String email;
    String cpf;
    String phone;
    String password, confirmPassword;
}
