import React, { useEffect, useState, Fragment } from "react";
import styled from "styled-components";
import Link from "next/link";
import Header, { Header2 } from "../../src/components/Header/Header";
import SideNav from "../../src/components/Header/sidenav";
import Footer from "../../src/components/Footer/Footer";
import indexStyles from "./index.module.css";
import GlobalSearchBar from "../../src/components/GlobalComponents/GlobalSearchBar";
import MainGroceryList from "../../src/components/GroceryPage/GroceryList/MainGroceryList/Index";
import SuggestedMeals from "../../src/components/GroceryPage/GroceryList/SuggestedMeals/Index";
import Cart from "../../src/components/Cart/Index";
import CartProvider from "../store/CartProvider";
import Items from "../../src/components/items/Items";
import { base_url } from "../../src/util/Api";

const index = () => {
  const [showCart, setShowCart] = useState(false);
  const [userData, setUserData] = useState([]);
  const [userErrData, setUserErrData] = useState({});
  const [searchTerm, setSearchTerm] = useState("");
  const [activeCard, setActiveCard] = useState("");
  const [itemsData, setItemsData] = useState([]);
  const [productErrData, setProductErrData] = useState({});

  async function fetchItems() {
    try {
      const response = await fetch(`https://chopchow.app/api/items`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
  
      const data = await response.json();
  
      if (data.data === undefined) {
        setProductErrData(data);
      } else {
        setItemsData(data.data);
      }
    } catch (error) {
      console.log(error);
    }
   
  }

  async function fetchUserGrocery() {
    try {
      const userDetails = JSON.parse(localStorage.getItem("user"));
      const token = localStorage.getItem("x-auth-token");
      const user_id = userDetails?._id;
  
      if (userDetails) {
        localStorage.setItem("user_id", JSON.stringify(user_id));
  
        const response = await fetch(
          `${base_url}/groceries/${user_id}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: token,
            },
          }
        );
  
        const data = await response.json();
        
        if (data.data === undefined) {
          setUserErrData(data);
        } else {
          setUserData(data.data[0]);
        }
      } else {
        setUserData([]);
      }
    } catch(error) {
      console.log(error);
    }
   
  }

  useEffect(() => {
    fetchItems();
    fetchUserGrocery();
  }, []);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [showCart]);

  const openCart = () => {
    setShowCart(true);
  };

  const closeCart = () => {
    setShowCart(false);
  };

  //const grocery = userData.groceryList;

  //const grocery = productGrocery[0].groceryList;
  const grocery = userData?.groceryList;

  //console.log("gl", userData);

  const items = itemsData;
  return (
    <CartProvider>
      {showCart ? (
        <Cart closeCart={closeCart} />
      ) : (
        <div className={indexStyles.allBody}>
          <Head>
            <title>Chop Chow Grocery Lists</title>
            <meta name="description" content="Use Chop Chow to store your 
            shopping lists or recipe ideas. Make your grocery lists public
             and share your favourite recipes with family and friends." />
          </Head>
          <Header route="groceryList" openCart={openCart} />
          <Header2 />
          <SideNav />
          <div className={indexStyles.groceryBody}>
            <div className={indexStyles.groceryMainBody}>
              <div className={indexStyles.arrowBack}>
                <div className={indexStyles.mainArrowRow}>
                  {/* <Link href="/" legacyBehavior> */}
                  <Link href="/" >
                    <img
                      id="backArr"
                      src="/assets/grocery_list/backArr.svg"
                      alt="arrowDown"
                    />
                  </Link>
                  {/* <Link href="/" legacyBehavior> */}
                  <Link href="/" >
                    <label>Back</label>
                  </Link>
                </div>
                <h1>Your Grocery List</h1>
              </div>
              <h2>Add new item from Store</h2>
              <div className={indexStyles.searchBody}>
                <div className={indexStyles.searchInput}>
                  <img
                    src="/assets/grocery_list/Search.svg"
                    alt="search icon"
                  />
                  <input
                    placeholder="Search Meals, Ingredient and Products"
                    value={searchTerm}
                    onChange={(event) => {
                      if (event.target.value === "") {
                        setSearchTerm("");
                        setActiveCard("");
                      } else {
                        setSearchTerm(event.target.value);
                        setActiveCard(event.target.value);
                      }
                    }}
                  />
                </div>
                {items
                  .filter((item) => {
                    if (searchTerm == "") {
                      return null;
                    } else if (
                      item.item_name
                        ?.toLowerCase()
                        .includes(searchTerm.toLowerCase()) &&
                      item.item_status[0]?.status === "Draft"
                    ) {
                      return item;
                    }
                  })
                  .map((item) => (
                    <Items
                      itemName={item.item_name}
                      itemPrice={item.item_price}
                      itemStore={item.store_name}
                    />
                  ))}
              </div>
              <div className={indexStyles.itemsHeader}>
                <label>Items</label>
                <div className={indexStyles.addDeleteText}>
                  <label>Add selection(s) to Cart</label>
                  <p>Remove selection(s)</p>
                </div>
              </div>
              <div className={indexStyles.groceryListCard}>
                {grocery?.map((list) => (
                  <MainGroceryList
                    id={list._id}
                    listName={list.listName}
                    groceryItems={list.groceryItems}
                  />
                ))}
              </div>
              <SuggestedMeals />
            </div>
            <Footer />
          </div>
        </div>
      )}
    </CartProvider>
  );
};

export default index;
