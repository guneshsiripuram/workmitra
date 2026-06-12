package com.workmitra.api.dto;

import lombok.Data;

@Data
public class WorkRequestDto {
    private Long workerId;
    private String description;
    private String address;
    private String phone;
}
