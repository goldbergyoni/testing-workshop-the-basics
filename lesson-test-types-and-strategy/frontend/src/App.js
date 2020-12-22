// INFO : as of react v17 and CRA v4 we can skip importing React to use JSX
import ToggleButton from "./components/ToggleButton";
import FormSection from "./components/Form";
import useForm from "./hooks/useForm";
import { useState } from "react";
import axios from 'axios';

function App() {
  const [values, handleChange,handleReset] = useForm(); // custom hook to manage form values
  const [isLoading, setIsLoading] = useState(false);
  const [apiRes, setApiRes] = useState(null);
  const [apiError,setApiError] = useState(null);

  const handleSubmit = async (event) => {
    event.preventDefault(); // to not refresh the page and lose the State
    setApiRes(null);
    setApiError(null);
    setIsLoading(true);
    const theNewProductToAdd = { ...values };
    try {
      const response = await axios.post("http://localhost:3000/product", theNewProductToAdd,{
        headers: {
          "Content-Type": "application/json",
        },
      });
      setIsLoading(false);
      setApiRes(response.data);
      handleReset();
    } catch (e) {
      setIsLoading(false);
      if(e.response.status === 500){
        setApiError('❗️Some properties are missing')
      } else if(e.response.status === 400){
        setApiError('❗️Save failed, product does not exist’. Here’s an existing product "camera-2"')
      }
    }
  };

  return (
    <>
      <header>
        <h3 className="title is-4">eCommerce Form</h3>
        <ToggleButton />
      </header>
      <section className="section">
        <div className="container is-max-desktop">
          <div className="mb-6">
            <h1 className="title">Add New Product</h1>
            <h2 className="subtitle">
              This is the place to add a new product to your e-commerce site
            </h2>
          </div>
          <div className="response-container">
            {apiRes?.price && (
              <>
                <h2 className="subtitle is-info">
                 ℹ️ The new Product was saved successfully 🎉
                </h2>
                <h2 className="subtitle">The given price is: ${apiRes.price}US$
                </h2>
              </>
            )}
            {apiError && (
              <>
                <h2 className="subtitle is-info">
                  {apiError}
                </h2>
              </>
            )}
          </div>
          <FormSection
            handleSubmit={handleSubmit}
            handleChange={handleChange}
            isLoading={isLoading}
            values={values}
          />
        </div>
      </section>
    </>
  );
}

export default App;
