import styles from "./login.module.css";
import inputStyles from "../input/input.module.css";
import signupstyles from "../signup/signup.module.css";
import { FaXTwitter } from "react-icons/fa6";
import { VscClose } from "react-icons/vsc";
import { useLocation, useNavigate } from "react-router-dom";
import SocialMediaOptions from "../SocialMediaOptions/SocialMediaOptions";
import { ChangeEvent, FormEvent, useRef, useState } from "react";
import { BiShow } from "react-icons/bi";
import axios from "axios";

interface Props {
  handleLoginStatus: (status: boolean | null) => void;
}

const Login = ({ handleLoginStatus }: Props) => {
  const navigate = useNavigate();
  const location = useLocation();
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [userData, setUserData] = useState<string>();
  const [inputName, setInputName] = useState("");
  const [secondStep, setSecondStep] = useState(false);
  const [passwordValue, setPasswordValue] = useState<string>();
  const [showPassword, setShowPassword] = useState(false);
  const [disabled, setDisabled] = useState(true);

  const handleCloseSignUp = () => {
    location.state?.background ? navigate(-1) : navigate("/");
  };

  const handleLoginSubmit = async (event: FormEvent) => {
    event.preventDefault();

    try {
      const response = await axios.get(
        "http://localhost:8080/api/auth/check-login",
        {
          params: {
            data: (inputRef.current && inputRef.current.value) || null,
          },
        }
      );
      if (response.status === 200 && response.data.username) {
        setUserData(response.data.username);
        setInputName("Username");
        console.log(response.data);
      }

      if (response.status === 200 && response.data.email) {
        setUserData(response.data.email);
        setInputName("Email");
        console.log(response.data);
      }
      if (response.status === 200 && response.data.phone_number) {
        setUserData(response.data.phone_number);
        setInputName("Phone");
        console.log(response.data);
      }

      if (response.status === 200) setSecondStep(true);
    } catch (error) {
      console.error("error while checking login info: ", error);
    }
  };

  const handlePasswordSubmit = async (event: FormEvent) => {
    event.preventDefault();

    let data = {
      inputName: userData,
      password: passwordValue,
    };

    try {
      const response = await axios.get("http://localhost:8080/api/auth/login", {
        params: { data },
        withCredentials: true,
      });

      console.log(response);
      if (response.status === 200) {
        handleLoginStatus(true);
        navigate("/");
      }
    } catch (error) {
      console.error("error while checking the password", error);
    }
  };

  const handlePasswordValueChange = (event: ChangeEvent<HTMLInputElement>) => {
    setPasswordValue(event.target.value);
    setDisabled(!(event.target.value.length > 0));
  };

  const handleShowBtnClick = () => {
    setShowPassword((prev) => !prev);
  };

  return (
    <div className={signupstyles.background}>
      <form
        className={styles.container}
        onSubmit={handleLoginSubmit}
        style={{ display: secondStep ? "none" : "flex" }}
      >
        <div>
          <div>
            <button
              className={signupstyles.closeBtn}
              onClick={handleCloseSignUp}
            >
              <VscClose className={signupstyles.closeIcon} />
            </button>
          </div>
          <div>
            <FaXTwitter className={signupstyles.twitterIcon} />
          </div>
        </div>
        <div className={styles.formContent}>
          <div className={signupstyles.createAccount}>Sign In to X</div>
          <div className={styles.socialMedia}>
            <SocialMediaOptions />
          </div>
          <div>
            <label
              className={`${inputStyles.label} ${inputStyles.valid}`}
              style={{ display: secondStep ? "none" : "flex" }}
            >
              <div className={inputStyles.labelTextContainer}>
                <div className={inputStyles.labelText}>
                  Phone, email, or username
                </div>
              </div>
              <div className={inputStyles.inputContainer}>
                <input
                  type="text"
                  name="username"
                  id="username"
                  className={inputStyles.input}
                  placeholder=" "
                  ref={inputRef}
                  required
                />
              </div>
            </label>
          </div>
          <div className={`${styles.button} ${styles.white}`}>
            <button>Next</button>
          </div>
          <div className={`${styles.button} ${styles.black}`}>
            <button type="button">Forgot Password?</button>
          </div>
          <div className={styles.signUpContainer}>
            <span className={styles.yes}>Don't have an account? </span>
            <span className={styles.signUp}>Sign Up</span>
          </div>
        </div>
      </form>
      {/* second step!! i love hatsune miku!!! は　つ　ね　み　く！　初音ミク！！！！*/}
      <form
        className={styles.container}
        onSubmit={handlePasswordSubmit}
        style={{ display: secondStep ? "flex" : "none" }}
      >
        <div>
          <div>
            <button
              className={signupstyles.closeBtn}
              onClick={handleCloseSignUp}
            >
              <VscClose className={signupstyles.closeIcon} />
            </button>
          </div>
          <div>
            <FaXTwitter className={signupstyles.twitterIcon} />
          </div>
        </div>
        <div className={signupstyles.formContent}>
          <div className={signupstyles.createAccount}>Enter your password</div>

          <div>
            <label
              className={`${inputStyles.label} ${inputStyles.valid} ${styles.disabledInput}`}
            >
              <div className={inputStyles.labelTextContainer}>
                <div className={inputStyles.labelText}>{inputName}</div>
              </div>
              <div className={inputStyles.inputContainer}>
                <input
                  type="text"
                  name={inputName}
                  id={inputName}
                  className={inputStyles.input}
                  placeholder=" "
                  value={userData}
                  disabled
                  required
                />
              </div>
            </label>
            <label className={`${inputStyles.label} ${inputStyles.valid}`}>
              <div className={inputStyles.labelTextContainer}>
                <div className={inputStyles.labelText}>Password</div>
              </div>
              <div className={inputStyles.inputContainer}>
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  id="password"
                  className={inputStyles.input}
                  value={passwordValue}
                  onChange={handlePasswordValueChange}
                  placeholder=" "
                  required
                />
              </div>
              <div className={styles.showPasswordContainer}>
                <button
                  className={styles.showPasswordBtn}
                  type="button"
                  onClick={handleShowBtnClick}
                >
                  <BiShow />
                </button>
              </div>
            </label>
          </div>
          <div
            className={`${signupstyles.submitButton} ${signupstyles.signUp}`}
            style={{ marginTop: "225px" }}
          >
            <button disabled={disabled}>Log in</button>
          </div>
          <div className={styles.signUpContainer}>
            <span className={styles.yes}>Don't have an account? </span>
            <span className={styles.signUp}>Sign Up</span>
          </div>
        </div>
      </form>
    </div>
  );
};

export default Login;
