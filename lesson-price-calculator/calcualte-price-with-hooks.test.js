const ProductService = require('./products-service');
const configuration = require('./configuration');

describe('Calculate Price', () => {
    beforeAll(async () => {
        console.log('🚩 beforeAll');
        await configuration.start();
    });
    afterAll(async () => {
        console.log('🚩 afterAll');
        await configuration.stop();
    });
    beforeEach(() => {
        console.log('🚩 beforeEach');
        configuration.restoreToInitialState();
    });
    afterEach(() => {
        console.log('🚩 afterEach');
    });
    describe('Check Discounts', () => {
        test('When no discounts allowed, then get 0% discount', async () => {
            /// Arrange
            console.log('🚩 Test 1')
            const productServiceUnderTest = new ProductService();
            configuration.getConfig().allowDiscount = false;

            // Act
            const receivedPrice = productServiceUnderTest.calculatePriceWithConfig(100, true, false);

            // Assert
            expect(receivedPrice).toBe(100);
        })

        test('When a product is on sale, then apply 10% discount', async () => {
            /// Arrange
            console.log('🚩 Test 2')
            const productServiceUnderTest = new ProductService();

            // Act
            const receivedPrice = productServiceUnderTest.calculatePriceWithConfig(100, true, false);

            // Assert
            expect(receivedPrice).toBe(90);
        });
    });
});