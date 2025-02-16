package com.marian.Project.Service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.marian.Project.Model.ContactMessage;
import com.marian.Project.Repository.ContactMessageRepository;

@Service
public class ContactMessageService {

private final ContactMessageRepository contactMessageRepository;
    
    @Autowired
    public ContactMessageService(ContactMessageRepository contactMessageRepository) {
        this.contactMessageRepository = contactMessageRepository;
    }
    
    public ContactMessage saveContactMessage(ContactMessage contactMessage) {
        return contactMessageRepository.save(contactMessage);
    }
}
