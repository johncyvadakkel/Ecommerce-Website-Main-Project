package com.marian.Project.Seeder;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Component;

import com.marian.Project.Model.Admin;
import com.marian.Project.Repository.AdminRepository;

@Component
public class AdminSeeder implements CommandLineRunner{
	 @Autowired
	 private AdminRepository adminRepository;

     private final BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

     @Override
     public void run(String... args) throws Exception{
    	 if (adminRepository.count() == 0) {
    		 Admin admin = new Admin();
             admin.setEmail("admin001@gmail.com");
             admin.setPassword(passwordEncoder.encode("adminPass@1"));

             adminRepository.save(admin);
             System.out.println("Admin user created successfully.");
    	 }else {
    		 System.out.println("Admin user already exists.");
    	 }
     }
}
    
