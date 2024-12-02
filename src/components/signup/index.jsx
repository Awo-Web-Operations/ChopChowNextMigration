import React, { useState, useEffect } from 'react';
import styles from '../Login/style.module.css';
// import { Form, Button, Container, Modal, Row, Col, ButtonToolbar } from 'react-bootstrap';
import { EyeSIcon } from "../icons";
import Link from 'next/link';
import img_logo from "../../../public/assets/logos/CC_Logo_no_bg.png"
import Image from "next/image";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import { toast } from "react-toastify";
import { connect, useSelector } from "react-redux";
import {
  userSignUp,
  sendEmailOTP,
  verifyEmailOTP,
  requestnumber,
  verifynumber,
  confirmAccount,
} from "../../actions";
import { GoogleLogin } from "@react-oauth/google";
import FacebookLogin from "react-facebook-login";
import axios, { base_url } from "../../util/Api";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { useRouter } from "next/router";
import UserVerification from "../UserVerification";
import UserVerificationSuccess from "../UserVerificationSuccess";
import OTP from "../OTP";
import { jwtDecode } from "jwt-decode";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { useMobileMedia } from '../../customhooks/useResponsive';

function SignUp(props) {
  const [openUserVerification, setOpenUserVerification] = React.useState(false);
  const [openUserVerificationSuccess, setOpenUserVerificationSuccess] = React.useState(false);
  const [openOTP, setOpenOTP] = React.useState(false);
  const [type, setType] = React.useState('');
  const [isSuccess, SetIsSuccess] = React.useState(false);
  const { authUser, isAuthenticated } = useSelector(state => state.Auth)
  const router = useRouter();
  const [message, setMessageState] = useState(null);
  const [status, setStatusState] = useState(null);
  const [isAgreed, setIsAgreed] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [showPass, setShowPassState] = useState(null);
  const [formState, setFormState] = useState({
    username: "",
    email: "",
    phone_number: "",
    first_name: "",
    last_name: "",
    password: "",
    confirm_password: "",
  });
  const [error, setError] = useState({
    username: '',
    password: '',
    confirm_password: '',
    isAgreed: '',
  })
  const mobileScreen = useMobileMedia();
  const isverified = useSelector((state) => state.Auth.isVerified);
  const openVerified = useSelector((state) => state.Common.openVerification);
  const handleOpenOtp = () => {
    setOpenUserVerification(false)
    setOpenUserVerificationSuccess(false)
    setOpenOTP(true)
  }
  const handleOpenSuccess = () => {
    setOpenUserVerification(false)
    setOpenOTP(false)

  }
  console.log("openVerified", openVerified)
  // useEffect(()=>{
  //   if(isverified){
  //     //setOpenUserVerificationSuccess(true)
  //   }
  // }, [isverified])
  useEffect(() => {
    if (isAuthenticated && authUser) {
      router.push("/dashboard");
    }
  }, [authUser, isAuthenticated])


  useEffect(() => {
    if (openVerified) {
      const userLogin = JSON.parse(localStorage.getItem("formState"));
      console.log("line 87", userLogin.email)
      try {
        let result = ConfirmAccount(userLogin)
        console.log("result", result)
        if (result) {
          SetIsSuccess(true)
          setOpenUserVerificationSuccess(true);
        } else {
          SetIsSuccess(false)
          setOpenUserVerificationSuccess(true);
        }
      } catch (err) {
        SetIsSuccess(false)
        setOpenUserVerificationSuccess(false);
      }


    }
  }
    , [openVerified])

  const ConfirmAccount = async (userLogin) => {
    await props.confirmAccount(userLogin.email);
  }

  const { username, email, phone_number, first_name, last_name, password, confirm_password, } = formState;


  function handleChange(e) {
    setFormState({ ...formState, [e.target.name]: e.target.value });
    validateInput(e);
  }

  function togglePass() {
    setShowPassState(!showPass);
  }

  function handlePhoneChange(e) {
    setFormState({ ...formState, ['phone_number']: e });
  }

  const validateInput = e => {
    let { name, value } = e.target;
    setError(prev => {
      const stateObj = { ...prev, [name]: "" };

      switch (name) {
        case "username":
          if (!value) {
            stateObj[name] = "Please enter Username.";
          }
          break;

        case "password":
          if (!value) {
            stateObj[name] = "Please enter Password";
          } else if (password && value !== confirm_password) {
            stateObj["confirm_password"] = "Password and Confirm Password does not match.";
          } else {
            stateObj["confirm_password"] = confirm_password ? "" : error.confirm_password;
          }
          break;

        case "confirm_password":
          if (!value) {
            stateObj[name] = "Please enter Confirm Password.";
          } else if (confirm_password && value !== password) {
            stateObj[name] = "Password and Confirm Password does not match.";
          }
          break;

        default:
          break;
      }

      return stateObj;
    });
  };



  console.log('redux', props.redux)


  async function formSubmit(e) {
    e.preventDefault();


    // Run validation logic
    const validationErrors = validateInput(e) ?? {};

    // Check if there are any validation errors
    if (Object.values(validationErrors).some((error) => error !== '')) {
      setError(validationErrors);
      console.error('Form validation failed:', validationErrors);
      return;
    }

    // Check if the user has agreed to terms and conditions
    if (!isAgreed) {
      setError((prev) => ({ ...prev, isAgreed: 'Please agree to terms and conditions' }));
      console.error('Please agree to the terms and conditions.');
      return;
    }

    let result = await props.signup({
      username,
      email,
      phone_number,
      first_name,
      last_name,
      password,
    })
    console.log("result", result)
    if (result) {
      localStorage.setItem("formState", JSON.stringify(formState));
      setOpenUserVerification(true)
    }




    // if(isAuthenticated && authUser){

    // //   router.push("/dashboard");
    // }
  }

  console.log("openUserVerificationSuccess", openUserVerificationSuccess)
  return (
    <>
      <div className={styles.login}>
        <div className={styles.login_col_2}>
          <div className={styles.login_top}>
            <div className={styles.login_cancel_con}>
              <Link href="/" legacyBehavior>
                <img
                  src="/assets/grocery_list/backArr.svg"
                  alt="goBack"
                  width="20px"
                  height="20px"
                  className={styles.login_cancel}
                />
              </Link>
              <Link href="/" legacyBehavior>
                <img
                  src="/assets/grocery_list/backArr_white.svg"
                  alt="goBack"
                  width="20px"
                  height="20px"
                  className={styles.login_backArr}
                />
              </Link>

              <Link href="/" legacyBehavior>
                <h3 className={styles.login_cancel}>Back</h3>
              </Link>
            </div>
            <Link href="/" legacyBehavior>
              <Image
                src={img_logo}
                alt="logo"
                className={styles.login_main_logo_img}
              />
            </Link>
            <h4 className={styles.login_promo_text}>
              Get your African Delicacies delievered to your Door
            </h4>
          </div>
          <div >
            <h3 className={styles.login_col_h3}>Sign Up</h3>


            <div className={styles.signup_form} style={{ paddingLeft: 10, paddingRight: 10 }}>

              <div className={styles.login_form_col_2}>
                <div className={styles.login_form_group}>
                  <label htmlFor="first_name" className={styles.login_form_label}>First Name</label>
                  <input
                    type="text"
                    name="first_name"
                    value={first_name}
                    placeholder="First Name"
                    onChange={handleChange}
                    className={styles.login_form_input} />

                </div>
                <div className={styles.login_form_group}>
                  <label htmlFor="last_name" className={styles.login_form_label}>Last Name</label>
                  <input
                    type="text"
                    name="last_name"
                    value={last_name}
                    placeholder="Last Name"
                    onChange={handleChange}
                    className={styles.login_form_input} />

                </div>
              </div>
              <div className={styles.login_form_group}>
                <label htmlFor="username" className={styles.login_form_label}>
                  Username
                </label>
                <input
                  type="text"
                  name="username"
                  value={username}
                  placeholder="Username"
                  onChange={handleChange}
                  onBlur={validateInput}
                  className={styles.login_form_input}
                />
                {error.username && <span style={{ color: "#FF0000", fontSize: 14 }}>{error.username}</span>}
              </div>
              <div className={styles.login_form_group}>
                <label htmlFor="email" className={styles.login_form_label}>
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={email}
                  placeholder="Email"
                  onChange={handleChange}
                  className={styles.login_form_input}
                />
              </div>
              <div className={styles.login_form_col_2}>
                <div className={styles.login_form_group}>
                  <label htmlFor="city" className={styles.login_form_label}>City</label>
                  <input name="city" type="text" className={styles.login_form_input} />

                </div>
                <div className={styles.login_form_group}>
                  <label htmlFor="country" className={styles.login_form_label}>Country</label>
                  <input name="country" type="text" className={styles.login_form_input} />

                </div>
              </div>
              <div className={styles.login_form_group}>
                <label htmlFor="phone_number" className={styles.login_form_label}>
                  Phone Number
                </label>

                <PhoneInput
                  inputClass={styles.login_form_input}
                  country={'us'}
                  name="phone_number"
                  value={phone_number}
                  onChange={phone => handlePhoneChange(phone)}
                />
              </div>
              <div className={styles.login_form_group}>
                <label htmlFor="password" id='password' className={styles.login_form_label}>
                  Password
                </label>
                <input
                  type={showPass ? "text" : "password"}
                  name="password"
                  id="password"
                  value={password}
                  placeholder="Create a Password"
                  onChange={handleChange}
                  onBlur={validateInput}
                  className={styles.login_form_input}
                />

                <div onClick={togglePass} className={styles.secureEye}>
                  {showPass ?
                    <VisibilityOff />
                    :
                    <Visibility />
                  }
                </div>
                {error.password && <span style={{ color: "#FF0000", fontSize: 14 }}>{error.password}</span>}
              </div>
              <div className={styles.login_form_group}>
                <label htmlFor="password" id="confirm_password" className={styles.login_form_label}>
                  Confirm Password
                </label>
                <input
                  type={showPass ? "text" : "password"}
                  id="confirm_password"
                  name="confirm_password"
                  value={confirm_password}
                  placeholder="Confirm Password"
                  onChange={handleChange}
                  onBlur={validateInput}
                  className={styles.login_form_input}
                />

                <div onClick={togglePass} className={styles.secureEye}>
                  {showPass ?
                    <VisibilityOff />
                    :
                    <Visibility />
                  }
                </div>
                {error.confirm_password && <span style={{ color: "#FF0000", fontSize: 14 }} >{error.confirm_password}</span>}
              </div>

              {/* <div className={styles.signup_form_option}>
                <input
                    className={styles.signup_form_radioInput}
                    type="checkbox"
                    id="agreement"
                    name="isAgreed"
                    required
                    value={isAgreed}
                    onChange={() => setIsAgreed(!isAgreed)}
                    />
                    
                    <label htmlFor="agreement" className={styles.signup_form_radio_label}>
                    I accept the Terms & Conditions and <Link legacyBehavior href="/privacypolicy"><a style={{textDecoration: "underline"}}>Privacy and Cookie Notice</a></Link>
  
                    </label>
                    {!isAgreed && <span style={{color: "#FF0000", fontSize: 14}} >{error.isAgreed}</span>}
                </div> */}

              <div className={styles.signup_form_option}>
                <input
                  className={styles.signup_form_radioInput}
                  type="checkbox"
                  id="agreement"
                  name="isAgreed"
                  required
                  value={isAgreed}
                  onChange={() => setIsAgreed(!isAgreed)}
                />

                <label
                  htmlFor="agreement"
                  className={styles.signup_form_radio_label}
                >
                  I accept the Terms & Conditions and{" "}
                  <Link legacyBehavior href="/privacypolicy">
                    <a style={{ textDecoration: "underline" }}>
                      Privacy and Cookie Notice
                    </a>
                  </Link>
                </label>
                {!isAgreed && (
                  <span style={{ color: "#FF0000", fontSize: 14 }}>
                    {error.isAgreed}
                  </span>
                )}
              </div>

              <div className={styles.signup_form_option}>
                <input
                  className={styles.signup_form_radioInput}
                  type="checkbox"
                  id="newsletter"
                  name="newsletter"
                  value="isSubscribed"
                  onChange={(e) => setIsSubscribed(e.target.value)}
                />

                <label
                  htmlFor="newsletter"
                  className={styles.signup_form_radio_label}
                >
                  I want to receive Chop Chow Newletters and best deal
                  promotional offers
                </label>
              </div>

              {status === "success" ? (
                <p className="msg-success">{message}</p>
              ) : (
                <p className="msg-err">{message}</p>
              )}

              <button onClick={formSubmit} className={styles.login_button}>
                Register
              </button>
              <div className={styles.login_options}>
                <h3>Sign up with social media</h3>

                <div className={styles.flex}>
                  <div>
                    {
                      <FacebookLogin
                        appId={process.env.FB_APP_ID}
                        autoLoad={true}
                        fields="name,email,picture"
                        cssClass={styles.blue}
                        // callback={responseFacebook}
                        render={(renderProps) => (
                          <button
                            className={styles.blue}
                            onClick={() => {
                              renderProps.onClick();
                            }}
                          >
                            This is my custom FB button
                          </button>
                        )}
                      />
                    }
                  </div>
                  <div>
                    <GoogleLogin
                      onSuccess={async (credentialResponse) => {
                        try {
                          const decoded = jwtDecode(
                            credentialResponse.credential
                          );
                          // const s3Client = new S3Client({
                          //   region: process.env.NEXT_PUBLIC_S3_REGION,
                          //   credentials: {
                          //     accessKeyId:
                          //       process.env
                          //         .NEXT_PUBLIC_CHOPCHOWAPP_USER_AWS_KEY,
                          //     secretAccessKey:
                          //       process.env
                          //         .NEXT_PUBLIC_CHOPCHOWAPP_USER_AWS_SECRET,
                          //   },
                          // });
                          // console.log(decoded, "decoded");
                          // const resp = await fetch(decoded.picture);
                          // const blob = await resp.blob();
                          // const fileName = `images/${Date.now()}-${decoded.picture
                          //   .split("/")
                          //   .pop()}`;

                          // const params = {
                          //   Bucket: process.env.NEXT_PUBLIC_S3_BUCKET,
                          //   Key: fileName,
                          //   Body: blob,
                          //   ContentType: blob.type,
                          //   ACL: "public-read",
                          // };
                          // console.log(params, 'params')

                          // const command = new PutObjectCommand(params);
                          // const uploadResult = await s3Client.send(command);
                          // console.log("Upload successful:", uploadResult);

                          // const s3Url = `https://${process.env.NEXT_PUBLIC_S3_BUCKET}.s3.${process.env.NEXT_PUBLIC_S3_REGION}.amazonaws.com/${fileName}`;
                          // console.log(s3Url, 's3Url')
                          const payload = {
                            first_name: decoded?.given_name,
                            last_name: decoded?.family_name,
                            email: decoded?.email,
                            username: decoded?.given_name,
                            password: Math.floor(
                              Math.random() * 100000000
                            ).toString(),
                            email_notifications: false,
                            profile_picture: decoded.picture

                          };
                          const form = new FormData();
                          for (let entry in payload) {
                            form.append(entry, payload[entry]);
                          }
                          // form.append("profile_picture", blob);
                          const response = await axios("/user/signup", {
                            method: "post",
                            // headers: {
                            //   "Content-Type": "multipart/form-data",
                            // },
                            data: payload,
                          });
                          toast.success("Registration was successful");
                          router.push("/login");
                        } catch (error) {
                          toast.error(
                            error?.response?.data?.message?.message ||
                            "An error occured"
                          );
                          console.log(error, "error");
                        }
                      }}
                      onError={() => {
                        console.log("Login Failed");
                      }}
                    />
                  </div>
                </div>
              </div>
              <h3 className={styles.login_new}>
                Already have an account?{" "}
                {props.closeSignUp ? (
                  <span onClick={props.closeSignUp}>Sign in here</span>
                ) : (
                  <Link legacyBehavior href="/login">
                    <a>Sign in here</a>
                  </Link>
                )}
              </h3>
            </div>
          </div>
        </div>


        {!mobileScreen ? <div className={styles.login_col_1}>

          <div className={styles.login_col_1_img_2}>
            <img width="100%" height="100%" src="/assets/signup/signup_mobile.jpeg" alt="Signup" />
          </div>
          <img width="100%" height="100%" className={styles.login_col_1_img} src="/assets/signup/signup_bg.jpg" alt="Signup" />
        </div> :
          <div className={styles.login_col_1}>
            <div className={styles.login_col_1_img_2}>
              <div
                style={{
                  backgroundImage: "url('/assets/signup/signup_mobile.jpeg')",
                  width: "100%",
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                  backgroundRepeat: "no-repeat",
                }}
              >
                <div
                  style={{
                    width: "100%",
                    height: "100%",
                    backgroundColor: "rgba(0,0,0,0.5)",
                  }}
                />
              </div>
              {/* <img
              width="100%"
              height="100%"
              src="/assets/signup/signup_mobile.jpeg"
              alt="Signup"
            /> */}
            </div>
          </div>}

      </div>
      {openUserVerification && <UserVerification formState={formState} setFormState={setFormState} requestnumberFunc={props.requestnumberFunc} type={type} setType={setType} sendEmailOTPFunc={props.sendEmailOTPFunc} next={handleOpenOtp} open={openUserVerification} setOpen={setOpenUserVerification} />}

      {openOTP && <OTP formState={formState} setFormState={setFormState} verifynumberFunc={props.verifynumberFunc} type={type} setType={setType}
        verifyEmailOTPFunc={props.verifyEmailOTPFunc} next={handleOpenSuccess} open={openOTP} setOpen={setOpenOTP} sendEmailOTPFunc={props.sendEmailOTPFunc} requestnumberFunc={props.requestnumberFunc} setOpenUserVerificationSuccess={setOpenUserVerificationSuccess} />}

      {/* {openUserVerificationSuccess && <UserVerificationSuccess formState={formState} setFormState={setFormState}  next={()=>router.push("/login")} type={type} setType={setType} open={openUserVerificationSuccess} setOpen={setOpenUserVerificationSuccess} isSuccess= {isSuccess} />}
         */}

    </>
  )
}
function mapStateToProp(state) {
  return {
    auth: state.Auth,
    redux: state
  };
}

function mapDispatchToProps(dispatch) {
  return {
    signup: (form) => dispatch(userSignUp(form)),
    verifynumberFunc: (form) => dispatch(verifynumber(form)),
    requestnumberFunc: (form) => dispatch(requestnumber(form)),
    verifyEmailOTPFunc: (form) => dispatch(verifyEmailOTP(form)),
    sendEmailOTPFunc: (form) => dispatch(sendEmailOTP(form)),
    confirmAccount: (email) => dispatch(confirmAccount(email)),

  };
}

export default connect(
  mapStateToProp,
  mapDispatchToProps,
)(SignUp);