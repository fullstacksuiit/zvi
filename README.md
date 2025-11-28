# Zain Ventures India Website

A modern, responsive static website for a Tours & Travels business offering Bus Rental, Car Rental, and Truck Rental services.

## Features

- **Responsive Design** - Works seamlessly on desktop, tablet, and mobile devices
- **Modern UI/UX** - Clean, professional design with smooth animations
- **Service Sections** - Dedicated sections for Bus, Car, and Truck rental services
- **Fleet Showcase** - Gallery displaying available vehicles
- **Contact Form** - Fully functional booking/inquiry form with validation
- **Smooth Scrolling** - Enhanced navigation with smooth scroll effects
- **Mobile Menu** - Hamburger menu for mobile devices
- **Interactive Elements** - Hover effects, animations, and scroll-triggered effects

## File Structure

```
zvi/
├── index.html          # Main HTML file
├── styles.css          # CSS styles and animations
├── script.js           # JavaScript functionality
├── images/             # Image assets folder
│   ├── hero-bg.jpg     # Hero section background
│   ├── bus.jpg         # Bus fleet image
│   ├── car.jpg         # Car fleet image
│   ├── sedan.jpg       # Sedan image
│   ├── suv.jpg         # SUV image
│   ├── minibus.jpg     # Mini bus image
│   ├── truck.jpg       # Truck image
│   ├── tempo.jpg       # Tempo traveller image
│   └── about.jpg       # About section image
└── README.md           # This file
```

## Setup Instructions

1. **Add Images**
   - Place your vehicle and background images in the `images/` folder
   - Recommended image names (you can use your own):
     - `hero-bg.jpg` - Hero section background (1920x1080px recommended)
     - `bus.jpg` - Luxury bus image
     - `sedan.jpg` - Sedan car image
     - `suv.jpg` - SUV image
     - `minibus.jpg` - Mini bus image
     - `truck.jpg` - Cargo truck image
     - `tempo.jpg` - Tempo traveller image
     - `about.jpg` - About section image

2. **Customize Content**
   - Open `index.html` and update:
     - Company name (currently "Zain Ventures India")
     - Contact information (phone, email, address)
     - Service descriptions
     - Fleet details
     - About section content

3. **Color Customization**
   - Open `styles.css` and modify the CSS variables in `:root`:
     - `--primary-color` - Main brand color (default: #ff6b35)
     - `--secondary-color` - Secondary color (default: #004e89)
     - `--dark-color` - Dark theme color (default: #1a1a2e)

4. **Launch the Website**
   - Simply open `index.html` in any modern web browser
   - Or host on any web server (Apache, Nginx, GitHub Pages, Netlify, etc.)

## Sections Overview

### 1. Hero Section
- Eye-catching landing area with call-to-action buttons
- Background image with overlay effect
- Animated scroll indicator

### 2. Services Section
- Three main service cards: Bus Rental, Car Rental, Truck Rental
- Feature lists for each service
- "Get Quote" buttons

### 3. Fleet Section
- Grid layout showcasing different vehicle types
- Hover effects with vehicle information
- Responsive image gallery

### 4. Why Choose Us
- Six feature boxes highlighting company benefits
- Icons and descriptions
- Grid layout

### 5. About Section
- Company information
- Statistics counter (animated)
- About image

### 6. Contact Section
- Contact information display
- Booking/inquiry form with validation
- Phone, email, address details

### 7. Footer
- Quick links
- Social media links
- Contact information
- Copyright notice (© 2025 Zain Ventures India)

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## Technologies Used

- **HTML5** - Semantic markup
- **CSS3** - Modern styling, Flexbox, Grid, Animations
- **JavaScript (ES6+)** - Interactive features
- **Font Awesome** - Icons (loaded via CDN)

## Customization Tips

### Changing Colors
Edit the CSS variables in `styles.css`:
```css
:root {
    --primary-color: #your-color;
    --secondary-color: #your-color;
    --dark-color: #your-color;
}
```

### Adding More Vehicles
1. Add image to `images/` folder
2. Copy a `.fleet-item` div in `index.html`
3. Update the image source and text

### Modifying Form Behavior
Edit the form submission handler in `script.js`:
```javascript
bookingForm.addEventListener('submit', (e) => {
    // Add your form handling logic
});
```

### Connecting to Backend
To connect the form to a backend service:
1. Add your API endpoint in `script.js`
2. Use `fetch()` or `XMLHttpRequest` to send form data
3. Handle response and show appropriate messages

## Deployment Options

### GitHub Pages
1. Create a GitHub repository
2. Upload all files
3. Enable GitHub Pages in repository settings

### Netlify
1. Drag and drop the folder to Netlify
2. Site will be live instantly

### Traditional Hosting
1. Upload files via FTP to your web hosting
2. Ensure files are in the public_html or www directory

## Image Sources

You can get free stock images from:
- [Unsplash](https://unsplash.com) - Search for "bus", "car", "truck"
- [Pexels](https://pexels.com) - Free vehicle photos
- [Pixabay](https://pixabay.com) - Free images

## Support & Customization

For further customization or support:
- Modify the HTML structure in `index.html`
- Adjust styling in `styles.css`
- Add features in `script.js`

## License

Free to use for personal and commercial projects.

---

**Note**: Remember to replace placeholder images and update contact information before deploying to production!
