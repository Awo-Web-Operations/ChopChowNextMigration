import { useEffect } from "react";
import styles from "../../../src/components/Checkout/style.module.css";

const PaymentMethod = ({ data, setData, handleChange, cardErrors }) => {
  const changePaymentMethod = (method) => {
    setData((prevData) => ({ ...prevData, paymentMethod: method }));
  };

  useEffect(() => {
    if (!data.paymentMethod) {
      changePaymentMethod("card");
    }
  }, [data.paymentMethod]);

  return (
    <div className={styles.paymentMethod}>
      <div className={styles.paymentHeader}>
        <h2 className={styles.sectionHeaderText}>Payment Method</h2>
        <p>Complete your purchase by providing your payment details</p>
      </div>
      <div className={styles.paymentTypeSelection}>
        <span
          onClick={() => changePaymentMethod("card")}
          className={
            data.paymentMethod === "card" ? styles.activeCardSelection : ""
          }
        >
          <img src="/assets/checkout/CreditCard.svg" alt="Credit Card" />
          Card
        </span>
        <span
          onClick={() => changePaymentMethod("paypal")}
          className={
            data.paymentMethod === "paypal" ? styles.activeCardSelection : ""
          }
        >
          <img src="/assets/checkout/paypal-logo.svg" alt="PayPal" />
        </span>
        <span
          onClick={() => changePaymentMethod("sezzle")}
          className={
            data.paymentMethod === "sezzle" ? styles.activeCardSelection : ""
          }
        >
          Sezzle
        </span>
      </div>

      {data.paymentMethod === "card" ? (
        <div className={styles.cardDetailsInput}>
          <div className={styles.cardTypeSelection}>
            <p>Choose card type</p>
            <div className={styles.availableCards}>
              {["mastercard", "visa", "american"].map((type) => (
                <label key={type}>
                  <input
                    type="radio"
                    name="cardtype"
                    onChange={(e) => handleChange(e)}
                    value={type}
                  />
                  <span>
                    <img src={`/assets/logos/${type}.png`} />
                  </span>
                </label>
              ))}
            </div>
          </div>
          <hr />
          <div className={styles.inputs}>
            <div>
              <label htmlFor="fullname">Fullname</label>
              <input
                type="text"
                name="fullname"
                value={data.fullname || ""}
                onChange={handleChange}
              />
              {cardErrors.fullname && (
                <p className={styles.errorText}>{cardErrors.fullname}</p>
              )}
            </div>
            <div>
              <label htmlFor="card_number">Card number</label>
              <input
                type="text"
                name="card_number"
                value={data.card_number || ""}
                onChange={handleChange}
              />

              {cardErrors.card_number && (
                <p className={styles.errorText}>{cardErrors.card_number}</p>
              )}
            </div>
            <div>
              <input
                type="text"
                placeholder="DD"
                name="expiry_day"
                value={data.expiry_day || ""}
                onChange={handleChange}
              />
              /
              <input
                type="text"
                placeholder="MM"
                name="expiry_month"
                value={data.expiry_month || ""}
                onChange={handleChange}
              />
              /
              <input
                type="text"
                placeholder="YY"
                name="expiry_year"
                value={data.expiry_year || ""}
                onChange={handleChange}
              />
              {cardErrors.expiry_date && (
                <p className={styles.errorText}>{cardErrors.expiry_date}</p>
              )}
            </div>
            <div>
              <input
                type="text"
                placeholder="CVV"
                name="cvv"
                value={data.cvv || ""}
                onChange={handleChange}
              />
              {cardErrors.cvv && (
                <p className={styles.errorText}>{cardErrors.cvv}</p>
              )}
            </div>
          </div>
          <div className={styles.billingAddress}>
            <p className={styles.sectionHeaderText}>Billing Address</p>
            <div>
              <label className={styles.billingAddressCheck}>
                <input
                  type="checkbox"
                  name="sameAsShipping"
                  checked={data.sameAsShipping || false}
                  onChange={(e) =>
                    setData({ ...data, sameAsShipping: e.target.checked })
                  }
                />
                <p>Billing Address is the same as the shipping address</p>
              </label>
            </div>
          </div>
        </div>
      ) : data.paymentMethod === "paypal" ? (
        <div className={styles.cardDetailsInput}>
          <h2>PayPal is not available for now</h2>
        </div>
      ) : (
        <div className={styles.cardDetailsInput}>
          <h2>Sezzle is not available for now</h2>
        </div>
      )}
    </div>
  );
};

export default PaymentMethod;
