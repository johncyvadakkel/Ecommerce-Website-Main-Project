package com.marian.Project.Model;

import java.math.BigDecimal;
import java.sql.Date;
import java.util.List;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;

@Entity
public class Product {

	 @Id
	 @GeneratedValue(strategy = GenerationType.IDENTITY)
	 private Long id;

	 @Column(nullable = false)
	 private String name;

	 private String description;
	 private BigDecimal price;
	 private Integer stockQuantity;
	 private Boolean isOrganic;
	 
	 @Enumerated(EnumType.STRING)  // Add this annotation
	 @Column(nullable = false)
	 private ProductCategory category; 
	 private String imageUrl;

	 @ManyToOne
	 @JoinColumn(name = "seller_id")
	 private User seller;

	 // Quality metrics for organic products
	 private String organicCertification;
	 private Date harvestDate;
	 private String origin;
	 
	public Product() {
		super();
		// TODO Auto-generated constructor stub
	}

	public Product(Long id, String name, String description, BigDecimal price, Integer stockQuantity, Boolean isOrganic,
			ProductCategory category, String imageUrl, User seller, 
			String organicCertification, Date harvestDate, String origin) {
		super();
		this.id = id;
		this.name = name;
		this.description = description;
		this.price = price;
		this.stockQuantity = stockQuantity;
		this.isOrganic = isOrganic;
		this.category = category;
		this.imageUrl = imageUrl;
		this.seller = seller;
		this.organicCertification = organicCertification;
		this.harvestDate = harvestDate;
		this.origin = origin;
	}

	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public String getDescription() {
		return description;
	}

	public void setDescription(String description) {
		this.description = description;
	}

	public BigDecimal getPrice() {
		return price;
	}

	public void setPrice(BigDecimal price) {
		this.price = price;
	}

	public Integer getStockQuantity() {
		return stockQuantity;
	}

	public void setStockQuantity(Integer stockQuantity) {
		this.stockQuantity = stockQuantity;
	}

	public Boolean getIsOrganic() {
		return isOrganic;
	}

	public void setIsOrganic(Boolean isOrganic) {
		this.isOrganic = isOrganic;
	}

	public ProductCategory getCategory() {
		return category;
	}

	public void setCategory(ProductCategory category) {
		this.category = category;
	}

	public String getImageUrl() {
		return imageUrl;
	}

	public void setImageUrl(String imageUrl) {
		this.imageUrl = imageUrl;
	}

	public User getSeller() {
		return seller;
	}

	public void setSeller(User seller) {
		this.seller = seller;
	}



	public String getOrganicCertification() {
		return organicCertification;
	}

	public void setOrganicCertification(String organicCertification) {
		this.organicCertification = organicCertification;
	}

	public Date getHarvestDate() {
		return harvestDate;
	}

	public void setHarvestDate(Date harvestDate) {
		this.harvestDate = harvestDate;
	}

	public String getOrigin() {
		return origin;
	}

	public void setOrigin(String origin) {
		this.origin = origin;
	}

	@Override
	public String toString() {
		return "Product [id=" + id + ", name=" + name + ", description=" + description + ", price=" + price
				+ ", stockQuantity=" + stockQuantity + ", isOrganic=" + isOrganic + ", category=" + category
				+ ", imageUrl=" + imageUrl + ", seller=" + seller + ", organicCertification=" + organicCertification + ", harvestDate=" + harvestDate + ", origin="
				+ origin + "]";
	}
	 
	 
	
	
	
    public void reduceStock(int quantity) {
        if (quantity > this.stockQuantity) {
            throw new IllegalArgumentException("Not enough stock available for product: " + this.name);
        }
        this.stockQuantity -= quantity;
    }
	 
	 
}
