package com.marian.Project.Controller;


import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;

import com.marian.Project.Model.OrderStatus;
import com.marian.Project.Model.ProductOrder;
import com.marian.Project.Model.User;
import com.marian.Project.Service.OrderService;


@RequestMapping("/api/payment")
@RestController
@CrossOrigin(origins = "http://localhost:3000")
public class OrderController {

	@Autowired
	private OrderService service;
	
	
	
	
	 @GetMapping("/credentials")
	    public ResponseEntity<Map<String, String>> getRazorpayCredentials() {
	        return ResponseEntity.ok(service.getRazorpayCredentials());
	    }

	    @PostMapping("/create-order")
	    @ResponseBody
	    public ResponseEntity<ProductOrder> createOrder(@RequestBody ProductOrder productOrder) throws Exception {
	        ProductOrder createOrder = service.createOrder(productOrder);
	        return new ResponseEntity<>(createOrder, HttpStatus.CREATED);
	    }
	 
	
	    
	    @PostMapping("/handle-payment-callback")
	    public ResponseEntity<String> handlePaymentCallback(@RequestBody Map<String, String> respPayload) {
	        System.out.println("Received Payment Callback: " + respPayload); // Log the payload
	        try {
	            service.updateOrder(respPayload);
	            return ResponseEntity.ok("Payment processed successfully");
	        } catch (Exception e) {
	            e.printStackTrace();
	            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
	                                 .body("Payment processing failed: " + e.getMessage());
	        }
	    }

	    
	    
	    @GetMapping("/orders/user/{userId}")
	    public ResponseEntity<List<ProductOrder>> getUserOrders(@PathVariable Long userId) {
	        List<ProductOrder> orders = service.getUserOrders(userId);
	        return ResponseEntity.ok(orders);
	    }

	    @GetMapping("/orders/{orderNumber}")
	    public ResponseEntity<ProductOrder> getOrderByNumber(@PathVariable String orderNumber) {
	        try {
	            ProductOrder order = service.getOrderByNumber(orderNumber);
	            return ResponseEntity.ok(order);
	        } catch (Exception e) {
	            return ResponseEntity.notFound().build();
	        }
	    }
	    
	    
	    @GetMapping("/getorder")
	    public List<ProductOrder> getAllOrders() {
	        return service.getAllOrders();
	    }

	    
	    
	    @PutMapping("update/{orderNumber}")
	    public ResponseEntity<ProductOrder> updateOrderStatus(@PathVariable String orderNumber, @RequestBody OrderStatus status) {
	        ProductOrder updatedOrder = service.updateOrderStatus(orderNumber, status);
	        return ResponseEntity.ok(updatedOrder);
	    }

	    
	    
	    
	    @GetMapping("/track-order/{orderNumber}")
	    public ResponseEntity<ProductOrder> trackOrder(@PathVariable String orderNumber) {
	        try {
	            ProductOrder order = service.getOrderTrackingInfo(orderNumber);
	            return ResponseEntity.ok(order);
	        } catch (Exception e) {
	            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
	        }
	    }

	    
}
