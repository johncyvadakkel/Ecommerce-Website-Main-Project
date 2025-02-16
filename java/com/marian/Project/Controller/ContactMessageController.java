package com.marian.Project.Controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.marian.Project.Model.ContactMessage;
import com.marian.Project.Service.ContactMessageService;

@RestController
@RequestMapping("/api/admin/contact")
@CrossOrigin(origins = "http://localhost:3000")
public class ContactMessageController {

private final ContactMessageService contactMessageService;
    
    @Autowired
    public ContactMessageController(ContactMessageService contactMessageService) {
        this.contactMessageService = contactMessageService;
    }
    
    @PostMapping
    public ResponseEntity<ContactMessage> submitContactMessage(@RequestBody ContactMessage contactMessage) {
        ContactMessage savedMessage = contactMessageService.saveContactMessage(contactMessage);
        return new ResponseEntity<>(savedMessage, HttpStatus.CREATED);
    }
}
