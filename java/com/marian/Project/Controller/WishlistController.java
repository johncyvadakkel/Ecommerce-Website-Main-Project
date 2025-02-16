package com.marian.Project.Controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.marian.Project.Model.Wishlist;
import com.marian.Project.Service.WishlistService;

@RestController
@RequestMapping("/api/wishlist")
@CrossOrigin(origins = "http://localhost:3000")
public class WishlistController {

	@Autowired
    private WishlistService wishlistService;
	
	@PostMapping("/toggle")
    public ResponseEntity<Boolean> toggleWishlist(
        @RequestParam Long userId,   // Ensure userId is passed correctly
        @RequestParam Long productId
    ) {
        try {
            boolean isInWishlist = wishlistService.toggleWishlist(userId, productId);
            return ResponseEntity.ok(isInWishlist);
        } catch (Exception e) {
            return ResponseEntity.status(403).body(false); // Return a 403 status if something fails
        }
    }
  

    @GetMapping
    public ResponseEntity<?> getUserWishlist(@RequestParam Long userId) {
        return ResponseEntity.ok(wishlistService.getUserWishlist(userId));
    }
}
