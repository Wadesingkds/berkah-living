# LocalHub Brand Implementation Guide

## Overview

This guide provides step-by-step instructions for implementing the LocalHub brand identity across all digital and print touchpoints.

## Part 1: Web Implementation

### 1.1 CSS Variables Setup

Add to your global CSS or Tailwind config:

```css
:root {
  /* Primary Colors */
  --color-primary: #C0633E;
  --color-primary-dark: #A84D2E;
  --color-primary-light: #D4754F;
  
  /* Secondary Colors */
  --color-secondary: #D4A041;
  --color-secondary-dark: #B88A35;
  --color-secondary-light: #DEB456;
  
  /* Accent Colors */
  --color-accent: #5C7C58;
  --color-accent-light: #7A9A76;
  
  /* Neutral Colors */
  --color-dark: #2D3748;
  --color-gray: #718096;
  --color-light: #E2E8F0;
  --color-cream: #F4E4BC;
  --color-white: #FFFFFF;
  
  /* Typography */
  --font-primary: 'Plus Jakarta Sans', system-ui, -apple-system, sans-serif;
  
  /* Spacing */
  --spacing-xs: 4px;
  --spacing-sm: 8px;
  --spacing-md: 16px;
  --spacing-lg: 24px;
  --spacing-xl: 32px;
  
  /* Border Radius */
  --radius-sm: 4px;
  --radius-md: 8px;
  --radius-lg: 12px;
  --radius-xl: 16px;
  --radius-full: 9999px;
  
  /* Shadows */
  --shadow-sm: 0 2px 8px rgba(0, 0, 0, 0.08);
  --shadow-md: 0 4px 16px rgba(0, 0, 0, 0.12);
  --shadow-lg: 0 8px 24px rgba(0, 0, 0, 0.16);
}
```

### 1.2 Tailwind Configuration

```javascript
// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#F9F3F0',
          100: '#F3E7E1',
          200: '#E7CFC3',
          300: '#DBB7A5',
          400: '#CF9F87',
          500: '#C0633E',
          600: '#A84D2E',
          700: '#90371E',
          800: '#78210E',
          900: '#600B00',
        },
        secondary: {
          50: '#FBF8F2',
          100: '#F7F1E5',
          200: '#EFE3CB',
          300: '#E7D5B1',
          400: '#DFC797',
          500: '#D4A041',
          600: '#BC8A31',
          700: '#A47421',
          800: '#8C5E11',
          900: '#744801',
        },
        accent: {
          50: '#F3F5F1',
          100: '#E7EBE3',
          200: '#CFD7C7',
          300: '#B7C3AB',
          400: '#9FAF8F',
          500: '#5C7C58',
          600: '#4A6446',
          700: '#384C34',
          800: '#263422',
          900: '#141C10',
        },
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'system-ui', '-apple-system', 'sans-serif'],
      },
      borderRadius: {
        sm: '4px',
        md: '8px',
        lg: '12px',
        xl: '16px',
      },
      boxShadow: {
        sm: '0 2px 8px rgba(0, 0, 0, 0.08)',
        md: '0 4px 16px rgba(0, 0, 0, 0.12)',
        lg: '0 8px 24px rgba(0, 0, 0, 0.16)',
      },
    },
  },
};
```

### 1.3 Font Import

Add to your HTML head or CSS:

```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap" rel="stylesheet">
```

## Part 2: Component Styling

### 2.1 Button Component

```jsx
// Button.jsx
export function Button({ variant = 'primary', size = 'md', children, ...props }) {
  const baseStyles = 'font-semibold rounded-lg transition-colors duration-200';
  
  const variants = {
    primary: 'bg-primary-500 text-white hover:bg-primary-600',
    secondary: 'bg-secondary-500 text-white hover:bg-secondary-600',
    outline: 'border-2 border-primary-500 text-primary-500 hover:bg-primary-50',
    ghost: 'text-primary-500 hover:bg-primary-50',
  };
  
  const sizes = {
    sm: 'px-3 py-2 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg',
  };
  
  return (
    <button className={`${baseStyles} ${variants[variant]} ${sizes[size]}`} {...props}>
      {children}
    </button>
  );
}
```

### 2.2 Card Component

```jsx
// Card.jsx
export function Card({ children, className = '' }) {
  return (
    <div className={`bg-white rounded-lg shadow-sm border border-light p-6 ${className}`}>
      {children}
    </div>
  );
}
```

### 2.3 Typography Components

```jsx
// Typography.jsx
export function H1({ children }) {
  return <h1 className="text-5xl font-bold text-dark">{children}</h1>;
}

export function H2({ children }) {
  return <h2 className="text-4xl font-bold text-dark">{children}</h2>;
}

export function H3({ children }) {
  return <h3 className="text-2xl font-semibold text-dark">{children}</h3>;
}

export function Body({ children }) {
  return <p className="text-base text-gray leading-relaxed">{children}</p>;
}
```

## Part 3: Logo Implementation

### 3.1 Logo Component

```jsx
// Logo.jsx
export function Logo({ variant = 'horizontal', size = 'md' }) {
  const sizes = {
    sm: 'w-24',
    md: 'w-32',
    lg: 'w-48',
  };
  
  const logoPath = `/brand/assets/logo-${variant}.svg`;
  
  return (
    <img 
      src={logoPath} 
      alt="LocalHub" 
      className={sizes[size]}
    />
  );
}
```

### 3.2 Favicon Setup

```html
<!-- In public/index.html or next.js head -->
<link rel="icon" type="image/svg+xml" href="/brand/assets/logo-icon.svg">
<link rel="apple-touch-icon" href="/brand/assets/logo-icon.png">
```

## Part 4: Social Media Guidelines

### 4.1 Post Templates

Use `public/brand/mockups/social-media-post.svg` as template for:
- Product announcements
- UMKM spotlights
- Tips & tutorials
- Community highlights

### 4.2 Profile Setup

- **Profile Picture:** Use `logo-icon.svg` (400x400px)
- **Cover Photo:** Use website header mockup (1500x500px)
- **Bio:** "Belanja Lokal, Mudah Digital | Support UMKM Sekitar"

## Part 5: Print Materials

### 5.1 Business Cards

- **Template:** `public/brand/mockups/business-card.svg`
- **Size:** 90x55mm (standard Indonesia)
- **Paper:** Matte finish, 300gsm
- **Colors:** Full color, CMYK

### 5.2 Flyers & Brochures

- **Size:** A4 (210x297mm) or A5 (148x210mm)
- **Resolution:** 300 DPI
- **Colors:** CMYK
- **Font:** Plus Jakarta Sans (embed all fonts)

## Part 6: Email Templates

### 6.1 Email Header

```html
<table width="100%" cellpadding="0" cellspacing="0">
  <tr>
    <td align="center" style="padding: 20px;">
      <img src="https://localhub.id/brand/assets/logo-horizontal.svg" 
           alt="LocalHub" width="200" style="display: block;">
    </td>
  </tr>
</table>
```

### 6.2 Email Button

```html
<table cellpadding="0" cellspacing="0">
  <tr>
    <td style="background-color: #C0633E; border-radius: 8px; padding: 12px 24px;">
      <a href="#" style="color: #FFFFFF; text-decoration: none; font-weight: 600; 
                         font-family: 'Plus Jakarta Sans', sans-serif;">
        Mulai Belanja
      </a>
    </td>
  </tr>
</table>
```

## Part 7: App Implementation

### 7.1 App Icon

- **iOS:** 1024x1024px (will be scaled automatically)
- **Android:** 512x512px (will be scaled automatically)
- **Format:** PNG with transparency
- **File:** `public/brand/mockups/app-icon.svg`

### 7.2 Splash Screen

Use website header mockup as base for splash screen design.

---

**Next:** Review BRAND_GUIDELINES.md for complete brand standards.
