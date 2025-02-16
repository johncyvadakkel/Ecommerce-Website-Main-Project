package com.marian.Project.Repository;

import java.math.BigDecimal;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.marian.Project.Model.Product;
import com.marian.Project.Model.ProductCategory;

@Repository
public interface AdminProductRepository extends JpaRepository<Product, Long>{

	List<Product> findByCategory(ProductCategory category);
    List<Product> findByIsOrganic(Boolean isOrganic);
    List<Product> findByPriceBetween(BigDecimal minPrice, BigDecimal maxPrice);
    List<Product> findBySeller_Id(Long sellerId);
    List<Product> findByNameContainingIgnoreCase(String keyword);
}
