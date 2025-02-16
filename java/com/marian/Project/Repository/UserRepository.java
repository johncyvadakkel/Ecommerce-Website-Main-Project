package com.marian.Project.Repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.marian.Project.Model.User;

@Repository
public interface UserRepository extends JpaRepository<User,Long>{

//	User findByEmail(String email);
	    Optional<User> findByEmail(String email);
	    List<User> findByLocationContainingIgnoreCase(String location);
	    boolean existsByEmail(String email);
	    
	    // Additional search methods
	    List<User> findByUsernameContainingIgnoreCase(String username); 
	    List<User> findByStatus(String status);
	    
	    // Combined search methods
	    @Query("SELECT u FROM User u WHERE " +
	           "LOWER(u.location) LIKE LOWER(CONCAT('%', :searchTerm, '%')) OR " +
	           "LOWER(u.email) LIKE LOWER(CONCAT('%', :searchTerm, '%')) OR " +
	           "LOWER(u.username) LIKE LOWER(CONCAT('%', :searchTerm, '%'))")
	    List<User> searchByTermIgnoreCase(@Param("searchTerm") String searchTerm);
	    
	
	 
}
