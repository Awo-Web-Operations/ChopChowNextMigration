import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import EmailIcon from '@mui/icons-material/Email';
import PhoneAndroidIcon from '@mui/icons-material/PhoneAndroid';
import img_logo from "../../../public/assets/logos/CC_Logo_no_bg.png";

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
export default function ResetPasswordSuccess({open, setOpen, next}) {
  //
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const handleOption = (title) => {
console.log(title)
  }

  return (
    <div> 
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box  sx={style}>
          <div className='verification'>
          <div className='withbg' >   <img className='success-img' src="/assets/signup/15179-confirm-popup 1.svg" alt="Signup" /> </div>
            <h3>Password Reset</h3>
            <p>Login with you new password</p>
           
 

<div className='otp-options'> 
 <button className='verification-button bigger' onClick={next()}>Login Now</button>
 </div>
</div>
 
             
        </Box>
      </Modal>
    </div>
  );
}
