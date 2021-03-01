const products = [];

class ProductDataAccess {
  async saveProduct(newProduct, overrideExisting) {
    console.log("DAL layer was called to save a new product");
    return await this.internallySaveProduct(newProduct);
  }

  async internallySaveProduct(newProduct) {
    products.push(newProduct);
    return Promise.resolve(null);
  }

  async getProductByName(name) {
    //Intentionally put timeout to make it real async like API/DB call
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const foundedBooks = products.filter((aProduct) => aProduct.name === name);
        const result = foundedBooks.length > 0 ? foundedBooks[0] : null;
        resolve(result);
      }, 0);
    });
  }

  async deleteProduct(name, callback) {
    const updatedProductsList = products.filter((aProductToCheck) => aProductToCheck.name !== name);
    products = updatedProductsList;
    const result = updatedProductsList ? true : false;

    callback(null, {
      succeed: result,
    });
  }
}

module.exports = new ProductDataAccess();
