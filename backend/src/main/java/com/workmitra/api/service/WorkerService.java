package com.workmitra.api.service;

import com.workmitra.api.dto.ProfileRequest;
import com.workmitra.api.dto.WorkerResponse;
import com.workmitra.api.entity.User;
import com.workmitra.api.entity.WorkerProfile;
import com.workmitra.api.exception.ResourceNotFoundException;
import com.workmitra.api.repository.UserRepository;
import com.workmitra.api.repository.WorkerProfileRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class WorkerService {

    @Autowired
    private WorkerProfileRepository workerProfileRepository;

    @Autowired
    private UserRepository userRepository;

    @Transactional
    public WorkerProfile createOrUpdateProfile(String phone, ProfileRequest request) {
        User user = userRepository.findByPhone(phone)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with phone: " + phone));

        if (!"WORKER".equals(user.getRole())) {
            throw new IllegalArgumentException("Only users with role WORKER can create a profile!");
        }

        // Check if profile already exists for this user, if so update it, else create new
        WorkerProfile profile = workerProfileRepository.findByUserId(user.getId())
                .orElse(new WorkerProfile());

        profile.setUser(user);
        profile.setSkill(request.getSkill().toUpperCase());
        profile.setExperience(request.getExperience());
        profile.setLocation(request.getLocation());
        profile.setPhotoUrl(request.getPhotoUrl());

        return workerProfileRepository.save(profile);
    }

    @Transactional(readOnly = true)
    public List<WorkerResponse> getAllWorkers(String skill) {
        List<WorkerProfile> profiles;
        if (skill != null && !skill.trim().isEmpty()) {
            profiles = workerProfileRepository.findBySkillIgnoreCase(skill.trim());
        } else {
            profiles = workerProfileRepository.findAll();
        }

        return profiles.stream()
                .map(this::mapToWorkerResponse)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public WorkerResponse getWorkerById(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with ID: " + id));

        if (!"WORKER".equals(user.getRole())) {
            throw new IllegalArgumentException("User with ID " + id + " is not a Worker!");
        }

        WorkerProfile profile = workerProfileRepository.findByUserId(id)
                .orElseThrow(() -> new ResourceNotFoundException("Profile not setup yet for worker: " + user.getName()));

        return mapToWorkerResponse(profile);
    }

    private WorkerResponse mapToWorkerResponse(WorkerProfile profile) {
        return new WorkerResponse(
                profile.getUser().getId(),
                profile.getUser().getName(),
                profile.getUser().getPhone(),
                profile.getSkill(),
                profile.getExperience(),
                profile.getLocation(),
                profile.getPhotoUrl()
        );
    }
}
