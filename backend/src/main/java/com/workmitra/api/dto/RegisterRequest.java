package com.workmitra.api.dto;

import lombok.Data;

@Data
public class RegisterRequest {
    private String name;
    private String phone;
    private String password;
    private String role; // CUSTOMER or WORKER
}
