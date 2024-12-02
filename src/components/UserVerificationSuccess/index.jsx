import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import EmailIcon from '@mui/icons-material/Email';
import PhoneAndroidIcon from '@mui/icons-material/PhoneAndroid';
import img_logo from "../../../public/assets/logos/CC_Logo_no_bg.png";
import { useEffect } from 'react';
import { confirmAccount, userSignIn, verifyEmailOTP, verifynumber } from '../../actions';
import { useDispatch } from 'react-redux';

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
export default function UserVerificationSuccess({open, setOpen, next, type, formState, isSuccess}) {
 
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const dispatch = useDispatch()
//   const handleOption = (title) => {
// console.log(title)
//   }
console.log("isSuccess", isSuccess)
  //dispatch(userSignIn(formState?.email, formState?.password))
const handleClick = () => {

  dispatch(confirmAccount(formState.email))
  next()
}
  return (
   
     <div> 
       {isSuccess ?
       <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box  sx={style}>
          <div className='verification'>
          <div className='withbg' >   <img className='success-img' src="/assets/signup/15179-confirm-popup 1.svg" alt="Signup" /> </div>
          <h3>Account Verified</h3>
    <p>Thanks For successfully verifying your Account</p>
            
           
 

<div className='otp-options'> 
 {/* <button className='verification-button bigger' onClick={() => handleClick(type)}>Go to Homepage</button>*/}
 <button className='verification-button bigger' style= {{marginBottom: "10px"}} onClick={() => handleClick()}>Go to Homepage</button>
 </div> 
</div>
 
             
        </Box>
      </Modal>:

<Modal
open={open}
onClose={handleClose}
aria-labelledby="modal-modal-title"
aria-describedby="modal-modal-description"
>
<Box  sx={style}>
  <div className='verification'>
  <div className='withbg' >   <img className='error-img' src="/assets/signup/remove.png"  alt="Signup"/> </div>
  <h3>Account Verification Failed</h3>
            {/* <p>Thanks For successfully verifying your Account</p> */}
   


<div className='otp-options'> 
{/* <button className='verification-button bigger' onClick={() => handleClick(type)}>Go to Homepage</button>*/}
<button className='verification-button bigger' style= {{marginBottom: "10px"}} onClick={() => handleClick()}>Go to Homepage</button>
</div> 
</div>

     
</Box>
</Modal>
}
</div>
  );
}


