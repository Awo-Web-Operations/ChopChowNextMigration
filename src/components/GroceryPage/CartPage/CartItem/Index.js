import React, { useState } from "react";
import cartStyles from "./Index.module.css";
import { useMobileMedia } from "../../../../customhooks/useResponsive";

function CartItem(props) {
  const mobileScreen = useMobileMedia();
  const itemTotal = (props.amount * props.price).toFixed(2) || 0;

  return (
    <div className={cartStyles.cartCard}>
      {mobileScreen ? (
        <React.Fragment>
          <div className={cartStyles.mobileCardLeft}>
            <div className={cartStyles.mobileImgDiv}>
              <img src={props.picture} />
              <div className={cartStyles.mobileListItems}>
                <label>{props.name}</label>
                <div className={cartStyles.supplierDiv}>
                  <h2>Supplier:</h2>
                  <h5>{props.store}</h5>
                </div>
              </div>
            </div>
          </div>
          <div className={cartStyles.mobileCardRight}>
            <div className={cartStyles.priceDiv}>
              <label>${props.price == "NAN" ? 0 : props.price}</label>
              <img
                onClick={() => props.onDelete(props)}
                src="/assets/grocery_list/closeIconOrange.svg"
              />
            </div>
            <div className={cartStyles.cardQuantity}>
              <div className={cartStyles.cardQty}>
                <label onClick={() => props.onRemove(props)}>-</label>
              </div>
              <label>{props.amount}</label>
              <div className={cartStyles.cardQty}>
                <label onClick={() => props.onAdd(props)}>+</label>
              </div>
            </div>
          </div>
        </React.Fragment>
      ) : (
        <React.Fragment>
          <div className={cartStyles.cartProduct}>
            <img src={props.picture} />
            <label>{props.name}</label>
          </div>
          <div className={cartStyles.cartQuantity}>
            <div className={cartStyles.qty}>
              <label onClick={() => props.onRemove(props)}>-</label>
            </div>
            <label>{props.amount}</label>
            <div className={cartStyles.qty}>
              <label onClick={() => props.onAdd(props)}>+</label>
            </div>
          </div>
          <div className={cartStyles.cartValues}>
            <label>{props.store}</label>
            <label>${props.price == "NAN" ? 0 : props.price}</label>
            <label>${itemTotal === "NaN" ? "" : itemTotal}</label>
            <img
              src="/assets/grocery_list/closeIcon.svg"
              onClick={() => props.onDelete(props)}
            />
          </div>
        </React.Fragment>
      )}
    </div>
  );
}

export default CartItem;
