package com.marian.Project.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import com.marian.Project.Model.OrderStatus;
import com.marian.Project.Model.Product;
import com.marian.Project.Model.ProductOrder;
import com.marian.Project.Model.User;
import com.marian.Project.Repository.AdminProductRepository;
import com.marian.Project.Repository.OrderRepository;
import com.marian.Project.Repository.UserRepository;
import com.razorpay.Order;
import com.razorpay.RazorpayClient;

import io.micrometer.common.util.StringUtils;

@Service
public class OrderService {
	
	@Autowired
	private OrderRepository orderRepo;
	
	@Autowired
	private UserRepository userRepository;
	
	@Autowired
	private AdminProductRepository productRepository;
	
	
	
	@Value("${razorpay.key.id}")
	private String razorPayKey;
	
	@Value("${razorpay.secret.key}")
	private String razorPaySecret;
	
	public ProductOrder createOrder(ProductOrder orders) throws Exception {
	    try {
	    	
	    	 if (orders.getUser() == null || orders.getUser().getId() == null) {
	             throw new RuntimeException("Invalid user information");
	         }

	         User user1 = userRepository.findById(orders.getUser().getId())
	             .orElseThrow(() -> new RuntimeException("User not found"));
	    	
	         if (StringUtils.isEmpty(orders.getName())) {
	             orders.setName(user1.getUsername());
	         }
	         if (StringUtils.isEmpty(orders.getPhone())) {
	             orders.setPhone(user1.getPhone());
	         }
	         
	    	
	        RazorpayClient client = new RazorpayClient(razorPayKey, razorPaySecret);
	        
	        // Create Razorpay order request
	        JSONObject orderRequest = new JSONObject();
	        orderRequest.put("amount", orders.getAmount() * 100); // Amount in paise
	        orderRequest.put("currency", "INR");
	        orderRequest.put("receipt", "order_" + System.currentTimeMillis());
	        
	        // Create Razorpay order
	        Order razorPayOrder = client.orders.create(orderRequest);
	        
	        // Set the Razorpay order ID and status
	        orders.setRazorpayOrderId(razorPayOrder.get("id"));
            orders.setOrderStatus(OrderStatus.CREATED);

	        
	        // Fetch the user object from the database using the userId
	        User user = userRepository.findById(orders.getUser().getId())
	                                  .orElseThrow(() -> new RuntimeException("User not found"));
	        
	        orders.setUser(user); // Set the user for the order

	        // Save the order and return it
	        return orderRepo.save(orders);
	    } catch (Exception e) {
	        throw new Exception("Error creating Razorpay order", e);
	    }
	}

	public ProductOrder updateOrder(Map<String, String> responsePayload) {
	    String razorPayOrderId = responsePayload.get("razorpay_order_id");
	    String razorPayPaymentId = responsePayload.get("razorpay_payment_id");
	    
	    ProductOrder order = orderRepo.findByrazorpayOrderId(razorPayOrderId);
	    
	    if (order != null) {
	        order.setOrderStatus(OrderStatus.PAYMENT_COMPLETED);
	        order.setRazorpayPaymentId(razorPayPaymentId);
	        return orderRepo.save(order);
	    }
	    
	    throw new RuntimeException("Order not found");
	}
	
	

	
    public Map<String, String> getRazorpayCredentials() {
        return Map.of(
            "key", razorPayKey
        );
    }
    
    
    public List<ProductOrder> getUserOrders(Long userId) {
        return orderRepo.findByUserIdOrderByCreatedAtDesc(userId);
    }

    public ProductOrder getOrderByNumber(String orderNumber) {
        return orderRepo.findByOrderNumber(orderNumber);
    }

    public ProductOrder updateOrderStatus(String orderNumber, OrderStatus status) {
        ProductOrder order = orderRepo.findByOrderNumber(orderNumber);
        if (order != null) {
            order.setOrderStatus(status);
            return orderRepo.save(order);
        }
        throw new RuntimeException("Order not found");
    }
    
    
    
    
    
    public List<ProductOrder> getAllOrders() {
        return orderRepo.findAll();
    }    

    
    public ProductOrder getOrderDetailsByOrderNumber(String orderNumber) {
        return orderRepo.findByOrderNumber(orderNumber);
    }

    
    
    public ProductOrder getOrderTrackingInfo(String orderNumber) {
        ProductOrder order = orderRepo.findByOrderNumber(orderNumber);
        if (order == null) {
            throw new RuntimeException("Order not found with order number: " + orderNumber);
        }

        // Dynamically compute the tracking info
        order.setShippingStatus(getShippingStatus(order.getOrderStatus()));
        order.setEstimatedDelivery(getEstimatedDelivery(order.getOrderStatus()));
        order.setCurrentLocation(getCurrentLocation(order.getOrderStatus()));

        return order;
    }

    private String getShippingStatus(OrderStatus status) {
        switch (status) {
            case CREATED:
                return "Order Created";
            case PAYMENT_PENDING:
                return "Payment Pending";
            case PAYMENT_COMPLETED:
                return "Payment Completed";
            case PROCESSING:
                return "Being Processed";
            case SHIPPED:
                return "Shipped";
            case DELIVERED:
                return "Delivered";
            case CANCELLED:
                return "Cancelled";
            default:
                return "Unknown Status";
        }
    }

    private LocalDate getEstimatedDelivery(OrderStatus status) {
        switch (status) {
            case CREATED:
            case PAYMENT_PENDING:
                return LocalDate.now().plusDays(7);  
            case PAYMENT_COMPLETED:
            case PROCESSING:
                return LocalDate.now().plusDays(5); 
            case SHIPPED:
                return LocalDate.now().plusDays(2);  
            case DELIVERED:
                return LocalDate.now();  
            case CANCELLED:
                return null;  
            default:
                return null;
        }
    }

    private String getCurrentLocation(OrderStatus status) {
        switch (status) {
            case CREATED:
                return "Warehouse";
            case PAYMENT_PENDING:
                return "Pending Payment";
            case PAYMENT_COMPLETED:
                return "Processing Center";
            case PROCESSING:
                return "Processing";
            case SHIPPED:
                return "In Transit";
            case DELIVERED:
                return "Delivered";
            case CANCELLED:
                return "Cancelled";
            default:
                return "Unknown Location";
        }
    }
}
