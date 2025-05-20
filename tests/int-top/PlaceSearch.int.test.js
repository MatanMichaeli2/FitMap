// tests/int-top/PlaceSearch.int.test.js
import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import PlaceSearch from '../../map/PlaceSearch';

/* ------------------------------------------------------------------
   Mock Google Maps Places Autocomplete  (Top-Down stub)
-------------------------------------------------------------------*/
const clearInstanceListeners = jest.fn();

class MockAutocomplete {
  constructor(inputEl, opts) {
    this.inputEl = inputEl;
    this.opts = opts;
    // נייצר מקום דמה עם קואורדינטות
    this._place = {
      name: 'פארק נחל',
      geometry: { location: { lat: () => 31.252, lng: () => 34.792 } },
    };
    // שומר את ה־listener שהקומפוננטה מוסיפה
    this._listener = null;
  }
  addListener(event, cb) {
    if (event === 'place_changed') this._listener = cb;
  }
  getPlace() {
    return this._place;
  }
  /** utility לחשוף ל-טסט */
  __triggerPlaceChanged() {
    this._listener && this._listener();
  }
}

beforeAll(() => {
  // מוסיפים window.google mock
  global.google = {
    maps: {
      places: { Autocomplete: MockAutocomplete },
      event: { clearInstanceListeners },
    },
  };
});

afterEach(() => jest.clearAllMocks());

afterAll(() => {
  // מנקים כדי לא להשפיע על טסטים אחרים
  delete global.google;
});

/* ------------------------------------------------------------------
   Integration tests
-------------------------------------------------------------------*/
describe('PlaceSearch – Top-Down Integration', () => {
  test('renders search input and hides loader once Autocomplete loads', () => {
    render(<PlaceSearch onPlaceSelected={jest.fn()} />);

    // אינפוט קיים
    const input = screen.getByPlaceholderText('חפש מתקן לפי שם או כתובת');
    expect(input).toBeInTheDocument();

    // ה-loader כבר לא אמור להופיע אחרי שה-Autocomplete נטען (isLoaded=true)
    expect(screen.queryByText('טוען...')).not.toBeInTheDocument();
  });

});
