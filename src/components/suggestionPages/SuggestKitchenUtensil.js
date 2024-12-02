import React, { Component } from "react";
import TextField from "@mui/material/TextField";
// import Chip from "@mui/material/Chip";
import Autocomplete from "@mui/lab/Autocomplete"; // createFilterOptions,
// import axios from 'axios';
import axios from "../../util/Api";
import { Row, Col } from "react-bootstrap";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import Chip from "@mui/material/Chip";
import AddIcon from "@mui/icons-material/Add";
// import { Dialog, DialogContent, DialogContentText, DialogTitle } from '@mui/material';
// import MealPageModal from "../mealsPage/MealPageModal";
import styles from "./suggestion.module.css";
import Popup1 from "../popups/popup1";
import Image from "next/image";
import { AiOutlineClose } from "react-icons/ai";
import { toast } from "react-toastify";
import { base_url } from "../../util/Api";
import { withRouter } from "next/router";

const initialState = {
  utensilName: "",
  utensilImage1: "",
  utensilImage2: "",
  utensilImage3: "",
  utensilImage4: "",
  utensilImagesData: [],
  intro: "",

  sizeNames: [],
  // do we need product group list AND strings ?
  descriptionGroupList: [],
  // store product names of inputted strings to compare with db products
  descriptionStrings: [],
  // do we want to use current ingredient formats ? Yes.
  currentIngredient: "",
  measurement: "",
  quantity: "",
  currentProductImgSrc: null,
  currentProductDisplayIndex: 0,

  currentStore: "",

  // we need to update how we create image paths
  productImg_path: "",
  suggested_stores: [],
  currProductIndexInDBsProductsList: -1,
  // currStoreIndexIfExistsInProductsList: -1,

  instructionWordlength: 0,

  suggestedCategories: [],

  booleanOfDisplayOfDialogBoxConfirmation: false,

  //mealsModal controller
  openModal: false,
  stepInputs: [],
};

class SuggestKitchenUtensilForm extends Component {
  utensilsList = [];
  ingredientsQuantityMeasurements = [];

  constructor(props) {
    super(props);
    this.state = initialState;

    this.closeModal = this.closeModal.bind(this);
    // this.handleStoreNameInput = this.handleStoreNameInput.bind(this);

    // this.getProductIndex = this.getProductIndex.bind(this);
  }

  ///////////////////////////////////////////////////////////////////////////////////////
  componentDidMount() {
    console.log(this.props);
    console.log(this.props.categories);
    // get all Meal Names***
    var url = "/get-all-products";
    var url = `${base_url}/products/get-all-products`;

    axios
      .get(url)
      .then((body) => {
        var utensilsList = body.data;
        if (utensilsList && utensilsList.data.length !== 0) {
          console.log("returns GET of ALL MEALS ");
          for (var i = 0; i < mealList.data.length; i++) {
            this.allMealNames.push(mealList.data[i].mealName);
          }
        } else {
          console.log("get all Utensils names function does not return");
        }
      })
      .catch((err) => {
        console.log(err);
      });

    console.log(this.utensilsList);
    // get all store names*, if NEW products section exists.

    // can redux resolve this for us by checking if we recently called this in cache or from another page ??
    // var url = "/get-all-products";
    url = "https://chopchowserver.vercel.app/get-all-products";

    // axios.get(url).then((body) => {
    //   this.productsList = body.data;
    //   if (this.productsList && this.productsList.data.length !== 0) {
    //     console.log("returns GET ALL PRODUCTS ");
    //     for (var i = 0; i < this.productsList.data.length; i++) {
    //       this.utensilNames.push(this.productsList.data[i].product_name);
    //       this.productImageLink.push(this.productsList.data[i].product_image);
    //     }
    //   } else {
    //     console.log("get all products function does not return");
    //   }
    // })
    // .catch((err) => {
    //   console.log(err);
    // });

    //----get category meals-------------------------
    url = "/get-all-categories";
    // axios.get(url).then((body) => {
    //   var categoriesFromDBList = body.data;
    //   if (categoriesFromDBList && categoriesFromDBList.data.length !== 0) {
    //     console.log("returns GET of ALL Categories ");

    //     for (var i = 0; i < categoriesFromDBList.data.length; i++) {
    //       this.categories.push(categoriesFromDBList.data[i].category_name);
    //     }
    //     console.log("PRINTING UPDATED CATEGORIES LIST");
    //   } else {
    //     console.log("get all products function does not return");
    //   }
    // })
    //   .catch((err) => {
    //     console.log(err);
    //   });
    this.categories = this.categories;

    let doc = document.querySelector("#formutensil");
    if (doc) {
      setInterval(() => {
        // localStorage.setItem("suggestUtensilForm", JSON.stringify(this.state));
      }, 100);
    }

    if (localStorage.getItem("suggestUtensilForm")) {
      let {
        utensilName,
        intro,
        sizeNames,
        utensilImagesData,
        // do we need product group list AND strings ?
        descriptionGroupList,
        // store product names of inputted strings to compare with db products
        descriptionStrings,
        // do we want to use current ingredient formats ? Yes.
        currentIngredient,
        measurement,
        quantity,
        currentProductImgSrc,
        currentProductDisplayIndex,

        currentStore,

        // we need to update how we create image paths
        productImg_path,
        suggested_stores,
        currProductIndexInDBsProductsList,
        // currStoreIndexIfExistsInProductsList,

        suggestedCategories,
        productImagesData,
        booleanOfDisplayOfDialogBoxConfirmation,
      } = JSON.parse(localStorage.getItem("suggestUtensilForm"));

      this.setState({
        utensilName,
        utensilImage: "",
        utensilImageName: "",
        utensilImageData: "",
        utensilImagesData: Array.isArray(productImagesData)
          ? productImagesData
          : [],
        intro,
        sizeNames,
        // do we need product group list AND strings ?
        descriptionGroupList,
        // store product names of inputted strings to compare with db products
        descriptionStrings,
        // do we want to use current ingredient formats ? Yes.
        currentIngredient,
        measurement,
        quantity,
        currentProductImgSrc,
        currentProductDisplayIndex,

        currentStore,

        // we need to update how we create image paths
        productImg_path,
        suggested_stores,
        currProductIndexInDBsProductsList,
        // currStoreIndexIfExistsInProductsList,
        suggestedCategories,

        booleanOfDisplayOfDialogBoxConfirmation,
      });
    }
  }

  onInputChange = (e) => {
    console.log("Comes in on text field change; ");
    console.log(e.target.value);
    // console.log(" " + [e.target.id] + " " + e.target.value);
    this.setState({ utensilName: e.target.value });
  };

  uploadUtensilImage = () => {
    // <input accept="image/*,video/mp4,video/mov,video/x-m4v,video/*" id="utensilImage" name="utensilImage" type="file" className="mb-2 pr-4" onChange={(ev) => this.onUpdateutensilImage(ev)} />
    const input = document.createElement("input");
    input.accept = "image/*,video/mp4,video/x-m4v,video/*";
    input.id = "utensilImage";
    input.name = "utensilImage";
    input.type = "file";
    input.onchange = (ev) => this.onUpdateUtensilImage(ev);
    input.hidden = true;
    input.click();
  };

  onUpdateUtensilImage = (event) => {
    if (event.target.files[0] === undefined) return;
    // Allowing file type
    var allowedImageExtensions = /(\.jpg|\.jpeg|\.png|\.)$/i;

    if (allowedImageExtensions.exec(event.target.files[0].name)) {
      //display utensils main image or videoin suggest utensil
      // if (this.state.utensilImage === '') {
      this.setState({
        utensilImagesData: [
          ...this.state.utensilImagesData,
          URL.createObjectURL(event.target.files[0]),
        ],
      });

      if (this.state.utensilImage1 == "") {
        this.setState({ utensilImage1: event.target.files[0] });
      } else if (this.state.utensilImage2 == "") {
        this.setState({ utensilImage2: event.target.files[0] });
      } else if (this.state.utensilImage3 == "") {
        this.setState({ utensilImage3: event.target.files[0] });
      } else {
        this.setState({ utensilImage4: event.target.files[0] });
      }
      // this.setState({
      //   utensilImage: event.target.files[0],
      //   utensilImageName: event.target.files[0].name,
      //   utensilImageData: URL.createObjectURL(event.target.files[0])
      // });
      // var image = document.getElementById("UtensilsMainImages");
      // image.style.display = "block";
      // image.src = URL.createObjectURL(event.target.files[0]);

      // console.log(event.target.files[0]);
      // console.log(event.target.files[0].name);
      // console.log(allowedImageExtensions.exec(event.target.files[0].name));

      // console.log(URL.createObjectURL(event.target.files[0]));
      // } else {

      // var image = document.getElementById("UtensilsMainImages"+(this.state.utensilImagesData.length+1));
      // image.style.display = "block";
      // image.src = URL.createObjectURL(event.target.files[0]);

      // }
    } else {
      alert("Invalid image type");
    }
  };

  onTextFieldChange = (e) => {
    console.log("Comes in on text field change; ");

    console.log(" " + [e.target.id] + " " + e.target.value);
    this.setState({ [e.target.id]: e.target.value });
  };

  handleCategoryDropdownChange = (val) => {
    console.log(this.state.suggestedCategories);
    this.setState({ suggestedCategories: val });
    // below setstate causes an error to make each new set a sum of all previous.
    // this.setState({ suggestedCategories: [...this.state.suggestedCategories, val] });
  };

  categoryBlur = (e) => {
    this.setState({
      categoryVal: e.target.value,
    });
  };

  addCategory = () => {
    let cat = this.state.categoryVal;
    const categorySentence = cat;
    const categoryWords = categorySentence.split(" ");

    categoryWords
      .map((categoryWord) => {
        return categoryWord[0].toUpperCase() + categoryWord.substring(1);
      })
      .join(" ");

    let suggestedCategories = this.state.suggestedCategories;
    suggestedCategories.push(categoryWords);
    this.setState({
      suggestedCategories,
    });
  };

  handleDeleteCategoryChip(chip) {
    var array = [...this.state.suggestedCategories]; // make a separate copy of the array
    var index = array.indexOf(chip);
    if (index !== -1) {
      array.splice(index, 1);
      this.setState({ suggestedCategories: array });
    }
  }

  handleMeasurement = (event, val) => {
    // if (event.target.value) {
    //   this.setState({ measurement: event.target.value });
    // } else {
    //   this.setState({ measurement: "" });
    // }

    console.log("In handleMeasurement . \n val is: " + val);

    if (val !== null && val !== undefined) {
      // CHECK IF INPUT MATCHES ANY PRODUCT ALREADY IN DB and
      // set currProductIndexInDBsProductsList variable
      const searchResult = this.props.measurements.map(function callback(
        element
      ) {
        if (element.toLowerCase() === val.toLowerCase()) {
          return true;
        } else {
          return false;
        }
      });
      const tmpcurrMeasurementIndexInDBsMeasurementList =
        searchResult.indexOf(true);
      console.log(
        "Curr Product Index If Exists In Products List is: \n" +
        tmpcurrMeasurementIndexInDBsMeasurementList
      );

      // check if product name is an existing product
      // set product existense to index, so one will not need to edit
      // this.setState({ currProductIndexInDBsProductsList: tmpcurrMeasurementIndexInDBsMeasurementList });

      // set current ingredient to input Product regardless
      // console.log("Event is: \n"+ event.target);
      if (event != null && event.target.value !== null) {
        this.setState({ measurement: event.target.innerHTML });
      } else {
        this.setState({ measurement: val });
      }
    } else {
      console.log("val is null!");
    }
  };

  addDescription = (event) => {
    event.preventDefault();
    var properDescriptionStringSyntax;
    var descriptionValue = document.getElementById("descriptionName").value;
    var quantityValue = document.getElementById("quantity").value;
    // best to get the measurement from the state
    // perhaps becuse inner html is defined before state is updated
    // var measurementValue = this.state.currentIngredientMeasurement;
    var measurementValue = document.getElementById("measurement").value;

    properDescriptionStringSyntax =
      descriptionValue + ":" + quantityValue + "" + measurementValue;

    // This is the Object for an Ingredient of a Known Product
    var descriptionObject = {
      description_name: descriptionValue,
      quantity: quantityValue,
      measurement: measurementValue,
      properDescriptionStringSyntax: properDescriptionStringSyntax,
    };

    // edit product details for new product object
    // descriptionObject.productImgFile = null;
    descriptionObject.productIndex = 0;
    // descriptionObject.calories = 0;

    console.log(descriptionObject, "descriptionObjectdescriptionObject");
    // console.log(this.state?.descriptionObject, 'descree')

    this.setState({
      descriptionGroupList: [
        // ...this.state?.descriptionObject,
        descriptionObject,
      ],
    });
    // after adding product to ingredient group list
    // reset current product img src and path to null, and same for current ingredient inputs
    // this.setState({ currentProductImgSrc: null, productImg_path: "" });
    this.setState({ quantity: "", measurement: "null" });
    this.setState({ measurement: "", descriptionName: "" });
    this.handleAddDescriptionChip(properDescriptionStringSyntax);
  };

  handleAddDescriptionChip(chip) {
    this.setState(prevState => ({
        descriptionStrings: [...(prevState.descriptionStrings || []), chip],
    }));
}

  handleDeleteSizeChip(chip) {
    var array = this.state.descriptionStrings; // make a separate copy of the array
    var removeFromGroup = this.state.descriptionGroupList;

    var index = array.indexOf(chip);
    if (index !== -1) {
      array.splice(index, 1);
      removeFromGroup.splice(index, 1);

      this.setState({
        descriptionStrings: array,
        descriptionGroupList: removeFromGroup,
      });
    }
  }

  closeModal() {
    this.setState({ openModal: false });
    // this.openModal = false;
    // this.func_removeutensilFlag();
  }
  capitalizeWords(text) {
    return text?.replace(/\b\w/g, (match) => match.toUpperCase());
  }

  openMealDetailsModal = (index) => {
    console.log("Comes in toggle product details div id. Index is : " + index);

    var individualProductDisplay = document.getElementById(
      "ProductAdditionalDataDisplayed"
    );
    console.log(individualProductDisplay);

    // if (individualProductDisplay.style.display === "block") {
    //   individualProductDisplay.style.display = "none";
    // }
    // else {
    //   individualProductDisplay.style.display = "block";
    // }
    this.setState({ openModal: true });
  };

  ///////////////////////////////////////////////////////////////////////////////////////
  sendSuggestedUtensilToDB = async (e) => {
    const {
      utensilName,
      utensilImagesData,
      intro,
      suggestedCategories,
      descriptionGroupList,
      utensilImage1,
      utensilImage2,
      utensilImage3,
      utensilImage4,
    } = this.state;

    // handle edge case Product name, ingredienrs or image upload required to submit form
    if (utensilName === "") {
      console.log("product label blank");
      return;
    }
    // if (ingredientStrings.length === 0) { window.alert("Suggested Product requires adding at least one ingredient to submit"); return; }
    if (
      utensilImagesData === null ||
      utensilImagesData === undefined ||
      utensilImagesData === []
    ) {
      window.alert("You didn't add suggested product image");
      return;
    }

    // Handle instruction/product images to create url for product images on server
    /*Loop through Ingredients product data
    Check if all products listed exist in the database.
    If not, let server create placeholder before submitting to db.
    Get list of new products and new Categories
    This for loop is making sure we are building a product_slider.
    we could probably merge this in the above for loop easily, but we want to call this path function,
    so lets figure out what its even doing!*/

    // const all_ingredients_formatted = [];
    const product_slider = [];
    let i = 0;

    let new_measurements = [];

    //prepare product data to Mongo and Recipe Steps Images and Video content to s3
    const instructionGroupData = [];
    const contentNameToContentImageOrVideoMapForS3 = new FormData();
    console.log("product name:");
    console.log(this.state.utensilName);

    contentNameToContentImageOrVideoMapForS3.append(
      "productContentName",
      this.state.utensilName
    );
    console.log(contentNameToContentImageOrVideoMapForS3);
    var keyValueData = { productContentName: this.state.utensilName };
    // console.log("Stringified version:");
    // console.log(keyValueData);
    var singleTitleTest = JSON.stringify(keyValueData);
    console.log(singleTitleTest);

    //-------------Submit remainder data of product to Mongo ------------------------------------------
    let suggestProductForm = new FormData();
    const utensilString = utensilName;
    const utensilWords = utensilString.split(" ");

    utensilWords
      .map((utensilWord) => {
        return utensilWord[0].toUpperCase() + utensilWord.substring(1);
      })
      .join(" ");
    suggestProductForm.append("item_name", utensilName);

    suggestProductForm.append("item_intro", intro);

    if (utensilImage1) {
      suggestProductForm.append("item_images", utensilImage1);
    }
    if (utensilImage2) {
      suggestProductForm.append("item_images", utensilImage2);
    }
    if (utensilImage3) {
      suggestProductForm.append("item_images", utensilImage3);
    }
    if (utensilImage4) {
      suggestProductForm.append("item_images", utensilImage4);

    }

    if (!utensilImage1 && !utensilImage2 && !utensilImage3 && !utensilImage4) {
      const img = await fetch(
        "/assets/store_pics/no-image-utensil.png"
      );
      const blob = await img.blob()
      suggestProductForm.append("item_images", blob);
    }

    // descriptionGroupList.map((individualDescriptions) => {
    //   console.log(individualDescriptions);
    //   suggestProductForm.append('product_descriptions', JSON.stringify(individualDescriptions));
    // })

    suggestProductForm.append(
      "user",
      JSON.parse(localStorage.getItem("user"))._id
    );

    console.log(descriptionGroupList, "descriptionGroupList");
    const arr = descriptionGroupList?.map((ele) => {
      return {
        object_name: ele.description_name,
        object_quantity: ele.quantity,
        object_measurement: ele.measurement,
        formatted_string: `${this.capitalizeWords(ele.description_name)} : ${ele.quantity
          }${ele.measurement}`,
      };
    });

    const arr_2 = this.state.descriptionStrings?.map((element) => {
      const splited = element.split(":");
      const descripName = splited[0];
      let qty = "";

      const ele = splited[1];
      for (let i = 0; i < ele.length; i++) {
        if (!Object.is(Number(ele.charAt(i)), NaN)) {
          console.log(ele.charAt(i), "ele.charAt(i)");
          qty = qty.concat(ele.charAt(i));
        }
      }
      const measurement = ele.slice(ele.indexOf(qty));
      const formatted_string = `${this.capitalizeWords(descripName)} : ${ele}`;

      return {
        object_name: descripName,
        object_quantity: Number(qty),
        object_measurement: measurement,
        formatted_string,
      };
    });

    suggestProductForm.append("description", JSON.stringify(arr_2));

    suggestProductForm.append("item_type", "Utensil");

    // suggestProductForm.append('ingredientStrings', ingredientStrings);
    // list of products quantity measurements (created on submit Product)
    // suggestProductForm.append('ingredientsQuantityMeasurements', JSON.stringify(this.ingredientsQuantityMeasurements));
    // suggestProductForm.append('new_measurements', JSON.stringify(new_measurements));

    // suggestProductForm.append('product_slider', JSON.stringify(product_slider));
    // suggestProductForm.append('formatted_ingredient', JSON.stringify(all_ingredients_formatted));

    // new suggested products
    // suggestProductForm.append('product_categories', JSON.stringify(suggestedCategories));
    // suggestProductForm.append('product_type', JSON.stringify("Utensil"));
    // suggestProductForm.append('publicly_available', JSON.stringify("Draft"));

    // suggestedCategories.map((individualCategories) => {
    //   suggestProductForm.append('product_categories', individualCategories);
    // })

    const capitalizedSuggestedCategories = suggestedCategories?.map((ele) =>
      this.capitalizeWords(ele)
    );
    suggestProductForm.append(
      "item_categories",
      JSON.stringify(capitalizedSuggestedCategories)
    );
    // suggestProductForm.append('product_details', descriptionGroupList);
    console.log(this.state.chunk1Content);

    // chunk content should be passed as file
    //---------------------------------------------Submit Product to Mongo---------------------------------------------------
    // var url = "/createProduct/";
    var url = `${base_url}/items/`;

    console.log(this.props.router, "this.props.router");
    if (this.props.router?.query?.id) {
      url = url + `?action=update&_id=${this.props.router.query.id}`;
    }

    const config = {
      method: "POST",
      data: suggestProductForm,
      url: url,
      headers: {
        // 'application/json' is the modern content-type for JSON, but some
        // older servers may use 'text/json'.
        // See: http://bit.ly/text-json
        // application/x-www-form-urlencoded
        // 'content-type': 'multipart/form-data'
      },
    };

    console.log("Printing Chunk Contents");

    var instructionData = JSON.parse(JSON.stringify(instructionGroupData));
    console.log(instructionData);

    axios(config)
      .then((response) => {
        if (response.status >= 200 && response.status < 300) {
          this.setState({ booleanOfDisplayOfDialogBoxConfirmation: true });
          console.log(response);
          console.log("Display Product submitted successfully");
          toast.success("Kitchen Utensils submitted successfully");
          localStorage.setItem("suggestUtensilForm", JSON.stringify({}));
          this.setState(initialState);
          // window.location.href = "/SuggestProduct"
        } else {
          console.log("Something wrong happened ");
        }
      })
      .catch((error) => {
        console.log(error);
        toast.error(error.message);
      });
  };

  deleteImages(id) {
    const delImages = this.state.utensilImagesData;
    delImages.splice(id, 1);
    this.setState({ ...this.state, utensilImagesData: delImages });
  }
  ///////////////////////////////////////////////////////////////////////////////////////
  render() {
    // const [ingredientInput, setIngredientInput] = useState('');

    // const theme = createMuiTheme({
    //   palette: { primary: green },
    // });

    const { descriptionStrings } = this.state;

    return (
      <div className={styles.suggestion_section_2}>
        <form
          id="formutensil"
          className={styles.suggestion_forms}
          noValidate
          autoComplete="off"
          encType="multipart/form-data"
          method="post"
        >
          <div className={styles.suggestion_form}>
            <div className={styles.suggestion_form_group}>
              <label
                htmlFor="utensilName"
                className={styles.suggestion_form_label}
              >
                Utensil Name
              </label>
              <TextField
                value={this.state.utensilName}
                id="utensilName"
                fullWidth
                onChange={this.onInputChange}
                variant="outlined"
                required
              />
            </div>

            <h3>
              Upload Utensil Images <em>(Up to 4)</em>
            </h3>
            {this.state.utensilImagesData.length < 4 && (
              <div className={styles.suggestion_form_image}>
                <div className={styles.suggestion_form_image_col_1}>
                  <div
                    onClick={() => this.uploadUtensilImage()}
                    className={styles.suggestion_form_image_icon_con}
                  >
                    <AddIcon className={styles.suggestion_form_image_icon} />
                  </div>
                </div>
                <div className={styles.suggestion_form_image_col_2}>
                  <p>
                    Upload picture with : Jpeg or Png format and not more than
                    500kb
                  </p>
                </div>
              </div>
            )}

            {this.state.utensilImagesData.map((data, index) => (
              <Row key={index}>
                <Col md={12} style={{ marginTop: "20px" }}>
                  <p>
                    <Image
                      id="UtensilsMainImages"
                      src={data}
                      width={100}
                      height={100}
                      alt="main_Utensil_Image"
                    />
                  </p>
                  <div
                    className={styles.close}
                    onClick={() => this.deleteImages(index)}
                  >
                    <AiOutlineClose className={styles.closeIcon} />
                  </div>
                </Col>
              </Row>
            ))}

            <h3>Description</h3>
            <div className={styles.suggestion_form_group}>
              <label htmlFor="intro" className={styles.suggestion_form_label}>
                Intro (150 words)
              </label>
              <TextField
                value={this.state.intro}
                multiline
                id="intro"
                fullWidth
                onChange={this.onTextFieldChange}
                variant="outlined"
              />
            </div>
          </div>
          <h3>Utensil Descriptions</h3>
          <div className={styles.suggestion_form} onKeyDown={(event) => {
            if (event.key === "Enter") {
              event.preventDefault();
              this.addDescription(event)
            }
          }}>
            <div className={styles.suggestion_form_group}>
              <label
                htmlFor="descriptionName"
                className={styles.suggestion_form_label}
              >
                Description Name
              </label>
              <TextField
                fullWidth
                id="descriptionName"
                onChange={this.onTextFieldChange}
                variant="outlined"
                value={this.state.descriptionName}
              />
            </div>
            <div className={styles.suggestion_form_2_col}>
              <div className={styles.suggestion_form_2_col_2}>
                <div className={styles.suggestion_form_group}>
                  <label
                    htmlFor="quantity"
                    className={styles.suggestion_form_label}
                  >
                    Quantity
                  </label>
                  <TextField
                    inputProps={{ min: 0 }}
                    fullWidth
                    id="quantity"
                    type="number"
                    onChange={this.onTextFieldChange}
                    variant="outlined"
                    placeholder="1.."
                    value={this.state.quantity}
                  />
                </div>
              </div>

              <div className={styles.suggestion_form_2_col_1}>
                <div className={styles.suggestion_form_group}>
                  <label
                    htmlFor="measurement"
                    className={styles.suggestion_form_label}
                  >
                    Measurement
                  </label>
                  <Autocomplete
                    id="measurement"
                    options={this.props.measurements?.map((option) => option)}
                    value={this.state.measurement}
                    onChange={this.handleMeasurement}
                    freeSolo
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        value={this.state.measurement}
                        id="measurement"
                        variant="outlined"
                        type="text"
                      />
                    )}
                  />
                </div>
              </div>

              <Button
                variant="contained"
                disableRipple
                onClick={this.addDescription}
                className={styles.ingredient_button}
                style={{ width: "max-content" }}
              >
                {" "}
                Add Description
              </Button>
            </div>

            <Stack direction="row" spacing={1} className={styles.stack}>
              {descriptionStrings?.map((data, index) => (
                <Chip
                  key={index}
                  label={data}
                  className={styles.chip}
                  onClick={() => this.handleDeleteSizeChip(data)}
                  onDelete={() => this.handleDeleteSizeChip(data)}
                />
              ))}
            </Stack>
          </div>

          <h3>Utensil Categories</h3>
          <div className={styles.suggestion_form}>
            <div className={styles.suggestion_form_group}>
              <label
                htmlFor="tags-outlined"
                className={styles.suggestion_form_label}
              >
                Suggest category for this Utensil
              </label>
              <div className={styles.input_button}>
                <Autocomplete
                  multiple
                  id="tags-outlined"
                  freeSolo
                  clearOnBlur
                  onBlur={this.categoryBlur}
                  options={this.props.categories ? this.props.categories : []}
                  onChange={(e, newValue) => this.handleCategoryDropdownChange(newValue)}
                  value={Array.isArray(this.state.suggestedCategories) ? this.state.suggestedCategories : []}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      variant="outlined"
                      placeholder="Suggest categories for this meal.."
                      fullWidth
                    />
                  )}
                />

                <Button
                  variant="contained"
                  disableRipple
                  onClick={this.addCategory}
                  className={styles.ingredient_button}
                  style={{ width: "max-content" }}
                >
                  {" "}
                  Add Category
                </Button>
              </div>
            </div>
            <Stack direction="row" spacing={1} className={styles.stack}>
              {this.state.suggestedCategories?.map((data, index) => (
                <Chip
                  key={index}
                  label={data}
                  className={styles.chip}
                  onClick={() => this.handleDeleteCategoryChip(data)}
                  onDelete={() => this.handleDeleteCategoryChip(data)}
                />
              ))}
            </Stack>
          </div>

          <u style={{ color: "#F47900" }} onClick={this.openMealDetailsModal}>
            {" "}
            Show Preview
          </u>

          {/* <Row>
                <Col md={12}> */}
          {/* <ThemeProvider theme={theme}> */}
          <Button
            variant="contained"
            className={styles.ingredient_button}
            style={{ width: "100%" }}
            onClick={() => this.sendSuggestedUtensilToDB()}
          >
            {" "}
            Add Utensil
          </Button>
          {/* </ThemeProvider> */}
          {/* </Col>
                
              </Row> */}
          <u>View privacy policy</u>
          <div id="ProductAdditionalDataDisplayed">
            <Popup1
              popup="kitchen"
              openModal={this.state.openModal}
              closeModal={this.closeModal}
              name={this.state.utensilName}
              description={this.state.intro}
              imageData={this.state.utensilImagesData[0]}
              image={this.state.utensilImagesData[0]}
              imagesData={this.state.utensilImagesData.slice(1)}
              categories={this.state.suggestedCategories}
              descriptionsList={this.state.descriptionStrings}
            />
          </div>
        </form>
      </div>
    );
  }
}

export default withRouter(SuggestKitchenUtensilForm);
