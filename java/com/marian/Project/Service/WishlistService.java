package com.marian.Project.Service;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.marian.Project.Model.Product;
import com.marian.Project.Model.User;
import com.marian.Project.Model.Wishlist;
import com.marian.Project.Repository.AdminProductRepository;
import com.marian.Project.Repository.UserRepository;
import com.marian.Project.Repository.WishlistRepository;

import jakarta.transaction.Transactional;

@Service
public class WishlistService {

	@Autowired
    private WishlistRepository wishlistRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private AdminProductRepository productRepository;

    @Transactional
    public boolean toggleWishlist(Long userId, Long productId) {
        User user = userRepository.findById(userId)
            .orElseThrow(() -> new RuntimeException("User not found"));
        Product product = productRepository.findById(productId)
            .orElseThrow(() -> new RuntimeException("Product not found"));

        boolean existsInWishlist = wishlistRepository.existsByUserAndProduct(user, product);

        if (existsInWishlist) {
            // Remove from wishlist
            Wishlist wishlistItem = wishlistRepository.findByUserAndProduct(user, product)
                .orElseThrow(() -> new RuntimeException("Wishlist item not found"));
            wishlistRepository.delete(wishlistItem);
            return false;
        } else {
            // Add to wishlist
            Wishlist newWishlistItem = new Wishlist();
            newWishlistItem.setUser(user);
            newWishlistItem.setProduct(product);
            wishlistRepository.save(newWishlistItem);
            return true;
        }
    }

    public List<Product> getUserWishlist(Long userId) {
        User user = userRepository.findById(userId)
            .orElseThrow(() -> new RuntimeException("User not found"));

        return wishlistRepository.findByUser(user).stream()
            .map(Wishlist::getProduct)
            .collect(Collectors.toList());
    }
}
