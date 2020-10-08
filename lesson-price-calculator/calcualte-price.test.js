const ProductService = require('./products-service');

describe('Calculate Price', () => {
    describe('Check Discounts', () => {
        test('When a product is on sale, then apply 10% discount', () => {
            const productServiceUnderTest = new ProductService();

            const receivedPrice = productServiceUnderTest.calculatePrice(100, true, false);

            //We should get back 90, let's check
            if (receivedPrice != 90) {
                throw new Error(`We expected to get 90, but got ${receivedPrice}`);
            }
        });

        test('When no price provided, then throw invalidInput exception', () => {
            /// Arrange
            const productsServiceUnderTest = new ProductService();

            // Act
            const addProduct = productsServiceUnderTest.addProduct.bind(this, 'Dracula', null, 'books');

            // Assert
            expect(addProduct).toThrowError(expect.objectContaining({
                name: 'invalidInput'
            }));
        });
    });
});