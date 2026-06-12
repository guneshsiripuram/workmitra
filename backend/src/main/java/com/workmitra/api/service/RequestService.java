package com.workmitra.api.service;

import com.workmitra.api.dto.WorkRequestDto;
import com.workmitra.api.dto.WorkRequestResponse;
import com.workmitra.api.entity.User;
import com.workmitra.api.entity.WorkRequest;
import com.workmitra.api.exception.ResourceNotFoundException;
import com.workmitra.api.repository.UserRepository;
import com.workmitra.api.repository.WorkRequestRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class RequestService {

    @Autowired
    private WorkRequestRepository workRequestRepository;

    @Autowired
    private UserRepository userRepository;

    @Transactional
    public WorkRequestResponse createRequest(String customerPhone, WorkRequestDto dto) {
        User customer = userRepository.findByPhone(customerPhone)
                .orElseThrow(() -> new ResourceNotFoundException("Customer not found with phone: " + customerPhone));

        if (!"CUSTOMER".equals(customer.getRole())) {
            throw new IllegalArgumentException("Only customers can submit work requests!");
        }

        User worker = userRepository.findById(dto.getWorkerId())
                .orElseThrow(() -> new ResourceNotFoundException("Worker not found with ID: " + dto.getWorkerId()));

        if (!"WORKER".equals(worker.getRole())) {
            throw new IllegalArgumentException("Target user with ID " + dto.getWorkerId() + " is not a worker!");
        }

        WorkRequest request = new WorkRequest();
        request.setCustomer(customer);
        request.setWorker(worker);
        request.setDescription(dto.getDescription());
        request.setAddress(dto.getAddress());
        request.setPhone(dto.getPhone());
        request.setStatus("PENDING");

        WorkRequest savedRequest = workRequestRepository.save(request);
        return mapToResponse(savedRequest);
    }

    @Transactional(readOnly = true)
    public List<WorkRequestResponse> getRequestsForCustomer(String customerPhone) {
        User customer = userRepository.findByPhone(customerPhone)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with phone: " + customerPhone));

        List<WorkRequest> requests = workRequestRepository.findByCustomerIdOrderByIdDesc(customer.getId());
        return requests.stream().map(this::mapToResponse).collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<WorkRequestResponse> getRequestsForWorker(String workerPhone) {
        User worker = userRepository.findByPhone(workerPhone)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with phone: " + workerPhone));

        List<WorkRequest> requests = workRequestRepository.findByWorkerIdOrderByIdDesc(worker.getId());
        return requests.stream().map(this::mapToResponse).collect(Collectors.toList());
    }

    @Transactional
    public WorkRequestResponse updateRequestStatus(Long requestId, String workerPhone, String newStatus) {
        WorkRequest request = workRequestRepository.findById(requestId)
                .orElseThrow(() -> new ResourceNotFoundException("Work request not found with ID: " + requestId));

        // Security check: Only the worker assigned to this request can update its status
        if (!request.getWorker().getPhone().equals(workerPhone)) {
            throw new IllegalArgumentException("Unauthorized: You are not the worker assigned to this request!");
        }

        String status = newStatus.toUpperCase();
        if (!"ACCEPTED".equals(status) && !"REJECTED".equals(status)) {
            throw new IllegalArgumentException("Status must be either ACCEPTED or REJECTED!");
        }

        request.setStatus(status);
        WorkRequest updatedRequest = workRequestRepository.save(request);
        return mapToResponse(updatedRequest);
    }

    private WorkRequestResponse mapToResponse(WorkRequest request) {
        return new WorkRequestResponse(
                request.getId(),
                request.getCustomer().getId(),
                request.getCustomer().getName(),
                request.getWorker().getId(),
                request.getWorker().getName(),
                request.getDescription(),
                request.getAddress(),
                request.getPhone(),
                request.getStatus()
        );
    }
}
