package com.marian.Project.Repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.marian.Project.Model.Product;
import com.marian.Project.Model.User;
import com.marian.Project.Model.Wishlist;

@Repository
public interface WishlistRepository extends JpaRepository<Wishlist, Long>{

	List<Wishlist> findByUser(User user);
    Optional<Wishlist> findByUserAndProduct(User user, Product product);
    boolean existsByUserAndProduct(User user, Product product);
}
