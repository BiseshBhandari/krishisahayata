const { addCart, getCart, addQuantity, removeItem } = require('../controller/userController/cartFeature');
const { User, Product, Cart } = require('../model/association');
const sequelize = require('../config/db_config');

// Mock dependencies
jest.mock('../model/association', () => ({
    User: {
        findByPk: jest.fn(),
    },
    Product: {
        findByPk: jest.fn(),
    },
    Cart: {
        create: jest.fn(),
        findOne: jest.fn(),
        findAll: jest.fn(),
        destroy: jest.fn(),
    },
}));
jest.mock('../config/db_config', () => ({
    literal: jest.fn().mockImplementation((query) => ({ query })),
}));

const mockResponse = () => {
    const res = {};
    res.status = jest.fn().mockReturnValue(res);
    res.json = jest.fn().mockReturnValue(res);
    return res;
};

describe('Cart Controller', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('addCart', () => {
        it('should add a new cart item successfully', async () => {
            const req = {
                body: { userId: 1, productId: 1, quantity: '2' },
            };
            const res = mockResponse();

            // Mock Product.findByPk
            Product.findByPk.mockResolvedValue({
                product_id: 1,
                price: 10.0,
            });

            // Mock Cart.findOne
            Cart.findOne.mockResolvedValue(null);

            // Mock Cart.create
            Cart.create.mockResolvedValue({
                id: 1,
                userId: 1,
                productId: 1,
                quantity: 2,
                price: 10.0,
                total: 20.0,
                save: jest.fn().mockResolvedValue(undefined),
            });

            // Mock Cart.findAll for calculateTotalCartValue
            Cart.findAll.mockResolvedValue([
                { id: 1, userId: 1, productId: 1, quantity: 2, price: 10.0, total: 20.0 },
            ]);

            await addCart(req, res);

            expect(Product.findByPk).toHaveBeenCalledWith(1);
            expect(Cart.findOne).toHaveBeenCalledWith({ where: { userId: 1, productId: 1 } });
            expect(Cart.create).toHaveBeenCalledWith({
                userId: 1,
                productId: 1,
                quantity: 2,
                price: 10.0,
            });
            expect(res.status).toHaveBeenCalledWith(201);
            expect(res.json).toHaveBeenCalledWith({
                success: true,
                cart: expect.objectContaining({
                    userId: 1,
                    productId: 1,
                    quantity: 2,
                    price: 10.0,
                    total: 20.0,
                }),
                totalPrice: 20.0,
            });
        });

        it('should update quantity for existing cart item', async () => {
            const req = {
                body: { userId: 1, productId: 1, quantity: '2' },
            };
            const res = mockResponse();

            // Mock Product.findByPk
            Product.findByPk.mockResolvedValue({
                product_id: 1,
                price: 10.0,
            });

            // Mock Cart.findOne
            const cartItem = {
                id: 1,
                userId: 1,
                productId: 1,
                quantity: 1,
                price: 10.0,
                total: 10.0,
                save: jest.fn().mockResolvedValue(undefined),
            };
            Cart.findOne.mockResolvedValue(cartItem);

            // Mock Cart.findAll for calculateTotalCartValue
            Cart.findAll.mockResolvedValue([
                { id: 1, userId: 1, productId: 1, quantity: 3, price: 10.0, total: 30.0 },
            ]);

            await addCart(req, res);

            expect(Product.findByPk).toHaveBeenCalledWith(1);
            expect(Cart.findOne).toHaveBeenCalledWith({ where: { userId: 1, productId: 1 } });
            expect(cartItem.quantity).toBe(3);
            expect(cartItem.total).toBe(30.0);
            expect(cartItem.save).toHaveBeenCalled();
            expect(res.status).toHaveBeenCalledWith(201);
            expect(res.json).toHaveBeenCalledWith({
                success: true,
                cart: expect.objectContaining({
                    userId: 1,
                    productId: 1,
                    quantity: 3,
                    price: 10.0,
                    total: 30.0,
                }),
                totalPrice: 30.0,
            });
        });

        it('should return 404 if product not found', async () => {
            const req = {
                body: { userId: 1, productId: 1, quantity: '2' },
            };
            const res = mockResponse();

            // Mock Product.findByPk
            Product.findByPk.mockResolvedValue(null);

            await addCart(req, res);

            expect(Product.findByPk).toHaveBeenCalledWith(1);
            expect(Cart.findOne).not.toHaveBeenCalled();
            expect(res.status).toHaveBeenCalledWith(404);
            expect(res.json).toHaveBeenCalledWith({ error: 'Product not found' });
        });

        it('should return 500 on server error', async () => {
            const req = {
                body: { userId: 1, productId: 1, quantity: '2' },
            };
            const res = mockResponse();

            // Mock Product.findByPk to throw error
            Product.findByPk.mockRejectedValue(new Error('Database error'));

            await addCart(req, res);

            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({ error: 'Error adding to cart' });
        });
    });

    describe('getCart', () => {
        it('should fetch cart items successfully', async () => {
            const req = {
                params: { userId: 1 },
            };
            const res = mockResponse();

            // Mock Cart.findAll
            Cart.findAll.mockResolvedValue([
                {
                    id: 1,
                    userId: 1,
                    productId: 1,
                    quantity: 2,
                    price: 10.0,
                    total: 20.0,
                    Product: { product_id: 1, name: 'Test Product', imageUrl: 'test.jpg' },
                },
            ]);

            // Mock Cart.findAll for calculateTotalCartValue
            Cart.findAll.mockResolvedValueOnce([
                { id: 1, userId: 1, productId: 1, quantity: 2, price: 10.0, total: 20.0 },
            ]);

            await getCart(req, res);

            expect(Cart.findAll).toHaveBeenCalledWith({
                where: { userId: 1 },
                include: {
                    model: Product,
                    attributes: ['product_id', 'name', 'imageUrl'],
                },
            });
            expect(res.json).toHaveBeenCalledWith({
                success: true,
                cart: expect.arrayContaining([
                    expect.objectContaining({
                        userId: 1,
                        productId: 1,
                        quantity: 2,
                        total: 20.0,
                    }),
                ]),
                totalPrice: 20.0,
            });
        });

        it('should return empty cart if no items exist', async () => {
            const req = {
                params: { userId: 1 },
            };
            const res = mockResponse();

            // Mock Cart.findAll
            Cart.findAll.mockResolvedValue([]);

            // Mock Cart.findAll for calculateTotalCartValue
            Cart.findAll.mockResolvedValueOnce([]);

            await getCart(req, res);

            expect(Cart.findAll).toHaveBeenCalledWith({
                where: { userId: 1 },
                include: {
                    model: Product,
                    attributes: ['product_id', 'name', 'imageUrl'],
                },
            });
            expect(res.json).toHaveBeenCalledWith({
                success: true,
                cart: [],
                totalPrice: 0,
            });
        });

        it('should return 500 on server error', async () => {
            const req = {
                params: { userId: 1 },
            };
            const res = mockResponse();

            // Mock Cart.findAll to throw error
            Cart.findAll.mockRejectedValue(new Error('Database error'));

            await getCart(req, res);

            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({ error: 'Error fetching cart' });
        });
    });

    describe('addQuantity', () => {
        it('should increase cart item quantity', async () => {
            const req = {
                body: { userId: 1, productId: 1 },
            };
            const res = mockResponse();

            // Mock Cart.findOne
            const cartItem = {
                id: 1,
                userId: 1,
                productId: 1,
                quantity: 1,
                price: 10.0,
                total: 10.0,
                save: jest.fn().mockResolvedValue(undefined),
            };
            Cart.findOne.mockResolvedValue(cartItem);

            Cart.findAll.mockResolvedValue([
                { id: 1, userId: 1, productId: 1, quantity: 2, price: 10.0, total: 20.0 },
            ]);

            await addQuantity(req, res);

            expect(Cart.findOne).toHaveBeenCalledWith({ where: { userId: 1, productId: 1 } });
            expect(cartItem.quantity).toBe(2);
            expect(cartItem.total).toBe(20.0);
            expect(cartItem.save).toHaveBeenCalled();
            expect(res.json).toHaveBeenCalledWith({
                success: true,
                cart: expect.objectContaining({
                    userId: 1,
                    productId: 1,
                    quantity: 2,
                    total: 20.0,
                }),
                totalPrice: 20.0,
            });
        });

        it('should return 404 if cart item not found', async () => {
            const req = {
                body: { userId: 1, productId: 1 },
            };
            const res = mockResponse();

            // Mock Cart.findOne
            Cart.findOne.mockResolvedValue(null);

            await addQuantity(req, res);

            expect(Cart.findOne).toHaveBeenCalledWith({ where: { userId: 1, productId: 1 } });
            expect(res.status).toHaveBeenCalledWith(404);
            expect(res.json).toHaveBeenCalledWith({ error: 'Cart item not found' });
        });

        it('should return 500 on server error', async () => {
            const req = {
                body: { userId: 1, productId: 1 },
            };
            const res = mockResponse();

            // Mock Cart.findOne to throw error
            Cart.findOne.mockRejectedValue(new Error('Database error'));

            await addQuantity(req, res);

            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({ error: 'Error increasing cart quantity' });
        });
    });

    describe('removeItem', () => {
        it('should remove cart item successfully', async () => {
            const req = {
                body: { userId: 1, productId: 1 },
            };
            const res = mockResponse();

            // Mock Cart.destroy
            Cart.destroy.mockResolvedValue(1);

            // Mock Cart.findAll for calculateTotalCartValue
            Cart.findAll.mockResolvedValue([]);

            await removeItem(req, res);

            expect(Cart.destroy).toHaveBeenCalledWith({ where: { userId: 1, productId: 1 } });
            expect(res.json).toHaveBeenCalledWith({
                success: true,
                totalPrice: 0,
                message: 'Item removed from cart',
            });
        });

        it('should return 500 on server error', async () => {
            const req = {
                body: { userId: 1, productId: 1 },
            };
            const res = mockResponse();

            // Mock Cart.destroy to throw error
            Cart.destroy.mockRejectedValue(new Error('Database error'));

            await removeItem(req, res);

            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({ error: 'Error deleting cart item' });
        });
    });
});