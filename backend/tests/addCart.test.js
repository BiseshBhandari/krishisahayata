const { addCart } = require('../controller/userController/cartFeature');
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

            Product.findByPk.mockResolvedValue({
                product_id: 1,
                price: 10.0,
            });

            Cart.findOne.mockResolvedValue(null);

            Cart.create.mockResolvedValue({
                id: 1,
                userId: 1,
                productId: 1,
                quantity: 2,
                price: 10.0,
                total: 20.0,
                save: jest.fn().mockResolvedValue(undefined),
            });

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

            Product.findByPk.mockResolvedValue({
                product_id: 1,
                price: 10.0,
            });

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

            Product.findByPk.mockRejectedValue(new Error('Database error'));

            await addCart(req, res);

            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({ error: 'Error adding to cart' });
        });
    });
});