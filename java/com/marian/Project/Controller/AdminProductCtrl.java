package com.marian.Project.Controller;

import java.util.Arrays;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.marian.Project.Model.Product;
import com.marian.Project.Model.ProductCategory;
import com.marian.Project.Service.AdminProductService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/admin")
@CrossOrigin(origins = "http://localhost:3000")
public class AdminProductCtrl {

	 @Autowired
	    private AdminProductService productService;

	 @GetMapping("/categories")
	 public ResponseEntity<Map<String, String>> getAllCategories() {
	     Map<String, String> categories = Arrays.stream(ProductCategory.values())
	         .collect(Collectors.toMap(
	             ProductCategory::name,
	             ProductCategory::getDisplayName
	         ));
	     return ResponseEntity.ok(categories);
	 }

	 @PostMapping
	 public ResponseEntity<?> addProduct(@Valid @RequestBody Product product) {
	     try {
	         System.out.println("Received product: " + product); // Debug log
	         Product savedProduct = productService.saveProduct(product);
	         return ResponseEntity.ok(savedProduct);
	     } catch (Exception e) {
	         e.printStackTrace(); // Debug log
	         return ResponseEntity.badRequest().body(e.getMessage());
	     }
	 }

	    @GetMapping("/products")
	    public ResponseEntity<List<Product>> getAllProducts() {
	        return ResponseEntity.ok(productService.getAllProducts());
	    }
	    
	    @GetMapping("/products/{id}")
	    public ResponseEntity<?> getProductById(@PathVariable Long id) {
	        Optional<Product> productOpt = productService.getProductById(id);
	        if (productOpt.isPresent()) {
	            return ResponseEntity.ok(productOpt.get());
	        } else {
	            return ResponseEntity.status(404).body("Product not found");
	        }
	    }

	    @GetMapping("/category/{category}")
	    public ResponseEntity<List<Product>> getProductsByCategory(@PathVariable ProductCategory category) {
	        return ResponseEntity.ok(productService.findByCategory(category));
	    }
	    
	    @DeleteMapping("/{id}")
	    public ResponseEntity<?> deleteProduct(@PathVariable Long id) {
	        try {
	            productService.deleteProduct(id);
	            return ResponseEntity.ok().build();
	        } catch (Exception e) {
	            return ResponseEntity.badRequest().body(e.getMessage());
	        }
	    }

}
