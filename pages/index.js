import React, { Component } from "react";
import Header, { Header2 } from "../src/components/Header/Header";
import Footer from "../src/components/Footer/Footer";
import LandingPage from "./landingpage";
import { useEffect } from "react";
import CartProvider from "./store/CartProvider";
import Head from "next/head";

import { ToastContainer, toast } from "react-toast";

// import { Route, Switch, Redirect } from "react-router-dom";
// import HomePage from "./components/HomePage";
// import MealsPage from "./components/mealsPage/MealsPage";
// import VSMealsPage from "./components/vsm2/VSMealsPage";

// import ProductsSection from "./components/productsPage/ProductsPage";
// import Login from "./components/Login";
// import GroceryPage from "./components/GroceryPage";
// import ProductFullDetail from "./components/ProductFullDetail/ProductFullDetail";
// import SignUp from "./components/signup";
// import ForgotPassword from "./components/forgotpassword";
// import ResetPassword from "./components/resetpassword";
// import SuggestMeal from "./components/SuggestMeal";
// import SuggestProduct from "./components/SuggestProduct";
// import ViewSuggestedMeals from "./components/ViewSuggestedMeals";
// import AdminPanel from "./components/AdminPanel/AdminPanel";
import { setInitUrl, getUser } from "../src/actions";
import { connect } from "react-redux";
import axios from "../src/util/Api";
import productsObj from "../src/custom_data/products.json";
import SideNav from "../src/components/Header/sidenav";
import HomePage from "./home";
// import { createMuiTheme, ThemeProvider } from '@mui/material';

class App extends Component {
  allMealNames = [];
  productNames = [
    "Spinach",
    "Brown Beans",
    "Ijebu Garri",
    "Honey Beans",
    "Kale",
    "Water",
    "Squash Potatoes",
    "Oregano",
    "Cashews",
    "Palm Oil",
    "Pineapple",
    "Onions",
    "Flour",
    "Butter",
    "Sugar",
    "Hawaiian Bread",
    "Avocados",
    "Tomatoes",
    "Beef",
    "Green Pepper",
    "Garlic",
    "Ginger",
    "Vegetable Oil",
    "Lemon",
    "Rosemary Powder",
  ];
  productImageLink = [];
  categories = ["Baking", "Cooking", "Home", "Ethiopian", "Quick-Meal"];
  measurements = [
    "mL",
    "oz",
    "L",
    "cup(s)",
    "Tbsp",
    "tsp",
    "pt",
    "g",
    "kg",
    "lb",
    "qt",
    "gallon",
    "dash/pinch",
    "Leaves",
    "cloves",
    "cubes",
    "Large",
    "medium",
    "small",
  ];
  kitchenUtensils = [
    "Baking Sheet",
    "Colander",
    "Cooking Oil",
    "Cutting Board",
    "Fridge",
    "Knife Set",
    "Mixing Bowls",
    "Pot",
    "Pan",
    "Peeler",
    "Thermometer",
    "Wire Mesh",
    "Zester",
  ];
  // productDisplayBooleansOutOfState = [];
  availableLocations = [
    "African Carribean Market",
    "Abule",
    "Scotch Bonnet Restaurant",
    "Ralphs",
    "Target",
    "Walmart",
    "Vons",
  ];

  groceryList = [];
  locationAddressComponent = [];

  //////////////////////////////////////////////////////////////////////

  render() {
    // const { customer_id } = this.props;

    return (
      <CartProvider>
        <Head>
          <title>Chop Chow Cooking App</title>
          <meta
            key="title"
            name="viewport"
            content="initial-scale=1.0, width=device-width"
          />
          <meta
            name="description"
            content="Adding convenience to your home cooking."
          />
        </Head>

        <Header />
        <Header2 />
        <SideNav />
        <HomePage />

        {/* <LandingPage /> */}
        <Footer footer="shape 2" />
      </CartProvider>
    );
  }
}

// export default App;
export default App;
