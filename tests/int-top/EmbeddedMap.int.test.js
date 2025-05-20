// tests/int-top/EmbeddedMap.int.test.js
import React from 'react';
import { render, screen } from '@testing-library/react';
import EmbeddedMap from '../../map/facility-details/EmbeddedMap';

// Mock CSS-module classes so Jest לא יתלונן
jest.mock('../../../components/EmbeddedMap/EmbeddedMap.module.css', () => ({
  embeddedMapContainer: 'embeddedMapContainer-class',
  mapPlaceholder: 'mapPlaceholder-class',
}));

describe('EmbeddedMap – Top-Down Integration', () => {
  const facilityWithCoords = {
    name: 'פארק נחל',
    latitude: 31.252,
    longitude: 34.792,
  };

  const facilityWithoutCoords = {
    name: 'מתחם ספורט',
  };

  test('shows placeholder when latitude/longitude are missing', () => {
    render(<EmbeddedMap facility={facilityWithoutCoords} />);

    // מופיע האלמנט עם טקסט השגיאה
    expect(
      screen.getByText(/לא ניתן להציג מפה - מיקום חסר/)
    ).toBeInTheDocument();

    // מחלקת ה־CSS של ה־placeholder קיימת
    const placeholderDiv = screen.getByText(/לא ניתן להציג מפה/).parentElement;
    expect(placeholderDiv).toHaveClass('mapPlaceholder-class');
  });

  test('renders iframe with correct Google-Maps URL when coords exist', () => {
    render(<EmbeddedMap facility={facilityWithCoords} />);

    // iframe קיים עם כותרת
    const iframe = screen.getByTitle('מפה של פארק נחל');
    expect(iframe).toBeInTheDocument();

    // URL משורשר נכון
    const expectedSrc = `https://maps.google.com/maps?q=${facilityWithCoords.latitude},${facilityWithCoords.longitude}&z=15&output=embed`;
    expect(iframe).toHaveAttribute('src', expectedSrc);
  });
});
