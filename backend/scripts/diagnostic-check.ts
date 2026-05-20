import axios from 'axios';

async function diagnosticCheck() {
    try {
        console.log('🔍 DIAGNOSTIC CHECK: Fetching product details from API\n');
        
        // Use the test product ID we just created
        const productId = '69a3da1851e838f24d580c44';
        const apiUrl = `http://localhost:3000/api/products/${productId}`;
        
        console.log(`📡 Fetching from: ${apiUrl}\n`);
        
        const response = await axios.get(apiUrl);
        const product = response.data.data;
        
        console.log('✅ API RESPONSE RECEIVED\n');
        console.log('='.repeat(80));
        console.log('BASIC FIELDS:');
        console.log('='.repeat(80));
        console.log(`✓ Name: ${product.name}`);
        console.log(`✓ Description (chars): ${product.description?.length || 0}`);
        console.log(`✓ Price: ${product.price}`);
        console.log(`✓ Stock: ${product.stock}`);
        
        console.log('\n' + '='.repeat(80));
        console.log('EXTENDED FIELDS:');
        console.log('='.repeat(80));
        
        // Check each extended field
        const extendedFields = [
            'fullDescription',
            'features',
            'specifications',
            'material',
            'dimensions',
            'warranty',
            'returnPolicy',
            'additionalAttributes'
        ];
        
        let missingFields: string[] = [];
        let presentFields: string[] = [];
        
        extendedFields.forEach((field: string) => {
            if (product[field] !== undefined && product[field] !== null) {
                presentFields.push(field);
                console.log(`✅ ${field}:`);
                
                if (typeof product[field] === 'object') {
                    if (Array.isArray(product[field])) {
                        console.log(`   └─ Array with ${product[field].length} items`);
                        console.log(`   └─ Items: ${JSON.stringify(product[field]).substring(0, 100)}...`);
                    } else {
                        console.log(`   └─ Object with keys: ${Object.keys(product[field]).join(', ')}`);
                        console.log(`   └─ Data: ${JSON.stringify(product[field]).substring(0, 100)}...`);
                    }
                } else if (typeof product[field] === 'string') {
                    console.log(`   └─ String (${product[field].length} chars): ${product[field].substring(0, 80)}...`);
                } else {
                    console.log(`   └─ ${typeof product[field]}: ${product[field]}`);
                }
            } else {
                missingFields.push(field);
                console.log(`❌ ${field}: NOT FOUND`);
            }
        });
        
        console.log('\n' + '='.repeat(80));
        console.log('SUMMARY:');
        console.log('='.repeat(80));
        console.log(`✅ Present fields: ${presentFields.length}`);
        presentFields.forEach(f => console.log(`   ✓ ${f}`));
        
        if (missingFields.length > 0) {
            console.log(`\n❌ Missing fields: ${missingFields.length}`);
            missingFields.forEach(f => console.log(`   ✗ ${f}`));
        }
        
        console.log('\n' + '='.repeat(80));
        console.log('COMPLETE API RESPONSE:');
        console.log('='.repeat(80));
        console.log(JSON.stringify(product, null, 2));
        
    } catch (error: any) {
        console.error('❌ Error fetching from API:', error.message);
        if (error.response) {
            console.error('Status:', error.response.status);
            console.error('Data:', error.response.data);
        }
    }
}

diagnosticCheck();
