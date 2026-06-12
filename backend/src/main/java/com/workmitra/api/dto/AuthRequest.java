package com.workmitra.api.dto;

import lombok.Data;

@Data
public class AuthRequest {
    private String phone;
    private String password;
}
