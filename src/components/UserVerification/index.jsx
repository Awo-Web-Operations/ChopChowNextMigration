import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import EmailIcon from '@mui/icons-material/Email';
import PhoneAndroidIcon from '@mui/icons-material/PhoneAndroid';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: '90%', // Adjusted width for responsiveness
  maxWidth: 800, // Maximum width for larger screens
  bgcolor: 'background.paper',
  borderRadius: '8px',
};

export default function UserVerification({ next, open, setOpen, type, setType, sendEmailOTPFunc, requestnumberFunc, formState, setFormState }) {
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  console.log("type",type);
  localStorage.setItem("type", type );
  const handleOption = (title) => {
    console.log(title);
    setType(title)
    if(title  =='Email Address') { 
      sendEmailOTPFunc({ email: formState?.email})
    }else {
      requestnumberFunc({ number: formState?.phone_number})
    }

    return setTimeout(() => {
      next();   
      }, 1000);
  };

  return (
    <div>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style} style={{borderRadius:"8px"}}>
          <div className="verification">
            <h3>Complete your Registration</h3>
            <p>
              Almost there! To complete your registration, please choose an
              option to receive 6-digit verification code.
              <br />
              We only use this number to confirm that you are a valid user.
            </p>

            <div className="options">
              <h4>Choose Verification Option</h4>
              <VerificationOption
                Icon={EmailIcon}
                title={'Email Address'}
                subtitle={
                  'We will send a verification code to your email address, kindly open your mail to continue.'
                }
                action={handleOption}
                buttonTitle={'Verify with Email'}
              />
              <hr />
              <VerificationOption
                Icon={PhoneAndroidIcon}
                title={'Phone Number'}
                subtitle={
                  'To Verify with your phone number, Enter the code that will be sent to your registered phone number '
                }
                action={handleOption}
                buttonTitle={'Verify with Phone Number'}
              />
            </div>
          </div>
        </Box>
      </Modal>
    </div>
  );
}

const VerificationOption = ({ Icon, title, subtitle, action, buttonTitle }) => {
  return (
    <div className="option">
      <div className="img">
        <Icon />
      </div>
      <div className="title">
        <h6>{title}</h6>
        <small>{subtitle}</small>
      </div>
      <div className="button">
        <button className="verification-button" onClick={() => action(title)}>
          {buttonTitle}
        </button>
      </div>
    </div>
  );
};
