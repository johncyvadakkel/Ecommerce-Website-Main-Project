package com.marian.Project.Service;

import java.math.BigDecimal;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.marian.Project.Model.CartItem;
import com.marian.Project.Model.Product;
import com.marian.Project.Model.User;
import com.marian.Project.Repository.AdminProductRepository;
import com.marian.Project.Repository.CartRepository;
import com.marian.Project.Repository.UserRepository;

import jakarta.transaction.Transactional;


@Service
public class CartService {
    @Autowired
    private CartRepository cartRepository;
    
    @Autowired
    private AdminProductRepository productRepository;
    
    @Autowired
    private UserRepository userRepository;  // Add this
    
    public List<CartItem> getCartItems(Long userId) {
        return cartRepository.findByUserId(userId);
    }
    
    @Transactional
    public CartItem addToCart(Long userId, Long productId, Integer quantity) {
        // Get user
        User user = userRepository.findById(userId)
            .orElseThrow(() -> new RuntimeException("User not found"));
            
        // Get product
        Product product = productRepository.findById(productId)
            .orElseThrow(() -> new RuntimeException("Product not found"));
            
        if (product.getStockQuantity() < quantity) {
            throw new RuntimeException("Not enough stock available");
        }
        
        // Check if product already exists in user's cart
        CartItem existingItem = cartRepository.findByUserIdAndProductId(userId, productId);
        if (existingItem != null) {
            // Update quantity instead of creating new item
            int newQuantity = existingItem.getQuantity() + quantity;
            if (product.getStockQuantity() < newQuantity) {
                throw new RuntimeException("Not enough stock available");
            }
            existingItem.setQuantity(newQuantity);
            existingItem.setSubtotal(product.getPrice().multiply(BigDecimal.valueOf(newQuantity)));
            return cartRepository.save(existingItem);
        }
        
        // Create new cart item
        CartItem cartItem = new CartItem();
        cartItem.setUser(user);
        cartItem.setProduct(product);
        cartItem.setQuantity(quantity);
        
        // Calculate subtotal
        BigDecimal subtotal = product.getPrice().multiply(BigDecimal.valueOf(quantity));
        cartItem.setSubtotal(subtotal);
        
        return cartRepository.save(cartItem);
    }
    
    @Transactional
    public void removeFromCart(Long itemId, Long userId) {
        CartItem item = cartRepository.findByIdAndUserId(itemId, userId)
            .orElseThrow(() -> new RuntimeException("Cart item not found or unauthorized"));
        cartRepository.delete(item);
    }
    
    @Transactional
    public CartItem updateQuantity(Long itemId, Long userId, Integer quantity) {
        CartItem cartItem = cartRepository.findByIdAndUserId(itemId, userId)
            .orElseThrow(() -> new RuntimeException("Cart item not found or unauthorized"));
            
        if (cartItem.getProduct().getStockQuantity() < quantity) {
            throw new RuntimeException("Not enough stock available");
        }
        
        cartItem.setQuantity(quantity);
        
        // Recalculate subtotal
        BigDecimal subtotal = cartItem.getProduct().getPrice().multiply(BigDecimal.valueOf(quantity));
        cartItem.setSubtotal(subtotal);
        
        return cartRepository.save(cartItem);
    }
}
