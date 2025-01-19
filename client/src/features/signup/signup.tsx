import FormInput from "../../components/form-input/form-input";
import "./signup.css";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";

function SignUp() {
  const [emailInput, setEmailInput] = useState("");
  const [usernameInput, setUsernameInput] = useState("");
  const [passwordInput, setPasswordInput] = useState("");

  const [emailValid, setEmailValid] = useState(false);
  const [usernameValid, setUsernameValid] = useState(false);
  const [passwordValid, setPasswordValid] = useState(false);
  const [isDisabled, setIsDisabled] = useState(true);

  const [usernameTaken, setUsernameTaken] = useState(false)

  // Validate email
  const checkEmail = (value: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    setEmailValid(emailRegex.test(value));
  };

  // Validate username
  const checkUsername = (value: string) => {
    setUsernameValid(value.length > 2 && value.length <= 16);
  };

  // Validate password
  const checkPassword = (value: string) => {
    const hasInteger = /\d/;
    const hasLetters = /[a-zA-Z]/;

    const validConditions =
      hasInteger.test(value) && hasLetters.test(value) && value.length > 8 && value.length <= 30;
    setPasswordValid(validConditions);
  };

  // Enable/disable button
  useEffect(() => {
    setIsDisabled(!(emailValid && usernameValid && passwordValid));
  }, [emailValid, usernameValid, passwordValid]);

  useEffect(() => {
    if(usernameTaken) {
      const timer = setTimeout(() => {
      setUsernameTaken(false)
    }, 5000);

    
      return () => clearTimeout(timer)
    } 
  }, [usernameTaken]);

  // Send form data
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const data = {
      email: emailInput,
      username: usernameInput,
      password: passwordInput,
    };

    try {
      const response = await axios.post("http://localhost:8080/api/register", data, {
        headers: {
          "Content-Type": "application/json",
        }
        
      })
      console.log(`Response: ${response.data}`)  
      
    } catch (error: unknown) {
        if (axios.isAxiosError(error)) {
          if (error.response?.status === 400) {
            setUsernameTaken(true);
            console.error("Error: Username already exists");
          } else {
            console.error("Axios Error:", error.message);
          }
        } else {
          console.error("Unexpected Error:", error);
        }
      }
  }


  return (
    <div className="signup-screen">
      <div className="signup-center">
        <form className="signup-container" onSubmit={handleSubmit}>
          <div>
            <h2 className="login-header">Sign up</h2>
          </div>
          <span className="warning">{usernameTaken && "email/username taken"}</span>

          {/* Email Input */}
          <FormInput
            id="email"
            value={emailInput}
            onChange={(e) => {
              const value = e.target.value;
              setEmailInput(value);
              checkEmail(value);
            }}
          />
          <div className="warning">{!emailValid && emailInput && "Invalid email address."}</div>

          {/* Username Input */}
          <FormInput
            id="username"
            value={usernameInput}
            onChange={(e) => {
              const value = e.target.value;
              setUsernameInput(value);
              checkUsername(value);
            }}
          />
          <div className="warning">
            {!usernameValid && usernameInput && "Username must be 3-16 characters long."}
          </div>

          {/* Password Input */}
          <FormInput
            id="password"
            type="password"
            value={passwordInput}
            onChange={(e) => {
              const value = e.target.value;
              setPasswordInput(value);
              checkPassword(value);
            }}
          />
          <div className="warning">
            {!passwordValid && passwordInput && "Password must be 9-30 characters with letters and numbers."}
          </div>

          {/* Submit Button */}
          <div className="signup-btn-container">
            <button className="signup-btn" type="submit" disabled={isDisabled}>
              <h4>Sign up</h4>
            </button>
          </div>

          {/* Login Link */}
          <div className="login-link-container">
            <Link to="/" className="login-link">
              Login
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}

export default SignUp;
