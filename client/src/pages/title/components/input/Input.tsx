import { HTMLInputTypeAttribute, InputHTMLAttributes, useEffect } from "react"
import styles from "./input.module.css"

interface Props extends InputHTMLAttributes<HTMLInputElement>{
  warning: string,
  limit?: boolean,
  name: string,
  type?: HTMLInputTypeAttribute,
  value: string | undefined,
  handleInputChange: (event: React.FocusEvent<HTMLInputElement>) => void,
  setInputValue?: React.Dispatch<React.SetStateAction<string | undefined>>
  valid: boolean | undefined,
  // to clear on unmount 
  setInputValid?: React.Dispatch<React.SetStateAction<boolean | undefined>>,
  setTaken?: React.Dispatch<React.SetStateAction<boolean | undefined>>
  // only for name input
  nameInputCount?: number
  // additional warnings
  emailTaken?: boolean,
  phoneTaken?: boolean,

}


const Input = ({
  warning, 
  limit, 
  name, 
  type, 
  value, 
  valid, 
  nameInputCount, 
  handleInputChange, 
  setInputValue, 
  emailTaken, 
  phoneTaken,
  setInputValid,
  setTaken

} : Props) => {

  // input value reset on component unmount for phone or email
  useEffect(() => {
    return () => {
      setInputValue && setInputValue('')
      setInputValid && setInputValid(undefined)
      setTaken && setTaken(undefined)
    }
  }, [])

  return (
    <>
      <label className={`${styles.label} ${!valid || emailTaken || phoneTaken ? styles.invalid : styles.valid}`}>
        <div className={styles.labelTextContainer}>
          <div className={styles.labelText}>{name.charAt(0).toUpperCase() + name.slice(1)}</div>
        </div>
        <div className={styles.inputContainer}>
          <input
           type={type} 
           name={name} 
           id={name} 
           maxLength={51} 
           className={styles.input}  
           placeholder=" "  
           value={value}  
           onChange={handleInputChange} 
           required
          />
        </div>
        {limit && <div className={styles.inputCount}>{nameInputCount} / 50</div>}
        {valid === false && <div className={styles.inputValid}>{emailTaken ? "Email taken": warning}</div>}
      </label>
    </>
  )
}

export default Input