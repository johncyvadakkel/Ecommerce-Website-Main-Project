package com.marian.Project.Service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class EmailService {

	@Autowired
    private JavaMailSender mailSender;

	public void sendPasswordResetEmail(String to, String token) {
	    try {
	        SimpleMailMessage message = new SimpleMailMessage();
	        message.setTo(to);
	        message.setSubject("Password Reset Request");
	        message.setText("Hello,\n\n" +
	                "You have requested to reset your password. Click the link below to reset your password:\n\n" +
	                "http://localhost:3000/reset-password/" + token + "\n\n" +
	                "This link will expire in 24 hours.\n\n" +
	                "If you didn't request this, please ignore this email.\n\n" +
	                "Best regards,\nYour Application Team");
	        mailSender.send(message);
	    } catch (Exception e) {
	        System.err.println("Error sending email: " + e.getMessage());
	    }
	}
}
