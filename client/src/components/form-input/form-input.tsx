import React, {forwardRef} from "react";
import "./form-input.css"

interface Props {
  id: string;
  value?: string;
  type?: string;
  onChange?: (event: React.FocusEvent<HTMLInputElement>) => void;
} 
 
const FormInput = forwardRef<HTMLInputElement, Props>(({id, value, type="text", onChange}, ref) => {

  return (

  <div className="form-input-container">
    <div className="form-text-area">
      <label htmlFor={id} className="form-label">{id}:</label>
      <input
       type={type}
       name={id}
       value={value}  
       id={id} 
       ref={ref}
       onChange={onChange} 
       className="form-input" 
       />
    </div>
  </div>  
  )
})

export default FormInput