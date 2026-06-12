package com.workmitra.api.dto;

import lombok.Data;

@Data
public class ProfileRequest {
    private String skill;
    private Integer experience;
    private String location;
    private String photoUrl;
}
