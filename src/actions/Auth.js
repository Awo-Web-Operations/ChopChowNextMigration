import {
  INIT_URL,
  USER_DATA,
  USER_TOKEN_SET,
  USER_ROLE,
  CUSTOMER_ID,
  FETCH_START,
  FETCH_SUCCESS,
  FETCH_ERROR,
  SIGNOUT_USER_SUCCESS,
  IS_AUTHENTICATED,
  TRIGGER_SNACK,
  OPEN_LOGIN,
  IS_VERIFIED,
  OPEN_VERIFICATION,
  LOGIN_ON_VERIFICATION,
} from "../constants/ActionTypes";
import axios from "../util/Api";
import Alert from "@mui/material/Alert";
import { toast } from "react-toastify";
import { clear, hash } from "./utils";
export const setInitUrl = (url) => {
  return {
    type: INIT_URL,
    payload: url,
  };
};

export const setOpenLogin = (login) => {
  return (dispatch) => {
    dispatch({ type: OPEN_LOGIN, payload: login });
  };
};

export const userSignUp = (form) => async (dispatch) => {
  let userData;
  dispatch({ type: FETCH_START });
  await axios
    .post("/user/signup", {
      ...form,
    })
    .then(({ data }) => {
      userData = data.data.user;

      console.log("__ SignUp api res __ : ", data);

      console.log("auth user signup", data.data.user);
      localStorage.setItem("user", JSON.stringify(data.data.user));

      dispatch({ type: FETCH_SUCCESS });

      dispatch({ type: USER_DATA, payload: data.data.user });

      dispatch({ type: IS_VERIFIED, payload: false });

    })
    .catch((err) => {
      console.error("xxx userSignUp Request ERROR xxx");
      console.log(err?.response);
      toast.error(err?.response?.data?.message?.message);
      dispatch({ type: IS_AUTHENTICATED, payload: false });
      if (err.response.status === 422) {
        dispatch({
          type: FETCH_ERROR,
          payload:
            "Email address was already taken. If you are owner, please proceed to login with this email.",
        });
      }
    });

  if (userData) {
    console.log("__ SignUp userData __ : ", userData);
    return true;
  } else {
    return false;
  }
};

export const userSignIn = (email, password, remember, callback, withAuth) => {
  const customId = "custom-id-yes";

  console.log("withAuth", withAuth);
  return (dispatch) => {
    dispatch({ type: FETCH_START });
    dispatch({ type: OPEN_VERIFICATION, payload: false });
    dispatch({ type: LOGIN_ON_VERIFICATION, payload: false });
    dispatch({ type: USER_TOKEN_SET, payload: null });
    dispatch({ type: USER_DATA, payload: null });
    const withAuth_ = {
      password,
      email: email,
    };
    const no_withAuth_ = {
      withAuth: false,
      email: email,
    };

    axios
      .post("/user/signin", withAuth ? withAuth_ : no_withAuth_)
      .then(({ data }) => {
        console.log(" ___ userSignIn RESPONSE ___ ", data);
        console.log(" ___ userSignIn RESPONSE ___ ", data.data.token);
        axios.defaults.headers.common["Authorization"] =
          "Bearer " + data.data.token;

        console.log(remember, "rememberremember");
        if (remember) {
          hash(email, password);
        } else {
          clear();
        }
        localStorage.setItem("x-auth-token", data.data.token);
        localStorage.setItem("x-auth-refresh-token", data.data.refreshToken);
        localStorage.setItem("in", Date.now());
        localStorage.setItem("user", JSON.stringify(data.data.user));
        callback();
        dispatch({ type: FETCH_SUCCESS });
        dispatch({ type: USER_TOKEN_SET, payload: data.data.token });
        dispatch({ type: USER_ROLE, payload: data.data.role });
        dispatch({ type: USER_DATA, payload: data.data.user });
        dispatch({ type: IS_AUTHENTICATED, payload: true });
        dispatch({ type: OPEN_VERIFICATION, payload: false });
        dispatch({ type: LOGIN_ON_VERIFICATION, payload: false });

        // dispatch({ type: CUSTOMER_ID, payload: data.customerID });
        const customId = "custom-id-no";
        if (data.data.isVerified) {
          dispatch({ type: IS_VERIFIED, payload: true });
          toast.success("Login Successful", { toastId: customId });
        } else {
          toast.success(
            "Kindly Verify your account, so as to login successfully"
          );
        }

        //toast.success(data.data.message);

        return true;
      })
      .catch((err) => {
        console.log({ err });
        const customId = "custom-id-yes";
        console.error(
          "xxx userSignIn Request ERROR xxx",
          err?.response?.data?.message?.message
        );
        toast.error(err?.response?.data?.message?.message, {
          toastId: customId,
        });
        callback();
        dispatch({ type: IS_AUTHENTICATED, payload: false });
        dispatch({
          type: FETCH_ERROR,
          payload: err.message || "signin operation failed",
        });
        dispatch({
          type: TRIGGER_SNACK,
          payload: {
            showSnack: true,
            snackMessage: "signin operation failed",
          },
        });
        return false;
      });
  };
};

export const getUser = (id) => {
  return (dispatch) => {
    dispatch({ type: FETCH_START });
    axios
      .get("/user/findUser/" + id)
      .then(({ data }) => {
        console.log(" ___ getUser RESPONSE ___ ", data.data);
        dispatch({ type: FETCH_SUCCESS });
        // dispatch({ type: USER_TOKEN_SET, payload: data.data.token });
        // dispatch({ type: USER_ROLE, payload: data.data.role });
        localStorage.setItem("user", JSON.stringify(data.data));
        dispatch({ type: USER_DATA, payload: data.data });
        dispatch({ type: IS_AUTHENTICATED, payload: true });
      })
      .catch((err) => {
        console.error("xxx getUser Request ERROR xxx", err);
        dispatch({
          type: FETCH_ERROR,
          payload: "Error during get me request with this token",
        });
        dispatch({ type: SIGNOUT_USER_SUCCESS });
      });
    dispatch({ type: SIGNOUT_USER_SUCCESS });
  };
};

export const verifyToken = (user, token) => {
  return (dispatch) => {
    dispatch({ type: FETCH_START });
    axios
      .get("/user/verifyToken")
      .then(({ data }) => {
        console.log(" ___ verifyUser RESPONSE ___ ", data);
        if (data.data.id) {
          localStorage.setItem("x-auth-token", token);
          localStorage.setItem("in", Date.now());
          // localStorage.setItem('user', JSON.stringify(user));
          console.log(user);
          dispatch({ type: FETCH_SUCCESS });
          dispatch({ type: USER_DATA, payload: user });
          dispatch({ type: USER_TOKEN_SET, payload: token });
          dispatch({ type: IS_AUTHENTICATED, payload: true });
        } else {
          console.log("logout");
          localStorage.removeItem("x-auth-token");
          localStorage.removeItem("in");
          localStorage.removeItem("user");
          dispatch({ type: USER_DATA, payload: [] });
          dispatch({ type: USER_TOKEN_SET, payload: "" });
          dispatch({ type: IS_AUTHENTICATED, payload: false });
          window.location.assign("/");
        }
      })
      .catch((err) => {
        console.error("xxx verifyUser Request ERROR xxx", err);
        // dispatch({ type: FETCH_ERROR, payload: "Error during get me request with this token" });
        localStorage.removeItem("x-auth-token");
        localStorage.removeItem("in");
        localStorage.removeItem("user");
        dispatch({ type: SIGNOUT_USER_SUCCESS });
        dispatch({ type: IS_AUTHENTICATED, payload: false });
        // window.location.assign('/')
        setTimeout(() => {
          dispatch({ type: FETCH_ERROR, payload: "" });
        }, 5000);
      });
    dispatch({ type: SIGNOUT_USER_SUCCESS });
    dispatch({ type: IS_AUTHENTICATED, payload: false });
    window.location.assign("/");
  };
};

export const verifyEmail = (userid, token) => {
  return (dispatch) => {
    dispatch({ type: FETCH_START });
    axios
      .post("/user/verifyEmail", {
        userid,
        token,
      })
      .then(({ data }) => {
        console.log(" ___ verifyUser RESPONSE ___ ", data);
        console.log(" ___ verifyUser RESPONSE ___ id", data.data);
        if (data.data.id && data.data.is_verified) {
          axios.defaults.headers.common["Authorization"] =
            "Bearer " + data.data.token;

          localStorage.setItem("x-auth-token", data.data.token);
          localStorage.setItem("x-auth-refresh-token", data.data.refreshToken);
          localStorage.setItem("in", Date.now());
          localStorage.setItem("user", JSON.stringify(data.data.user));

          dispatch({ type: FETCH_SUCCESS });
          dispatch({ type: USER_TOKEN_SET, payload: data.data.token });
          dispatch({ type: USER_ROLE, payload: data.data.role });
          dispatch({ type: USER_DATA, payload: data.data.user });
          dispatch({ type: IS_AUTHENTICATED, payload: true });
          dispatch({ type: IS_VERIFIED, payload: true });

          // dispatch({ type: CUSTOMER_ID, payload: data.custom
        } else {
          console.log("logout");
          localStorage.removeItem("x-auth-token");
          localStorage.removeItem("in");
          localStorage.removeItem("user");
          dispatch({ type: USER_DATA, payload: [] });
          dispatch({ type: USER_TOKEN_SET, payload: "" });
          dispatch({ type: IS_AUTHENTICATED, payload: false });
          window.location.assign("/");
        }
      })
      .catch((err) => {
        console.error("xxx verifyUser Request ERROR xxx", err);
        // dispatch({ type: FETCH_ERROR, payload: "Error during get me request with this token" });
        localStorage.removeItem("x-auth-token");
        localStorage.removeItem("in");
        localStorage.removeItem("user");
        dispatch({ type: SIGNOUT_USER_SUCCESS });
        dispatch({ type: IS_AUTHENTICATED, payload: false });
        // window.location.assign('/')
        setTimeout(() => {
          dispatch({ type: FETCH_ERROR, payload: "" });
        }, 5000);
      });
    dispatch({ type: SIGNOUT_USER_SUCCESS });
    dispatch({ type: IS_AUTHENTICATED, payload: false });
    window.location.assign("/");
  };
};

export const changePassword = (payload) => {
  return (dispatch) => {
    dispatch({ type: FETCH_START });
    axios
      .post("/change-password", payload)
      .then(({ data }) => {
        console.log(" Change Password API RES ->> ", data);
        axios.defaults.headers.common["Authorization"] = "Bearer " + data.token;
        dispatch({
          type: FETCH_SUCCESS,
          payload: "Password was changed successfully.",
        });
        dispatch({ type: USER_TOKEN_SET, payload: data.token });
        dispatch({ type: USER_DATA, payload: data.user });
      })
      .catch((err) => {
        console.error("xxx changePassword Request ERROR xxx", err.response);
        dispatch({ type: FETCH_ERROR, payload: "Password is not matched" });
      });
  };
};

export const forgotPassword = (email) => {
  return (dispatch) => {
    dispatch({ type: FETCH_START });
    axios
      .post("/user/forgotpassword", { email: email })
      .then(({ data }) => {
        console.log(" email sent: ", data);
        dispatch({ type: FETCH_SUCCESS, payload: data.message });
      })
      .catch((err) => {
        console.error("xxx forgotPassword Request ERROR xxx", err);
        dispatch({
          type: FETCH_ERROR,
          payload: "Error during request to resend email",
        });
      });
  };
};

export const cancelSubscription = () => {
  return (dispatch) => {
    dispatch({ type: FETCH_START });
    axios
      .get("/unsubscribe")
      .then(({ data }) => {
        console.log(" Unsubscrieb API RES ->> ", data);
        axios.defaults.headers.common["Authorization"] = "Bearer " + data.token;
        dispatch({
          type: FETCH_SUCCESS,
          payload: "Subscription was cancelled successfully.",
        });
        dispatch({ type: USER_TOKEN_SET, payload: data.token });
        dispatch({ type: USER_DATA, payload: data.user });
      })
      .catch((err) => {
        console.error(
          "xxx cancel subscription Request ERROR xxx",
          err.response
        );
        dispatch({
          type: FETCH_ERROR,
          payload: "Error during cancel subscription request.",
        });
      });
  };
};
export const userSignOut = () => {
  return (dispatch) => {
    dispatch({ type: FETCH_START });
    dispatch({ type: OPEN_VERIFICATION, payload: false });
    localStorage.removeItem("x-auth-token");
    localStorage.removeItem("x-auth-refresh-token");
    localStorage.removeItem("in");
    localStorage.removeItem("user");
    localStorage.removeItem("cartItems");
    dispatch({ type: FETCH_SUCCESS });
    dispatch({ type: SIGNOUT_USER_SUCCESS });
  };
};

export const resendEmail = () => {
  return (dispatch) => {
    dispatch({ type: FETCH_START });
    axios
      .post("/email/resend")
      .then(({ data }) => {
        console.log(" resend email api success: ", data.message);
        dispatch({ type: FETCH_SUCCESS, payload: data.message });
      })
      .catch((err) => {
        console.error("xxx resendEmail Request ERROR xxx", err);
        dispatch({
          type: FETCH_ERROR,
          payload: "error resending email",
        });
        dispatch({
          type: TRIGGER_SNACK,
          payload: {
            showSnack: true,
            snackMessage: "error resending email",
          },
        });
      });
  };
};

export const socialSignIn = (token) => {
  return (dispatch) => {
    dispatch({ type: FETCH_START });
    dispatch({ type: USER_TOKEN_SET, payload: null });
    dispatch({ type: USER_DATA, payload: null });
    axios
      .post("/google/login", {
        token: token,
      })
      .then(({ data }) => {
        axios.defaults.headers.common["Authorization"] =
          "Bearer " + data.data.token;

        localStorage.setItem("x-auth-token", data.data.token);
        localStorage.setItem("in", Date.now());
        localStorage.setItem("user", JSON.stringify(data.data.user));

        dispatch({ type: FETCH_SUCCESS });
        dispatch({ type: USER_TOKEN_SET, payload: data.data.token });
        dispatch({ type: USER_ROLE, payload: data.data.role });
        dispatch({ type: USER_DATA, payload: data.data.user });
        dispatch({ type: IS_AUTHENTICATED, payload: true });
        dispatch({ type: IS_VERIFIED, payload: true });
        dispatch({ type: EMAIL_VERIFIED, payload: true });
      })
      .catch((err) => {
        console.error("xxx userSignIn Request ERROR xxx", err);
        dispatch({ type: IS_AUTHENTICATED, payload: false });
        dispatch({
          type: FETCH_ERROR,
          payload: err.message || "signin operation failed",
        });
        dispatch({
          type: TRIGGER_SNACK,
          payload: {
            showSnack: true,
            snackMessage:
              err?.response?.data?.message?.message ||
              "signin operation failed",
          },
        });

        return false;
      });
  };
};

export const sendEmailOTP = ({ email }) => {
  return (dispatch) => {
    dispatch({ type: FETCH_START });
    axios
      .post("/user/sendemailotp", { email })
      .then(({ data }) => {
        console.log(" resend email api success ----: ", data.message);
        dispatch({ type: FETCH_SUCCESS, payload: data.message });
      })
      .catch((err) => {
        dispatch({
          type: FETCH_ERROR,
          payload: "error resending email",
        });
        dispatch({
          type: TRIGGER_SNACK,
          payload: {
            showSnack: true,
            snackMessage: "error resending email",
          },
        });
      });
  };
};

// export const OpenVerification = () => {
//   return (dispatch) => {
//     dispatch({ type: FETCH_START });
//     axios
//       .post("/user/sendemailotp",{email})
//       .then(({ data }) => {
//         console.log(" resend email api success ----: ", data.message);
//         dispatch({ type: FETCH_SUCCESS, payload: data.message });
//         dispatch({ type: OPEN_VERIFICATION, payload: true });
//       })
//       .catch((err) => {
//         dispatch({
//           type: FETCH_ERROR,
//           payload: "error resending email",
//         });
//         dispatch({
//           type: TRIGGER_SNACK,
//           payload: {
//             showSnack: true,
//             snackMessage: "error resending email",
//           },
//         });
//       });
//   };
// };

export const verifyEmailOTP = ({ email, otp }) => {
  return async (dispatch) => {
    try {
      dispatch({ type: OPEN_VERIFICATION, payload: true });
      dispatch({ type: FETCH_START });

      const { data } = await axios.post("/user/verifyEmailOTP", { email, otp });

      console.log("resend email API success:", data.message);
      console.log("resend email API success:", data.data.user);

      if (data?.data?.success) {
        localStorage.setItem("x-auth-token", data.data.token);
        localStorage.setItem("x-auth-refresh-token", data.data.refreshToken);
        localStorage.setItem("in", Date.now());
        localStorage.setItem("user", JSON.stringify(data.data.user));

        dispatch({ type: FETCH_SUCCESS });
        dispatch({ type: USER_TOKEN_SET, payload: data.data.token });
        dispatch({ type: USER_ROLE, payload: data.data.role });
        dispatch({ type: USER_DATA, payload: data.data.user });
        dispatch({ type: IS_AUTHENTICATED, payload: true });
        dispatch({ type: IS_VERIFIED, payload: true });
        // dispatch({ type: EMAIL_VERIFIED, payload: true });
        toast.success("Email verification successful!");
        return { success: true, data };
      }
    } catch (err) {
      dispatch({
        type: FETCH_ERROR,
        payload: "Error verifying email",
      });
      dispatch({
        type: TRIGGER_SNACK,
        payload: {
          showSnack: true,
          snackMessage: "Error verifying email",
        },
      });
      if (err.response?.data?.message?.message === "Incorrect OTP") {
        return {
          success: false,
          message: err.response?.data?.message?.message,
        };
      }

      return {
        success: false,
        message: err.response?.data?.message || "Error resending email",
      };
    }
  };
};

export const requestnumber = ({ number }) => {
  return (dispatch) => {
    dispatch({ type: FETCH_START });
    axios
      .post("/user/requestnumber", { number })
      .then(({ data }) => {
        console.log(" resend email api success: ", data);
        dispatch({ type: FETCH_SUCCESS, payload: data.message });
        localStorage.setItem("requestId", JSON.stringify(data.request_id));
      })
      .catch((err) => {
        dispatch({
          type: FETCH_ERROR,
          payload: "error resending email",
        });
        dispatch({
          type: TRIGGER_SNACK,
          payload: {
            showSnack: true,
            snackMessage: "error resending email",
          },
        });
      });
  };
};

export const verifynumber = (request_id, code, email) => {
  return (dispatch) => {
    dispatch({ type: OPEN_VERIFICATION, payload: true });
    dispatch({ type: FETCH_START });
    console.log("request_id", request_id);

    axios
      .post("/user/verifynumber", { request_id, code, email })
      .then(({ data }) => {
        console.log("Verification API success: ", data.message);
        if (data?.data?.success) {
          dispatch({ type: USER_DATA, payload: data.data.user });
          dispatch({ type: IS_AUTHENTICATED, payload: true });
          toast.success("Phone number verification successful");
          return { success: true, data };
        }
      })
      .catch((err) => {
        dispatch({
          type: FETCH_ERROR,
          payload: "Error resending email",
        });
        dispatch({
          type: TRIGGER_SNACK,
          payload: {
            showSnack: true,
            snackMessage: "Error resending email",
          },
        });

        const errorMessage =
          err.response?.data?.message || "Error resending email";
        toast.error(errorMessage);
        return { success: false, message: errorMessage };
      });
  };
};

export const resetPassword = (password, token) => {
  return (dispatch) => {
    dispatch({ type: FETCH_START });
    axios
      .post("/user/resetpassword", { token, password })
      .then(({ data }) => {
        console.log(" reset password api: ", data.message);
        dispatch({ type: FETCH_SUCCESS, payload: data.message });
      })
      .catch((err) => {
        console.error("xxx error resetting password ERROR xxx", err);
        var message = "";
        if (err.response.status === 400 || err.response.status === 404) {
          message = "Bad Request , Check username or email ... !!";
        } else if (err.response.status === 401) {
          message = "you are UnAuthorized";
        } else if (err.response.status >= 500) {
          message = "Sorry , Internal Server ERROR";
        } else {
          message = "Please check your inbox for more details! ";
        }

        dispatch({
          type: FETCH_ERROR,
          payload: message,
        });
      });
  };
};

export const confirmAccount = (email) => async (dispatch) => {
  let userData;
  dispatch({ type: OPEN_VERIFICATION, payload: false });
  dispatch({ type: FETCH_START });
  await axios
    .post("/user/confirmaccount", {
      email,
    })
    .then(({ data }) => {
      userData = data.data.user;

      console.log("__ confirmUser api res __ : ", userData);
      if (userData) {
        dispatch({ type: LOGIN_ON_VERIFICATION, payload: true });
        dispatch({ type: OPEN_VERIFICATION, payload: false });
      } else {
        dispatch({ type: LOGIN_ON_VERIFICATION, payload: false });
        dispatch({ type: OPEN_VERIFICATION, payload: false });
      }
    })
    .catch((err) => {
      dispatch({
        type: FETCH_ERROR,
        payload: "error retrieving account by email - email not found",
      });
    });
};

// export const confirmAccount = (email, cb) =>
//   async (dispatch) => {
//     try {
//       dispatch({ type: OPEN_VERIFICATION, payload: false });
//       dispatch({ type: FETCH_START });

//       const response = await axios.post("/user/confirmaccount", { email });
//       const userData = response.data.data.user;

//       console.log("__ confirmUser api res __ : ", userData);

//       if (userData) {
//         dispatch({ type: LOGIN_ON_VERIFICATION, payload: true });
//         dispatch({ type: OPEN_VERIFICATION, payload: false });
//         cb(true); // Return true if the user data exists
//       } else {
//         dispatch({ type: LOGIN_ON_VERIFICATION, payload: false });
//         dispatch({ type: OPEN_VERIFICATION, payload: false });
//         cb(false); // Return false if user data doesn't exist
//       }
//     } catch (err) {
//       dispatch({
//         type: FETCH_ERROR,
//         payload: "Error retrieving account by email - email not found",
//       });
//       return false; // Return false if there is an error
//     }
//   }

// dispatch({
//   type: TRIGGER_SNACK,
//   payload: {
//     showSnack: true,
//     snackMessage: "error resending email",
//   },
// });
