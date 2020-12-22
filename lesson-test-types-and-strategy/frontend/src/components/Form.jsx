const FormSection = ({ values, handleChange, handleSubmit,isLoading }) => (
  <form onSubmit={handleSubmit} className="pt-6">
    <div className="field">
      <label className="label" htmlFor="name">
        Product name:
      </label>
      <div className="control">
        <input
          className="input is-rounded"
          required
          id="name"
          type="text"
          name="name"
          value={values.name}
          onChange={handleChange}
        />
      </div>
    </div>
    <div className="field">
      <label className="label" htmlFor="category">
        Category
      </label>
      <div className="control">
        <input
          className="input is-rounded"
          id="category"
          type="text"
          name="category"
          value={values.category}
          onChange={handleChange}
        />
      </div>
    </div>
    <div className="field">
      <label className="label" htmlFor="vendor">
        Vendor
      </label>
      <div className="control">
        <div className="select is-rounded">
          <select
            value={values.vendor}
            name="vendor"
            id="vendor"
            onChange={handleChange}
          >
            <option disabled value="">
              select...
            </option>
            <option value="suppliers inc.">Suppliers inc.</option>
            <option value="goodies corp">Goodies corp</option>
            <option value="commerce">Commerce</option>
            <option value="global">Global</option>
          </select>
        </div>
      </div>
    </div>
    <div className="field">
      <label className="label" htmlFor="productId">
        Product Identifier
      </label>
      <div className="control">
        <input
          className="input is-rounded"
          id="productId"
          type="text"
          name="productId"
          value={values.productId}
          onChange={handleChange}
        />
      </div>
    </div>
    <button
      className={`button is-info is-rounded ${isLoading ? "is-loading" : ""}`}
      type="submit"
    >
      Submit
    </button>
  </form>
);

export default FormSection;
