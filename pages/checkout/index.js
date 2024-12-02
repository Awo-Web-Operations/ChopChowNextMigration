import React, { useState } from "react";

import { useRouter } from "next/router";
import styles from "../../src/components/Checkout/style.module.css";
import GoBack from "../../src/components/CommonComponents/goBack";
import Header, { Header2 } from "../../src/components/Header/Header";
import Head from "next/head";
import Footer from "../../src/components/Footer/Footer";
import Subscription from "../../src/components/Checkout/Subscription";
import Delivery from "../../src/components/Checkout/Delivery";
import ContactInformation from "../../src/components/Checkout/ContactInformation";
import PaymentMethod from "../../src/components/Checkout/PaymentMethod";
import DeliveryAddress from "../../src/components/Checkout/DeliveryAddress";
import PlaceOrderBtn from "../../src/components/Checkout/PlaceOrderBtn";
import OrderSummary from "../../src/components/Checkout/OrderSummary";
import { useDispatch, useSelector } from "react-redux";
import cardValidator from "card-validator";
import axios from "../../src/util/Api";
import { toast } from "react-toastify";

const validationMessages = {
  firstname: "Please enter your first name.",
  lastname: "Please enter your last name.",
  email: "Please enter your email address.",
  phone: "Please enter your phone number.",
  address: "Please enter your home address.",
  address1: "Please enter other address.",
  address2: "Please enter other address.",
  state: "Please enter your state.",
  city: "Please enter your city.",
  postalcode: "Please enter your postal code.",
  country: "Please enter your country.",
  delivery_note: "Kindly enter a Delivery Note.",
  subscription: "Kindly select a subscription plan.",
  dateOfDelivery: "Select a date for your delivery.",
};

const Checkout = () => {
  const router = useRouter();
  const { id } = router.query;
  const { cartItems: items } = useSelector((state) => {
    return state.Cart;
  });
  const [deliveryType, setDeliveryType] = useState();
  const [tax, setTax] = useState(40);
  const [creatingOrder, setCreatingOrder] = useState(false);

  const dispatch = useDispatch();

  const SubTotal = items.reduce((a, c) => a + c.price * c.amount, 0);

  const TotalPrice = (SubTotal + tax).toFixed(2);

  const [error, setError] = useState({
    subscription: "",
    dateOfDelivery: "",
    Delivery: "",
    firstname: "",
    lastname: "",
    email: "",
    phone: "",
    address: "",
    address1: "",
    address12: "",
    state: "",
    city: "",
    postalcode: "",
    country: "",
    delivery_note: "",
    timetodeliver: "",
  });
  const payload = {
    subscription: "",
    dateOfDelivery: "",
    Delivery: "",
    firstname: "",
    lastname: "",
    email: "",
    phone: "",
    address: "",
    address1: "",
    address12: "",
    state: "",
    city: "",
    postalcode: "",
    country: "",
    delivery_note: "",
    timetodeliver: "",
  };
  const [data, setData] = useState(payload);
  const [cardErrors, setCardErrors] = useState({});

  const formatOrderPayload = (data, items) => {
    return {
      order_items: items.map((item) => item.itemId),

      user: data.userId,

      pickup_details: `${data.firstname} ${data.lastname}, ${data.phone}, ${data.address}, ${data.city}, ${data.state}, ${data.country}, ${data.postalcode}`,

      delivery_details: {
        address: data.address,
        address1: data.address1,
        state: data.state,
        city: data.city,
        postalcode: data.postalcode,
        country: data.country,
        delivery_note: data.delivery_note,
        timetodeliver: data.timetodeliver,
      },

      payment_details: {
        subscription: data.subscription,
        dateOfDelivery: data.dateOfDelivery,
        Delivery: data.Delivery,
      },

      total: TotalPrice,

      pickup_or_delivery: data?.pickupOrDelivery || "",

      frequency_to_deliver: data?.frequency_to_deliver || "",

      subtotal: data.SubTotal,
    };
  };

  const placeOrder = () => {
    if (
      Object.keys(cardErrors).length === 0 &&
      Object.values(error).every((message) => message === "")
    ) {
      const formattedData = formatOrderPayload({ ...data, SubTotal }, items);
      const user = JSON.parse(localStorage.getItem("user"));
      if (Object.keys(user).length !== 0) {
        setCreatingOrder(true);
        axios
          .post("/order/createOrder", { ...formattedData, userId: user._id })
          .then((data) => {
            toast.success(data?.data?.data?.message);
            setCreatingOrder(false);
          })
          .catch((error) => {
            setCreatingOrder(false);

            toast.error(
              error?.message || "Something went wrong creating order"
            );
          });
      }
    }
  };

  const handleChange = (e) => {
    setData({ ...data, [e.target.name]: e.target.value });
    validateInput(e);
    validateCardInfo();
  };

  const validateCardInfo = () => {
    const { fullname, card_number, expiry_month, expiry_year, cvv } = data;
    const errors = {};
    // Validate Full Name
    if (!fullname || fullname.trim().length === 0) {
      errors.fullname = "Full name is required";
    }

    // Validate Card Number
    const cardValidation = cardValidator.number(card_number);
    if (!cardValidation.isValid) {
      errors.card_number = "Invalid card number";
    }

    // Validate Expiration Date
    const expirationValidation = cardValidator.expirationDate(
      `${expiry_month}/${expiry_year}`
    );
    if (!expirationValidation.isValid) {
      errors.expiry_date = "Invalid expiration date";
    }

    // Validate CVV
    const cvvValidation = cardValidator.cvv(cvv);
    if (!cvvValidation.isValid) {
      errors.cvv = "Invalid CVV";
    }

    setCardErrors(errors);
  };

  const validateInput = (e) => {
    const { name, value } = e.target;

    setError((prev) => {
      const stateObj = { ...prev, [name]: "" };

      if (!value && validationMessages[name]) {
        stateObj[name] = validationMessages[name];
      }

      return stateObj;
    });
  };

  return (
    <div className={styles.container}>
      <Head>
        <title>Chop Chow Checkout</title>
        <meta
          key="title"
          name="viewport"
          content="initial-scale=1.0, width=device-width"
        />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@100..900&display=swap"
          rel="stylesheet"
        ></link>
      </Head>

      <Header />
      <Header2 />
      <div className={styles.inner_container}>
        <div className={styles.constraint}>
          <div className={styles.header}>
            <GoBack />
            <b>Checkout</b>
          </div>
          <div className={styles.checkout}>
            <div className={styles.checkout_left}>
              <Subscription
                data={data}
                setData={setData}
                handleChange={handleChange}
              />

              <Delivery
                data={data}
                setData={setData}
                handleChange={handleChange}
                deliveryType={deliveryType}
                setDeliveryType={setDeliveryType}
              />

              <ContactInformation
                data={data}
                setData={setData}
                handleChange={handleChange}
              />

              <DeliveryAddress
                data={data}
                setData={setData}
                handleChange={handleChange}
              />

              <PaymentMethod
                data={data}
                setData={setData}
                handleChange={handleChange}
                cardErrors={cardErrors}
              />
              <div className={styles.show_on_mobile}>
                <PlaceOrderBtn
                  loading={creatingOrder}
                  placeOrder={placeOrder}
                />
              </div>
            </div>
            <div className={styles.checkout_right}>
              <div className={styles.sticky}>
                <OrderSummary
                  items={items}
                  TotalPrice={TotalPrice}
                  SubTotal={SubTotal}
                />
                <div className={styles.hide_on_mobile}>
                  <PlaceOrderBtn
                    loading={creatingOrder}
                    placeOrder={placeOrder}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Checkout;
