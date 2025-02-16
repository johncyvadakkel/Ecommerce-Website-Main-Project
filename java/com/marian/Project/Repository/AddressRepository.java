package com.marian.Project.Repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.marian.Project.Model.Address;

@Repository
public interface AddressRepository extends JpaRepository<Address, Long> {

    List<Address> findByUserId(Long userId);
    
    @Query("SELECT a FROM Address a WHERE a.user.id = :userId AND a.isDefault = true")
    Address findDefaultAddress(@Param("userId") Long userId);
    
    @Query("SELECT COUNT(a) FROM Address a WHERE a.user.id = :userId")
    int countByUserId(@Param("userId") Long userId);
}
