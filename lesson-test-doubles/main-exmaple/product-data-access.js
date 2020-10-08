const products = [];

class ProductDataAccess {
    async saveProduct(newProduct) {
        products.push(newProduct);
    }

    async getProducts(category) {
        //Intentionally put timeout to make it real async like API/DB call
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                const result = products.filter((aProduct) => aProduct.category === category);
                resolve(result);
            }, 0);
        });
    }


    async deleteProduct(name, callback) {
        const updatedProductsList = products.filter((aProductToCheck) => aProductToCheck.name !== name);
        products = updatedProductsList;
        const result = updatedProductsList ? true : false;

        callback(null, {
            succeed: result
        });
    }
}

module.exports = ProductDataAccess;