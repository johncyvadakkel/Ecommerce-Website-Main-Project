package com.marian.Project;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
public class SecurityConfig {
	@Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
		http.csrf(csrf -> csrf.disable())  // Disable CSRF for simplicity (not recommended for production)
        .authorizeHttpRequests(auth -> auth
        .requestMatchers("/api/auth/**","/api/admin/**","/api/cart/**","/api/payment/**","/api/wishlist/**").permitAll()// Allow access to these endpoints without authentication
        .anyRequest().authenticated()  // All other requests require authentication
        );
       return http.build();
    }
	
	@Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
}
	


