package com.marian.Project.Repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.marian.Project.Model.Admin;

@Repository
public interface AdminRepository extends JpaRepository<Admin,Long>{

	Admin findByEmail(String email);
}
