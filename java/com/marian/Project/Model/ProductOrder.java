package com.marian.Project.Model;

import java.time.LocalDate;
import java.time.LocalDateTime;

import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.PrePersist;
import jakarta.persistence.PreUpdate;
import jakarta.persistence.Transient;

@Entity
public class ProductOrder {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Integer orderId;
	
    private String orderNumber;
	private String name;
	private String phone;
	private Integer amount;
	private String razorpayOrderId;
	private String razorpayPaymentId;
	
    
    @Enumerated(EnumType.STRING)
    private OrderStatus orderStatus;
	
	@ManyToOne
    @JoinColumn(name = "user_id")  // Foreign key column name in the product_order table
    private User user; 
	
	 private LocalDateTime createdAt;
	    private LocalDateTime updatedAt;
	    
	    
	    @Transient
	    private String shippingStatus;
	    @Transient
	    private LocalDate estimatedDelivery;
	    @Transient
	    private String currentLocation;

	    
	    
	    @PrePersist
	    protected void onCreate() {
	        createdAt = LocalDateTime.now();
	        orderNumber = "ORD" + System.currentTimeMillis();
	        orderStatus = OrderStatus.CREATED;
	    }

	    @PreUpdate
	    protected void onUpdate() {
	        updatedAt = LocalDateTime.now();
	    }
	
	
	
	public ProductOrder() {
		super();
		// TODO Auto-generated constructor stub
	}

	

	public ProductOrder(Integer orderId, String orderNumber, String name, String phone, Integer amount,
			String razorpayOrderId, String razorpayPaymentId, OrderStatus orderStatus, User user,
			LocalDateTime createdAt, LocalDateTime updatedAt, String shippingStatus,
			LocalDate estimatedDelivery, String currentLocation) {
		super();
		this.orderId = orderId;
		this.orderNumber = orderNumber;
		this.name = name;
		this.phone = phone;
		this.amount = amount;
		this.razorpayOrderId = razorpayOrderId;
		this.razorpayPaymentId = razorpayPaymentId;
		this.orderStatus = orderStatus;
		this.user = user;
		this.createdAt = createdAt;
		this.updatedAt = updatedAt;
		this.shippingStatus = shippingStatus;
		this.estimatedDelivery = estimatedDelivery;
		this.currentLocation = currentLocation;
	}

	public Integer getOrderId() {
		return orderId;
	}

	public void setOrderId(Integer orderId) {
		this.orderId = orderId;
	}

	public String getOrderNumber() {
		return orderNumber;
	}

	public void setOrderNumber(String orderNumber) {
		this.orderNumber = orderNumber;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public String getPhone() {
		return phone;
	}

	public void setPhone(String phone) {
		this.phone = phone;
	}

	public Integer getAmount() {
		return amount;
	}

	public void setAmount(Integer amount) {
		this.amount = amount;
	}

	public String getRazorpayOrderId() {
		return razorpayOrderId;
	}

	public void setRazorpayOrderId(String razorpayOrderId) {
		this.razorpayOrderId = razorpayOrderId;
	}

	public String getRazorpayPaymentId() {
		return razorpayPaymentId;
	}

	public void setRazorpayPaymentId(String razorpayPaymentId) {
		this.razorpayPaymentId = razorpayPaymentId;
	}

	public OrderStatus getOrderStatus() {
		return orderStatus;
	}

	public void setOrderStatus(OrderStatus orderStatus) {
		this.orderStatus = orderStatus;
	}

	public User getUser() {
		return user;
	}

	public void setUser(User user) {
		this.user = user;
	}

	public LocalDateTime getCreatedAt() {
		return createdAt;
	}

	public void setCreatedAt(LocalDateTime createdAt) {
		this.createdAt = createdAt;
	}

	public LocalDateTime getUpdatedAt() {
		return updatedAt;
	}

	public void setUpdatedAt(LocalDateTime updatedAt) {
		this.updatedAt = updatedAt;
	}

	public String getShippingStatus() {
		return shippingStatus;
	}

	public void setShippingStatus(String shippingStatus) {
		this.shippingStatus = shippingStatus;
	}

	public LocalDate getEstimatedDelivery() {
		return estimatedDelivery;
	}

	public void setEstimatedDelivery(LocalDate estimatedDelivery) {
		this.estimatedDelivery = estimatedDelivery;
	}

	public String getCurrentLocation() {
		return currentLocation;
	}

	public void setCurrentLocation(String currentLocation) {
		this.currentLocation = currentLocation;
	}
	
	

	@Override
	public String toString() {
		return "ProductOrder [orderId=" + orderId + ", orderNumber=" + orderNumber + ", name=" + name + ", phone="
				+ phone + ", amount=" + amount + ", razorpayOrderId=" + razorpayOrderId + ", razorpayPaymentId="
				+ razorpayPaymentId + ", orderStatus=" + orderStatus + ", user=" + user + ", createdAt=" + createdAt
				+ ", updatedAt=" + updatedAt + ", shippingStatus=" + shippingStatus
				+ ", estimatedDelivery=" + estimatedDelivery + ", currentLocation=" + currentLocation + "]";
	}

	

	
}
