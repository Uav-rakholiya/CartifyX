import PDFDocument from 'pdfkit';
import axios from 'axios';
import fs from 'fs';

// Helper interface for order with populated fields
interface PopulatedOrder {
    _id: any;
    createdAt: any;
    user: {
        name: string;
        email: string;
    } | any; // allow any for flexibility if population fails or is partial
    items: Array<{
        name: string;
        price: number;
        quantity: number;
        image?: string;
    }>;
    shippingAddress: {
        address: string;
        city: string;
        postalCode: string;
        country: string;
    };
    totalPrice?: number;
    taxPrice?: number;
    itemsPrice?: number;
    shippingPrice?: number;
}

export const generateInvoicePDF = async (order: any, stream: any) => {
    const doc = new PDFDocument({ margin: 50, size: 'A4' });

    doc.pipe(stream);

    // --- Helper Functions ---
    const fetchImage = async (src: string) => {
        try {
            if (src && src.startsWith('http')) {
                const response = await axios.get(src, { responseType: 'arraybuffer' });
                return response.data;
            }
            return null;
        } catch (error) {
            console.error(`Failed to fetch image: ${src}`, error);
            return null;
        }
    };

    const generateHr = (y: number) => {
        doc.strokeColor('#555555').lineWidth(1).moveTo(50, y).lineTo(550, y).stroke();
    };

    const formatCurrency = (amount: number) => {
        return 'Rs. ' + (amount || 0).toFixed(2);
    };

    // --- Layout Constants ---
    const pageWidth = 595.28; // A4 Width
    const pageHeight = 841.89; // A4 Height
    const backgroundColor = '#000000'; // Black Background
    const textColor = '#FFFFFF'; // White Text
    const accentColor = '#FFD700'; // Gold Accent
    const secondaryColor = '#AAAAAA'; // Light Gray

    // --- Background ---
    doc.rect(0, 0, pageWidth, pageHeight).fill(backgroundColor);

    // --- Header ---
    doc.fillColor(accentColor).fontSize(24).font('Helvetica-Bold').text('CartifyX', 50, 50);

    doc.fillColor(textColor).fontSize(10).font('Helvetica')
        .text('CartifyX Inc.', 200, 50, { align: 'right' })
        .fillColor(secondaryColor).text('123 E-commerce St', 200, 65, { align: 'right' })
        .text('Tech City, TC 98765', 200, 80, { align: 'right' })
        .moveDown();

    generateHr(100);

    // --- Customer & Order Details ---
    const customerInformationTop = 115;

    const orderDate = order.createdAt ? new Date(order.createdAt).toLocaleDateString() : new Date().toLocaleDateString();

    // Handle populated user safely
    let userName = 'Valued Customer';
    if (order.user) {
        if (typeof order.user === 'object' && order.user.name) {
            userName = order.user.name;
        } else if (typeof order.user === 'string') {
            // If not populated, maybe just use ID if nothing else
            // or keep 'Valued Customer'
        }
    }

    doc.fillColor(textColor).fontSize(10)
        .text('Invoice Number:', 50, customerInformationTop)
        .fillColor(accentColor).font('Helvetica-Bold').text(order._id ? order._id.toString() : 'N/A', 150, customerInformationTop)

        .fillColor(textColor).font('Helvetica').text('Invoice Date:', 50, customerInformationTop + 15)
        .text(orderDate, 150, customerInformationTop + 15)

        .text('Balance Due:', 50, customerInformationTop + 30)
        .fillColor(accentColor).text(formatCurrency(0), 150, customerInformationTop + 30); // Assuming Paid

    // Customer Details
    doc.fillColor(textColor).font('Helvetica-Bold').text(userName, 300, customerInformationTop);

    if (order.shippingAddress) {
        doc.font('Helvetica').text(order.shippingAddress.address || '', 300, customerInformationTop + 15)
            .text(`${order.shippingAddress.city || ''}, ${order.shippingAddress.postalCode || ''}`, 300, customerInformationTop + 30)
            .text(order.shippingAddress.country || '', 300, customerInformationTop + 45);
    }

    doc.moveDown();

    generateHr(170);

    // --- Table Header ---
    const invoiceTableTop = 200;
    const col1 = 50;  // Image
    const col2 = 100; // Description
    const col3 = 300; // Unit Cost
    const col4 = 400; // Qty
    const col5 = 450; // Total

    // Header Row Background
    doc.rect(col1, invoiceTableTop - 5, 500, 25).fill('#333333');

    doc.fillColor(accentColor).font('Helvetica-Bold')
        .text('Item', col1 + 5, invoiceTableTop)
        .text('Description', col2, invoiceTableTop)
        .text('Unit Cost', col3, invoiceTableTop, { width: 90, align: 'right' })
        .text('Qty', col4, invoiceTableTop, { width: 40, align: 'right' })
        .text('Total', col5, invoiceTableTop, { width: 90, align: 'right' });

    doc.font('Helvetica');

    // --- Items ---
    let position = invoiceTableTop + 30; // 30px down for first row
    let subtotal = 0;

    // Handle different item structures just in case
    const items = order.items || order.orderItems || [];

    if (items && Array.isArray(items)) {
        for (let i = 0; i < items.length; i++) {
            const item = items[i];
            const rowHeight = 60; // Taller for images

            // Check for page break
            // basic check, if close to bottom
            if (position > 700) {
                doc.addPage();
                // Re-draw background
                doc.rect(0, 0, pageWidth, pageHeight).fill(backgroundColor);
                // Reset position
                position = 50;
            }

            // Striped rows (Darker Gray) for better readability
            if (i % 2 === 0) {
                doc.rect(col1, position - 5, 500, rowHeight).fill('#1A1A1A');
            }

            // Image Fetching
            if (item.image) {
                const imgBuffer = await fetchImage(item.image);
                if (imgBuffer) {
                    try {
                        // Fit image in 40x40 box
                        doc.image(imgBuffer, col1 + 5, position, { width: 40, height: 40, fit: [40, 40], align: 'center', valign: 'center' });
                    } catch (e) {
                        // ignore image error
                    }
                }
            }

            const price = typeof item.price === 'number' ? item.price : 0;
            const quantity = typeof item.quantity === 'number' ? item.quantity : 1;
            const lineTotal = price * quantity;
            subtotal += lineTotal;

            // Item Name
            doc.fillColor(textColor).fontSize(10)
                .text(item.name || 'Unknown Item', col2, position + 15, { width: 180, height: 40, ellipsis: true });

            // Unit Price
            doc.text(formatCurrency(price), col3, position + 15, { width: 90, align: 'right' });

            // Quantity
            doc.text(quantity.toString(), col4, position + 15, { width: 40, align: 'right' });

            // Line Total
            doc.fillColor(accentColor).font('Helvetica-Bold')
                .text(formatCurrency(lineTotal), col5, position + 15, { width: 90, align: 'right' });

            doc.font('Helvetica'); // Reset font

            position += rowHeight;
        }
    }

    generateHr(position + 10);

    // --- Summary ---
    const subtotalPosition = position + 30;

    // Use order values if available, else calculated
    const finalSubtotal = order.itemsPrice !== undefined ? order.itemsPrice : subtotal;
    const finalTax = order.taxPrice !== undefined ? order.taxPrice : (finalSubtotal * 0.05); // Default 5% if missing
    const finalTotal = order.totalPrice !== undefined ? order.totalPrice : (finalSubtotal + finalTax);

    doc.fillColor(textColor).font('Helvetica-Bold');
    doc.text('Subtotal', 350, subtotalPosition, { width: 90, align: 'right' });
    doc.text(formatCurrency(finalSubtotal), 450, subtotalPosition, { width: 90, align: 'right' });

    doc.text('Tax', 350, subtotalPosition + 20, { width: 90, align: 'right' });
    doc.text(formatCurrency(finalTax), 450, subtotalPosition + 20, { width: 90, align: 'right' });

    doc.fontSize(12).fillColor(accentColor).text('Total', 350, subtotalPosition + 40, { width: 90, align: 'right' });
    doc.text(formatCurrency(finalTotal), 450, subtotalPosition + 40, { width: 90, align: 'right' });

    // --- Footer ---
    doc.fontSize(10).font('Helvetica').fillColor(secondaryColor)
        .text('Payment is due within 15 days. Thank you for your business.', 50, 750, { align: 'center', width: 500 });

    doc.end();
};
