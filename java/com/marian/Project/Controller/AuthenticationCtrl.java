package com.marian.Project.Controller;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.marian.Project.Model.Admin;
import com.marian.Project.Model.User;
import com.marian.Project.Repository.AdminRepository;
import com.marian.Project.Repository.UserRepository;
import com.marian.Project.Service.AuthenticationService;


@RequestMapping("/api/auth")
@RestController
@CrossOrigin(origins = "http://localhost:3000")
public class AuthenticationCtrl {
	@Autowired
    private AuthenticationService authService;
	
	@Autowired
	private AdminRepository adminRepository;
	
	@Autowired
	private UserRepository userRepository;

	@PostMapping("/login")
	public ResponseEntity<Map<String, String>> login(@RequestBody User user) {
	    String result = authService.login(user.getEmail(), user.getPassword());
	    Map<String, String> response = new HashMap<>();
	    
	    switch (result) {
	        case "Admin":
	            Admin admin = adminRepository.findByEmail(user.getEmail());
	            response.put("role", "Admin");
	            response.put("message", "Admin login successful!");
	            response.put("id", admin.getId().toString());  // Add admin ID
	            return ResponseEntity.ok(response);
	        case "User":
	            User foundUser = userRepository.findByEmail(user.getEmail()).get();
	            response.put("role", "User");
	            response.put("message", "User login successful!");
	            response.put("id", foundUser.getId().toString());  // Add user ID
	            return ResponseEntity.ok(response);
	        default:
	            response.put("message", result);  // Error message if login fails
	            return ResponseEntity.status(401).body(response); 
	    }
	}
	
	@PostMapping("/register")
    public String register(@RequestBody User user) {
		if (authService.registerUser(user)) {
			return "User registered successfully!";
		}
		return "Email is already registered.";
	}
	
	@GetMapping("/get")
	public List<User> show(){
		return authService.showUser();
	}
	
	

	@PostMapping("/forgot-password")
	public ResponseEntity<String> forgotPassword(@RequestBody Map<String, String> body) {
	    try {
	        String email = body.get("email");  // Correctly extracting from the body
	        String response = authService.generateResetToken(email);
	        return ResponseEntity.ok(response);
	    } catch (Exception e) {
	        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
	    }
	}
	
	
	@PostMapping("/reset-password")
	public ResponseEntity<String> resetPassword(@RequestBody Map<String, String> body) {
	    try {
	        String token = body.get("token");
	        String newPassword = body.get("newPassword");
	        String response = authService.resetPassword(token, newPassword);
	        return ResponseEntity.ok(response);
	    } catch (RuntimeException e) {
	        return ResponseEntity.status(HttpStatus.BAD_REQUEST)
	                             .body("Failed to reset password: " + e.getMessage());
	    } catch (Exception e) {
	        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
	                             .body("An unexpected error occurred. Please try again later.");
	    }
	}

	
}
