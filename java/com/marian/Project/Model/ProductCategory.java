package com.marian.Project.Model;

public enum ProductCategory {

	 WHOLE_SPICES("Whole Spices"),
	    GROUND_SPICES("Ground Spices"),
	    EXOTIC_SPICES("Exotic Spices"),
	    BLENDED_SPICES("Blended Spices"),
	    ORGANIC_SPICES("Organic Spices"),
	    SEEDS("Seeds"),
	    HERBS("Herbs");

	    private final String displayName;

	    ProductCategory(String displayName) {
	        this.displayName = displayName;
	    }

	    public String getDisplayName() {
	        return displayName;
	    }
}
