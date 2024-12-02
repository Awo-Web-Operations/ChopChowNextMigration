import styles from "../../../src/components/Checkout/style.module.css";
import { Loader } from "../../common";

const PlaceOrderBtn = ({ placeOrder, loading }) => {
  return (
    <div className={styles.PlaceOrderBtn_container}>
      <p>
        By placing your order you agree to our{" "}
        <a href="#">Terms & Conditions</a>,{" "}
        <a href="#">Privacy and returns policies</a>
      </p>
      <button className="cursor-pointer" onClick={placeOrder}>
        {loading ? (
          <Loader thickness={5} size={30} color="secondary" />
        ) : (
          "Place an order"
        )}
      </button>
      <a>Dummy Button for Guest Place Order</a>
    </div>
  );
};

export default PlaceOrderBtn;
