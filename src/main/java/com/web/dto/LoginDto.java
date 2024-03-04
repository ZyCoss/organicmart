package com.web.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class LoginDto {

    private String username;

    private String password;

    private String tokenDevice;
}
