import { rest } from 'msw';

export const handlers = [
  rest.get('/api/contact-info', (req, res, ctx) =>
    res(
      ctx.json({
        address: 'מכללת סמי שמעון',
        phone: '0528985233',
        email: 'Fitmapinfo@gmail.com',
      })
    )
  ),
  // … handlers נוספים אם צריך
];
