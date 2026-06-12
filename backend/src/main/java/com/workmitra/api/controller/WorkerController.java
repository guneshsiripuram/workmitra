package com.workmitra.api.controller;

import com.workmitra.api.dto.ProfileRequest;
import com.workmitra.api.dto.WorkerResponse;
import com.workmitra.api.entity.WorkerProfile;
import com.workmitra.api.service.WorkerService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;

@RestController
@RequestMapping("/api/workers")
public class WorkerController {

    @Autowired
    private WorkerService workerService;

    // Create or update currently logged-in worker's profile
    @PostMapping("/profile")
    public ResponseEntity<WorkerProfile> createOrUpdateProfile(@RequestBody ProfileRequest request, Principal principal) {
        // principal.getName() returns the phone number we stored as subject in the JWT token
        WorkerProfile profile = workerService.createOrUpdateProfile(principal.getName(), request);
        return ResponseEntity.ok(profile);
    }

    // Get all workers (with optional skill filter)
    @GetMapping
    public ResponseEntity<List<WorkerResponse>> getAllWorkers(@RequestParam(value = "skill", required = false) String skill) {
        List<WorkerResponse> workers = workerService.getAllWorkers(skill);
        return ResponseEntity.ok(workers);
    }

    // Get a specific worker by user ID
    @GetMapping("/{id}")
    public ResponseEntity<WorkerResponse> getWorkerById(@PathVariable("id") Long id) {
        WorkerResponse worker = workerService.getWorkerById(id);
        return ResponseEntity.ok(worker);
    }
}
