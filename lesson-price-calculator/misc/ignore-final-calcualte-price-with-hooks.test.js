const ProductService = require('../products-service');
const configuration = require('../configuration');


beforeAll(async (done) => {
    console.log('🚩 Before all');
    await configuration.start();
    done();
});

describe('Calculate Price', () => {

    afterAll(async () => {
        console.log('🚩 after all')
        await configuration.stop();
    })

    beforeEach(() => {
        console.log('🚩 before each')
        configuration.restoreToInitialState();
    });

    afterEach(() => {
        console.log('🚩 after each')
    });

    describe('Check Discounts2', () => {
        test('When no discounts are allowed, the get 0% discount', () => {
            /// Arrange
            console.log('🚩 Test 1 starts')
            const productServiceUnderTest = new ProductService();
            configuration.getConfig().allowDiscount = false;

            // Act
            const receivedPrice = productServiceUnderTest.calculatePriceWithConfig(100, true, false);

            // Assert
            expect(receivedPrice).toBe(100);
        });

        test('When a product is on sale, then apply 10% discount', () => {
            /// Arrange
            console.log('🚩 Test 2 starts')
            const productServiceUnderTest = new ProductService();

            // Act
            const receivedPrice = productServiceUnderTest.calculatePriceWithConfig(100, true, false);

            // Assert
            expect(receivedPrice).toBe(90);
        });
    });
});