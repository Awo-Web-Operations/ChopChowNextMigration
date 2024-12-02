import React, { useState, useEffect } from "react";
import styles from "./style.module.css";
import { connect, useDispatch, useSelector } from "react-redux";
import { userSignIn, socialSignIn, verifyEmail } from "../../actions";
import img_logo from "../../../public/assets/logos/CC_Logo_no_bg.png";
import facebook from "../../../public/assets/logos/facebook.png";
import closeIcon from "../../../public/assets/icons/eva_menu-close.png";
import Image from "next/image";
import Link from "next/link";
import ForgetPassword from "../forgotpassword";
import SignUp from "../signup";
import { EyeSIcon } from "../icons";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { Loader, SimpleSnackbar } from "../../common";
import { GoogleLogin } from "@react-oauth/google";
import { useRouter } from "next/router";
import { toast } from "react-toastify";
import FacebookLogin from "react-facebook-login";
import { useAuth } from "../../context/auth.context";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import * as Crypto from "crypto-hash";
import { unHash } from "../../actions/utils";
import { jwtDecode } from "jwt-decode";
import axios from "../../util/Api";
import {
  IS_AUTHENTICATED,
  USER_DATA,
  USER_ROLE,
  USER_TOKEN_SET,
} from "../../constants/ActionTypes";
import { setSelectedUserType } from "../../reducers/userSlice";

function Login(props) {
  const isverified = useSelector((state) => state.Auth.isVerified);
  const isauthenticated = useSelector((state) => state.Auth.isAuthenticated);
  const [forgetPassword, setForgetPasswordState] = useState(false);
  const [signUp, setSignUpState] = useState(false);
  const [status, setStatusState] = useState(null);
  const [message, setMessageState] = useState(null);
  const [showPass, setShowPassState] = useState(null);
  const { isOpen, setIsOpen } = useAuth();
  const [formState, setFormState] = useState({
    email: "",
    password: "",
    rememberPassword: false,
  });
  const [loginLoading, setLoginLoading] = useState(false);
  const { email, password, rememberPassword } = formState;
  const dispatch = useDispatch();
  const [showFacebook, setShowFacebook] = useState(false);
  const router = useRouter();

  // useEffect(() => {
  //  // const currentURL = window.location.href;
  //   const {userid, token} = router.query;
  //   console.log("useeffect query", router.query)
  //   props.verifyEmail(userid, token);
  // }, [router.query])

  function openForgetPassword() {
    setForgetPasswordState(true);
  }

  function closeForgetPassword() {
    setForgetPasswordState(false);
  }

  function openSignUp() {
    // props.setSignUpState(true)
    setIsOpen(false);
    setSignUpState(true);
  }

  function closeSignUp() {
    if (isverified == "true" && isauthenticated == "true") {
      setSignUpState(true);
    } else {
      setSignUpState(false);
    }
  }

  function onChange(e) {
    setFormState({ ...formState, [e.target.name]: e.target.value });
  }
  const responseFacebook = (response) => {
    console.log(response);
  };

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (props.auth.isAuthenticated && user) {
      props.auth.authUser.super_app_admin
        ? // user.super_app_admin
        router.push("/admin")
        : router.push("/dashboard");
      setIsOpen(false);
    } else {
      // setLoginLoading(false);
    }
  }, [props.auth.isAuthenticated]);

  console.log(props);
  async function Login(e) {
    e.preventDefault();

    // props.login(email, password);
    // check redux
    // props.toggleLogin() // then redirect to dashboard

    setLoginLoading(true);

    await props.login(email, password, rememberPassword, () => {
      console.log("calling callback");
      setLoginLoading(false);
      dispatch(setSelectedUserType(Array(JSON.parse(localStorage.getItem("user") || "{}")) ? JSON.parse(localStorage.getItem("user") || "{}")?.user_type?.[0] : 'customer'));

    });

    // setTimeout(() => {
    //   setLoginLoading(false)
    // }, 3000);

    // if (props.auth.isAuthenticated) {
    //   setLoginLoading(false);
    //   toast.success("Login Successful")
    // } else {
    //   setLoginLoading(false);
    //   toast.success("Login Sucessful")

    // }
  }
  console.log("useeffect isverified", isverified);

  async function handleSocialLogin(credentialResponse) {
    console.log(credentialResponse, "credentialResponse");
    const decoded = jwtDecode(credentialResponse.credential);
    try {
      const decoded = jwtDecode(credentialResponse.credential);
      console.log(decoded, 'decoded')
      await props.login(
        decoded?.email,
        null,
        false,
        () => {
          console.log("calling callback");
          setLoginLoading(false);
        },
        true
      );
    } catch (error) {
      toast.error(
        error?.response?.data?.message?.message || "An error occured"
      );
      console.log(error, "error");
    }
    // setLoginLoading(true);
    // await props.socialLogin(credentialResponse.credential);
    // if (props.auth.isAuthenticated) {
    //   setLoginLoading(false);
    // } else {
    //   setLoginLoading(false);
    // }
  }

  function togglePass() {
    setShowPassState(!showPass);
  }

  useEffect(() => {
    (async () => {
      const hash = await unHash();
      if (hash?.email && hash?.password) {
        setFormState({
          email: hash.email,
          password: hash.password,
          rememberPassword: true,
        });
      }
    })();
  }, []);
  //{console.log("signedin", props.auth)}
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
              Adding Convenience to your Home Made Meals
            </h4>
          </div>
          <div style={{ margin: 0 }}>
            <h3 className={styles.login_col_2_welcome}>Welcome Back</h3>
            <h3 className={styles.login_col_h3}>Login</h3>
            <div className={styles.login_form}>
              <div className={styles.login_form_group}>
                <label htmlFor="email" className={styles.login_form_label}>
                  Email
                </label>
                <input
                  type='email'
                  name="email"
                  value={email}
                  placeholder="Your Email or Username"
                  onChange={onChange}
                  className={styles.login_form_input}
                />
              </div>
              <div className={styles.login_form_group}>
                <label htmlFor="password" className={styles.login_form_label}>
                  Password
                </label>
                <input
                  type={showPass ? "text" : "password"}
                  id="password"
                  name="password"
                  value={password}
                  placeholder="Your password"
                  onChange={onChange}
                  className={styles.login_form_input}
                />
                <div onClick={togglePass} className={styles.secureEye}>
                  {showPass ? <VisibilityOff /> : <Visibility />}
                </div>
              </div>

              <div
                className={styles.login_password_help}
                style={{ justifyContent: "space-between" }}
              >
                <div className={styles.login_remember_pass}>
                  <input
                    onChange={() =>
                      setFormState({
                        ...formState,
                        rememberPassword: !Boolean(rememberPassword),
                      })
                    }
                    name="rememberPassword"
                    checked={rememberPassword}
                    value={rememberPassword}
                    type="checkbox"
                  />
                  <label>Remember Password</label>
                </div>
                <div className={styles.login_forgot_pass}>
                  <Link href="/forgotpassword">Forgot your Password?</Link>
                </div>
              </div>

              <button onClick={Login} className={styles.login_button}>
                {loginLoading ? (
                  <Loader thickness={5} size={30} color="secondary" />
                ) : (
                  "Login"
                )}
              </button>

              {/* <h3 className={styles.login_new}>
              Don't have an account yet?{" "}
                <span onClick={openSignUp}>Sign up here</span>
             
            </h3> */}
            </div>
            <h3 className={styles.login_new}>
              Don't have an account yet?{" "}
              <Link legacyBehavior href="/signup">
                <a>Sign up here</a>
              </Link>{" "}
            </h3>

            <div className={styles.login_options}>
              <h3>Login with social media</h3>

              <div className={styles.flex}>
                <div>
                  {showFacebook && (
                    <FacebookLogin
                      appId={process.env.FB_APP_ID}
                      autoLoad={true}
                      fields="name,email,picture"
                      cssClass={styles.blue}
                      callback={responseFacebook}
                      render={(renderProps) => (
                        <button
                          className={styles.blue}
                          onClick={() => {
                            renderProps.onClick();
                            setShowFacebook(false);
                          }}
                        >
                          This is my custom FB button
                        </button>
                      )}
                    />
                  )}
                  {!showFacebook && (
                    <button
                      className={styles.blue}
                      onClick={() => setShowFacebook(true)}
                    >
                      Login with Facebook
                    </button>
                  )}
                </div>
                <div>
                  <GoogleLogin
                    onSuccess={async (credentialResponse) =>
                      handleSocialLogin(credentialResponse)
                    }
                    onError={() => {
                      console.log("Login Failed");
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className={styles.login_col_1}>
          <div className={styles.login_col_1_img_2}>
            {/* <img
              width="100%"
              height="100%"
              src="/assets/signup/signin_mobile.jpeg"
              alt="Signup"
            /> */}
            <div
              style={{
                backgroundImage: "url('/assets/signup/signin_mobile.jpeg')",
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
          </div>
          <img
            width="100%"
            height="100%"
            className={styles.login_col_1_img}
            src="/assets/signup/login.png"
            alt="Sign-in"
          />
        </div>
      </div>
      {/* {forgetPassword && (
      router.push("/forgotpassword")
    )}  */}
      {/* {signUp && (
        <SignUp
          closeSignUp={closeSignUp}
          toggleLogin={props.toggleLogin ? props.toggleLogin : undefined}
        />
      )} */}
      {/* {forgetPassword && (
      <ForgetPassword closeForgetPassword={closeForgetPassword} />
    )}
    {signUp && (
      <SignUp
        closeSignUp={closeSignUp}
        toggleLogin={props.toggleLogin ? props.toggleLogin : undefined}
      />
    )} */}
    </>
  );
}

function mapStateToProp(state) {
  return {
    auth: state.Auth,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    login: (email, password, rememberPassword, callback) =>
      dispatch(userSignIn(email, password, rememberPassword, callback)),
    socialLogin: (code) => dispatch(socialSignIn(code)),
    verifyEmail: (userid, token) => dispatch(verifyEmail(userid, token)),
  };
}

// export default Login;

export default connect(mapStateToProp, mapDispatchToProps)(Login);
