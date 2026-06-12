package com.workmitra.api.controller;

import com.workmitra.api.dto.AuthRequest;
import com.workmitra.api.dto.AuthResponse;
import com.workmitra.api.dto.RegisterRequest;
import com.workmitra.api.entity.User;
import com.workmitra.api.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private UserService userService;

    @PostMapping("/register")
    public ResponseEntity<?> registerUser(@RequestBody RegisterRequest request) {
        try {
            User registeredUser = userService.registerUser(request);
            Map<String, Object> response = new HashMap<>();
            response.put("message", "User registered successfully");
            response.put("userId", registeredUser.getId());
            response.put("role", registeredUser.getRole());
            return new ResponseEntity<>(response, HttpStatus.CREATED);
        } catch (IllegalArgumentException ex) {
            Map<String, String> errorResponse = new HashMap<>();
            errorResponse.put("error", ex.getMessage());
            return new ResponseEntity<>(errorResponse, HttpStatus.BAD_REQUEST);
        }
    }

    @PostMapping("/login")
    public ResponseEntity<?> loginUser(@RequestBody AuthRequest request) {
        try {
            AuthResponse authResponse = userService.loginUser(request);
            return ResponseEntity.ok(authResponse);
        } catch (Exception ex) {
            Map<String, String> errorResponse = new HashMap<>();
            errorResponse.put("error", "Invalid phone number or password!");
            return new ResponseEntity<>(errorResponse, HttpStatus.UNAUTHORIZED);
        }
    }
}
