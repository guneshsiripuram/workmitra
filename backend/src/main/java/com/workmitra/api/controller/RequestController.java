package com.workmitra.api.controller;

import com.workmitra.api.dto.WorkRequestDto;
import com.workmitra.api.dto.WorkRequestResponse;
import com.workmitra.api.service.RequestService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/requests")
public class RequestController {

    @Autowired
    private RequestService requestService;

    // Create a new work request (Customer only)
    @PostMapping
    public ResponseEntity<WorkRequestResponse> createRequest(@RequestBody WorkRequestDto dto, Principal principal) {
        // principal.getName() extracts the logged-in customer's phone from the JWT
        WorkRequestResponse response = requestService.createRequest(principal.getName(), dto);
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    // Get all requests submitted by the logged-in customer
    @GetMapping("/customer")
    public ResponseEntity<List<WorkRequestResponse>> getRequestsForCustomer(Principal principal) {
        List<WorkRequestResponse> responses = requestService.getRequestsForCustomer(principal.getName());
        return ResponseEntity.ok(responses);
    }

    // Get all requests received by the logged-in worker
    @GetMapping("/worker")
    public ResponseEntity<List<WorkRequestResponse>> getRequestsForWorker(Principal principal) {
        List<WorkRequestResponse> responses = requestService.getRequestsForWorker(principal.getName());
        return ResponseEntity.ok(responses);
    }

    // Update status (Accept/Reject) of a request (Worker only)
    @PutMapping("/{requestId}/status")
    public ResponseEntity<WorkRequestResponse> updateRequestStatus(
            @PathVariable("requestId") Long requestId,
            @RequestBody Map<String, String> payload,
            Principal principal) {
        String status = payload.get("status");
        if (status == null) {
            throw new IllegalArgumentException("Field 'status' is required in the request body!");
        }
        WorkRequestResponse response = requestService.updateRequestStatus(requestId, principal.getName(), status);
        return ResponseEntity.ok(response);
    }
}
