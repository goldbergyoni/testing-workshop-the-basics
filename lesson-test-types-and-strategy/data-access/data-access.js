let products = [];

class ProductDataAccess {
  doesNameExist(candidateName) {
    const sameNameProducts = products.filter((aProductToCheck) => aProductToCheck.name === candidateName);

    return sameNameProducts.length > 0;
  }

  async addProduct(newProduct) {
    // Making it slow and async intentionally to simulate DB work
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        products.push(newProduct);

        const response = {
          status: "succeeded",
          id: Math.ceil(Math.random()),
        };

        resolve(response);
      }, 25);
    });
  }

  async getVendorProductDetails(vendorName, vendorId) {
    // Let's pretend to fetch information about a product from our vendors table
    return Promise.resolve({
      popularity: 0.95,
      vendorPrice: 100,
      returnRate: 0.2,
      color: "blue",
      storageSizeInCC: 200,
      productionCountry: "China",
      productCategory: "Books",
    });
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

  async updateProduct(id, newName, newPrice) {}
}

module.exports = new ProductDataAccess();
