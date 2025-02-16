package com.marian.Project.Controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.marian.Project.Model.CartItem;
import com.marian.Project.Service.CartService;

@RestController
@RequestMapping("/api/cart")
@CrossOrigin(origins = "http://localhost:3000")
public class CartController {
	
	@Autowired
    private CartService cartService;
    
    @GetMapping("/items")
    public ResponseEntity<List<CartItem>> getCartItems(@RequestParam Long userId) {
        return ResponseEntity.ok(cartService.getCartItems(userId));
    }
    
    @PostMapping("/add")
    public ResponseEntity<CartItem> addToCart(
        @RequestParam Long userId,
        @RequestParam Long productId, 
        @RequestParam Integer quantity
    ) {
        CartItem cartItem = cartService.addToCart(userId, productId, quantity);
        return ResponseEntity.ok(cartItem);
    }
    
    @DeleteMapping("/remove/{itemId}")
    public ResponseEntity<Void> removeFromCart(
        @PathVariable Long itemId,
        @RequestParam Long userId
    ) {
        cartService.removeFromCart(itemId, userId);
        return ResponseEntity.ok().build();
    }
    
    @PutMapping("/update/{itemId}")
    public ResponseEntity<CartItem> updateQuantity(
        @PathVariable Long itemId,
        @RequestParam Long userId,
        @RequestParam Integer quantity
    ) {
        CartItem cartItem = cartService.updateQuantity(itemId, userId, quantity);
        return ResponseEntity.ok(cartItem);
    }
}
