package com.marian.Project.Service;


import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import com.marian.Project.Model.Admin;
import com.marian.Project.Model.PasswordResetToken;
import com.marian.Project.Model.User;
import com.marian.Project.Repository.AdminRepository;
import com.marian.Project.Repository.PasswordResetTokenRepository;
import com.marian.Project.Repository.UserRepository;

@Service
public class AuthenticationService {
	
	 @Autowired
	 private AdminRepository adminRepository;

	 @Autowired
	 private UserRepository userRepository;
	    
	    @Autowired
	    private EmailService emailService;
	    
	    @Autowired
	    private JavaMailSender mailSender;
	    
	    @Autowired
	    private PasswordResetTokenRepository tokenRepository;
	 

	 private final BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();
	 
	 
	 public String login(String email, String password) {
	        Admin admin = adminRepository.findByEmail(email);
	        if (admin != null) {
	            if (passwordEncoder.matches(password, admin.getPassword())) {
	                return "Admin";
	            }
	            return "Invalid admin credentials";
	        }
	        
	        return userRepository.findByEmail(email)
	                .map(user -> {
	                    if (passwordEncoder.matches(password, user.getPassword())) {
	                        return "User";
	                    }
	                    return "Invalid user credentials";
	                })
	                .orElse("Invalid credentials");
	    }
	 
	 public boolean registerUser(User user) {
		    // Check if the email is already in the database
		    if (userRepository.findByEmail(user.getEmail()).isPresent()) {
		        // Return false if the email already exists
		        return false;
		    }
		    // Hash the password before saving
		    user.setPassword(passwordEncoder.encode(user.getPassword()));
		    // Save the user to the database
		    userRepository.save(user);
		    return true;
		}

	 
	 public List<User> showUser(){
		 return userRepository.findAll();	 
		 }
	 
	 
	 public String generateResetToken(String email) {
	        User user = userRepository.findByEmail(email)
	            .orElseThrow(() -> new RuntimeException("User not found"));

	        String token = UUID.randomUUID().toString();
	        LocalDateTime expiryDate = LocalDateTime.now().plusHours(1);

	        PasswordResetToken resetToken = new PasswordResetToken(token, expiryDate, user);
	        tokenRepository.save(resetToken);

	        sendResetEmail(user.getEmail(), token);

	        return "Password reset link sent to your email.";
	    }

	    private void sendResetEmail(String email, String token) {
	        String resetLink = "http://localhost:3000/reset-password?token=" + token;
	        SimpleMailMessage message = new SimpleMailMessage();
	        message.setTo(email);
	        message.setSubject("Reset Your Password");
	        message.setText("Click the link to reset your password: " + resetLink);
	        mailSender.send(message);
	    }

	    public String resetPassword(String token, String newPassword) {
	        PasswordResetToken resetToken = tokenRepository.findByToken(token)
	            .orElseThrow(() -> new RuntimeException("Invalid or expired token"));

	        if (resetToken.getExpiryDate().isBefore(LocalDateTime.now())) {
	            throw new RuntimeException("Token has expired");
	        }

	        User user = resetToken.getUser();
	        user.setPassword(passwordEncoder.encode(newPassword));
	        userRepository.save(user);

	        tokenRepository.delete(resetToken);

	        return "Password reset successful.";
	    }
	 
}
