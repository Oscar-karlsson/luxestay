import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Background Colors
        primary: "var(--primary-color)",        // Primary background
        navbar: "var(--navbar-color)",          // Navbar color
        accent: "var(--accent-color)",          // Accent color
        card: "var(--card-color)",              // Card background

        // Text Colors
        primaryText: "var(--primary-text-color)",  // Primary text
        secondaryText: "var(--secondary-text-color)", // Secondary text
        link: "var(--link-color)",                // Link color
        linkHover: "var(--link-hover-color)",     // Link hover color

        // Button Colors
        primaryButton: "var(--primary-button-color)", // Primary button
        primaryButtonHover: "var(--primary-button-hover)", // Primary button hover
        secondaryButton: "var(--secondary-button-color)", // Secondary button
        secondaryButtonHover: "var(--secondary-button-hover)", // Secondary button hover
        primaryButtonText: "var(--primary-button-text-color)", // Text on primary button
        secondaryButtonText: "var(--secondary-button-text-color)", // Text on secondary button

        // UI Elements
        icon: "var(--icon-color)",               // Icon color
        iconHover: "var(--icon-hover-color)",     // Icon hover color
        border: "var(--border-color)",            // Border color
        divider: "var(--divider-color)",          // Divider color
        success: "var(--success-color)",          // Success color
        error: "var(--error-color)",              // Error color
        disabled: "var(--disabled-color)",        // Disabled color

        // Input Colors
        inputBackground: "var(--input-background)", // Input background
        inputBorder: "var(--input-border)",        // Input border
        inputFocus: "var(--input-focus)",          // Input focus color

        // Favorite Colors
        favoriteOutline: "var(--favorite-outline)", // Outline color
        favoriteActive: "var(--favorite-active)",   // Active favorite color
        favoriteInactive: "var(--favorite-inactive)", // Inactive favorite color
      },
      fontFamily: {
        sans: ['Open Sans', 'sans-serif'], // Default sans font
        serif: ['Playfair Display', 'serif'], // Default serif font
      },
      fontSize: {
        // Font sizes defined earlier
        'h1-mobile': 'var(--font-size-h1-mobile)',
        'h1-desktop': 'var(--font-size-h1-desktop)',
        'h2-mobile': 'var(--font-size-h2-mobile)',
        'h2-desktop': 'var(--font-size-h2-desktop)',
        'h3-mobile': 'var(--font-size-h3-mobile)',
        'h3-desktop': 'var(--font-size-h3-desktop)',
        'h4-mobile': 'var(--font-size-h4-mobile)',
        'h4-desktop': 'var(--font-size-h4-desktop)',
        'h5-mobile': 'var(--font-size-h5-mobile)',
        'h5-desktop': 'var(--font-size-h5-desktop)',
        'b1-mobile': 'var(--font-size-b1-mobile)',
        'b1-desktop': 'var(--font-size-b1-desktop)',
        'b2-mobile': 'var(--font-size-b2-mobile)',
        'b2-desktop': 'var(--font-size-b2-desktop)',
        'b3-mobile': 'var(--font-size-b3-mobile)',
        'b3-desktop': 'var(--font-size-b3-desktop)',
        'b4-mobile': 'var(--font-size-b4-mobile)',
        'b4-desktop': 'var(--font-size-b4-desktop)',
      },
      fontWeight: {  // Add this section for font weights
        'semi-bold': "600",    // Semi Bold
        'regular': "400",      // Regular
        'medium': "500",       // Medium
      },
      boxShadow: {
        'top': '0 -4px 6px -1px rgba(0, 0, 0, 0.1), 0 -2px 4px -1px rgba(0, 0, 0, 0.06)',
        'bottom': '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
      },
    },
  },
  plugins: [],
};
export default config;
