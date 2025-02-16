package com.marian.Project.Model;

import java.time.LocalDateTime;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;

@Entity
@Table(name = "wishlists")
public class Wishlist {

	    @Id
	    @GeneratedValue(strategy = GenerationType.IDENTITY)
	    private Long id;

	    @ManyToOne
	    @JoinColumn(name = "user_id", nullable = false)
	    private User user;

	    @ManyToOne
	    @JoinColumn(name = "product_id", nullable = false)
	    private Product product;

	    @Column(name = "added_at")
	    private LocalDateTime addedAt;

	    // Constructors, getters, and setters
	    public Wishlist() {
	        this.addedAt = LocalDateTime.now();
	    }

		public Wishlist(Long id, User user, Product product, LocalDateTime addedAt) {
			super();
			this.id = id;
			this.user = user;
			this.product = product;
			this.addedAt = addedAt;
		}

		public Long getId() {
			return id;
		}

		public void setId(Long id) {
			this.id = id;
		}

		public User getUser() {
			return user;
		}

		public void setUser(User user) {
			this.user = user;
		}

		public Product getProduct() {
			return product;
		}

		public void setProduct(Product product) {
			this.product = product;
		}

		public LocalDateTime getAddedAt() {
			return addedAt;
		}

		public void setAddedAt(LocalDateTime addedAt) {
			this.addedAt = addedAt;
		}

		@Override
		public String toString() {
			return "Wishlist [id=" + id + ", user=" + user + ", product=" + product + ", addedAt=" + addedAt + "]";
		}
	    
	    
}
