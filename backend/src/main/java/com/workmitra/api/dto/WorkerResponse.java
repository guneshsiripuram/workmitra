package com.workmitra.api.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class WorkerResponse {
    private Long userId;
    private String name;
    private String phone;
    private String skill;
    private Integer experience;
    private String location;
    private String photoUrl;
}
