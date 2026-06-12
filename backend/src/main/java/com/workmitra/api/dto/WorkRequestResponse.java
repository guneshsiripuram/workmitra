package com.workmitra.api.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class WorkRequestResponse {
    private Long requestId;
    private Long customerId;
    private String customerName;
    private Long workerId;
    private String workerName;
    private String description;
    private String address;
    private String phone;
    private String status;
}
