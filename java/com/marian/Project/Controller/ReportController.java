package com.marian.Project.Controller;


import com.marian.Project.Model.ProductOrder;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

import com.marian.Project.Service.ReportService;

@RequestMapping("/api/admin")
@RestController
@CrossOrigin(origins = "http://localhost:3000")
public class ReportController {

	@Autowired
    private ReportService orderReportService;
    
	@GetMapping("/orders")
    public ResponseEntity<List<ProductOrder>> getAllOrders() {
        List<ProductOrder> orders = orderReportService.getAllOrders();
        return new ResponseEntity<>(orders, HttpStatus.OK);
    }

    // Generate Report (CSV)
    @GetMapping("/download")
    public ResponseEntity<byte[]> downloadReport(@RequestParam(defaultValue = "csv") String format) {
        byte[] reportData = orderReportService.generateReport(format);

        HttpHeaders headers = new HttpHeaders();
        headers.add(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=orders_report." + format);

        return new ResponseEntity<>(reportData, headers, HttpStatus.OK);
    }
}
