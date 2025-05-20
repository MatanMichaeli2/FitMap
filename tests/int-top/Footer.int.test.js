// src/components/tests/int-top/Footer.int.test.js
import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import userEvent from '@testing-library/user-event';
import Footer from '../../shared/Footer';

// Mock the CSS Module
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

// Mock global.fetch for Top-Down tests
beforeAll(() => {
  jest.spyOn(global, 'fetch').mockImplementation(() =>
    Promise.resolve({
      ok: true,
      json: () => Promise.resolve({
        address: 'מכללת סמי שמעון',
        phone: '0528985233',
        email: 'Fitmapinfo@gmail.com',
      }),
    })
  );
});
afterAll(() => {
  global.fetch.mockRestore();
});

describe('Footer Top-Down Integration Tests', () => {
  // Helper to render with router and capture URL
  const renderWithRouter = (ui, { route = '/' } = {}) => {
    render(
      <MemoryRouter initialEntries={[route]}>
        <Routes>
          <Route
            path="*"
            element={
              <>
                {ui}
                <div data-testid="location-display">{window.location.pathname}</div>
              </>
            }
          />
        </Routes>
      </MemoryRouter>
    );
  };

  test('renders all footer sections correctly', () => {
    renderWithRouter(<Footer />);

    // Main sections
    expect(screen.getByText('מתקני כושר עירוניים')).toBeInTheDocument();
    expect(screen.getByText(/אפליקציה למציאת מתקני כושר ציבוריים בקרבתך/)).toBeInTheDocument();
    expect(screen.getByText('קישורים מהירים')).toBeInTheDocument();

    // Social media links
    const socialLinks = screen.getAllByRole('link', { name: /facebook|instagram|twitter/i });
    expect(socialLinks.length).toBe(3);

    // Copyright notice
    const currentYear = new Date().getFullYear().toString();
    expect(screen.getByText(new RegExp(`${currentYear} Dray.apps. כל הזכויות שמורות.`))).toBeInTheDocument();
  });

  test('renders contact info from mock fetch', async () => {
    renderWithRouter(<Footer />);

    // Contact info should be fetched via mocked fetch
    expect(await screen.findByText('מכללת סמי שמעון')).toBeInTheDocument();
    expect(screen.getByText('0528985233')).toBeInTheDocument();
    expect(screen.getByText('Fitmapinfo@gmail.com')).toBeInTheDocument();
  });

  test('clicking footer links updates the URL', async () => {
    render(
      <MemoryRouter initialEntries={['/']}>
        <Routes>
          <Route path='/' element={<Footer />} />
          <Route path='/fitness-map' element={<div>Fitness Map Page</div>} />
          <Route path='/privacy' element={<div>Privacy Page</div>} />
        </Routes>
      </MemoryRouter>
    );

    const user = userEvent.setup();
    const mapLink = screen.getByRole('link', { name: 'מפת מתקנים' });
    await user.click(mapLink);

    expect(screen.getByText('Fitness Map Page')).toBeInTheDocument();
  });
});
