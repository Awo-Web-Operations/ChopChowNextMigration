import styles from "../../../src/components/Checkout/style.module.css";
const DeliveryAddress = ({ data, setData, handleChange }) => {
  const {
    address1,
    address2,
    state,
    city,
    postalcode,
    country,
    delivery_note,
  } = data;
  return (
    <div className={styles.box_deliveryAddress}>
      <h2 className={styles.sectionHeaderText}>Delivery Address</h2>
      <div className={styles.deliveryAddress}>
        <div className={styles.deliveryAddressUpper}>
          <div>
            <label htmlFor="address1">Street address 1</label>
            <input
              type="text"
              name="address1"
              id="fistname"
              value={address1}
              placeholder="Address 1"
              onChange={handleChange}
            />
          </div>
          <div>
            <label htmlFor="address2">Street address 2</label>
            <input
              type="text"
              name="address2"
              id="address2"
              value={address2}
              placeholder="Address 2"
              onChange={handleChange}
            />
          </div>
          <div>
            <label htmlFor="state">State / Province</label>
            <input
              type="text"
              name="state"
              id="email"
              value={state}
              placeholder="State"
              onChange={handleChange}
            />
          </div>
          <div>
            <label htmlFor="city">City</label>
            <input
              type="text"
              name="city"
              id="phone"
              value={city}
              placeholder="City"
              onChange={handleChange}
            />
          </div>
          <div>
            <label htmlFor="postalcode">Zip / Postal code</label>
            <input
              type="tel"
              name="postalcode"
              id="address"
              value={postalcode}
              placeholder="Postal code"
              onChange={handleChange}
            />
          </div>
          <div>
            <label htmlFor="country">Country</label>
            <input
              type="text"
              name="country"
              id="address"
              value={country}
              placeholder="Country"
              onChange={handleChange}
            />
          </div>
        </div>
        <hr />
        <div className={styles.deliveryAddressLower}>
          <div>
            <label htmlFor="delivery_note">Delivery Note</label>
            <textarea
              name="delivery_note"
              value={delivery_note}
              placeholder="Delivery Note"
              onChange={handleChange}
            ></textarea>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeliveryAddress;
