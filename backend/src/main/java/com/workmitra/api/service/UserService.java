package com.workmitra.api.service;

import com.workmitra.api.dto.AuthRequest;
import com.workmitra.api.dto.AuthResponse;
import com.workmitra.api.dto.RegisterRequest;
import com.workmitra.api.entity.User;
import com.workmitra.api.repository.UserRepository;
import com.workmitra.api.security.JwtTokenProvider;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private JwtTokenProvider tokenProvider;

    @Transactional
    public User registerUser(RegisterRequest request) {
        // Check if phone number is already registered
        if (userRepository.existsByPhone(request.getPhone())) {
            throw new IllegalArgumentException("Phone number is already registered!");
        }

        // Validate Role
        String role = request.getRole().toUpperCase();
        if (!role.equals("CUSTOMER") && !role.equals("WORKER")) {
            throw new IllegalArgumentException("Role must be either CUSTOMER or WORKER!");
        }

        // Create new User entity
        User user = new User();
        user.setName(request.getName());
        user.setPhone(request.getPhone());
        user.setRole(role);
        // Encrypt the password using BCrypt
        user.setPassword(passwordEncoder.encode(request.getPassword()));

        return userRepository.save(user);
    }

    public AuthResponse loginUser(AuthRequest request) {
        // Authenticate the user credentials
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getPhone(), request.getPassword())
        );

        // Retrieve the authenticated user from the database
        User user = userRepository.findByPhone(request.getPhone())
                .orElseThrow(() -> new IllegalArgumentException("User not found with phone: " + request.getPhone()));

        // Generate the JWT token containing the custom claims
        String token = tokenProvider.generateToken(user.getPhone(), user.getRole(), user.getId());

        return new AuthResponse(token, user.getId(), user.getName(), user.getRole());
    }
}
