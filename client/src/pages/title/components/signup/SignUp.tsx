import { FaXTwitter } from "react-icons/fa6";
import styles from "./signup.module.css";
import { VscClose } from "react-icons/vsc";
import { useNavigate } from "react-router-dom";
import Input from "../input/Input";
import React, { ChangeEvent, useEffect, useState } from "react";
import { IoIosArrowDown } from "react-icons/io";
import axios from "axios";

const SignUp = () => {
  const years = Array.from({ length: 2024 - 1905 + 1 }, (_, i) => 2024 - i);
  const days = Array.from({ length: 31 }, (_, i) => i + 1);
  const navigate = useNavigate();

  const [inputType, setInputType] = useState("tel");
  const [disabled, setDisabled] = useState(true);

  // name
  const [nameInputCount, setNameInputCount] = useState(0);
  const [nameInputValue, setNameInputValue] = useState("");
  const [nameInputValid, setNameInputValid] = useState<boolean | undefined>(
    undefined
  );

  // email
  const [emailInput, setEmailInput] = useState<string>();
  const [emailInputValid, setEmailInputValid] = useState<boolean | undefined>(
    undefined
  );
  const [emailTaken, setEmailTaken] = useState<boolean | undefined>(undefined);

  // phone
  const [phoneInput, setPhoneInput] = useState<string>();
  const [phoneInputValid, setPhoneInputValid] = useState<boolean | undefined>(
    undefined
  );
  const [phoneTaken, setPhoneTaken] = useState<boolean | undefined>(undefined);

  // date
  const [selectedDay, setSelectedDay] = useState<string>("");
  const [selectedMonth, setSelectedMonth] = useState<string>("");
  const [selectedYear, setSelectedYear] = useState<string>("");

  // second stage for password
  const [secondStage, setSecondStage] = useState<boolean>(false);
  const [display, setDisplay] = useState("flex");
  const [passwordValue, setPasswordValue] = useState("");
  const [passwordValid, setPasswordValid] = useState(false);
  const [submitDisabled, setSubmitDisabled] = useState(true);

  useEffect(() => {
    const isDateIncomplete =
      selectedDay === "" || selectedMonth === "" || selectedYear === "";
    const isEmailInvalid = !emailInputValid || emailTaken;
    const isPhoneInvalid = !phoneInputValid || phoneTaken;
    const isNameInvalid = !nameInputValid;

    if (inputType === "email") {
      setDisabled(isEmailInvalid || isNameInvalid || isDateIncomplete);
    } else if (inputType === "tel") {
      setDisabled(isPhoneInvalid || isNameInvalid || isDateIncomplete);
    }
  }, [
    emailTaken,
    phoneTaken,
    nameInputValid,
    selectedDay,
    selectedMonth,
    selectedYear,
    emailInputValid,
    phoneInputValid,
    inputType,
  ]);

  const handleNameInputChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setNameInputValue(event.target.value);
    setNameInputValid(event.target.value.trim().length !== 0);
    setNameInputCount(event.target.value.length || 0);
  };

  const handleEmailInputChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = event.target.value;
    setEmailTaken(undefined);
    setEmailInput(value);

    const emailInputValid = event.target.checkValidity();
    setEmailInputValid(emailInputValid);

    // checking if the email is taken on the server

    if (emailInputValid) {
      const exists = await checkEmailExistence(value);
      setEmailTaken(exists);
    }
  };

  const checkEmailExistence = async (
    email: string
  ): Promise<boolean | undefined> => {
    try {
      const { data } = await axios.get(
        "http://localhost:8080/api/auth/check-email",
        {
          params: { email },
        }
      );

      return data.exists;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        if (error.response.status === 409) {
          return true;
        } else {
          console.error(error.stack);
        }
      } else {
        console.error("unexpected error occured: ", error);
      }
    }
  };

  const checkPhoneExistence = async (phone: string): Promise<boolean> => {
    try {
      const { data } = await axios.get(
        "http://localhost:8080/api/auth/check-phone",
        {
          params: { phone },
        }
      );

      return data.exists;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        if (error.response.status === 409) {
          return true;
        } else {
          console.error(error.stack);
          return false;
        }
      } else {
        console.error("unexpected error occured: ", error);
        return false;
      }
    }
  };

  const handlePhoneInputChange = async (
    event: React.FocusEvent<HTMLInputElement>
  ) => {
    setPhoneInput(event.target.value);
    setPhoneTaken(undefined);
    const phoneRegex =
      /^\+?[1-9]\d{0,2}[-.\s]?\(?\d{1,4}\)?[-.\s]?\d{1,4}[-.\s]?\d{1,9}$/;

    const phoneInputValid = phoneRegex.test(event.target.value);
    setPhoneInputValid(phoneInputValid);

    // checking if the phone is taken on the server
    if (phoneInputValid) {
      const exists = await checkPhoneExistence(event.target.value);
      setPhoneTaken(exists);
    }
  };

  const handleCloseSignUp = () => {
    navigate(-1);
  };

  const handleChangeInputClick = () => {
    inputType === "tel" ? setInputType("email") : setInputType("tel");
  };

  const handleDayChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedDay(e.target.value);
  };
  const handleMonthChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedMonth(e.target.value);
  };
  const handleYearChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedYear(e.target.value);
  };

  const handleUserDataSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    const formattedMonth = selectedMonth.toString().padStart(2, "0");
    const formattedDay = selectedDay.toString().padStart(2, "0");

    const birthDate = `${selectedYear}-${formattedMonth}-${formattedDay}`;
    let data = {
      username: nameInputValue,
      phone: phoneInput,
      email: emailInput,
      password: passwordValue,
      birthday: birthDate,
    };

    const response = await axios.post(
      "http://localhost:8080/api/auth/register",
      data
    );
    if (response.status === 201) navigate("/");
  };

  const handleNextClick = () => {
    setSecondStage(true);
    setDisplay("none");
  };

  const handlePasswordInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    setPasswordValue(event.target.value);

    setPasswordValid(event.target.value.length >= 8);
    setSubmitDisabled(event.target.value.length <= 8);
  };

  return (
    <div className={styles.background}>
      <form className={styles.container} onSubmit={handleUserDataSubmit}>
        <div>
          <div>
            <button className={styles.closeBtn} onClick={handleCloseSignUp}>
              <VscClose className={styles.closeIcon} />
            </button>
          </div>
          <div>
            <FaXTwitter className={styles.twitterIcon} />
          </div>
        </div>
        <div className={styles.formContent} style={{ display: display }}>
          <div className={styles.createAccount}>Create your account</div>
          <div className={styles.inputsContainer}>
            <div>
              <Input
                warning="What's your name?"
                limit={true}
                type="text"
                name="name"
                value={nameInputValue}
                nameInputCount={nameInputCount}
                valid={nameInputValid}
                handleInputChange={handleNameInputChange}
              />
            </div>
            <div>
              {inputType === "tel" && (
                <Input
                  warning={"Please enter a valid phone number"}
                  name={"phone"}
                  type={"tel"}
                  setTaken={setPhoneTaken}
                  setInputValid={setPhoneInputValid}
                  value={phoneInput}
                  valid={phoneInputValid}
                  handleInputChange={handlePhoneInputChange}
                  setInputValue={setPhoneInput}
                  phoneTaken={phoneTaken}
                />
              )}
              {inputType === "email" && (
                <Input
                  warning={"Please enter a valid email."}
                  name={"email"}
                  type={"email"}
                  setTaken={setEmailTaken}
                  setInputValid={setEmailInputValid}
                  value={emailInput}
                  valid={emailInputValid}
                  handleInputChange={handleEmailInputChange}
                  setInputValue={setEmailInput}
                  emailTaken={emailTaken}
                />
              )}
            </div>
          </div>
          <div className={styles.changeInput}>
            <button
              className="no-defaults"
              type="button"
              onClick={handleChangeInputClick}
            >
              Use email instead
            </button>
          </div>
          <div className={styles.dateOfBirth}>Date of Birth</div>
          <div className={styles.dateOfBirthAnnotation}>
            This will not be shown publicly. Confirm your own age, even if this
            account is for a business, a pet, or something else.
          </div>
          <div className={styles.dateFormContainer}>
            <div>
              <div className={styles.dateName}>Month</div>
              <div className={styles.selectContainer}>
                <select
                  name="month"
                  id="month"
                  className={styles.select}
                  defaultValue={""}
                  required
                  value={selectedMonth}
                  onChange={handleMonthChange}
                >
                  <option disabled value=""></option>
                  {[
                    "January",
                    "February",
                    "March",
                    "April",
                    "May",
                    "June",
                    "July",
                    "August",
                    "September",
                    "October",
                    "November",
                    "December",
                  ].map((month, index) => (
                    <option key={index + 1} value={index + 1}>
                      {month}
                    </option>
                  ))}
                </select>
                <div className={styles.arrow}>
                  <IoIosArrowDown />
                </div>
              </div>
            </div>
            <div>
              <div className={styles.dateName}>Day</div>
              <div className={styles.selectContainer}>
                <select
                  name="day"
                  id="day"
                  className={styles.select}
                  defaultValue={""}
                  required
                  value={selectedDay}
                  onChange={handleDayChange}
                >
                  <option disabled value=""></option>
                  {days.map((day) => (
                    <option key={day} value={day}>
                      {day}
                    </option>
                  ))}
                </select>
                <div className={styles.arrow}>
                  <IoIosArrowDown />
                </div>
              </div>
            </div>
            <div>
              <div className={styles.dateName}>Year</div>
              <div className={styles.selectContainer}>
                <select
                  name="year"
                  id="year"
                  className={styles.select}
                  defaultValue={""}
                  required
                  value={selectedYear}
                  onChange={handleYearChange}
                >
                  <option disabled value=""></option>
                  {years.map((year) => (
                    <option key={year} value={year}>
                      {year}
                    </option>
                  ))}
                </select>
                <div className={styles.arrow}>
                  <IoIosArrowDown />
                </div>
              </div>
            </div>
          </div>
        </div>
        <div
          className={styles.formContent}
          style={{ display: secondStage ? "flex" : "none" }}
        >
          <Input
            warning="Your password needs to be at least 8 characters, please enter a valid one."
            type="password"
            name="password"
            handleInputChange={handlePasswordInputChange}
            value={passwordValue}
            valid={passwordValid}
          />
        </div>
        <div className={`${styles.submitButton}`} style={{ display: display }}>
          <button disabled={disabled} type="button" onClick={handleNextClick}>
            Next
          </button>
        </div>

        <div
          className={`${styles.submitButton} ${styles.signUp}`}
          style={{ display: secondStage ? "flex" : "none" }}
        >
          <button
            disabled={submitDisabled}
            type="button"
            onClick={handleNextClick}
          >
            Sign Up
          </button>
        </div>
      </form>
    </div>
  );
};
export default SignUp;
