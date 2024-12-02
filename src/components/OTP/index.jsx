
import React, { useState, useEffect, useRef } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import EmailIcon from '@mui/icons-material/Email';
import PhoneAndroidIcon from '@mui/icons-material/PhoneAndroid';
import img_logo from "../../../public/assets/logos/CC_Logo_no_bg.png";
import { useDispatch, useSelector } from 'react-redux';
import { Router } from 'react-router-dom';
import { useRouter } from 'next/router';
import { verifyEmailOTP, verifynumber } from '../../actions';
import { toast } from "react-toastify";


const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: '90%', // Adjusted width for responsiveness
  maxWidth: 500, // Maximum width for larger screens
  bgcolor: 'background.paper',
  borderRadius: '8px',
};
export default function OTP({ next, open, setOpen, type, setType, verifyEmailOTPFunc, verifynumberFunc, formState, setFormState, sendEmailOTPFunc, requestnumberFunc, setOpenOTP }) {


  //const {}= useSelector( state => state.Auth);
  //const {isVerified}= useSelector( state => state.Common)

  let MaxLength = 6;
  const [password, setPassword] = useState(Array(MaxLength).fill(-1))
  const inpRefs = useRef(null);
  //const [close, setClose] = useState(false)
  const [activeInput, setActiveInput] = useState(-1);
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const [submissionFailed, setSubmissionFailed] = useState(false);
  //const [open, setOpen] = useState(true);
  const dispatch = useDispatch()
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(true)
  //   const handleOption = (title) => {
  // console.log(title)
  //   }

  //   const handleCodeChanges = ({target: {value}}, key) => {

  //     const _code =  code;

  //     _code[key] = value

  //     setCode(_code)
  // console.log('code', code)
  //   }



  // useEffect(()=>{
  // if(isVerified){
  //   next();
  // }
  // }
  // , [isVerified])

  const handleKeyDown = (e, i) => {
    if (e.key == "Backspace") {
      let pass = password
      pass[i] = -1
      setPassword(pass)
      setActiveInput(i - 1)
      if (i != 0) {
        let nextInput = inpRefs?.current?.[i - 1]
        //@ts-ignore
        nextInput?.focus()
      } else {
        //@ts-ignore
        inpRefs?.current?.[i].blur()
      }
    }
  }
  const handleChange = (e, i) => {
    // @ts-ignore
    //let v = e.nativeEvent["data"]
    const { value } = e.target;
    let pass = password
    //let value = parseInt(v)
    if (!isNaN(value)) {
      pass[i] = value
      setPassword(pass)
      setActiveInput(i + 1)

      // Once the input finishes it focuses button which is the next element in the form
      let nextInput = inpRefs?.current?.[i + 1]
      //@ts-ignore
      nextInput?.focus()
    }

  }
  console.log(type);
  const handleSubmit = async (event) => {
    event.preventDefault();
    let result;

    try {
      if (type === 'Email Address') {
        result = await dispatch(verifyEmailOTP({
          email: formState?.email,
          otp: password.reduce((a, b) => a + b, ""),
        }));
      } else {
        const requestId = localStorage.getItem("requestId");
        const parsedRequestId = requestId !== "undefined" ? JSON.parse(requestId) : null;

        if (parsedRequestId !== "{}" && parsedRequestId !== undefined) {
          result = await dispatch(verifynumber(parsedRequestId, password.reduce((a, b) => a + b), formState?.email));
          // setOpenOTP(false)
          // router.push("/dashboard")
        } else {
          console.error("Request ID is missing or invalid.");
          return toast.error("Request ID is missing. Please try again.");
          return;
        }
      }
    } catch (err) {
      console.error("Verification error:", err.message);
      toast.error("An error occurred during verification. Please try again.");
    } finally {
      setPassword(Array(MaxLength).fill(-1));
    }
  };



  const handleResendOtp = async () => {
    if (type == 'Email Address') {
      await sendEmailOTPFunc({ email: formState?.email })
    } else {
      await requestnumberFunc({ number: formState?.phone_number })
    }

  }

  return (
    <div>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <div className='verification'>
            <div className='withbg withcolor' >
              <img src="/assets/signup/tabler_mail-filled.svg" alt="Signup" /></div>
            <h3>Verify {type == "Email Address" ? "email address" : "your phone number"} to create a<br />new account</h3>
            <small>{type == "Email Address" ? "An email" : "A message"} with the verification code has been sent<br />to {type == "Email Address" ? formState?.email : formState?.phone_number}</small>



            <div className='options'>
              <small>Please Enter the code here</small>

              <div className='otp-inputs' >
                {/* <input onChange={(e)=>handleCodeChanges(e,0)} />
<input onChange={(e)=>handleCodeChanges(e,1)} />
<input onChange={(e)=>handleCodeChanges(e,2)} />
<input onChange={(e)=>handleCodeChanges(e,3)} />
<input onChange={(e)=>handleCodeChanges(e,4)} />
<input onChange={(e)=>handleCodeChanges(e,5)} /> */}
                <form ref={inpRefs}>
                  {password.map((digit, i) => (

                    <input type='text' key={i}
                      value={digit !== -1 ? digit : ""}
                      onKeyDown={(e) => handleKeyDown(e, i)}
                      onChange={(e) => handleChange(e, i)}
                      onFocus={() => setActiveInput(i)}
                      onBlur={() => setActiveInput(-1)}
                    ></input>

                  ))}
                  <div className='otp-options'>

                    {/* <button className='verification-button' onClick={handleSubmit} >{submitting ? "submitting" : `Verify ${type}`}</button> */}
                    <button className='verification-button' onClick={() => handleSubmit(event)} >Verify {type}</button>
                    <button className='verification-button alt' onClick={handleClose}>Cancel</button>
                  </div>

                </form>
              </div>


              <h4 style={{ marginLeft: 0, textAlign: 'center', cursor: "pointer" }}>Didn’t receive code? <span onClick={handleResendOtp}>Resend</span> </h4>





            </div>

          </div>
        </Box>
      </Modal>
      {/* {isVerified &&  next()} */}
    </div>
  );
}
