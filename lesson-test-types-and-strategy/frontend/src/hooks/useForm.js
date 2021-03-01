import { useState } from "react";

const initialState = {
  name:'',
  category:'',
  vendor:'',
  productId:''
}

const useForm = () => {
  const [state, setState] = useState(initialState);

  const handleChange = (event) => {
    setState((prevState) => ({
      ...prevState,
      [event.target.name]: event.target.value,
    }));
  };

  const handleReset = () => {
    setState(initialState)
  }

  return [state, handleChange,handleReset];
};

export default useForm;
