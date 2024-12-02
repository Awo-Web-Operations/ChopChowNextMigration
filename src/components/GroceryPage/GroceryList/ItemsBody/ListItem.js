import React, { useContext, useState } from "react";
import itemStyle from "./Index.module.css";
import CartContext from "../../../../../pages/store/cart-context";
import { useMobileMedia } from "../../../../customhooks/useResponsive";
import { canItemBeAddedToCart } from "../../../../util/canAddToCart";

function ListItem(props) {
  const [checked, setChecked] = useState(false);
  const cartCtx = useContext(CartContext);

  const mobileScreen = useMobileMedia();

  const addToCartHandler = () => {
    let canAddToCart = canItemBeAddedToCart(props);

    if (canAddToCart) {
      cartCtx.addItem({
        key: props.id,
        id: props.id,
        name: props.name,
        amount: props.quantity,
        picture: props.picture,
        price: props.price,
        store: props.store,
        pickUpTime: props.pickUpTime,
      });
    }
  };

  const checkBoxFunction = () => {
    setChecked(!checked);
  };

  return (
    <div className={itemStyle.listItemBody}>
      {mobileScreen ? (
        <React.Fragment>
          <div className={itemStyle.mobileLeft}>
            <div className={itemStyle.mobileCheck}>
              <div className={itemStyle.checkImageDiv}>
                {checked ? (
                  <img
                    src="/assets/grocery_list/checkedOrange.svg"
                    onClick={checkBoxFunction}
                  />
                ) : (
                  <img
                    src="/assets/grocery_list/uncheckedBox.svg"
                    onClick={checkBoxFunction}
                  />
                )}
              </div>
              <img src={props.picture} alt="product" />
            </div>
            <div className={itemStyle.mobileListItems}>
              <label>{props.name}</label>
              <div className={itemStyle.supplierDiv}>
                <h2>Supplier:</h2>
                <h5>{props.store}</h5>
              </div>
              <div className={itemStyle.quantityDiv}>
                <p>Qty:</p>
                <h4>{props.quantity}</h4>
              </div>
            </div>
          </div>

          <div className={itemStyle.mobileRight}>
            <div className={itemStyle.priceDiv}>
              <label>${props.price}</label>
              <img src="/assets/grocery_list/closeIconOrange.svg" />
            </div>
            <div className={itemStyle.addToMobileCart}>
              <label>Add to cart</label>
            </div>
          </div>
        </React.Fragment>
      ) : (
        <React.Fragment>
          <div className={itemStyle.checkB}>
            <div className={itemStyle.checkImageDiv}>
              {checked ? (
                <img
                  src="/assets/grocery_list/checkedOrange.svg"
                  onClick={checkBoxFunction}
                />
              ) : (
                <img
                  src="/assets/grocery_list/uncheckedBox.svg"
                  onClick={checkBoxFunction}
                />
              )}
            </div>
            <div className={itemStyle.productImageDiv}>
              <img src={props.picture} alt="product" />
            </div>
          </div>
          <div className={itemStyle.listItems}>
            <label>{props.name}</label>
            <label>x{props.quantity}</label>
            <label>${props.price}</label>
            <label>{props.store}</label>
            <label>{props.pickUpTime}</label>
          </div>
          <div className={itemStyle.listItemAction}>
            <div className={itemStyle.addToCart}>
              <label onClick={addToCartHandler}>Add Product to Cart</label>
            </div>
            <img src="/assets/grocery_list/closeIcon.svg" />
          </div>
        </React.Fragment>
      )}
    </div>
  );
}

export default ListItem;
