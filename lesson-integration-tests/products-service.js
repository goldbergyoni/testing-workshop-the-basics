let products = [];


class ProductsService {
    calculatePrice(catalogPrice, isOnSale, isPremiumUser) {
        let finalPrice = catalogPrice;

        if (isOnSale) {
            finalPrice *= 0.9;
        }

        if (isPremiumUser) {
            finalPrice *= 0.9;
        }

        //A bunch of other IF/ELSE

        return finalPrice;
    }

    doesNameExist(candidateName) {
        const sameNameProducts = products.filter((aProductToCheck) => aProductToCheck.name === candidateName);

        return sameNameProducts.length > 0;
    }

    async addProduct(newProduct) {
        // Making it slow and async intentionally to simulate DB work
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                if (!newProduct.name || !newProduct.price) {
                    const errorToThrow = new Error("Some properties are missing");
                    errorToThrow.name = "invalidInput";
                    return reject(errorToThrow);
                }
                if (this.doesNameExist(newProduct.name)) {
                    const errorToThrow = new Error("Name already exists");
                    errorToThrow.name = "duplicated";
                    return reject(errorToThrow);
                }

                 products.push(newProduct);;

                const response = {
                    status: 'succeeded',
                    id: Math.ceil(Math.random())
                }

                resolve(response);
            }, 10);
        })
    }

    async getProductsByName(name) {
        //Intentionally put timeout to make it real async like API/DB call
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                const result = products.filter((aProduct) => aProduct.name === name);
                resolve(result);
            }, 10);
        });
    }

    //Meant to demonstrate testing when callbacks exist
    async deleteProduct(name, callback) {
        const updatedProductsList = products.filter((aProductToCheck) => aProductToCheck.name !== name);
        products = updatedProductsList;
        const result = updatedProductsList ? true : false;

        callback(null, {
            succeed: result
        });
    }


}


module.exports = ProductsService;