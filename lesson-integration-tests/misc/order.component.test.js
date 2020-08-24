describe('/api', () => {
    describe('/orders', () => {
        describe('POST', () => {
            test('When valid order, then get positive response', () => {
                
            });

            test('When invalid order, then get 400 status', () => {
                
            });

            test('When valid order and premium user, then get 10% discount', () => {
                
            });
        });

        describe('GET', () => {
            test('When order exists, then get back a valid order', () => {
                
            });

            test('When sorting by date, then get the right sort', () => {
                
            });

            test('When an order doesnt exist, then get back empty array', () => {
                
            });
        });

        describe('DELETE', () => {
            test('When order approved, then disallow deletion by 400 response', () => {
                
            });

            test('When order is in draft status, then confirm deletion', () => {
                
            });
        });


    });

    describe('/products', () => {
        describe('POST', () => {
            test('When valid product, then get positive response', () => {
                
            });

            test('When invalid product, then get 400 status', () => {
                
            });

            test('When valid product and premium user, then get 10% discount', () => {
                
            });
        });

        describe('DELETE', () => {
            test('When product is in use, then disallow by returning 400', () => {
                
            });

            test('When order is in draft status, then confirm deletion with 204 status', () => {
                
            });
        });


    });
    
});