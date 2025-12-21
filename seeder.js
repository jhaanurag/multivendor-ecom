const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');
const Shop = require('./models/Shop');
const Product = require('./models/Product');
const Order = require('./models/Order');

dotenv.config();

const importData = async () => {
    try {
        // Clear existing data
        await Order.deleteMany();
        await Product.deleteMany();
        await Shop.deleteMany();
        await User.deleteMany();

        console.log('--- Cleaning Database ---');

        // 1. Create Users
        console.log('--- Seeding Users ---');
        const users = [
            { name: 'Admin User', email: 'admin@example.com', password: 'password123', role: 'admin' },
            { name: 'Tech Vendor', email: 'vendor1@example.com', password: 'password123', role: 'vendor' },
            { name: 'Decor Vendor', email: 'vendor2@example.com', password: 'password123', role: 'vendor' },
            { name: 'Fashion Vendor', email: 'vendor3@example.com', password: 'password123', role: 'vendor' },
            { name: 'John Doe', email: 'user@example.com', password: 'password123', role: 'user' },
            { name: 'Jane Smith', email: 'jane@example.com', password: 'password123', role: 'user' },
        ];

        const createdUsers = await User.create(users);
        const [admin, vendor1, vendor2, vendor3, customer1, customer2] = createdUsers;

        // 2. Create Shops
        console.log('--- Seeding Shops ---');
        const shops = [
            { name: 'Tech Haven', description: 'Latest gadgets and electronics', owner: vendor1._id, status: 'active' },
            { name: 'Rustic Home', description: 'Handmade home decor and furniture', owner: vendor2._id, status: 'active' },
            { name: 'Trend Boutique', description: 'Modern fashion and accessories', owner: vendor3._id, status: 'active' },
        ];

        const createdShops = await Shop.create(shops);
        const [shopTech, shopHome, shopFashion] = createdShops;

        // 3. Create Products
        console.log('--- Seeding Products ---');
        const productData = [
            // Tech Haven
            { name: 'Pro Wireless Mouse', price: 89.99, description: 'High precision wireless gaming mouse', stock: 50, shop: shopTech._id },
            { name: 'Mechanical Keyboard', price: 129.99, description: 'RGB mechanical keyboard with blue switches', stock: 30, shop: shopTech._id },
            { name: '4K UltraWide Monitor', price: 499.99, description: '34-inch curved ultrawide monitor', stock: 15, shop: shopTech._id },
            { name: 'Noise Cancelling Headphones', price: 199.99, description: 'Active noise cancellation over-ear headphones', stock: 25, shop: shopTech._id },
            { name: 'USB-C Docking Station', price: 79.99, description: '12-in-1 docking station for laptops', stock: 40, shop: shopTech._id },

            // Rustic Home
            { name: 'Ceramic Table Lamp', price: 45.00, description: 'Handcrafted ceramic lamp with linen shade', stock: 20, shop: shopHome._id },
            { name: 'Wool Throw Blanket', price: 65.00, description: 'Soft merino wool throw blanket', stock: 50, shop: shopHome._id },
            { name: 'Scented Soy Candle', price: 18.00, description: 'Lavender and eucalyptus scented candle', stock: 100, shop: shopHome._id },
            { name: 'Wall Art Trio', price: 120.00, description: 'Set of 3 abstract landscape prints', stock: 10, shop: shopHome._id },
            { name: 'Bamboo Coaster Set', price: 15.00, description: 'Set of 6 natural bamboo coasters', stock: 80, shop: shopHome._id },

            // Trend Boutique
            { name: 'Organic Cotton Tee', price: 25.00, description: 'Premium soft organic cotton t-shirt', stock: 200, shop: shopFashion._id },
            { name: 'Denim Jacket', price: 85.00, description: 'Classic blue denim jacket', stock: 40, shop: shopFashion._id },
            { name: 'Leather Crossbody Bag', price: 110.00, description: 'Italian leather crossbody bag', stock: 15, shop: shopFashion._id },
            { name: 'Silk Scarf', price: 40.00, description: '100% pure silk floral pattern scarf', stock: 60, shop: shopFashion._id },
            { name: 'Aviator Sunglasses', price: 150.00, description: 'Polarized classic aviator sunglasses', stock: 30, shop: shopFashion._id },
        ];

        const createdProducts = await Product.create(productData);

        // 4. Create Orders
        console.log('--- Seeding Orders ---');
        const orders = [
            {
                user: customer1._id,
                products: [
                    { product: createdProducts[0]._id, quantity: 1 },
                    { product: createdProducts[7]._id, quantity: 2 },
                ],
                totalAmount: 125.99,
                status: 'delivered'
            },
            {
                user: customer2._id,
                products: [
                    { product: createdProducts[12]._id, quantity: 1 },
                ],
                totalAmount: 110.00,
                status: 'processing'
            },
            {
                user: customer1._id,
                products: [
                    { product: createdProducts[4]._id, quantity: 1 },
                ],
                totalAmount: 79.99,
                status: 'pending'
            }
        ];

        await Order.create(orders);

        console.log('--- Data Seeding Complete ---');
        console.log('\nUse these credentials:');
        console.log('Admin: admin@example.com / password123');
        console.log('Tech Vendor: vendor1@example.com / password123');
        console.log('Customer: user@example.com / password123');

        if (require.main === module) process.exit();
    } catch (error) {
        console.error('Seeding Error:', error);
        if (require.main === module) process.exit(1);
    }
};

const destroyData = async () => {
    try {
        await Order.deleteMany();
        await Product.deleteMany();
        await Shop.deleteMany();
        await User.deleteMany();

        console.log('Data Destroyed!');
        process.exit();
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
};

if (require.main === module) {
    const uri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/mern_mall';
    mongoose.connect(uri).then(() => {
        if (process.argv[2] === '-d') {
            destroyData();
        } else {
            importData();
        }
    }).catch(err => {
        console.error('Connection Error:', err);
        process.exit(1);
    });
}


module.exports = { importData, destroyData };
