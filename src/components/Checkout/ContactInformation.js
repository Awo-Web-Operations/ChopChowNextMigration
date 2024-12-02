import styles from '../../../src/components/Checkout/style.module.css'
const ContactInformation = ({data, setData, handleChange,}) => {

  const {firstname,lastname, email, phone, address} = data
  return (
    <div className={styles.box_contact_information}>
        <h2 className={styles.sectionHeaderText}>Enter your Contact Information</h2>
        <div className={styles.contact_information}>
           <div>
                <label htmlFor='fistname'>Firstname</label>
                <input type='text' name='firstname' id='fistname'  value={firstname}
                  placeholder="first Name"
                  onChange={handleChange}/>
           </div>
           <div>
                <label htmlFor='lastname'>Lastname</label>
                <input type='text'name='lastname' id='lastname'  value={lastname}
                  placeholder="Last Name"
                  onChange={handleChange} />
           </div>
           <div>
                <label htmlFor='email'>Email address</label>
                <input type='email' name='email' id='email'   value={email}
                  placeholder="Email"
                  onChange={handleChange}/>
           </div>
           <div>
                <label htmlFor='phone'>Phone number</label>
                <input type='tel' name='phone' id='phone'  value={phone}
                  placeholder="Phone Number"
                  onChange={handleChange} />
           </div>
           <div>
                <label htmlFor='address'>Address</label>
                <input type='text' name='address' id='address'  value={address}
                  placeholder="Address"
                  onChange={handleChange}/>
           </div>
        </div>
    </div>
  )
}

export default ContactInformation