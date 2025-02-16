package com.marian.Project.Service;

import java.util.Collections;
import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.marian.Project.ExceptionHandler.ResourceNotFoundException;
import com.marian.Project.Model.User;
import com.marian.Project.Repository.UserRepository;


@Service
@Transactional(readOnly = true)
public class UserService {

	private final UserRepository userRepository;
    private final Logger logger = LoggerFactory.getLogger(UserService.class);
    
    @Autowired
    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }
    
    public List<User> getAllUsers() {
        return userRepository.findAll();
    }
    
    public User getUserByEmail(String email) {
        return userRepository.findByEmail(email)
            .orElseThrow(() -> new ResourceNotFoundException("User not found with email: " + email));
    }
    
    public List<User> searchUsersByLocation(String location) {
        if (location == null || location.trim().isEmpty()) {
            throw new IllegalArgumentException("Location search term cannot be empty");
        }
        List<User> users = userRepository.findByLocationContainingIgnoreCase(location.trim());
        if (users.isEmpty()) {
            throw new ResourceNotFoundException("No users found in location: " + location);
        }
        return users;
    }
    
    public List<User> searchUsers(String searchType, String searchTerm) {
        if (searchTerm == null || searchTerm.trim().isEmpty()) {
            throw new IllegalArgumentException("Search term cannot be empty");
        }
        
        searchTerm = searchTerm.trim();
        List<User> results;
        
        switch (searchType.toLowerCase()) {
            case "email":
                return Collections.singletonList(getUserByEmail(searchTerm));
            case "location":
                return searchUsersByLocation(searchTerm);
            case "name":
                results = userRepository.findByUsernameContainingIgnoreCase(searchTerm);
                break;
            default:
                results = userRepository.searchByTermIgnoreCase(searchTerm);
        }
        
        if (results.isEmpty()) {
            throw new ResourceNotFoundException("No users found for " + searchType + ": " + searchTerm);
        }
        
        return results;
    }
    
    @Transactional
    public User createUser(User user) {
        validateNewUser(user);
        user.setStatus("active");
        return userRepository.save(user);
    }
    
    @Transactional
    public User updateUser(Long id, User userDetails) {
        User existingUser = userRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + id));
        
        // Update only if email is different and not already taken
        if (!existingUser.getEmail().equals(userDetails.getEmail()) && 
            userRepository.existsByEmail(userDetails.getEmail())) {
            throw new IllegalArgumentException("Email already exists: " + userDetails.getEmail());
        }
        
        updateUserFields(existingUser, userDetails);
        return userRepository.save(existingUser);
    }
    
    private void validateNewUser(User user) {
        if (user.getEmail() == null || user.getEmail().trim().isEmpty()) {
            throw new IllegalArgumentException("Email cannot be empty");
        }
        if (userRepository.existsByEmail(user.getEmail())) {
            throw new IllegalArgumentException("Email already exists: " + user.getEmail());
        }
        if (user.getUsername() == null || user.getUsername().trim().isEmpty()) {
            throw new IllegalArgumentException("Name cannot be empty");
        }
    }
    
    private void updateUserFields(User existingUser, User userDetails) {
        existingUser.setUsername(userDetails.getUsername());
        existingUser.setEmail(userDetails.getEmail());
        existingUser.setPhone(userDetails.getPhone());
        existingUser.setLocation(userDetails.getLocation());
        existingUser.setStatus(userDetails.getStatus());
    }
}
