import fs from 'fs';
import path from 'path';
import { generateInvoicePDF } from '../services/invoice.service';

const mockOrder = {
    _id: '65c4a7f9a1b2c3d4e5f6g7h8',
    createdAt: new Date(),
    user: {
        name: 'Test User',
        email: 'test@example.com'
    },
    shippingAddress: {
        address: '123 Test St',
        city: 'Test City',
        postalCode: '12345',
        country: 'Test Country'
    },
    items: [
        {
            name: 'Test Product 1 (Long Name to Test Wrapping capabilities of the pdf generator which was a requested feature)',
            price: 100,
            quantity: 2,
            image: 'https://via.placeholder.com/150' // Placeholder image
        },
        {
            name: 'Test Product 2',
            price: 50,
            quantity: 1
        },
        {
            name: 'Test Product 3 with very long description that might overlap if not handled correctly by the layout engine of the pdfkit library',
            price: 200,
            quantity: 1,
            image: 'https://via.placeholder.com/150'
        }
    ],
    itemsPrice: 450,
    taxPrice: 36, // 8% of 450
    shippingPrice: 0,
    totalPrice: 486,
    isPaid: true
};

const outputPath = path.join(__dirname, '../../test-invoice.pdf');
const stream = fs.createWriteStream(outputPath);

console.log('Generating test invoice...');
generateInvoicePDF(mockOrder, stream)
    .then(() => {
        console.log(`Invoice generated at: ${outputPath}`);
    })
    .catch(err => {
        console.error('Error generating invoice:', err);
    });
