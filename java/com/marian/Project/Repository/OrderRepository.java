package com.marian.Project.Repository;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.marian.Project.Model.OrderStatus;
import com.marian.Project.Model.ProductOrder;

@Repository
public interface OrderRepository extends JpaRepository<ProductOrder,Integer>{

	public ProductOrder findByrazorpayOrderId(String orderId);
	 ProductOrder findByOrderNumber(String orderNumber);
	 List<ProductOrder> findByUserIdOrderByCreatedAtDesc(Long userId);
	 
	 
}
