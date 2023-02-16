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
    OPEN_LOGIN
} from "../constants/ActionTypes";
import axios from '../util/Api';

export const setInitUrl = (url) => {
    return {
        type: INIT_URL,
        payload: url
    };
};

export const setOpenLogin = (login) => {
    return (dispatch) => {
        dispatch({ type: OPEN_LOGIN, payload: login });
    }
};

export const userSignUp = (form) => {
    console.log(form);
    return (dispatch) => {
        dispatch({ type: FETCH_START });
        axios.post('/user/signup', {
            ...form
        }
        ).then(({ data }) => {
            console.log("__ SignUp api res __ : ", data);
            axios.defaults.headers.common['Authorization'] = "Bearer " + data.data.token;

            localStorage.setItem('x-auth-token', data.data.token);
            localStorage.setItem('in', Date.now());
            localStorage.setItem('user', JSON.stringify(data.data.user));

            dispatch({ type: FETCH_SUCCESS, payload: 'Sign up successful' });
            dispatch({ type: USER_TOKEN_SET, payload: data.data.token });
            dispatch({ type: USER_ROLE, payload: data.data.role });
            dispatch({ type: USER_DATA, payload: data.data.user });
            dispatch({ type: IS_AUTHENTICATED, payload: true });
            // dispatch({ type: USER_DATA, payload: data.user });
            // dispatch({ type: CUSTOMER_ID, payload: data.customerID });
            setTimeout(() => {
                dispatch({ type: FETCH_SUCCESS, payload: '' });
            }, 5000)
            window.location.assign('/dashboard')
        }).catch(({request}) => {
            console.error("xxx userSignUp Request ERROR xxx");
            dispatch({ type: IS_AUTHENTICATED, payload: false });
            if(request.response){
                console.error("xxx userSignIn Request ERROR xxx", JSON.parse(request.response).message.message);
                dispatch({ type: FETCH_ERROR, payload: JSON.parse(request.response).message.message });
            }else{
                console.error("xxx userSignIn Request ERROR xxx", "Server error");
                dispatch({ type: FETCH_ERROR, payload: "Server error" });
            }
            setTimeout(() => {
                dispatch({ type: FETCH_ERROR, payload: '' });
            }, 5000)
        });
    }
};

export const userSignIn = ( email, password ) => {
    return (dispatch) => {
        dispatch({ type: FETCH_START });
        dispatch({ type: USER_TOKEN_SET, payload: null });
        dispatch({ type: USER_DATA, payload: null });
        axios.post('/user/signin', {
            email: email,
            password: password,
        }
        ).then(({ data }) => {
            console.log(" ___ userSignIn RESPONSE ___ ", data);

            axios.defaults.headers.common['Authorization'] = "Bearer " + data.data.token;

            localStorage.setItem('x-auth-token', data.data.token);
            localStorage.setItem('in', Date.now());
            localStorage.setItem('user', JSON.stringify(data.data.user));

            dispatch({ type: FETCH_SUCCESS, payload: 'Login successfull' });
            dispatch({ type: USER_TOKEN_SET, payload: data.data.token });
            dispatch({ type: USER_ROLE, payload: data.data.role });
            dispatch({ type: USER_DATA, payload: data.data.user });
            dispatch({ type: IS_AUTHENTICATED, payload: true });
            // dispatch({ type: CUSTOMER_ID, payload: data.customerID });
            // console.log(" ___ userSignIn customerID ", data.customerID);
            setTimeout(() => {
                dispatch({ type: FETCH_SUCCESS, payload: '' });
            }, 5000)
            window.location.assign('/dashboard')

        }).catch(({request}) => {
            console.log(request)
            if(request.response){
                console.error("xxx userSignIn Request ERROR xxx", JSON.parse(request.response).message.message);
                dispatch({ type: FETCH_ERROR, payload: JSON.parse(request.response).message.message });
            }else{
                console.error("xxx userSignIn Request ERROR xxx", "Server error");
                dispatch({ type: FETCH_ERROR, payload: "Server error" });
            }
            dispatch({ type: IS_AUTHENTICATED, payload: false });
            setTimeout(() => {
                dispatch({ type: FETCH_ERROR, payload: '' });
            }, 5000)
        });
    }
};

export const getUser = (id) => {
    return (dispatch) => {
        dispatch({ type: FETCH_START });
        axios.get('/user/findUser/'+id,
        ).then(({ data }) => {
            console.log(" ___ getUser RESPONSE ___ ", data.data);
            dispatch({ type: FETCH_SUCCESS });
            // dispatch({ type: USER_TOKEN_SET, payload: data.data.token });
            // dispatch({ type: USER_ROLE, payload: data.data.role });
            localStorage.setItem('user', JSON.stringify(data.data));
            dispatch({ type: USER_DATA, payload: data.data });
            dispatch({ type: IS_AUTHENTICATED, payload: true });

        }).catch(err => {
            console.error("xxx getUser Request ERROR xxx", err);
            dispatch({ type: FETCH_ERROR, payload: "Error during get me request with this token" });
            dispatch({ type: SIGNOUT_USER_SUCCESS });
        });
    }
};

export const verifyToken = (user,token) => {
    return (dispatch) => {
        dispatch({ type: FETCH_START });
        axios.get('/user/verifyToken').then(({ data }) => {
            console.log(" ___ verifyUser RESPONSE ___ ", data);
            if(data.data.id){
                localStorage.setItem('x-auth-token', token);
                localStorage.setItem('in', Date.now());
                // localStorage.setItem('user', JSON.stringify(user));
                console.log(user)
                dispatch({ type: FETCH_SUCCESS });
                dispatch({ type: USER_DATA, payload: user });
                dispatch({ type: USER_TOKEN_SET, payload: token });
                dispatch({ type: IS_AUTHENTICATED, payload: true });
            }else{
                console.log('logout')
                localStorage.removeItem('x-auth-token');
                localStorage.removeItem('in');
                localStorage.removeItem('user');
                dispatch({ type: USER_DATA, payload: [] });
                dispatch({ type: USER_TOKEN_SET, payload: '' });
                dispatch({ type: IS_AUTHENTICATED, payload: false });
                window.location.assign('/')
            }
            
        }).catch(err => {
            console.error("xxx verifyUser Request ERROR xxx", err);
            // dispatch({ type: FETCH_ERROR, payload: "Error during get me request with this token" });
            localStorage.removeItem('x-auth-token');
                localStorage.removeItem('in');
                localStorage.removeItem('user');
            dispatch({ type: SIGNOUT_USER_SUCCESS });
            dispatch({ type: IS_AUTHENTICATED, payload: false });
            // window.location.assign('/')
            setTimeout(() => {
                dispatch({ type: FETCH_ERROR, payload: '' });
            }, 5000)
        });
    }
};

export const forgotPassword = (email) => {
    return (dispatch) => {
        dispatch({ type: FETCH_START });
        axios.post('/user/forgotpassword', {email: email})
            .then(({ data }) => {
                console.log(" email sent: ", data)
                dispatch({ type: FETCH_SUCCESS });
            })
            .catch(err => {
                console.error("xxx forgotPassword Request ERROR xxx", err);
                dispatch({ type: FETCH_ERROR, payload: "Error during request to resend email" });
            });
    }
}

export const changePassword = (payload) => {
    return (dispatch) => {
        dispatch({ type: FETCH_START });
        axios.post('/change-password', payload).then(({ data }) => {
            console.log(" Change Password API RES ->> ", data);
            axios.defaults.headers.common['Authorization'] = "Bearer " + data.token;
            dispatch({ type: FETCH_SUCCESS, payload: "Password was changed successfully." });
            dispatch({ type: USER_TOKEN_SET, payload: data.token });
            dispatch({ type: USER_DATA, payload: data.user });
        }).catch(err => {
            console.error("xxx changePassword Request ERROR xxx", err.response);
            dispatch({ type: FETCH_ERROR, payload: "Password is not matched" });
        });
    }
};

export const cancelSubscription = () => {
    return (dispatch) => {
        dispatch({ type: FETCH_START });
        axios.get('/unsubscribe').then(({ data }) => {
            console.log(" Unsubscrieb API RES ->> ", data);
            axios.defaults.headers.common['Authorization'] = "Bearer " + data.token;
            dispatch({ type: FETCH_SUCCESS, payload: "Subscription was cancelled successfully." });
            dispatch({ type: USER_TOKEN_SET, payload: data.token });
            dispatch({ type: USER_DATA, payload: data.user });
        }).catch(err => {
            console.error("xxx cancel subscription Request ERROR xxx", err.response);
            dispatch({ type: FETCH_ERROR, payload: "Error during cancel subscription request." });
        });
    }
}
export const userSignOut = () => {
    return (dispatch) => {
        dispatch({ type: FETCH_START });
        localStorage.removeItem('x-auth-token');
        localStorage.removeItem('in');
        localStorage.removeItem('user');
        dispatch({ type: FETCH_SUCCESS });
        dispatch({ type: SIGNOUT_USER_SUCCESS });
        // axios.get('/user/logout',
        // ).then(({ data }) => {
        //     if (typeof window !== 'undefined') {

        //         localStorage.removeItem("token");
        //     }
        //     dispatch({ type: FETCH_SUCCESS });
        //     dispatch({ type: SIGNOUT_USER_SUCCESS });
        // }).catch(err => {
        //     console.error("xxx userSignOut Request ERROR xxx", err);
        //     dispatch({ type: FETCH_ERROR, payload: "Error during user sign out request" });
        // });
    }
};

export const resendEmail = () => {
    return (dispatch) => {
        dispatch({ type: FETCH_START });
        axios.get('/email/resend')
            .then(({ data }) => {
                console.log(" resend email api success: ", data.message)
                dispatch({ type: FETCH_SUCCESS, payload: data.message });
            })
            .catch(err => {
                console.error("xxx resendEmail Request ERROR xxx", err);
                dispatch({ type: FETCH_ERROR, payload: "Error during request to resend email" });
            });
    }
}
