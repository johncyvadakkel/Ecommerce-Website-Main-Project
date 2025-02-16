package com.marian.Project.Repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.marian.Project.Model.ContactMessage;

@Repository
public interface ContactMessageRepository extends JpaRepository<ContactMessage,Long>{

}
