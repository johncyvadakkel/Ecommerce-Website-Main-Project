package com.marian.Project.Service;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.marian.Project.Model.Product;
import com.marian.Project.Model.ProductCategory;
import com.marian.Project.Repository.AdminProductRepository;

import jakarta.transaction.Transactional;

@Service
@Transactional
public class AdminProductService {
	
	@Autowired
    private AdminProductRepository productRepository;

    public Product saveProduct(Product product) {
        validateProduct(product);
        return productRepository.save(product);
    }

    private void validateProduct(Product product) {
    	 if (product.getName() == null || product.getName().trim().isEmpty()) {
             throw new IllegalArgumentException("Product name is required");
         }
         
         if (product.getPrice() == null) {
             throw new IllegalArgumentException("Price is required");
         }
         
         if (product.getPrice().signum() < 0) {
             throw new IllegalArgumentException("Price cannot be negative");
         }
         
         if (product.getStockQuantity() == null) {
             throw new IllegalArgumentException("Stock quantity is required");
         }
         
         if (product.getStockQuantity() < 0) {
             throw new IllegalArgumentException("Stock quantity cannot be negative");
         }
         
         if (product.getCategory() == null) {
             throw new IllegalArgumentException("Category is required");
         }
         
         if (Boolean.TRUE.equals(product.getIsOrganic()) && 
             (product.getOrganicCertification() == null || product.getOrganicCertification().trim().isEmpty())) {
             throw new IllegalArgumentException("Organic products must have certification");
         }
    }

    public List<Product> getAllProducts() {
        return productRepository.findAll();
    }

    public Optional<Product> getProductById(Long id) {
        return productRepository.findById(id);
    }

    public List<Product> findByCategory(ProductCategory category) {
        return productRepository.findByCategory(category);
    }

    public List<Product> findByIsOrganic(Boolean isOrganic) {
        return productRepository.findByIsOrganic(isOrganic);
    }

    public void deleteProduct(Long id) {
        if (!productRepository.existsById(id)) {
            throw new IllegalArgumentException("Product not found with id: " + id);
        }
        productRepository.deleteById(id);
    }

    public boolean updateStock(Long productId, Integer quantity) {
        Optional<Product> productOpt = productRepository.findById(productId);
        if (productOpt.isPresent()) {
            Product product = productOpt.get();
            if (product.getStockQuantity() >= quantity) {
                product.setStockQuantity(product.getStockQuantity() - quantity);
                productRepository.save(product);
                return true;
            }
        }
        return false;
    }

}
