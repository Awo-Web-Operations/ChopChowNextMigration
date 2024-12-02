import React, { useState } from 'react';
import styles from '../Login/style.module.css';
import style from './style.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faLock, faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import ResetPasswordSuccess from '../resetPasswordSuccess';
import { connect, useSelector } from 'react-redux';
import { useRouter } from 'next/router';
import { resetPassword } from '../../actions';
//import { Form, Button, Container, Modal, Row, Col, ButtonToolbar } from 'react-bootstrap';
// import { setTimeout } from 'timers';

function Resetpassword (props) {

  const router = useRouter();
  const {status} = useSelector(state => state.Common)
  const [success, setSuccess] = useState(false);
  const [open, setOpen] = useState(false)
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);
  const [formState, setformState] = useState({
    password1: "",
    password2: "",
  });

  const [error, setError] = useState({
    password1: "",
    password2: "",
  })
const { password1, password2} = formState

  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  const toggleConfirmPasswordVisibility = () => {
    setConfirmPasswordVisible(!confirmPasswordVisible);
  };
  
  const handleChange = (e) => {
    setformState({...formState, [e.target.name] : e.target.value});
    validateInput(e);
  }

  const validateInput = e => {
    let { name, value } = e.target;
    setError(prev => {
      const stateObj = { ...prev, [name]: "" };
 
      switch (name) {
       
 
        case "password1":
          if (!value) {
            stateObj[name] = "Please enter Password";
          } else if (password && value !== password2) {
            stateObj["password2"] = "Password and Confirm Password does not match.";
          } else {
            stateObj["password2"] = password2 ? "" : error.password2;
          }
          break;
 
        case "password2":
          if (!value) {
            stateObj[name] = "Please enter Confirm Password.";
          } else if (password2 && value !== password1) {
            stateObj[name] = "Password and Confirm Password does not match.";
          }
          break;
 
        default:
          break;
      }
 
      return stateObj;
    });
  }

  function formSubmit(e){
    e.preventDefault(); 
    // Run validation logic
  const validationErrors = validateInput(e) ?? {};

  // Check if there are any validation errors
  if (Object.values(validationErrors).some((error) => error !== '')) {
    setError(validationErrors);
    console.error('Form validation failed:', validationErrors);
    return;
  }
      props.resetPass(
        password1,
        token
      );
      setOpen(true)
     
    }

 const next = () => {
  router.push("/login")
 }

  const { email, token} = router.query;
  console.log("useeffect query", router.query)

  if(token !== "" && token !== null){
  return(

    <div >
      <div className={style.resetpassword}> 
      
      </div>
      <div className={style.container}>
          
            <div className = {style.ellipse}><FontAwesomeIcon icon={faLock}size="3x" /></div>
            <h3>Reset Password</h3>
            <div className={style.reset_text}>
            
            <h4>Enter a new password for {email}</h4>
            </div>
         
          <div className={style.inputgroup}>
            <form action="" className={style.formInput}>
              <div >
                <div className={style.inputlabel}>
                <label htmlFor="New Password" >New Password</label>
                </div>
               <div className={style.password_wrapper}>
                <input 
                className={styles.login_form_input}
                type={passwordVisible ? 'text' : 'password'}  
                placeholder="Password" 
                name="password1" 
                value={password1}
                id="password"
                onChange={handleChange}
                onBlur={validateInput}
               />
                <button
            type="button"
            className={style.password_toggle}
            onClick={togglePasswordVisibility}
          >
            <FontAwesomeIcon icon={passwordVisible ? faEye : faEyeSlash} />
          </button>
          </div>
              </div>
              {error.password1 && <span style={{color: "#FF0000", fontSize: 14}}>{error.password1}</span>}
              <div >
                <div>
                <label htmlFor="Confirm Password" className={style.inputlabel}>Confirm Password</label>
                </div>
                <div className={style.password_wrapper} >
                <input 
                className={styles.login_form_input}
                type={confirmPasswordVisible ? 'text' : 'password'}
                name="password2" 
                id="confirm-password"
                value={password2}
                placeholder="Confirm Password"
                onChange={handleChange}
                onBlur={validateInput} />
                <button
            type="button"
            className={style.password_toggle}
            onClick={toggleConfirmPasswordVisibility}
          >
            <FontAwesomeIcon icon={confirmPasswordVisible ? faEye : faEyeSlash} />
          </button>
          </div>
              </div>
              {error.password2 && <span style={{color: "#FF0000", fontSize: 14}}>{error.password2}</span>}
             
              <button type="reset" className={style.button} onClick={formSubmit}>Reset Password</button>    
            
            
            </form>
        </div>
      </div>
    {status && open  && <ResetPasswordSuccess open={open} setOpen={setOpen} next={next} />}
    </div>
    
  )} else {
    return (
        <Modal show={this.state.showModal} onHide={this.handleClose} className="modal resetpassword" backdrop="static">
          <Modal.Header closeButton>
            <Modal.Title style={{ width: '100%', textAlign: 'center' }}>
              <div>Something wrong with yout token please try again.</div>
            </Modal.Title>
          </Modal.Header>
          
              </Modal>
            )
      
  }
  
}



function mapStateToProp(state) {
  return {
    auth: state.Auth,
    redux: state
  };
}

function mapDispatchToProps(dispatch) {
  return {
    resetPass: (password1, token) => dispatch(resetPassword(password1, token))

  };
}

export default connect(
  mapStateToProp,
  mapDispatchToProps,
)(Resetpassword);

// export default class ResetPassword extends React.Component {
//   state = {
//     password1: '',
//     password2: '',
//     messageErr: false,
//     messageSuccess: false,
//     showModal: true,
//   };


//   handleChange = (e) => {
//     let name = e.currentTarget.name;
//     let value = e.currentTarget.value;
//     this.setState({ [name]: value });
//   }


//   handleClose = (delay) => {
//     // setTimeout(() => {
//       this.props.history.push('/grocery');
//     // }, delay || 0);
//   };

//   formSubmit = (e) => {
//     e.preventDefault();
//     if((this.state.password1 || this.state.password2)) {
//       this.submitForm();
//     } else {
//       this.setState({ messageErr: 'Please enter correct data.' });
//     }
//   };

//   submitForm = () => {
//     let token = this.props.location.search.replace('?', '').split('=')[1];
//     let formData = Object.assign({}, this.state, {token})
//     fetch('/api/resetpass', {
//       method: 'POST',
//       credentials: 'include',
//       headers: {
//         'Content-type': 'application/json',
//       },
//       body: JSON.stringify(formData),
//     }).then(response => {
//         if (response.status === 400 || response.status === 404) {
//           this.setState({ messageErr: 'Bad Request , Check username or email ... !!' });
//         } else if (response.status === 401) {
//           this.setState({ messageErr: 'you are UnAuthorized' });
//         } else if (response.status >= 500) {
//           this.setState({ messageErr: 'Sorry , Internal Server ERROR' })
//         } else {
//           this.setState({ messageErr: '', isAuthenticated: true, messageSuccess: 'Please check your inbox for more details! ' });
//           this.handleClose(5000);
//         }
//       })
//   };

//   render() {

// let isItReset = this.props.location.search.replace('?', '').split('=');
// if(isItReset.length > 1) {
//   isItReset = isItReset[1];
//   return (
//     <Modal show={this.state.showModal} onHide={this.handleClose} className="modal resetpassword" backdrop="static">
//       <Modal.Header closeButton>
//         <Modal.Title style={{ width: '100%', textAlign: 'center' }}>
//           <div>Reset Password</div>
//         </Modal.Title>
//       </Modal.Header>
//       <Modal.Body>
//         <Container>
//           <Row className="justify-content-md-center">
//             <Col xs lg>
//               <Form className="" onSubmit={this.formSubmit}>
//               <Form.Group>
//               <Form.Control type="hidden" name="token" value={isItReset} />
//                 <Form.Control
//                           type="password"
//                           name="password1"
//                           value={this.state.password1}
//                           placeholder="New Password"
//                           onChange={this.handleChange}
//                         />
                    
//                       </Form.Group>
//                       <Form.Label></Form.Label>
//                       <Form.Group>
//                       <Form.Control
//                           type="password"
//                           name="password2"
//                           value={this.state.password2}
//                           placeholder="Retype Password"
//                           onChange={this.handleChange}
//                         />
//                         <Form.Label></Form.Label>
                        
//                       </Form.Group>
                      
//                       <p className="msg-success">{this.state.messageSuccess}</p>
//                       <p className="msg-err">{this.state.messageErr}</p>
//                       <ButtonToolbar>
//                         <Button variant="secondary" type="submit" className="login__form-btn">Reset</Button>
//                       </ButtonToolbar>
                      
//                     </Form>
//                   </Col>
//                 </Row>
//               </Container>
//             </Modal.Body>
//           </Modal>
//         );
// } else {
//   return (
//     <Modal show={this.state.showModal} onHide={this.handleClose} className="modal resetpassword" backdrop="static">
//       <Modal.Header closeButton>
//         <Modal.Title style={{ width: '100%', textAlign: 'center' }}>
//           <div>Something wrong with yout token please try again.</div>
//         </Modal.Title>
//       </Modal.Header>
      
//           </Modal>
//         )
  
// }


//   }

// }
