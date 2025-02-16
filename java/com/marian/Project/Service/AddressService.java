package com.marian.Project.Service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.marian.Project.Model.Address;
import com.marian.Project.Model.User;
import com.marian.Project.Repository.AddressRepository;
import com.marian.Project.Repository.UserRepository;

import jakarta.transaction.Transactional;

@Service
public class AddressService {

	@Autowired
    private AddressRepository addressRepository;

    @Autowired
    private UserRepository userRepository;

    public List<Address> getUserAddresses(Long userId) {
        return addressRepository.findByUserId(userId);
    }

    @Transactional
    public Address addAddress(Long userId, Address address) {
        User user = userRepository.findById(userId)
            .orElseThrow(() -> new RuntimeException("User not found"));

        if (addressRepository.countByUserId(userId) == 0) {
            address.setIsDefault(true);
        }

        if (address.getIsDefault()) {
            Address existingDefault = addressRepository.findDefaultAddress(userId);
            if (existingDefault != null) {
                existingDefault.setIsDefault(false);
                addressRepository.save(existingDefault);
            }
        }

        address.setUser(user);
        return addressRepository.save(address);
    }

    @Transactional
    public Address updateAddress(Long addressId, Address addressDetails) {
        Address address = addressRepository.findById(addressId)
            .orElseThrow(() -> new RuntimeException("Address not found"));

        address.setStreetAddress(addressDetails.getStreetAddress());
        address.setCity(addressDetails.getCity());
        address.setState(addressDetails.getState());
        address.setDistrict(addressDetails.getDistrict());
        address.setPostalCode(addressDetails.getPostalCode());
        address.setAddressType(addressDetails.getAddressType());
        address.setLandmarkDetails(addressDetails.getLandmarkDetails());
        address.setPhoneNumber(addressDetails.getPhoneNumber());

        if (addressDetails.getIsDefault() && !address.getIsDefault()) {
            Address existingDefault = addressRepository.findDefaultAddress(address.getUser().getId());
            if (existingDefault != null) {
                existingDefault.setIsDefault(false);
                addressRepository.save(existingDefault);
            }
            address.setIsDefault(true);
        }

        return addressRepository.save(address);
    }
    


    public void deleteAddress(Long addressId) {
        addressRepository.deleteById(addressId);
    }

       
    public Address getDefaultAddress(Long userId) {
        Address defaultAddress = addressRepository.findDefaultAddress(userId);
        if (defaultAddress == null) {
            throw new RuntimeException("No default address found for user ID: " + userId);
        }
        return defaultAddress;
    }


        public Address saveAddress(Address address) {
            if (address.getIsDefault()) {
                // If this address is marked as default, ensure no other address is default for the user
                resetDefaultAddress(address.getUser().getId());
            }
            return addressRepository.save(address);
        }

        @Transactional
        private void resetDefaultAddress(Long userId) {
            List<Address> addresses = addressRepository.findByUserId(userId);
            for (Address addr : addresses) {
                addr.setIsDefault(false);
                addressRepository.save(addr);
            }
        }

    
}
