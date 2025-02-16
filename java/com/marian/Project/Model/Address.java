package com.marian.Project.Model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;

@Entity
public class Address {
	
	@Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
	@Column(nullable = false)
    private String streetAddress;

    @Column(nullable = false)
    private String city;
    
    @Column(nullable = false)
    private String district;

    @Column(nullable = false)
    private String state;


    @Column(nullable = false)
    private String postalCode;

    @Column(nullable = false)
    @Enumerated(EnumType.STRING) // To store as a string in the database
    private AddressType addressType;

    @Column(nullable = false)
    private Boolean isDefault = false;

    private String landmarkDetails;

    @Column(nullable = false)
    private String phoneNumber;

    // Add any relationships if necessary, for example:
    // Many addresses can belong to one user
    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user; // Assuming there's a User entity    
	
    public Address() {
		super();
		// TODO Auto-generated constructor stub
	}

	public Address(Long id, String streetAddress, String city, String state, String district, String postalCode,
			AddressType addressType, Boolean isDefault, String landmarkDetails, String phoneNumber, User user) {
		super();
		this.id = id;
		this.streetAddress = streetAddress;
		this.city = city;
		this.state = state;
		this.district = district;
		this.postalCode = postalCode;
		this.addressType = addressType;
		this.isDefault = isDefault;
		this.landmarkDetails = landmarkDetails;
		this.phoneNumber = phoneNumber;
		this.user = user;
	}

	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public String getStreetAddress() {
		return streetAddress;
	}

	public void setStreetAddress(String streetAddress) {
		this.streetAddress = streetAddress;
	}

	public String getCity() {
		return city;
	}

	public void setCity(String city) {
		this.city = city;
	}

	public String getDistrict() {
		return district;
	}

	public void setDistrict(String district) {
		this.district = district;
	}
	
	public String getState() {
		return state;
	}

	public void setState(String state) {
		this.state = state;
	}

	public String getPostalCode() {
		return postalCode;
	}

	public void setPostalCode(String postalCode) {
		this.postalCode = postalCode;
	}

	public AddressType getAddressType() {
		return addressType;
	}

	public void setAddressType(AddressType addressType) {
		this.addressType = addressType;
	}

	public Boolean getIsDefault() {
        return isDefault;
    }

    public void setIsDefault(Boolean isDefault) { 
        this.isDefault = isDefault;
    }

	public String getLandmarkDetails() {
		return landmarkDetails;
	}

	public void setLandmarkDetails(String landmarkDetails) {
		this.landmarkDetails = landmarkDetails;
	}

	public String getPhoneNumber() {
		return phoneNumber;
	}

	public void setPhoneNumber(String phoneNumber) {
		this.phoneNumber = phoneNumber;
	}

	public User getUser() {
		return user;
	}

	public void setUser(User user) {
		this.user = user;
	}

	@Override
	public String toString() {
		return "Address [id=" + id + ", streetAddress=" + streetAddress + ", city=" + city + ", state=" + state
				+ ", district=" + district + ", postalCode=" + postalCode + ", addressType=" + addressType
				+ ", isDefault=" + isDefault + ", landmarkDetails=" + landmarkDetails + ", phoneNumber=" + phoneNumber
				+ ", user=" + user + "]";
	}

	
}
