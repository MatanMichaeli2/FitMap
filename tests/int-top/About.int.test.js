// src/components/tests/int-top/About.int.test.js
import React from 'react';
import { render, screen } from '@testing-library/react';
import { BrowserRouter, MemoryRouter, Routes, Route } from 'react-router-dom';
import userEvent from '@testing-library/user-event';
import About from '../../shared/About';
import Footer from '../../shared/Footer';

// Mock the CSS Modules
jest.mock('../../../styles/About.module.css', () => ({
  container: 'container-class',
  heroSection: 'hero-section-class',
  heroContent: 'hero-content-class',
  heroSubtitle: 'hero-subtitle-class',
  missionSection: 'mission-section-class',
  sectionContent: 'section-content-class',
  sectionTitle: 'section-title-class',
  titleDecoration: 'title-decoration-class',
  missionDescription: 'mission-description-class',
  valuesSection: 'values-section-class',
  valuesGrid: 'values-grid-class',
  valueCard: 'value-card-class',
  valueIcon: 'value-icon-class',
  featuresSection: 'features-section-class',
  featuresGrid: 'features-grid-class',
  featureCard: 'feature-card-class',
  featureIcon: 'feature-icon-class',
  impactSection: 'impact-section-class',
  statsGrid: 'stats-grid-class',
  statCard: 'stat-card-class',
  statNumber: 'stat-number-class',
  teamSection: 'team-section-class',
  teamDescription: 'team-description-class',
  contactSection: 'contact-section-class',
  contactInfo: 'contact-info-class',
  contactButtons: 'contact-buttons-class',
  primaryButton: 'primary-button-class',
  secondaryButton: 'secondary-button-class',
}));

// Mock the Footer CSS module (since we'll be testing integration with Footer)
jest.mock('../../../styles/Footer.module.css', () => ({
  footer: 'footer-class',
  container: 'container-class',
  footerSection: 'footer-section-class',
  socialLinks: 'social-links-class',
  socialIcon: 'social-icon-class',
  footerLinks: 'footer-links-class',
  addressIcon: 'address-icon-class',
  footerBottom: 'footer-bottom-class',
  copyright: 'copyright-class',
  legalLinks: 'legal-links-class',
}));

// Mock react-icons to avoid SVG rendering issues in tests
jest.mock('react-icons/fa', () => ({
  FaMapMarkerAlt: () => <div data-testid="icon-map-marker">MapMarker</div>,
  FaUsers: () => <div data-testid="icon-users">Users</div>,
  FaDumbbell: () => <div data-testid="icon-dumbbell">Dumbbell</div>,
  FaStar: () => <div data-testid="icon-star">Star</div>,
  FaHeartbeat: () => <div data-testid="icon-heartbeat">Heartbeat</div>,
  FaStreetView: () => <div data-testid="icon-street-view">StreetView</div>,
  FaHandsHelping: () => <div data-testid="icon-hands-helping">HandsHelping</div>,
  FaEnvelope: () => <div data-testid="icon-envelope">Envelope</div>,
  FaMapSigns: () => <div data-testid="icon-map-signs">MapSigns</div>,
  FaFacebookF: () => <div data-testid="icon-facebook">Facebook</div>,
  FaInstagram: () => <div data-testid="icon-instagram">Instagram</div>,
  FaTwitter: () => <div data-testid="icon-twitter">Twitter</div>,
  FaPhone: () => <div data-testid="icon-phone">Phone</div>,
}));

describe('About Integration Tests', () => {
  // Helper function to render components with BrowserRouter
  const renderWithBrowserRouter = (ui) => {
    return render(
      <BrowserRouter>
        {ui}
      </BrowserRouter>
    );
  };

  test('renders all main sections of the About page', () => {
    renderWithBrowserRouter(<About />);
    
    // Check for main section headings
    expect(screen.getByText('אודות מתקני כושר עירוניים')).toBeInTheDocument();
    expect(screen.getByText('החזון שלנו')).toBeInTheDocument();
    expect(screen.getByText('העקרונות המנחים אותנו')).toBeInTheDocument();
    expect(screen.getByText('הכלים שאנחנו מציעים')).toBeInTheDocument();
    expect(screen.getByText('ההשפעה שלנו')).toBeInTheDocument();
    expect(screen.getByText('הצוות שלנו')).toBeInTheDocument();
    expect(screen.getByText('דברו איתנו')).toBeInTheDocument();
  });

  test('features section displays all feature cards with correct content', () => {
    renderWithBrowserRouter(<About />);
    
    // Check feature titles
    const expectedFeatures = [
      'מפה אינטראקטיבית',
      'קהילה פעילה',
      'מדריכי אימון',
      'התאמה אישית',
      'הוספת מתקנים'
    ];
    
    expectedFeatures.forEach(featureTitle => {
      expect(screen.getByText(featureTitle)).toBeInTheDocument();
    });
    
    // Verify icons are present
    expect(screen.getByTestId('icon-map-marker')).toBeInTheDocument();
    expect(screen.getByTestId('icon-users')).toBeInTheDocument();
    expect(screen.getByTestId('icon-dumbbell')).toBeInTheDocument();
    expect(screen.getByTestId('icon-star')).toBeInTheDocument();
    expect(screen.getByTestId('icon-map-signs')).toBeInTheDocument();
  });

  test('values section displays all value cards with correct content', () => {
    renderWithBrowserRouter(<About />);
    
    // Check value titles
    const expectedValues = [
      'נגישות לכל',
      'קהילתיות',
      'שיתוף ידע'
    ];
    
    expectedValues.forEach(valueTitle => {
      expect(screen.getByText(valueTitle)).toBeInTheDocument();
    });
    
    // Verify icons are present
    expect(screen.getByTestId('icon-heartbeat')).toBeInTheDocument();
    expect(screen.getByTestId('icon-street-view')).toBeInTheDocument();
    expect(screen.getByTestId('icon-hands-helping')).toBeInTheDocument();
  });

  test('impact section displays statistics', () => {
    renderWithBrowserRouter(<About />);
    
    // Check stats
    expect(screen.getByText('2,800+')).toBeInTheDocument();
    expect(screen.getByText('מתקני כושר מופו')).toBeInTheDocument();
    expect(screen.getByText('X')).toBeInTheDocument();
    expect(screen.getByText('יישובים בפריסה ארצית')).toBeInTheDocument();
  });

  test('contact section has working links', async () => {
    const user = userEvent.setup();
    
    render(
      <MemoryRouter initialEntries={['/about']}>
        <Routes>
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<div>Contact Page</div>} />
          <Route path="/contribute" element={<div>Contribute Page</div>} />
        </Routes>
      </MemoryRouter>
    );
    
    // Find the contact button and click it
    const contactButton = screen.getByRole('link', { name: /צרו קשר/i });
    expect(contactButton).toHaveAttribute('href', '/contact');
    await user.click(contactButton);
    
  });


  test('integration with navbar navigation', async () => {
    const user = userEvent.setup();
    
    // Create a simple Navbar component for testing
    const Navbar = () => (
      <nav>
        <ul>
          <li><a href="/">בית</a></li>
          <li><a href="/fitness-map">מפת מתקנים</a></li>
          <li><a href="/about">אודות</a></li>
          <li><a href="/contact">צור קשר</a></li>
        </ul>
      </nav>
    );
    
    render(
      <MemoryRouter initialEntries={['/']}>
        <Routes>
          <Route path="/" element={
            <>
              <Navbar />
              <div>Home Page</div>
            </>
          } />
          <Route path="/about" element={
            <>
              <Navbar />
              <About />
            </>
          } />
          <Route path="/fitness-map" element={<div>Fitness Map Page</div>} />
          <Route path="/contact" element={<div>Contact Page</div>} />
        </Routes>
      </MemoryRouter>
    );
    
    // Verify we're on the home page
    expect(screen.getByText('Home Page')).toBeInTheDocument();
    
    // Navigate to About page
    const aboutLink = screen.getByRole('link', { name: 'אודות' });
    await user.click(aboutLink);
    
  });

  test('layout responsiveness integration', () => {
    // This would normally test how the About page renders at different screen sizes
    // and how it interacts with responsive layout containers
    
    // Create a layout wrapper component
    const ResponsiveLayout = ({ children }) => (
      <div data-testid="responsive-layout">
        <div data-testid="sidebar">Sidebar</div>
        <main data-testid="main-content">{children}</main>
      </div>
    );
    
    renderWithBrowserRouter(
      <ResponsiveLayout>
        <About />
      </ResponsiveLayout>
    );
    
    // Verify the layout structure
    expect(screen.getByTestId('responsive-layout')).toBeInTheDocument();
    expect(screen.getByTestId('sidebar')).toBeInTheDocument();
    expect(screen.getByTestId('main-content')).toBeInTheDocument();
    
    // Verify About content is rendered within the layout
    expect(screen.getByText('אודות מתקני כושר עירוניים')).toBeInTheDocument();
  });
    });

