import React, { Component } from "react";
import axios from "../src/util/Api";
import WestIcon from "@mui/icons-material/West";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import {
  Dialog,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";
import styles from "../src/components/suggestionPages/suggestion.module.css";
import Link from "next/link";
import SuggestMealForm from "../src/components/suggestionPages/SuggestMeal";
import SuggestProductForm from "../src/components/suggestionPages/SuggestProduct";
import SuggestKitchenUtensilForm from "../src/components/suggestionPages/SuggestKitchenUtensil";
import SuggestCategoryForm from "../src/components/suggestionPages/SuggestCategory";
import Header, { Header2 } from "../src/components/Header/Header";
import SideNav from "../src/components/Header/sidenav";

import Head from "next/head";
import { withRouter } from "next/router";
class SuggestMeal extends Component {
  allMealNames = [];
  // productNames = [
  //   "Spinach",
  //   "Brown Beans",
  //   "Ijebu Garri",
  //   "Honey Beans",
  //   "Kale",
  //   "Water",
  //   "Squash Potatoes",
  //   "Oregano",
  //   "Cashews",
  //   "Palm Oil",
  //   "Pineapple",
  //   "Onions",
  //   "Flour",
  //   "Butter",
  //   "Sugar",
  //   "Hawaiian Bread",
  //   "Avocados",
  //   "Tomatoes",
  //   "Beef",
  //   "Green Pepper",
  //   "Garlic",
  //   "Ginger",
  //   "Vegetable Oil",
  //   "Lemon",
  //   "Rosemary Powder",
  // ];
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
  ingredientsQuantityMeasurements = [];

  constructor(props) {
    super(props);
    this.state = {
      currentStore: "",
      productNames: [],

      // we need to update how we create image paths
      productImg_path: "",
      new_product_ingredients: [],
      suggested_stores: [],
      currProductIndexInDBsProductsList: -1,
      // currStoreIndexIfExistsInProductsList: -1,

      booleanOfDisplayOfDialogBoxConfirmation: false,

      //mealsModal controller
      openModal: false,
      suggestOption: false,
      suggestionType: "Meal",
      suggestionModal: false,
    };

    this.openMealDetailsModal = this.openMealDetailsModal.bind(this);
    this.openSuggestionModal = this.openSuggestionModal.bind(this);

    this.closeModal = this.closeModal.bind(this);
    // this.handleStoreNameInput = this.handleStoreNameInput.bind(this);

    // this.getProductIndex = this.getProductIndex.bind(this);
  }
  async getIngredients() {
    try {
      const response = await axios(
        `/items/1?type=Product&item_status=Public&limit=1000`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      const data = Array.isArray(response.data.data.items)
        ? response.data.data.items.map((elem) => elem.item_name)
        : [];
      this.setState({
        ...this.state,
        productNames: data,
      });
    } catch (error) {
      console.log(error);
    }
  }

  ///////////////////////////////////////////////////////////////////////////////////////
  componentDidMount() {
    this.openSuggestionModal();

    this.getIngredients();
    setTimeout(() => {
      this.setState({
        ...this.state,
        // suggestionType: this.props.router?.query?.item_type ?? "Meal",
        suggestionType: "Meal",
      });
    }, 1000);

    this.categories = this.props.categories || this.categories;
  }

  handleCloseOfMealSubmissinoDialogMessage = () => {
    this.setState({ booleanOfDisplayOfDialogBoxConfirmation: false });
  };

  //////////////////////////////////////////////////////////////////////////////////////////////
  openMealDetailsModal = (index) => {
    var individualProductDisplay = document.getElementById(
      "ProductAdditionalDataDisplayed"
    );

    this.setState({ openModal: true });
  };

  closeModal() {
    this.setState({ openModal: false });
  }
  openSuggestionModal() {
    setTimeout(() => {
      if (!localStorage.getItem("x-auth-token")) {
        this.setState({ ...this.state, suggestionModal: true });
      }
    }, 3000);
  }

  suggestOption = () => {
    this.setState({
      suggestOption: !this.state.suggestOption,
    });
  };

  // handleSuggestionType = (type) => {
  //   this.setState({
  //     suggestionType: type,
  //   });
  //   this.suggestOption();
  // };
  handleSuggestionType = (type) => {
    const { router } = this.props;

    if (type === "Meal") {
      router.push("/suggestmeal");
    }
    else if (type === "Product") {
      router.push("/suggestproduct")
    }
    else if (type === "Kitchen Utensil") {
      router.push("/suggestutensil")
    }
    else if (type === "Category") {
      router.push("/suggestcategory")
    }
    else {
      this.setState({
        suggestionType: type,
        suggestOption: !this.state.suggestOption,
      });
    }
  };
  handleNavigation = () => {
    // Access router properties using this.props.router
    const { router } = this.props;

    // Example: Push a new URL to the router
    router.push("/login");
  };
  ///////////////////////////////////////////////////////////////////////////////////////
  render() {
    const { suggestOption, suggestionType } = this.state;

    return (
      <>
        <Header />
        <Header2 />
        <SideNav />
        <div className={styles.suggestion_container}>
          <Head>
            <title>Suggested Meal Form</title>
            <meta
              key="title"
              name="viewport"
              content="initial-scale=1.0, width=device-width"
            />
            <meta
              name="description"
              content="Share your go to meals and 
            everyday cooking ingredients and utensils here on Chop Chow"
            />
          </Head>
          <div className={styles.suggestion_sections}>
            <div className={styles.suggestion_section_1}>
              {this.state.suggestionModal && (
                <div className={styles.suggestionContainer}>
                  <div className={styles.suggestionModal}>
                    <div className={styles.gif}>
                      <img src="/assets/icons/login.svg" alt="" />
                    </div>
                    <p className={styles.successMessage}>Login to Continue</p>
                    <p className={styles.successText}>
                      To suggest this item, kindly login to your chopchow
                      account{" "}
                    </p>
                    <div className={styles.flexCol}>
                      {" "}
                      <Link href="/login" className={styles.btn}>
                        Login
                      </Link>
                      <p
                        onClick={() =>
                          this.setState({ suggestionModal: false })
                        }
                      >
                        No, thanks
                      </p>
                    </div>
                  </div>
                </div>
              )}
              <div className={styles.suggestion_section_1_col_1}>
                <ul className={styles.suggestion_header_pages}>
                  <WestIcon className={styles.suggestion_header_page_arrow} />
                  <li>
                    <Link href="/">back</Link>
                  </li>
                </ul>
              </div>
              <div className={styles.suggestion_section_1_col_2}>
                <p className={styles.suggestion_section_1_col_2_p}>
                  {" "}
                  Choose type
                </p>
                <div className={styles.select_container}>
                  <div
                    onClick={this.suggestOption}
                    className={styles.select_box}
                  >
                    <p>{suggestionType}</p>
                    <ArrowDropDownIcon className={styles.select_box_icon} />
                  </div>
                  {suggestOption && (
                    <div className={styles.select_options}>
                      <p onClick={() => this.handleSuggestionType("Meal")}>
                        Meals
                      </p>
                      <p onClick={() => this.handleSuggestionType("Product")}>
                        Products
                      </p>
                      <p
                        onClick={() =>
                          this.handleSuggestionType("Kitchen Utensil")
                        }
                      >
                        Kitchen Utensils
                      </p>
                      <p onClick={() => this.handleSuggestionType("Category")}>
                        Category
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
            {suggestionType === "Meal" && (
              <SuggestMealForm
                allMealNames={this.allMealNames}
                productNames={this.state.productNames}
                measurements={this.measurements}
                kitchenUtensils={this.kitchenUtensils}
                categories={this.categories}
                suggestionType={this.state.suggestionType}
              ></SuggestMealForm>
            )}

          </div>
          <Dialog
            open={this.state.booleanOfDisplayOfDialogBoxConfirmation}
            onClose={this.handleCloseOfMealSubmissinoDialogMessage}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
            maxWidth="xs"
            fullWidth
          >
            <DialogTitle id="alert-dialog-title">
              Meal Submitted Successfully!
            </DialogTitle>
            <DialogContent>
              <DialogContentText>
                Thanks for your submission. Your recipe may be published to our
                meals page upon admin review. Explore our Preview and Print
                option to create a hard copy of this meal.
              </DialogContentText>
            </DialogContent>
          </Dialog>
        </div>
      </>
    );
  }
}

export default withRouter(SuggestMeal);
