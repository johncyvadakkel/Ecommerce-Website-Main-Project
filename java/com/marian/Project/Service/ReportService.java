package com.marian.Project.Service;

import java.io.ByteArrayOutputStream;
import java.io.PrintWriter;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.marian.Project.Model.OrderStatus;
import com.marian.Project.Model.ProductOrder;
import com.marian.Project.Repository.OrderRepository;

@Service
public class ReportService {
	
    @Autowired
    private OrderRepository orderRepository;
    
    public List<ProductOrder> getAllOrders() {
        return orderRepository.findAll();
    }

    // Generate report (CSV format for now)
    public byte[] generateReport(String format) {
        List<ProductOrder> orders = getAllOrders();
        ByteArrayOutputStream outputStream = new ByteArrayOutputStream();
        PrintWriter writer = new PrintWriter(outputStream);

        // CSV Header
        writer.println("Order ID, Order Number, Name, Phone, Amount, Status, Created At");

        // Write data
        for (ProductOrder order : orders) {
            writer.println(order.getOrderId() + "," +
                    order.getOrderNumber() + "," +
                    order.getName() + "," +
                    order.getPhone() + "," +
                    order.getAmount() + "," +
                    order.getOrderStatus() + "," +
                    order.getCreatedAt());
        }

        writer.flush();
        return outputStream.toByteArray();
    }

}
