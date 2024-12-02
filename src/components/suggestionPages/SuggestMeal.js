import React, { Component, useEffect } from "react";
import TextField from "@mui/material/TextField";
// import Chip from "@mui/material/Chip";
import Autocomplete from "@mui/material/Autocomplete"; // createFilterOptions,
import _axios from 'axios';
import axios from "../../util/Api";
import { Row, Col } from "react-bootstrap";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import Chip from "@mui/material/Chip";
import AddIcon from "@mui/icons-material/Add";
// import MealPageModal from "../mealsPage/MealPageModal";
import styles from "./suggestion.module.css";
import Popup2 from "../popups/popup2";
// import ProductsPageModal from "./ProductsPageModal";
var FormData = require("form-data");
// var fs = require('fs');
import Image from "next/image";
import { AiOutlineClose } from "react-icons/ai";
import { toast } from "react-toastify";
import { base_url } from "../../util/Api";
import { withRouter } from "next/router";
import JSZip from 'jszip';
import mealImage1 from "../../../public/assets/store_pics/no-image-meal.png";

class SuggestMealForm extends Component {
  ingredientsQuantityMeasurements = [];

  constructor(props) {
    super(props);
    this.inputRef = React.createRef();
    this.state = {
      username: "",
      mealName: "",
      itemMealName: "",
      allMealNames: [],
      mealImage: [],
      itemMealImages: [],
      mealImagesData: [],
      mealImage0: "",
      mealImage1: "",
      mealImage2: "",
      mealImage3: "",
      itemmealImage0: "",
      itemmealImage1: "",
      itemmealImage2: "",
      itemmealImage3: "",
      intro: "",
      ingredientNames: [],
      // do we need product group list AND strings ?
      ingredientGroupList: [],
      // store product names of inputted strings to compare with db products
      ingredientStrings: [],
      // do we want to use current ingredient formats ? Yes.
      currentIngredient: "",
      currentIngredientMeasurement: "",
      currentIngredientQuantity: "",
      currentProductImgSrc: null,
      currentProductDisplayIndex: 0,

      currentStore: "",

      // we need to update how we create image paths
      productImg_path: "",
      // new_product_ingredients: [],
      suggested_stores: [],
      currProductIndexInDBsProductsList: -1,
      // currStoreIndexIfExistsInProductsList: -1,
      suggestedUtensils: [],

      cookTime: 0,
      prepTime: 0,

      instructionChunk6: {
        title: "",
        instructionSteps: [],
        dataName: "",
      },
      instructionChunk: [
        {
          title: "",
          instruction: "",
        },
      ],
      instructionChunk1: {
        title: "",
        instructionSteps: [],
        dataName: "",
      },
      instructionChunk2: {
        title: "",
        instructionSteps: [],

        dataName: "",
      },
      instructionChunk3: {
        title: "",
        instructionSteps: [],

        dataName: "",
      },
      instructions: [],

      instruction1: "",
      instruction2: "",
      instruction3: "",
      instruction4: "",
      instruction5: "",
      instruction6: "",

      instructionChunk4: {
        title: "",
        instructionSteps: [],

        dataName: "",
      },
      instructionChunk5: {
        title: "",

        instructionSteps: [],

        dataName: "",
      },
      instructionWordlength: 0,

      chunk1Content: "",
      chunk2Content: "",
      chunk3Content: "",
      chunk4Content: "",
      chunk5Content: "",
      chunk6Content: "",
      chunk1ContentURL: "",
      chunk2ContentURL: "",
      chunk3ContentURL: "",
      chunk4ContentURL: "",
      chunk5ContentURL: "",
      chunk6ContentURL: "",

      // do we want all the instruction variables ?
      // instructionGroupList:[],

      instructionimagesAndVideos: [],

      chef: "",
      suggestedCategories: [],
      servings: "1",
      tip: "",
      tips: [],

      booleanOfDisplayOfDialogBoxConfirmation: false,

      //mealsModal controller
      openModal: false,
      stepInputs: [],
      itemIntro: "",
      action: "Upload video locally",
      videoData: {
        socialUrl: "",
        video: {},
        videoUrl: "",
        "transcription": {},
        data: {}
      },
      isLoading: false,
      measurements: [],
      utensils: []
    };

    this.handleIngredientMeasurement =
      this.handleIngredientMeasurement.bind(this);
    // this.handleIngredientQuantity = this.handleIngredientQuantity.bind(this);
    this.addIngredientToMeal = this.addIngredientToMeal.bind(this);
    this.updateChef = this.updateChef.bind(this);
    this.updateTip = this.updateTip.bind(this);
    this.handleAddInstructionStep = this.handleAddInstructionStep.bind(this);
    this.handleInstructionTitle = this.handleInstructionTitle.bind(this);

    this.handleUtensilsDropdownChange =
      this.handleUtensilsDropdownChange.bind(this);
    this.openMealDetailsModal = this.openMealDetailsModal.bind(this);
    this.handleProductNameInput = this.handleProductNameInput.bind(this);
    this.closeModal = this.closeModal.bind(this);
    // this.handleStoreNameInput = this.handleStoreNameInput.bind(this);

    // this.getProductIndex = this.getProductIndex.bind(this);
  }

  ///////////////////////////////////////////////////////////////////////////////////////
  componentDidMount() {
    console.log("this.props.---**", this.props);
    console.log(JSON.parse(localStorage.getItem("user")));
    // get all Meal Names***
    // var url = "/meals/get-meals/1";
    // axios.get(url).then((body) => {
    //   var mealList = body.data;
    //   if (mealList) {
    //     mealList.data.meals.map((meal) => this.allMealNames.push(meal.meal_name));
    //   } else {
    //     console.log("get all meal names function does not return");
    //   }
    // })
    //   .catch((err) => {
    //     console.log(err);


    console.log("all meals", this.props.allMealNames);
    const currentUser = JSON.parse(localStorage.getItem("user")) || {};

    if (Object.keys(currentUser)?.length) {
      this.setState({
        ...this.state,
        username: currentUser?.first_name?.concat(" ", currentUser?.last_name),
      });
    }
    // get all store names*, if NEW products section exists.

    // can redux resolve this for us by checking if we recently called this in cache or from another page ??
    // var url = "/get-all-products";
    // url = "https://chopchowdev.herokuapp.com/get-all-products";

    //----get category meals-------------------------
    // url = "/get-all-categories";

    const getAllMeasurement = async (newPage) => {
      try {
        const resp = await axios.get(
          `/measurement/1?withPaginate=false&status=Public`
        );
        if (
          Array.isArray(resp?.data?.data?.measurement) &&
          resp?.data?.data?.measurement?.length
        ) {
          const mesr_names = resp.data.data?.measurement.map(
            (ele) => ele.measurement_name
          );
          this.setState({
            ...this.state,
            measurements: mesr_names,
          });
        }
      } catch (e) {
        console.log("err-", e);
      }
    };
    getAllMeasurement();

    const fetchMeals = async (page) => {
      try {
        const response = await axios(
          `/items/1?type=Utensil&withPaginate=false&status=Public`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        console.log(response.data.data.items, "response from data");
        const allUtensils = response.data.data.items.map(
          (ele) => ele.item_name
        );
        this.setState({
          ...this.state,
          utensils: allUtensils,
        });
      } catch (error) {
        console.log(error);
      }
    };
    fetchMeals();
    this.categories = this.categories;
    if (typeof window !== "undefined") {
      // let doc = document.querySelector("#formmeal");
      // if (doc) {
      //   setInterval(() => {
      //     localStorage.setItem("suggestMealForm", JSON.stringify(this.state));
      //   }, 100);
      // }

      console.log("This is the state ", this.state);
      if (localStorage.getItem("suggestMealForm_")) {
        let {
          mealName,
          itemMealName,
          intro,
          ItemIntro,
          ingredientNames,
          ingredeintsInItem,
          mealImagesData,
          // do we need product group list AND strings ?
          ingredientGroupList,
          // store product names of inputted strings to compare with db products
          ingredientStrings = ingredeintsInItem?.map(
            (elem) => elem?.formatted_string_of_item
          ) || [],
          // do we want to use current ingredient formats ? Yes.
          currentIngredient,
          currentIngredientMeasurement,
          currentIngredientQuantity,
          currentProductImgSrc,
          currentProductDisplayIndex,
          instructionChunk1Step,
          instructionChunk2Step,
          instructionChunk3Step,
          instructionChunk4Step,
          instructionChunk5Step,
          chunk1Content,
          chunk2Content,
          chunk3Content,
          chunk4Content,
          chunk5Content,
          chunk6Content,
          instructionChunk1DataName,
          instructionChunk2DataName,
          instructionChunk3DataName,
          instructionChunk4DataName,
          instructionChunk5DataName,
          instructionChunk6DataName,
          instructionChunk6Step,
          currentStore,

          // we need to update how we create image paths
          productImg_path,
          // new_product_ingredients,
          suggested_stores,
          currProductIndexInDBsProductsList,
          // currStoreIndexIfExistsInProductsList,
          suggestedUtensils,

          cookTime,
          prepTime,

          instructionChunk6,
          instructionChunk1,
          instructionChunk2,
          instructionChunk3,
          instructionChunk4,
          instructionChunk5,
          instructionWordlength,

          // do we want all the instruction variables ?
          // instructionGroupList:[],

          instructionimagesAndVideos,

          chef,
          suggestedCategories,
          servings,
          tip,
          tips,

          booleanOfDisplayOfDialogBoxConfirmation,
          stepInputs,
          image_or_video_content_1,
          image_or_video_content_2,
          image_or_video_content_3,
          image_or_video_content_4,
          image_or_video_content_5,
          image_or_video_content_6,

        } = JSON.parse(localStorage.getItem("suggestMealForm_"));
        console.log(mealName, "malnames");
        console.log(instructionChunk1, "instructionChunk1instructionChunk1");

        // let stepInpu ts_ =
        console.log(image_or_video_content_1,
          image_or_video_content_2,
          image_or_video_content_3, "images")
        this.setState({
          mealName,
          itemMealName: mealName,
          intro,
          ItemIntro,
          ingredientNames,
          chunk1Content,
          chunk2Content,
          chunk3Content,
          chunk4Content,
          chunk5Content,
          chunk6Content,
          ingredeintsInItem,
          mealImagesData,
          // do we need product group list AND strings ?
          ingredientGroupList,
          // store product names of inputted strings to compare with db products
          ingredientStrings,
          // do we want to use current ingredient formats ? Yes.
          currentIngredient,
          currentIngredientMeasurement,
          currentIngredientQuantity,
          currentProductImgSrc,
          currentProductDisplayIndex,

          currentStore,

          // we need to update how we create image paths
          productImg_path,
          // new_product_ingredients,
          suggested_stores,
          currProductIndexInDBsProductsList,
          // currStoreIndexIfExistsInProductsList,
          suggestedUtensils,

          cookTime,
          prepTime,
          instructionChunk1Step,
          instructionChunk2Step,
          instructionChunk3Step,
          instructionChunk4Step,
          instructionChunk5Step,
          instructionChunk6Step,
          instructionChunk1DataName,
          instructionChunk2DataName,
          instructionChunk3DataName,
          instructionChunk4DataName,
          instructionChunk5DataName,
          instructionChunk6DataName,
          stepInputs,
          instructionChunk1: {
            title: instructionChunk1?.title,
            instructionSteps: instructionChunk1Step || [], //[],
            dataName: instructionChunk1DataName,

          },
          instructionChunk2: {
            title: instructionChunk2?.title,
            instructionSteps: instructionChunk2Step || [],

            dataName: instructionChunk2DataName,
          },
          instructionChunk3: {
            title: instructionChunk3?.title,
            instructionSteps: instructionChunk3Step || [],

            dataName: instructionChunk3DataName,
          },
          instructionChunk4: {
            title: instructionChunk4?.title,
            instructionSteps: instructionChunk4Step || [],
            dataName: instructionChunk4DataName,
          },
          instructionChunk5: {
            title: instructionChunk5?.title,
            instructionSteps: instructionChunk5Step || [],

            dataName: instructionChunk5DataName,
          },
          instructionChunk6: {
            title: instructionChunk6?.title,
            instructionSteps: instructionChunk6Step || [],
            dataName: instructionChunk6DataName,
          },
          instructionWordlength,

          // do we want all the instruction variables ?
          // instructionGroupList:[],

          instructionimagesAndVideos,

          chef,
          suggestedCategories,
          servings,
          tip,
          tips,

          booleanOfDisplayOfDialogBoxConfirmation,
          stepInputs,
        });
        var allowedImageExtensions = /(\.jpg|\.jpeg|\.png|\.)$/i;
        var allowedVideoExtensions = /(\.mp4|\.m4v|\.)$/i;

        var imageElementId = "chunk1Image";
        var videoElementId = "chunk1Video";
        setTimeout(() => {
          if (chunk1Content) {
            const chunk1Video = document.querySelector('#chunk1Video');
            const chunk1Image = document.querySelector('#chunk1Image');
            if (chunk1Video) {
              chunk1Video.setAttribute('src', chunk1Content);
              chunk1Video.style.display = "block"
              chunk1Image.style.display = 'none'
            }
            else {
              chunk1Image.setAttribute('src', chunk1Content);
              chunk1Video.style.display = "none"
              chunk1Image.style.display = 'block'
            }
          }
        }, 500)
        setTimeout(() => {
          if (chunk2Content) {
            const chunk2Video = document.querySelector('#chunk2Video');
            const chunk2Image = document.querySelector('#chunk2Image');
            if (chunk2Video) {
              chunk2Video.setAttribute('src', chunk2Content);
              chunk2Video.style.display = "block"
              chunk2Image.style.display = 'none'
            }
            else {
              chunk2Image.setAttribute('src', chunk2Content);
              chunk2Video.style.display = "none"
              chunk2Image.style.display = 'block'
            }
          }
        }, 500);
        setTimeout(() => {
          if (chunk3Content) {
            const chunk3Video = document.querySelector('#chunk3Video');
            const chunk3Image = document.querySelector('#chunk3Image');
            if (chunk3Video) {
              chunk3Video.setAttribute('src', chunk3Content);
              chunk3Video.style.display = "block"
              chunk3Image.style.display = 'none'
            }
            else {
              chunk3Image.setAttribute('src', chunk3Content);
              chunk3Video.style.display = "none"
              chunk3Image.style.display = 'block'
            }
          }
        }, 500);
        setTimeout(() => {
          if (chunk4Content) {
            const chunk4Video = document.querySelector('#chunk4Video');
            const chunk4Image = document.querySelector('#chunk4Image');
            if (chunk4Video) {
              chunk4Video.setAttribute('src', chunk4Content);
              chunk4Video.style.display = "block"
              chunk4Image.style.display = 'none'
            }
            else {
              chunk4Image.setAttribute('src', chunk4Content);
              chunk4Video.style.display = "none"
              chunk4Image.style.display = 'block'
            }
          }
        }, 500);
        setTimeout(() => {
          if (chunk5Content) {
            const chunk5Video = document.querySelector('#chunk4Video');
            const chunk5Image = document.querySelector('#chunk4Image');
            if (chunk5Video) {
              chunk5Video.setAttribute('src', chunk5Content);
              chunk5Video.style.display = "block"
              chunk5Image.style.display = 'none'
            }
            else {
              chunk5Image.setAttribute('src', chunk5Content);
              chunk5Video.style.display = "none"
              chunk5Image.style.display = 'block'
            }
          }
        }, 500);
        setTimeout(() => {
          if (chunk6Content) {
            const chunk6Video = document.querySelector('#chunk4Video');
            const chunk6Image = document.querySelector('#chunk4Image');
            if (chunk6Video) {
              chunk6Video.setAttribute('src', chunk6Content);
              chunk6Video.style.display = "block"
              chunk6Image.style.display = 'none'
            }
            else {
              chunk6Image.setAttribute('src', chunk6Content);
              chunk6Video.style.display = "none"
              chunk6Image.style.display = 'block'
            }
          }
        }, 500);
        console.log(chunk2Content, "image_or_video_content_2")

      }
    }
    console.log(this.state, "dd");
  }
  componentWillUnmount() {
    console.log("componentunmount");
    let doc = document.querySelector("#formmeal");
    console.log(doc, "doc", this.state);
    if (doc) {
      localStorage.removeItem("suggestMealForm_");

      localStorage.setItem("suggestMealForm_", JSON.stringify(this.state));
    }
  }
  ///////////////////////////////////////////////////////////////////////////////////////
  handleCloseOfMealSubmissinoDialogMessage = () => {
    this.setState({ booleanOfDisplayOfDialogBoxConfirmation: false });
    // close out of state tracker..
    // productDisplayBooleansOutOfState[index] = false;
  };

  //////////////////////////////////////////////////////////////////////////////////////////////
  openMealDetailsModal = (index) => {
    // toggle products page visibility for product to be Edited.

    console.log("Comes in toggle product details div id. Index is : " + index);

    var individualProductDisplay = document.getElementById(
      "ProductAdditionalDataDisplayed"
    );
    console.log(individualProductDisplay);

    this.setState({ openModal: true });
  };

  closeModal() {
    this.setState({ openModal: false });
    // this.props.openModal = false;
    // this.props.func_removeMealFlag();
  }

  ///////////////////////////////////////////////////////////////////////////////////////
  onTextFieldChange = (e) => {
    // console.log("Comes in on text field change; ");

    // console.log(" " + [e.target.id] + " " + e.target.value);
    this.setState({ [e.target.id]: e.target.value });
  };

  ///////////////////////////////////////////////////////////////////////////////////////
  onInputChange = (e, val) => {
    console.log("Comes in on text field change; ");
    // console.log(e.target.id)
    // console.log(" " + [e.target.id] + " " + e.target.value);
    this.setState({ mealName: val });
    this.setState({ itemMealName: val });
  };

  ///////////////////////////////////////////////////////////////////////////////////////
  onUpdateMealImage = (event, id) => {
    if (event.target.files[0] === undefined) return;

    // Allowing file type
    var allowedImageExtensions = /(\.jpg|\.jpeg|\.png|\.)$/i;
    // we need to keep track of wether an image or video was last uploaded and use the last one only.
    if (allowedImageExtensions.exec(event.target.files[0].name)) {
      this.setState({
        // mealImageName: event.target.files[0].name,
        // mealImages: [...this.state.mealImages, event.target.files[0]],
        itemMealImages: [...this.state.itemMealImages, event.target.files[0]],
        mealImagesData: [
          ...this.state.mealImagesData,
          URL.createObjectURL(event.target.files[0]),
        ],
      });

      console.log(this.state.itemMealImages);
      let particularArray;

      // if (this.state.mealImage0 == "") {
      //   this.setState({ mealImage0: event.target.files[0] });
      //   this.setState({ mealImage0: event.target.files[0] });
      if (this.state.itemmealImage0 == "") {
        this.setState({ itemmealImage0: event.target.files[0] });
        this.setState({ itemmealImage0: event.target.files[0] });

        // var imageElementId = "mealImage0";
        // var image = document.getElementById(imageElementId);

        // // console.log(allowedImageExtensions.exec(event.target.files[0].name));
        // //display meals main image or videoin suggest meal
        // console.log(imageElementId);
        // image.style.display = "block";
        // image.src = image.src = URL.createObjectURL(event.target.files[0]);
        // } else if (this.state.mealImage1 == "") {
        //   this.setState({ mealImage1: event.target.files[0] });
        // } else if (this.state.mealImage2 == "") {
        //   this.setState({ mealImage2: event.target.files[0] });
        // } else {
        //   this.setState({ mealImage3: event.target.files[0] });
        // }
      } else if (this.state.itemmealImage1 == "") {
        this.setState({ itemmealImage1: event.target.files[0] });
      } else if (this.state.itemmealImage2 == "") {
        this.setState({ itemmealImage2: event.target.files[0] });
      } else {
        this.setState({ itemmealImage3: event.target.files[0] });
      }

      // this.setState({ instructionimagesAndVideos: recipeChunkImageOrVideo });
    } else {
      alert("Invalid file type");
    }
  };

  ///////////////////////////////////////////////////////////////////////////////////////
  onhandleInstructionImg = (event, id) => {
    if (event.target.files[0] === undefined) return;

    let particularArray;

    switch (id) {
      case 1:
        particularArray = this.state.instructionChunk1;
        particularArray.dataName = event.target.files[0].name;
        this.setState({
          instructionChunk1: particularArray,
          chunk1Content: event.target.files[0],
          chunk1ContentURL: URL.createObjectURL(event.target.files[0]),
        });
        break;
      case 2:
        particularArray = this.state.instructionChunk2;
        particularArray.dataName = event.target.files[0].name;
        this.setState({
          instructionChunk2: particularArray,
          chunk2Content: event.target.files[0],
          chunk2ContentURL: URL.createObjectURL(event.target.files[0]),
        });
        break;
      case 3:
        particularArray = this.state.instructionChunk3;
        particularArray.dataName = event.target.files[0].name;
        this.setState({
          instructionChunk3: particularArray,
          chunk3Content: event.target.files[0],
          chunk3ContentURL: URL.createObjectURL(event.target.files[0]),
        });
        break;
      case 4:
        particularArray = this.state.instructionChunk4;
        particularArray.dataName = event.target.files[0].name;
        this.setState({
          instructionChunk4: particularArray,
          chunk4Content: event.target.files[0],
          chunk4ContentURL: URL.createObjectURL(event.target.files[0]),
        });
        break;
      case 5:
        particularArray = this.state.instructionChunk5;
        particularArray.dataName = event.target.files[0].name;
        this.setState({
          instructionChunk5: particularArray,
          chunk5Content: event.target.files[0],
          chunk5ContentURL: URL.createObjectURL(event.target.files[0]),
        });
        break;
      case 6:
        particularArray = this.state.instructionChunk6;
        particularArray.dataName = event.target.files[0].name;
        this.setState({
          instructionChunk6: particularArray,
          chunk6Content: event.target.files[0],
          chunk6ContentURL: URL.createObjectURL(event.target.files[0]),
        });
        break;
      default:
      // ..do nothing
    }

    // this.setState({ instructionimagesAndVideos: recipeChunkImageOrVideo });

    // Allowing file type
    var allowedImageExtensions = /(\.jpg|\.jpeg|\.png|\.)$/i;
    var allowedVideoExtensions = /(\.mp4|\.m4v|\.)$/i;

    var imageElementId = "chunk" + id + "Image";
    var videoElementId = "chunk" + id + "Video";
    var image = document.getElementById(imageElementId);
    var video = document.getElementById(videoElementId);

    // console.log(allowedImageExtensions.exec(event.target.files[0].name));

    // we need to keep track of wether an image or video was last uploaded and use the last one only.
    if (allowedImageExtensions.exec(event.target.files[0].name)) {
      //display meals main image or videoin suggest meal
      image.style.display = "block";
      video.style.display = "none";

      image.src = image.src = URL.createObjectURL(event.target.files[0]);
    } else if (allowedVideoExtensions.exec(event.target.files[0].name)) {
      //display meals main image or videoin suggest meal
      video.style.display = "block";
      image.style.display = "none";

      // var video_source = document.getElementById(videoElementId+'Source');
      // video_source.src =  URL.createObjectURL(event.target.files[0]);
      video.src = URL.createObjectURL(event.target.files[0]);

      video.play();
      // console.log(URL.createObjectURL(event.target.files[0]));
      console.log(event.target.files[0]);
    } else {
      alert("Invalid file type");
    }
  };

  //////////////////////////////////////////////////////////////////////////////////////
  onUpdateInstructionImg = (event, ind) => {
    if (event.target.files[0] === null) return;

    // const tmp_instructionData = this.state.instructionGroupList;
    // const tmp_instructionItem = tmp_instructionData[ind];

    const temp_instructionImageOrVideoArray =
      this.state.instructionimagesAndVideos;
    // const individual_ImageOrVideo = temp_instructionImageOrVideoArray[ind];

    // tmp_instructionData[ind] = tmp;
    temp_instructionImageOrVideoArray[ind] = event.target.files[0];

    // this.setState({instructionGroupList: tmp_instructionData});
    this.setState({
      instructionimagesAndVideos: temp_instructionImageOrVideoArray,
    });
  };

  ///////////////////////////////////////////////////////////////////////////////////////
  updateChef() {
    var chefName = document.getElementById("chef").value;
    this.setState({ chef: chefName });
  }

  handleTip = (e) => {
    this.setState({
      tip: e.target.value,
    });
    if (e.keyCode === 13) {
      this.updateTip();
    }
  };

  ///////////////////////////////////////////////////////////////////////////////////////
  updateTip() {
    let chip = this.state.tip;
    this.setState({ tips: [...this.state.tips, chip], tip: "" });
  }

  ///////////////////////////////////////////////////////////////////////////////////////
  deleteTip(chip) {
    let tipsList = this.state.tips;
    console.log(chip);
    var index = tipsList.indexOf(chip);
    if (index !== -1) {
      tipsList.splice(index, 1);
      this.setState({ tips: tipsList });
    }
  }

  /////////////////////////////////////////////////////////////////////////////////////
  handleProductNameInput = (event, val) => {
    console.log("In handleProductNameInput . \n val is: " + val);
    if (val !== undefined && val !== null) {
      // CHECK IF INPUT MATCHES ANY PRODUCT ALREADY IN DB and
      // set currProductIndexInDBsProductsList variable
      const searchResult = this.props.productNames.map(function callback(
        element
      ) {
        if (element.toLowerCase() === val.toLowerCase()) {
          return true;
        } else {
          return false;
        }
      });
      const tmpcurrProductIndexInDBsProductsList = searchResult.indexOf(true);
      console.log(
        "Curr Product Index If Exists In Products List is: \n" +
        tmpcurrProductIndexInDBsProductsList
      );

      // check if product name is an existing product
      // set product existense to index, so one will not need to edit
      this.setState({
        currProductIndexInDBsProductsList: tmpcurrProductIndexInDBsProductsList,
      });

      // set current ingredient to input Product regardless
      // console.log("Event is: \n"+ event.target);
      if (event != null && event.target.value !== null) {
        this.setState({ currentIngredient: event.target.innerHTML });
      } else {
        this.setState({ currentIngredient: val });
      }
    } else {
      console.log("val is null or undefined");
    }
  };

  // getProductIndex(){
  //   this.productDisplayBooleansOutOfState.map(function(key, value){
  //     if(value == true){
  //       return key;
  //     }
  //   })
  // };
  ///////////////////////////////////////////////////////////////////////////////////////

  ///////////////////////////////////////////////////////////////////////////////////////
  handleAddIngredientChip(chip) {
    console.log(this.state.ingredientStrings, chip, "ingredientStrings");
    this.setState({
      ingredientStrings: [...this.state?.ingredientStrings, chip],
    });
  }

  ///////////////////////////////////////////////////////////////////////////////////////
  deleteNewIngredientFromNewProductPopUp = (ind) => {
    var array = this.state.ingredientStrings;
    var removeFromGroup = this.state.ingredientGroupList;
    var tmpNewProductsList = this.state.new_product_ingredients;
    // dont we need to get the specific index from new products list and ingredient group list ?
    if (ind !== -1) {
      array.splice(ind, 1);
      removeFromGroup.splice(ind, 1);
      tmpNewProductsList.splice(ind, 1);
      this.setState({
        ingredientStrings: array,
        ingredientGroupList: removeFromGroup,
        // new_product_ingredients: tmpNewProductsList,
      });
    }
  };

  ///////////////////////////////////////////////////////////////////////////////////////
  handleDeleteIngredientChip(chip) {
    var array = this.state.ingredientStrings; // make a separate copy of the array
    var removeFromGroup = this.state.ingredientGroupList;

    var index = array.indexOf(chip);
    if (index !== -1) {
      array.splice(index, 1);
      removeFromGroup.splice(index, 1);

      this.setState({
        ingredientStrings: array,
        ingredientGroupList: removeFromGroup,
      });
    }
  }

  ///////////////////////////////////////////////////////////////////////////////////////
  handleIngredientMeasurement(event, val) {
    // if (event.target.value) {
    //   this.setState({ currentIngredientMeasurement: event.target.value });
    // } else {
    //   this.setState({ currentIngredientMeasurement: "" });
    // }

    console.log("In handleIngredientMeasurement . \n val is: " + val);

    if (val) {
      // CHECK IF INPUT MATCHES ANY PRODUCT ALREADY IN DB and
      // set currProductIndexInDBsProductsList variable
      // const searchResult = this.measurements.map(function callback(element) { if (element.toLowerCase() === (val.toLowerCase())) { return true; } else { return false; } });
      // const tmpcurrMeasurementIndexInDBsMeasurementList = searchResult.indexOf(true);
      // console.log("Curr Product Index If Exists In Products List is: \n" + tmpcurrMeasurementIndexInDBsMeasurementList);

      // check if product name is an existing product
      // set product existense to index, so one will not need to edit
      // this.setState({ currProductIndexInDBsProductsList: tmpcurrMeasurementIndexInDBsMeasurementList });

      // set current ingredient to input Product regardless
      // console.log("Event is: \n"+ event.target);
      if (event != null && event.target.value !== null) {
        this.setState({ currentIngredientMeasurement: event.target.innerHTML });
      } else {
        this.setState({ currentIngredientMeasurement: val });
      }
    } else {
      console.log("val is null!");
    }
  }

  handleInstructionTitle(event, chunkIndex) {
    let particularArray;

    switch (chunkIndex) {
      case 1:
        particularArray = this.state.instructionChunk1;
        particularArray.title = event.target.value;
        this.setState({ instructionChunk1: particularArray });
        break;
      case 2:
        particularArray = this.state.instructionChunk2;
        particularArray.title = event.target.value;
        this.setState({ instructionChunk2: particularArray });
        break;
      case 3:
        particularArray = this.state.instructionChunk3;
        particularArray.title = event.target.value;
        this.setState({ instructionChunk3: particularArray });
        break;
      case 4:
        particularArray = this.state.instructionChunk4;
        particularArray.title = event.target.value;
        this.setState({ instructionChunk4: particularArray });
        break;
      case 5:
        particularArray = this.state.instructionChunk5;
        particularArray.title = event.target.value;
        this.setState({ instructionChunk5: particularArray });
        break;
      case 6:
        particularArray = this.state.instructionChunk6;
        particularArray.title = event.target.value;
        this.setState({ instructionChunk6: particularArray });
        break;
      default:
      // ..do nothing
    }
  }

  ///////////////////////////////////////////////////////////////////////////////////////
  handleAddInstructionStep(chip, chunkIndex) {
    var particularArray;

    //     instructionWordlength: '10px'
    //   })
    // }

    // let wordlength = this.state.instructionWordlength;

    // this.setState({
    //   instructionWordlength: wordlength + chip.split(' ').length
    // })console.log("Enter button pressed", );
    if (chip.keyCode === 13) {
      console.log("Enter button pressed");
      switch (chunkIndex) {
        case 1:
          particularArray = this.state.instructionChunk1;

          particularArray.instructionSteps = [
            ...this.state.instructionChunk1.instructionSteps,
            chip.target.value,
          ];
          console.log("This is the data", particularArray);
          this.setState({ instructionChunk1: particularArray });
          document.getElementById("instructionChunk1").value = "";
          break;
        case 2:
          particularArray = this.state.instructionChunk2;
          particularArray.instructionSteps = [
            ...this.state.instructionChunk2.instructionSteps,
            chip.target.value,
          ];
          this.setState({ instructionChunk2: particularArray });
          document.getElementById("instructionChunk2").value = "";
          break;
        case 3:
          particularArray = this.state.instructionChunk3;
          particularArray.instructionSteps = [
            ...this.state.instructionChunk3.instructionSteps,
            chip.target.value,
          ];
          this.setState({ instructionChunk3: particularArray });
          document.getElementById("instructionChunk3").value = "";
          break;
        case 4:
          particularArray = this.state.instructionChunk4;
          particularArray.instructionSteps = [
            ...this.state.instructionChunk4.instructionSteps,
            chip.target.value,
          ];
          this.setState({ instructionChunk4: particularArray });
          document.getElementById("instructionChunk4").value = "";
          break;
        case 5:
          console.log("Comes in here too");
          particularArray = this.state.instructionChunk5;
          particularArray.instructionSteps = [
            ...this.state.instructionChunk5.instructionSteps,
            chip.target.value,
          ];
          this.setState({ instructionChunk5: particularArray });
          document.getElementById("instructionChunk5").value = "";
          break;
        case 6:
          particularArray = this.state.instructionChunk6;
          particularArray.instructionSteps = [
            ...this.state.instructionChunk6.instructionSteps,
            chip.target.value,
          ];
          this.setState({ instructionChunk6: particularArray });
          document.getElementById("instructionChunk6").value = "";
          break;
        default:
        // ..do nothing
      }
    }
  }

  ///////////////////////////////////////////////////////////////////////////////////////
  handleDeleteInstructionsStep(chip, chunkIndex) {
    console.log("In delete instruction step/chip");
    console.log("Chip is " + chip);
    console.log("Index is " + chunkIndex);

    let particularArray;
    let index;
    let arraySteps;

    switch (chunkIndex) {
      case 1:
        particularArray = this.state.instructionChunk1; // make a separate copy of the array
        arraySteps = particularArray.instructionSteps;
        index = arraySteps.indexOf(chip);
        if (index !== -1) {
          arraySteps.splice(index, 1);
          particularArray.instructionSteps = arraySteps;
          console.log("new array : \n" + particularArray);
          this.setState({ instructionChunk1: particularArray });
        }
        break;
      case 2:
        particularArray = this.state.instructionChunk2; // make a separate copy of the array
        arraySteps = particularArray.instructionSteps;
        index = arraySteps.indexOf(chip);
        if (index !== -1) {
          arraySteps.splice(index, 1);
          particularArray.instructionSteps = arraySteps;
          this.setState({ instructionChunk2: particularArray });
        }
        break;
      case 3:
        particularArray = this.state.instructionChunk3; // make a separate copy of the array
        arraySteps = particularArray.instructionSteps;
        index = arraySteps.indexOf(chip);
        if (index !== -1) {
          arraySteps.splice(index, 1);
          particularArray.instructionSteps = arraySteps;
          this.setState({ instructionChunk3: particularArray });
        }
        break;
      case 4:
        particularArray = this.state.instructionChunk4; // make a separate copy of the array
        arraySteps = particularArray.instructionSteps;
        index = arraySteps.indexOf(chip);
        if (index !== -1) {
          arraySteps.splice(index, 1);
          particularArray.instructionSteps = arraySteps;
          this.setState({ instructionChunk4: particularArray });
        }
        break;
      case 5:
        particularArray = this.state.instructionChunk5; // make a separate copy of the array
        arraySteps = particularArray.instructionSteps;
        index = arraySteps.indexOf(chip);
        if (index !== -1) {
          arraySteps.splice(index, 1);
          particularArray.instructionSteps = arraySteps;
          this.setState({ instructionChunk5: particularArray });
        }
        break;
      case 6:
        particularArray = this.state.instructionChunk6; // make a separate copy of the array
        arraySteps = particularArray.instructionSteps;
        index = arraySteps.indexOf(chip);
        if (index !== -1) {
          arraySteps.splice(index, 1);
          particularArray.instructionSteps = arraySteps;
          this.setState({ instructionChunk6: particularArray });
        }
        break;
      default:
      // ..do nothing
    }
  }

  ///////////////////////////////////////////////////////////////////////////////////////
  handleKitchenUtensilInputName = (val) => {
    // const productString = val;
    const productWords = val;

    productWords
      .map((productWord) => {
        return productWord[0].toUpperCase() + productWord.substring(1);
      })
      .join(" ");

    this.setState({ suggestedUtensils: productWords });

    // causees error when testing in request payload
    // var tmpKitchenUtenails = [...this.state.suggestedUtensils]
    // this.setState({ suggestedUtensils: [tmpKitchenUtenails, val] });
  };

  kitBlur = (e) => {
    console.log(e.target.value);
    this.setState({
      kitVal: e.target.value,
    });
  };

  addKitchenUtensil = (e) => {
    let utensil = this.state.kitVal;
    console.log(utensil);
    let suggestedUtensils = this.state.suggestedUtensils;
    var index = suggestedUtensils.indexOf(utensil);
    if (index === -1) {
      suggestedUtensils.push(utensil);
      this.setState({
        suggestedUtensils,
      });
    }
  };

  capitalizeWords(text) {
    return text.replace(/\b\w/g, (match) => match.toUpperCase());
  }

  deleteUtensil(chip) {
    let suggestedUtensils = this.state.suggestedUtensils;
    console.log(chip);
    var index = suggestedUtensils.indexOf(chip);
    if (index !== -1) {
      suggestedUtensils.splice(index, 1);
      this.setState({ suggestedUtensils: suggestedUtensils });
    }
  }
  ///////////////////////////////////////////////////////////////////////////////////////
  handleUtensilsDropdownChange(event) {
    if (event.target.value) {
      this.setState({
        suggestedUtensils: [
          ...this.state.suggestedUtensils,
          event.target.value,
        ],
      });
    } else {
      this.setState({
        suggestedUtensils: [
          ...this.state.suggestedUtensils,
          event.target.innerHTML,
        ],
      });
    }
  }

  ///////////////////////////////////////////////////////////////////////////////////////
  handleDeleteUtensilsChip(chip) {
    var array = [...this.state.suggestedUtensils]; // make a separate copy of the array
    var index = array.indexOf(chip);
    if (index !== -1) {
      this.setState({ suggestedUtensils: array });
    }
  }

  ///////////////////////////////////////////////////////////////////////////////////////
  handleAddCategoryChip(chip) {
    this.setState({
      suggestedCategories: [...this.state.suggestedCategories, chip],
    });

    // new categories are created and handled on submit meal simply
  }

  ///////////////////////////////////////////////////////////////////////////////////////
  handleCategoryDropdownChange = (val) => {
    console.log(this.state.suggestedCategories);
    this.setState({ suggestedCategories: val });
    // below setstate causes an error to make each new set a sum of all previous.
    // this.setState({ suggestedCategories: [...this.state.suggestedCategories, val] });
  };

  categoryBlur = (e) => {
    console.log(e.target.value);
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
    var index = suggestedCategories.indexOf(cat);
    if (index === -1) {
      suggestedCategories.push(cat);
      this.setState({
        suggestedCategories,
      });
    }
  };

  ///////////////////////////////////////////////////////////////////////////////////////
  handleDeleteCategoryChip(chip) {
    var array = [...this.state.suggestedCategories]; // make a separate copy of the array
    var index = array.indexOf(chip);
    if (index !== -1) {
      array.splice(index, 1);
      this.setState({ suggestedCategories: array });
    }
  }

  ///////////////////////////////////////////////////////////////////////////////////////
  addIngredientToMeal(event) {
    event.preventDefault();
    var properIngredientStringSyntax;
    var ingredientValue = document.getElementById("currentIngredient").value;
    var quantityValue = document.getElementById(
      "currentIngredientQuantity"
    ).value;
    // best to get the measurement from the state
    // perhaps becuse inner html is defined before state is updated
    // var measurementValue = this.state.currentIngredientMeasurement;
    var measurementValue = document.getElementById(
      "currentIngredientMeasurement"
    ).value;

    if (ingredientValue === "") {
      window.alert("Enter ingredient to add to meal");
      return;
    }
    ingredientValue = this.capitalizeWords(ingredientValue);
    if (quantityValue === "") {
      // window.alert("Enter quantity to add to meal");
      // return;
    }
    // update ingredient string syntax for no quantity or no measurement.
    if (quantityValue === "") {
      properIngredientStringSyntax = ingredientValue;
    } else if (measurementValue === "" && quantityValue !== "") {
      // MAKE sure we are using the right and tested variables to display the right type of string at all times.
      properIngredientStringSyntax = "" + quantityValue + " " + ingredientValue;
    } else {
      properIngredientStringSyntax =
        "" + quantityValue + " " + measurementValue + " of " + ingredientValue;
    }

    // This is the Object for an Ingredient of a Known Product
    var currIngredientObject = {
      // productName: this.state.currentIngredient,
      productName: ingredientValue,
      // productImgFile: this.state.currentProductImgSrc,
      productImgPath: null,
      // display: this.state.currProductIndexInDBsProductsList,
      // availableLocations: [],

      // these are added to ingredient packets on submit, and not relevant in product object details
      quantity: quantityValue,
      measurement: measurementValue,
      properIngredientStringSyntax: properIngredientStringSyntax,
    };

    console.log(
      "current state of product index at Add Ingredient To Meal is : \n" +
      this.state.currProductIndexInDBsProductsList
    );

    const searchResult = this.props.productNames.map(function callback(
      element
    ) {
      if (element.toLowerCase() === ingredientValue.toLowerCase()) {
        return true;
      } else {
        return false;
      }
    });
    const tmpcurrProductIndexInDBsProductsList = searchResult.indexOf(true);

    console.log("ADDs to new_product_ingredients");

    console.log("creating new product object");

    // edit product details for new product object
    // currIngredientObject.productImgFile = null;
    currIngredientObject.productIndex = 0;
    // currIngredientObject.calories = 0;

    // append String to new Products array if not
    // var tmpNewProducts = [...this.state.new_product_ingredients];
    // var tmpNewProducts = this.state.new_product_ingredients;
    // var updatedProductList = [tmpNewProducts, currIngredientObject];

    // this.setState({ new_product_ingredients: updatedProductList })
    console.log("Current ingredient", currIngredientObject);
    this.setState({
      new_product_ingredients: [
        // ...this?.state?.new_product_ingredients,
        currIngredientObject,
      ],
    });
    console.log(this.state.new_product_ingredients, currIngredientObject);

    this.setState({
      ingredientGroupList: [
        ...this.state.ingredientGroupList,
        currIngredientObject,
      ],
    });
    // after adding product to ingredient group list
    // reset current product img src and path to null, and same for current ingredient inputs
    // this.setState({ currentProductImgSrc: null, productImg_path: "" });
    this.setState({
      currentIngredient: "null",
      currentIngredientQuantity: "",
      currentIngredientMeasurement: "null",
    });
    this.setState({ currentIngredient: "", currentIngredientMeasurement: "" });
    this.handleAddIngredientChip(properIngredientStringSyntax);

    //  Resetting inner html directly to clear ingredient inputs without changing state
    // document.getElementById("currentIngredient").value = 'NewPs';
    // document.getElementById("currentIngredientQuantity").value = 8;
    // document.getElementById("currentIngredientMeasurement").value = 'Removed';
  }

  ///////////////////////////////////////////////////////////////////////////////////////
  sendSuggestedMealToDB = async (e) => {
    const {
      mealName,
      itemMealName,
      prepTime,
      cookTime,
      mealImage,
      mealImagesData,
      intro,
      servings,
      chef,
      new_product_ingredients,
      ingredientGroupList,
      ingredientStrings,
      suggestedCategories,
      tips,
      suggestedUtensils,
      chunk1Content,
      chunk2Content,
      chunk3Content,
      chunk4Content,
      chunk5Content,
      chunk6Content,
      mealImages,
      itemMealImages,
      itemmealImage0,
      itemmealImage1,
      itemmealImage2,
      itemmealImage3,
    } = this.state;

    console.log("This.state", this.state);

    console.log("User data from local storage ", localStorage.getItem("user"));

    // handle edge case meal name, ingredienrs or image upload required to submit form
    if (mealName === "") {
      console.log("meal label blank");
      return;
    }
    if (itemMealName === "") {
      console.log("item meal label blank");
      return;
    }
    // if (ingredientStrings.length === 0) { window.alert("Suggested meal requires adding at least one ingredient to submit"); return; }
    if (mealImage === null || mealImage === undefined) {
      window.alert("You didn't add suggested meal image");
      return;
    }

    // Handle instruction/product images to create url for product images on server
    /*Loop through Ingredients meal data
    Check if all products listed exist in the database.
    If not, let server create placeholder before submitting to db.
    Get list of new products and new Categories

    we could probably merge this in the above for loop easily, but we want to call this path function,
    so lets figure out what its even doing!*/

    // const all_ingredients_formatted = [];
    // const product_slider = [];
    let i = 0;

    // for (i = 0; i < new_product_ingredients.length; i++) {
    //   // store ingredient format to submit ingredient product objects
    //   var tmp_ingredient = {
    //     // name and optional image added to new product,
    //     // we can add remainder products data after testing current
    //     ingredient: new_product_ingredients[i].productName,
    //     // image: new_product_ingredients[i].productImgFile
    //   };
    //   // handle quantity measurement list
    //   var measurementQuantity = {
    //     quantity: ingredientGroupList[i].quantity,
    //     measurement: ingredientGroupList[i].measurement,
    //   }
    //   // no need for handlers since this is created on submit!
    //   this.ingredientsQuantityMeasurements.push(measurementQuantity);
    //   // new_products.push(tmp_ingredient);
    //   // product_slider.push(tmp_slider_data);
    // }

    // let new_measurements = [];
    // for (i = 0; i < ingredientGroupList.length; i++) {
    //   // store ingredient format to submit ingredient product objects
    //   var tmp_ingredient = {
    //     // name and optional image added to new product,
    //     // we can add remainder products data after testing current
    //     productName: ingredientGroupList[i].productName,
    //     quantity: ingredientGroupList[i].quantity,
    //     measurement: ingredientGroupList[i].measurement,
    //     productImgPath: ingredientGroupList[i].productImgPath,
    //     properIngredientStringSyntax: ingredientGroupList[i].properIngredientStringSyntax
    //   };

    //   all_ingredients_formatted.push(tmp_ingredient);
    //   // console.log(tmp_ingredient);

    //   const tmp_slider_data = {
    //     ingredient: ingredientGroupList[i].product,
    //     image: ingredientGroupList[i].productImgPath,
    //     display: ingredientGroupList[i].display,
    //   };
    //   // store product slider format to submit slider object to meal
    //   product_slider.push(tmp_slider_data);

    //   // get new_Measurements from inputted ingredient packets
    //   if (ingredientGroupList[i].measurement !== "") {
    //     let index = this.props.measurements.indexOf(ingredientGroupList[i].measurement);
    //     if (index === -1) new_measurements.push(ingredientGroupList[i].measurement);
    //   }
    // }

    //-------------to make new category data ------------------------------------------
    // get list of new categories to submit to mongo

    // let new_kitchen_utensils = [];
    // for (i = 0; i < suggestedUtensils.length; i++) {
    //   // check if categories already exist, only add new categories to db,
    //   // though all will still be attached to meal, as mentioned
    //   let index = this.props.kitchenUtensils.indexOf(suggestedUtensils[i]);
    //   if (index === -1) new_kitchen_utensils.push(suggestedUtensils[i]);
    // }

    //prepare Meal data to Mongo and Recipe Steps Images and Video content to s3
    const instructionGroupData = [];
    const contentNameToContentImageOrVideoMapForS3 = new FormData();

    // max recipe chunks is 6
    // for (let i = 1; i < 7; i++) {
    //   var contentKey = "instructionChunkContent" + (i + 1);
    //   console.log(this.state.instructionChunk[i]);
    //   // add image or video to recipecontent array
    //   if (this.state.instructionimagesAndVideos[i] !== undefined) {
    //     // console.log("Comes in here to send individual content");
    //     // console.log(this.state.instructionimagesAndVideos[i]);
    //     // contentNameToContentImageOrVideoMapForS3.append( "mealContentName" , contentKey);
    //     contentNameToContentImageOrVideoMapForS3.append(
    //       contentKey,
    //       this.state.instructionimagesAndVideos[i]
    //     );
    //     console.log(contentNameToContentImageOrVideoMapForS3);
    //   }

    //   let currInstructionChunk = [];
    //   // let chunkContent;
    //   // start cases with 0 to include all step slide content
    //   switch (i) {
    //     case 0:
    //       currInstructionChunk = this.state.instructionChunk1;
    //       // currInstructionChunk.dataName = this.state.chunk1Content.filename;
    //       break;
    //     case 1:
    //       currInstructionChunk = this.state.instructionChunk2;
    //       // currInstructionChunk.dataName = this.state.chunk2Content.filename;
    //       break;
    //     case 2:
    //       currInstructionChunk = this.state.instructionChunk3;
    //       // currInstructionChunk.dataName = this.state.chunk3Content.filename;
    //       break;
    //     case 3:
    //       currInstructionChunk = this.state.instructionChunk4;
    //       // currInstructionChunk.dataName = this.state.chunk4Content.filename;
    //       break;
    //     case 4:
    //       currInstructionChunk = this.state.instructionChunk5;
    //       // currInstructionChunk.dataName = this.state.chunk5Content.filename;
    //       break;
    //     case 5:
    //       currInstructionChunk = this.state.instructionChunk6;
    //       // currInstructionChunk.dataName = this.state.chunk6Content.filename;
    //       break;
    //     default:
    //       currInstructionChunk = "null";
    //   }

    //   // let submitable_recipe_chunk = {
    //   //   // do not include and submite a step zero..
    //   //   step: i+1,
    //   //   // title is defined in instruction chunk
    //   //   instructionChunk: currInstructionChunk,
    //   //   // dataname : null
    //   // }
    //   // allMealsInstructionimagesAndVideosCombined.push(contentNameToContentImageOrVideoMapForS3);
    //   instructionGroupData.push(currInstructionChunk);
    // }

    // contentNameToContentImageOrVideoMapForS3.append(
    //   "mealContentName",
    //   this.state.mealName
    // );
    // console.log(contentNameToContentImageOrVideoMapForS3);
    // var keyValueData = { mealContentName: this.state.mealName };
    // console.log("Stringified version:");
    // console.log(keyValueData);
    // var singleTitleTest = JSON.stringify(keyValueData);
    // console.log(singleTitleTest);

    //-------------Submit remainder data of meal to Mongo ------------------------------------------

    let suggestMealForm = new FormData();
    // suggestMealForm.append("meal_name", mealName);
    suggestMealForm.append("item_name", itemMealName);
    // mealImages.forEach((file, i) => {
    //   itemMealImages.forEach((file, i) => {
    //   // suggestMealForm.append(`meal_images${i}`, file);
    //   suggestMealForm.append(`item_images${i}`, file);
    // });
    if (itemMealImages.length) {
      itemMealImages.map((ele) => {
        suggestMealForm.append("item_images", ele);
      });
    } else {
      const img = await fetch("/assets/store_pics/no-image-meal.png");
      const blob = await img.blob();
      suggestMealForm.append("item_images", blob);
    }

    let instructionTitles = [];
    let instructions = [];

    for (let i = 1; i < 7; i++) {
      if (
        this.state[`instructionChunk${i}`].title &&
        this.state[`instructionChunk${i}`].instructionSteps
      ) {
        console.log(this.state[`instructionChunk${i}`], "eeeeee");
        instructions.push(JSON.stringify(this.state[`instructionChunk${i}`]));
      }
    }

    if (instructions.length === 0 || ingredientStrings.length === 0) {
      // alert(
      //   "Instructions or Ingredents missing. Please add atleast one of each"
      // );
      // return;
    } else {
      suggestMealForm.append(
        "formatted_instructions",
        JSON.stringify(instructions.map((ele) => JSON.parse(ele)))
      );
    }

    if (chunk1Content && typeof chunk1Content !== "string") {
      suggestMealForm.append("image_or_video_content_1", chunk1Content);
    }
    if (chunk2Content && typeof chunk2Content !== "string") {
      suggestMealForm.append("image_or_video_content_2", chunk2Content);
    }
    if (chunk3Content && typeof chunk3Content !== "string") {
      suggestMealForm.append("image_or_video_content_3", chunk3Content);
    }
    if (chunk4Content && typeof chunk4Content !== "string") {
      suggestMealForm.append("image_or_video_content_4", chunk4Content);
    }
    if (chunk5Content && typeof chunk5Content !== "string") {
      suggestMealForm.append("image_or_video_content_5", chunk5Content);
    }
    if (chunk6Content && typeof chunk6Content !== "string") {
      suggestMealForm.append("image_or_video_content_6", chunk6Content);
    }

    // suggestMealForm.append('instructionsGroupList', instructionGroupData);

    // chunk content should be passed as file
    //---------------------------------------------Submit Meal to Mongo---------------------------------------------------
    // var url = "/addMealSuggestion/";
    // var url = `${base_url}/items/`;

    for (let i = 1; i < 7; i++) {
      if (
        this.state[`instructionChunk${i}`].title &&
        this.state[`instructionChunk${i}`].instruction
      ) {
        instructionTitles.push(this.state[`instructionChunk${i}`].title);
        instructions.push(this.state[`instructionChunk${i}`].instruction);
      }
    }

    // chunk content should be passed as file
    //---------------------------------------------Submit Meal to Mongo---------------------------------------------------
    // var url = "/addMealSuggestion/";
    // var url = `${base_url}/items`;

    console.log(this.state.allMealNames, "item");

    const formDataObj = {};
    suggestMealForm.forEach((value, key) => (formDataObj[key] = value));

    console.log("form", formDataObj);

    for (let i = 1; i < 7; i++) {
      if (
        this.state[`instructionChunk${i}`].title &&
        this.state[`instructionChunk${i}`].instruction
      ) {
        instructionTitles.push(this.state[`instructionChunk${i}`].title);
        instructions.push(this.state[`instructionChunk${i}`].instruction);
      }
    }
    // suggestMealForm.append('meal_images', mealImages);

    // suggestMealForm.append("intro", intro);
    suggestMealForm.append("item_intro", intro);
    // suggestMealForm.append("instructions", instructions)
    // suggestMealForm.append("instructionTitles", instructionTitles)
    suggestMealForm.append("item_type", this.props.suggestionType);

    const MealObject = {
      prep_time: prepTime,
      cook_time: cookTime,
      chef: this.state.username,
      servings,
      kitchen_utensils: JSON.stringify(suggestedUtensils),
      tips,

      meal_name: itemMealName,
    };
    suggestMealForm.append("item_data", JSON.stringify(MealObject));

    // if(this.props.suggestionType === '')

    // suggestMealForm.append('ingredientStrings', ingredientStrings);
    // list of products quantity measurements (created on submit meal)
    // suggestMealForm.append('ingredientsQuantityMeasurements', JSON.stringify(this.ingredientsQuantityMeasurements));

    // new suggested products
    // suggestMealForm.append("meal_categories", JSON.stringify(suggestedCategories))
    console.log(chunk2Content, "suggests");
    console.log(suggestedUtensils, "utensils");
    // RecipeSteps

    let ingredientList = [];
    for (let element of ingredientGroupList) {
      let obj = {};
      if (element.productName) {
        obj.item_name = element.productName;
      }
      if (element.quantity) {
        obj.item_quantity = !Number.isNaN(Number(element.quantity)) ? element.quantity : 1;
      }
      if (element.measurement) {
        obj.item_measurement = element.measurement;
      }
      if (element.properIngredientStringSyntax) {
        obj.formatted_string_of_item = element.properIngredientStringSyntax;
      }
      ingredientList.push(obj);
    }
    suggestMealForm.append(
      "formatted_ingredients",
      JSON.stringify(ingredientList)
    );
    // suggestMealForm.append("store_available", '63d426b416b83177aaeaed96');
    suggestMealForm.append(
      "user",
      JSON.parse(localStorage.getItem("user"))._id
    );
    // suggestMealForm.append("instruction_images1", chunk1Content);
    // suggestMealForm.append("instruction_images2", chunk2Content);
    // suggestMealForm.append("instruction_images3", chunk3Content);
    // suggestMealForm.append("instruction_images4", chunk4Content);
    // suggestMealForm.append("instruction_images5", chunk5Content);
    // suggestMealForm.append("instruction_images6", chunk6Content);
    // suggestMealForm.append("instruction1", chunk6Content);
    // suggestMealForm.append("instruction_images6", chunk6Content);

    // suggestMealForm.append('instructionsGroupList', instructionGroupData);

    // chunk content should be passed as file
    //---------------------------------------------Submit Meal to Mongo---------------------------------------------------
    // var url = "/addMealSuggestion/";
    var url = `${base_url}/items`;

    if (this.props.router?.query?.id) {
      url = url + `?action=${"update"}&_id=${this.props.router.query.id}`;
    }

    const config_ = {
      method: "POST",
      data: suggestMealForm,
      url: url,
      headers: {
        // 'application/json' is the modern content-type for JSON, but some
        // older servers may use 'text/json'.
        // See: http://bit.ly/text-json
        // application/x-www-form-urlencoded
        // 'content-type': 'multipart/form-data'
      },
    };

    // var instructionData = JSON.parse(JSON.stringify(instructionGroupData));
    // console.log(instructionData);
    const config = {
      method: "POST",
      data: suggestMealForm,
      url: url,
      headers: {
        // 'application/json' is the modern content-type for JSON, but some
        // older servers may use 'text/json'.
        // See: http://bit.ly/text-json
        // application/x-www-form-urlencoded
        // 'content-type': 'multipart/form-data'
      },
    };

    const capitalizedSuggestedCategories = suggestedCategories?.map((ele) =>
      this.capitalizeWords(ele)
    );
    suggestMealForm.append(
      "item_categories",
      JSON.stringify(capitalizedSuggestedCategories)
    );

    await axios(config)
      .then((response) => {
        console.log(typeof response.data.success, "response data");
        const status = response?.data.success;
        if (
          response.status >= 200 &&
          response.status < 300 &&
          typeof status === "undefined"
        ) {
          this.setState({ booleanOfDisplayOfDialogBoxConfirmation: true });
          console.log(response);
          console.log("Display Meal submitted successfully");
          localStorage.removeItem("suggestMealForm");
          toast.success("Meal submitted sucessfully");
        } else if (
          response?.data.success === false &&
          response?.data?.message === "Token is not valid"
        ) {
          toast.error(response?.data?.message);
          console.log("Something wrong happened ");
        }
      })
      .catch((error) => {
        console.log(error.message, "errors");
        toast.error(error.message);
      });
  };

  uploadMediaStep = (id) => {
    // <input accept="image/*,video/mp4,video/x-m4v,video/*" id="instructionChunkContent1" name="instructionChunkContent1" type="file" className="mb-2" onChange={(ev) => this.onhandleInstructionImg(ev, 1)} />
    const input = document.createElement("input");
    input.accept = "image/*,video/mp4,video/x-m4v,video/*";
    input.id = "instructionChunkContent" + id;
    input.name = "instructionChunkContent" + id;
    input.type = "file";
    input.onchange = (ev) => this.onhandleInstructionImg(ev, id);
    input.hidden = true;
    input.click();
  };

  uploadMealImage = () => {
    // <input accept="image/*,video/mp4,video/mov,video/x-m4v,video/*" id="mealImage" name="mealImage" type="file" className="mb-2 pr-4" onChange={(ev) => this.onUpdateMealImage(ev)} />
    const input = document.createElement("input");
    input.accept = "image/*,video/mp4,video/x-m4v,video/*";
    input.id = "mealImage";
    input.name = "mealImage";
    input.type = "file";
    let id = this.state.mealImagesData.length;
    input.onchange = (ev) => this.onUpdateMealImage(ev, id);
    input.hidden = true;
    input.click();
  };

  addMoreStep = () => {
    let stepInputs = this.state.stepInputs;

    let id = stepInputs.length + 2;

    stepInputs.push(id);
    this.setState({
      stepInputs,
    });
  };
  getItem = async (name) => {
    console.log(name, "name");
    try {
      const response = await axios.get(`/items/filter/${name}`);
      const resp = response.data.data.map((element) => {
        return {
          label: element.item_name,
          value: element._id,
          image: element?.itemImage0,
          price: element?.item_price ? `$${element?.item_price}` : "No Price",
          store: element?.store_available?.store_name || "No store",
          item_type: element?.item_type,
        };
      });
      const filteredItems = resp.filter((item) => item.item_type === "Meal");
      this.setState({
        ...this.state,
        allMealNames: filteredItems,
      });
      console.log(filteredItems);
    } catch (error) {
      console.log(error);
    }
    return name;
  };

  uploadMediaStep = (id) => {
    // <input accept="image/*,video/mp4,video/x-m4v,video/*" id="instructionChunkContent1" name="instructionChunkContent1" type="file" className="mb-2" onChange={(ev) => this.onhandleInstructionImg(ev, 1)} />
    const input = document.createElement("input");
    input.accept = "image/*,video/mp4,video/x-m4v,video/*";
    input.id = "instructionChunkContent" + id;
    input.name = "instructionChunkContent" + id;
    input.type = "file";
    input.onchange = (ev) => this.onhandleInstructionImg(ev, id);
    input.hidden = true;
    input.click();
  };

  uploadMealImage = () => {
    // <input accept="image/*,video/mp4,video/mov,video/x-m4v,video/*" id="mealImage" name="mealImage" type="file" className="mb-2 pr-4" onChange={(ev) => this.onUpdateMealImage(ev)} />
    const input = document.createElement("input");
    input.accept = "image/*,video/mp4,video/x-m4v,video/*";
    input.id = "mealImage";
    input.name = "mealImage";
    input.type = "file";
    let id = this.state.mealImagesData.length;
    input.onchange = (ev) => this.onUpdateMealImage(ev, id);
    input.hidden = true;
    input.click();
  };

  addMoreStep = () => {
    let stepInputs = this.state.stepInputs;

    let id = stepInputs.length + 2;

    stepInputs.push(id);
    this.setState({
      stepInputs,
    });
  };

  removeStep = (n) => {
    let stepInputs = this.state.stepInputs;
    var index = stepInputs.indexOf(n);
    stepInputs.splice(index, 1);

    // let instruction = this.state['instructionChunk'+n];

    this.state["instructionChunk" + n] = {
      title: "",
      instructionSteps: [],
      dataName: "",
    };

    this.state["chunk" + n + "Content"] = "";
    const input = document.getElementById("instructionChunkContent" + n);
    if (input) {
      input.accept = "";
      input.id = "";
      input.name = "";
      input.type = "";
      input.onchange = null;
      input.hidden = true;

      var imageElementId = "chunk" + n + "Image";
      var videoElementId = "chunk" + n + "Video";
      var image = document.getElementById(imageElementId);
      var video = document.getElementById(videoElementId);
      image.style.display = "none";
      video.style.display = "none";

      image.src = "";
      video.src = "";
    }

    this.setState({
      stepInputs,
    });
  };

  //fuction to delete selected image
  deleteImage(id) {
    const delImages = this.state.mealImagesData;
    delImages.splice(id, 1);
    this.setState({ ...this.state, mealImagesData: delImages });
  }
  //function to delete instruction image
  deleteImg(id) {
    var image = document.getElementById(id);
    image.style.display = "none";
    // const delImage = this.state["instructionChunk1"]
    // delImage.slice(id, 1)
    // this.setState({ ...this.state, instructionChunk1: delImage })
  }

  async processZipFile(buffer) {
    const zip = await JSZip.loadAsync(buffer);

    const response = {
      transcription: {},
      data: {},
      videos: []
    }
    const jsonFile = zip.file('transcription.json');
    if (jsonFile) {
      const jsonData = await jsonFile.async('text');
      const parsedData = JSON.parse(jsonData);
      response.transcription = parsedData
    }
    const jsonFile_ = zip.file('extract.json');
    if (jsonFile_) {
      const jsonData = await jsonFile_.async('text');
      const parsedData = JSON.parse(jsonData);
      response.data = parsedData
    }

    const videoFiles = [];
    zip.forEach((relativePath, file) => {
      if (relativePath.endsWith('.mp4') || relativePath.endsWith('.mkv') || relativePath.endsWith('.webm')) {
        videoFiles.push(file);
      }
    });
    const new_steps = await Promise.all(
      videoFiles?.map(async (element, idx) => {
        const stepIndex = Number(element?.name?.split('-')[1]?.split('.')[0]);
        const step = response.data?.meal_preparation_steps?.find(
          (ele) => Number(ele?.step) === stepIndex
        );

        if (step) {
          const videoBlob = await element.async('blob');
          const videoURL = URL.createObjectURL(videoBlob);
          return {
            ...step,
            step_video: {
              videoBlob,
              videoURL
            }
          };
        } else {
          return step;
        }
      })
    );

    response.data = {
      ...response.data,
      meal_preparation_steps: new_steps
    }

    videoFiles.forEach(async (videoFile) => {
      const videoBlob = await videoFile.async('blob');
      const videoURL = URL.createObjectURL(videoBlob);
      response.videos.push({
        videoBlob,
        videoURL
      })
    });
    return response
  }

  async processVideo(video, socialUrl) {
    try {
      const form = new FormData();
      if (video) {
        form.append('video', video)
      } else if (socialUrl) {
        form.append('url', socialUrl)
      } else {
        return alert('Add a video or url')
      }
      this.setState({
        ...this.state,
        isLoading: true
      })
      const source = _axios.CancelToken.source();
      const timeout = setTimeout(() => {
        source.cancel();
        console.log('Request timed out.');
      }, 420000);
      console.log('sending')

      _axios(`${base_url}/items/transcription`, {
        method: 'put',
        data: form,
        headers: {
          "Content-Type": "multipart/form-data"
        },
        cancelToken: source.token,
      })
        .then(async (result) => {
          console.log(result, 'resss_1');
          clearTimeout(timeout);

          //  const response =  await this.processZipFile(result.data)
          this.setState({
            ...this.state,
            isLoading: false,
            videoData: {
              ...this.state.videoData,
              transcription: result.data.data?.transcription,
              data: result.data.data?.data
            }
          })
        })
        .catch((error) => {
          if (_axios.isCancel(error)) {
            console.log('Request canceled:', error.message);
          } else {
            console.log('An error occurred:', error.message);
          }
        });
    } catch (e) {
      console.log(e, 'error')
    }
  }

  async saveVideo(video) {
    this.setState({
      ...this.state,
      videoData: {
        video,
        videoUrl: URL.createObjectURL(video)
      }
    })
  }

  async prefileForm() {
    const ingredientGroupList = this.state.videoData.data?.ingredients?.map((ele, idx) => {
      const quantity = ele?.ingredient_quantity ? "" : ele?.ingredient_quantity;
      const measurement = ele?.ingredient_measurement === 'N/A' ? "" : ele?.ingredient_measurement;
      return {
        measurement,
        productImgPath: null,
        productIndex: idx,
        productName: ele?.ingredient_name,
        properIngredientStringSyntax: (quantity && measurement ? `${quantity} ${measurement} of` : "") + `${ele?.ingredient_name}`,
        quantity: quantity ? "" : ele?.ingredient_quantity
      }
    })

    const ingredientStrings = this.state.videoData.data?.ingredients?.map((ele) => {
      const quantity = ele?.ingredient_quantity ? "" : ele?.ingredient_quantity;
      const measurement = ele?.ingredient_measurement === 'N/A' ? "" : ele?.ingredient_measurement;
      return (quantity && measurement ? `${quantity} ${measurement} of` : "") + `${ele?.ingredient_name}`
    })

    const obj = {};

    this.state.videoData.data?.meal_preparation_steps?.map((ele, idx) => {
      obj[`instructionChunk${idx + 1}`] = {
        title: ele?.step_title,
        instructionSteps: ele?.step_instruction ?? [],
        dataName: ""
      }
      // obj[`chunk${idx+1}Content`] = ele?.step_video?.videoURL
      // const doc = document.getElementById(`chunk${idx + 1}Video`);
      // if(doc){
      //   console.log(ele?.step_video?.videoURL, 'ele?.step_video?.videoURL')
      //   doc.setAttribute('src', ele?.step_video?.videoURL)
      //   doc.style.display = 'block'
      // }
    })

    this.setState({
      ...this.state,
      mealName: this.state.videoData.data?.meal_name ?? "",
      intro: this.state.videoData.data?.meal_preparation_summary ?? "",
      ingredientGroupList,
      ingredientStrings,
      itemMealName: this.state.videoData.data?.meal_name ?? "",
      suggestedCategories: this.state.videoData.data?.meal_categories ?? [],
      suggestedUtensils: this.state.videoData.data?.kitchen_utensils ?? [],
      stepInputs: (this.state.videoData.data?.meal_preparation_steps ?? [])?.map((_, idx) => idx + 1)?.slice(1),
      ...obj
    })
  }

  ///////////////////////////////////////////////////////////////////////////////////////
  render() {
    // const [ingredientInput, setIngredientInput] = useState('');

    // const theme = createMuiTheme({
    //   palette: { primary: green },
    // });




    // console.log(this.props.categories);
    const { ingredientStrings, stepInputs } = this.state;
    console.log(this.state.videoData, "steps");

    console.log(this.state.chunk2Content, "ingredientStrings");
    console.log(this.state.videoData.data, "render");

    console.log(
      this.state, 'stepInputs'
    )
    return (
      <div className={styles.suggestion_section_2}>
        <form
          id="formmeal"
          className={styles.suggestion_forms}
          noValidate
          autoComplete="off"
          encType="multipart/form-data"
          method="post"
        >
          <h3>Begin Suggesting Meal</h3>

          <div className={styles.link_embeb}>
            <div>
              <ul>
                {
                  ['Upload video locally'].map((element) => (
                    <li
                      style={{
                        borderBottom: this.state.action === element ? "2px solid #F47900" : ""
                      }}
                      onClick={() => this.setState({
                        ...this.state,
                        action: element
                      })}
                    >
                      {element}
                    </li>
                  ))
                }
              </ul>
              <div className={styles.box_container}>
                {
                  this.state.action === 'Embed Link' && <div>
                    <p className={styles.paste_url}>Paste the URL link of the video you want to upload</p>
                    <div className={styles.upload_box}>
                      <input
                        onChange={(event) => this.setState({
                          ...this.state,
                          videoData: {
                            ...this.state.videoData,
                            socialUrl: event.target.value
                          }
                        })}
                        placeholder="Paste the video url here" />
                      <div style={{
                        opacity: this.state.videoData.socialUrl ? 1 : 0.6,
                        cursor: this.state.videoData.socialUrl ? "pointer" : "not-allowed"
                      }}
                        onClick={() => this.processVideo(null, this.state.videoData.socialUrl)}
                      >
                        <p>
                          {
                            this.state.isLoading ? "Loading..." : "UPLOAD"
                          }
                        </p>
                      </div>
                    </div>
                  </div>
                }
                {
                  this.state.action === 'Upload video locally' && <>
                    {
                      this.state.videoData.videoUrl ? <div className={styles.videoCtn}>
                        <video
                          className={styles.video_url}
                          controls
                          src={this.state.videoData.videoUrl}
                        >
                          Your browser does not support the video tag.
                        </video>
                        <div style={{ width: "100%", display: "flex", justifyContent: "center", alignItems: "center", }}>
                          <div className={styles.transcribeBtn_parent}>
                            <div style={{
                              backgroundColor: "#fff",
                              borderRadius: '4px'
                            }}>
                              <div
                                onClick={() => this.processVideo(this.state.videoData.video)}
                                className={styles.transcribeBtn}>
                                <p>
                                  {
                                    this.state.isLoading ? "Loading..." : "Transcribe Video"
                                  }
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div
                          onClick={() => this.setState({
                            ...this.state,
                            videoData: {
                              video: {},
                              videoUrl: ""
                            }
                          })}
                          className={styles.closeBtn}>
                          <svg width="34" height="34" viewBox="0 0 34 34" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M17 3.1875C9.38387 3.1875 3.1875 9.38387 3.1875 17C3.1875 24.6161 9.38387 30.8125 17 30.8125C24.6161 30.8125 30.8125 24.6161 30.8125 17C30.8125 9.38387 24.6161 3.1875 17 3.1875ZM22.7528 21.25L21.25 22.7528L17 18.5028L12.75 22.7528L11.2472 21.25L15.4972 17L11.2472 12.75L12.75 11.2472L17 15.4972L21.25 11.2472L22.7528 12.75L18.5028 17L22.7528 21.25Z" fill="#949494" />
                          </svg>
                        </div>
                      </div> :
                        <div className={styles.local_upload}>

                          <p>Drag and drop your videos here to upload</p>
                          <p>Or</p>
                          <div
                            onClick={() => this.inputRef.current?.click()}
                          ><p>BROWSE FILES</p></div>
                          <input
                            type="file"
                            onChange={(event) => this.saveVideo(event.target.files[0])}
                            ref={this.inputRef}
                            style={{
                              display: 'none'
                            }}
                          />

                        </div>
                    }
                  </>

                }

              </div>
              {
                Boolean(Object.keys(this.state.videoData?.transcription ?? {}).length) && <div className={styles.transcriptionData}>
                  <p>Transcription </p>
                  <div className={styles.transcritionBox}>
                    {
                      Object.keys(this.state.videoData.transcription).map((element) => (
                        <p key={element}>
                          [{element}]: <span>{this.state.videoData.transcription[element]}</span>
                        </p>
                      ))
                    }
                  </div>
                  {
                    this.state.videoData.data && <div
                      onClick={() => this.prefileForm()}
                      className={styles.autofill_btn}>
                      <p>AUTOFILL FIELDS</p>
                    </div>
                  }
                </div>
              }
            </div>
          </div>

          <div className={styles.suggestion_form}>
            <div className={styles.suggestion_form_group}>
              <label
                // htmlFor="mealName"
                htmlFor="itemMealName"
                className={styles.suggestion_form_label}
              >
                Meal Name
              </label>
              <Autocomplete
                // id="mealName"
                id="itemMealName"
                options={this.state.allMealNames}
                value={this.state.mealName}
                onChange={(ev, val) =>
                  this.setState({
                    ...this.state,
                    itemMealName: val?.label,
                    mealName: val?.label,
                  })
                }
                onInputChange={(e) => this.getItem(e?.target?.value)}
                freeSolo
                onSelect={(e) => {
                  this.setState({
                    ...this.state,
                    itemMealName: e.target.value,
                    mealName: e.target.value,
                  });
                }}
                renderInput={(params) => (
                  <TextField {...params} variant="outlined" />
                )}
                fullWidth
              // value={this.state.mealName}
              // value={this.state.itemMealName}
              />
            </div>
            <div className={styles.suggestion_form_2_col}>
              <div className={styles.suggestion_form_2_col_1}>
                <div className={styles.suggestion_form_group}>
                  <label
                    htmlFor="prepTime"
                    className={styles.suggestion_form_label}
                  >
                    PrepTime (Minutes)
                  </label>
                  <TextField
                    value={this.state.prepTime}
                    id="prepTime"
                    type="number"
                    fullWidth
                    onChange={this.onTextFieldChange}
                    variant="outlined"
                    required
                  />
                </div>
              </div>
              <div className={styles.suggestion_form_2_col_2}>
                <div className={styles.suggestion_form_group}>
                  <label
                    htmlFor="cookTime"
                    className={styles.suggestion_form_label}
                  >
                    CookTime (Minutes)
                  </label>
                  <TextField
                    value={this.state.cookTime}
                    id="cookTime"
                    type="number"
                    fullWidth
                    onChange={this.onTextFieldChange}
                    variant="outlined"
                    required
                  />
                </div>
              </div>
            </div>

            <h3>
              Upload Images <em>(Up to 4)</em>
            </h3>
            {this.state.mealImagesData?.length < 4 && (
              <div className={styles.suggestion_form_image}>
                <div className={styles.suggestion_form_image_col_1}>
                  <div
                    onClick={() => this.uploadMealImage()}
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
            <Row>
              <Col md={12} style={{ marginTop: "20px" }}>
                <p>
                  <img
                    // id="mealImage0"
                    id="itemmealImage0"
                    width="100%"
                    height="100%"
                    alt="main_Meal_Image"
                    style={{ display: "none" }}
                  />
                </p>
              </Col>
            </Row>
            {this.state.mealImagesData?.map((data, index) => (
              <Row key={index}>
                <Col md={12} style={{ marginTop: "20px", width: "100%" }}>
                  <p className={styles.mealImg}>
                    <Image
                      src={data}
                      id={"itemmealImage" + { index }}
                      width={100}
                      height={100}
                      alt="other_meal_images"
                      objectFit="cover"
                      objectPosition="center"
                    />
                  </p>
                  <div
                    className={styles.close}
                    onClick={() => this.deleteImage(index)}
                  >
                    <AiOutlineClose className={styles.closeIcon} />
                  </div>
                </Col>
              </Row>
            ))}

            <h3>Add more details</h3>
            <div className={styles.suggestion_form_group}>
              {/* <label htmlFor="intro" className={styles.suggestion_form_label}> */}
              <label
                htmlFor="itemIntro"
                className={styles.suggestion_form_label}
              >
                Intro (150 words)
              </label>
              <TextField
                multiline
                value={this.state.intro}
                // value={this.state.itemIntro}
                id="intro"
                // id="itemIntro"
                fullWidth
                onChange={this.onTextFieldChange}
                variant="outlined"
              />
            </div>
            <div className={styles.suggestion_form_2_col}>
              <div className={styles.suggestion_form_2_col_1}>
                <div className={styles.suggestion_form_group}>
                  <label
                    htmlFor="servings"
                    className={styles.suggestion_form_label}
                  >
                    People to serve
                  </label>
                  <TextField
                    inputProps={{ min: 1 }}
                    value={this.state.servings}
                    id="servings"
                    fullWidth
                    type="number"
                    onChange={this.onTextFieldChange}
                    variant="outlined"
                    placeholder="1 person, 2, 4 or 10 people"
                  />
                </div>
              </div>
              <div className={styles.suggestion_form_2_col_2}>
                <div className={styles.suggestion_form_group}>
                  <label
                    htmlFor="chef"
                    className={styles.suggestion_form_label}
                  >
                    Name of Chef
                  </label>
                  <TextField
                    id="chef"
                    // value={this.state.chef}
                    disabled
                    value={this.state.username}
                    fullWidth
                    onChange={this.updateChef}
                    variant="outlined"
                  />
                </div>
              </div>
            </div>
          </div>
          <h3>Add Ingredients</h3>
          <div
            className={styles.suggestion_form}
            onKeyDown={(event) => {
              // Check if the pressed key is Enter
              if (event.key === "Enter") {
                event.preventDefault(); // Prevent default form submission
                this.addIngredientToMeal(event);
              }
            }}
          >
            <div className={styles.suggestion_form_group}>
              <label
                htmlFor="currentIngredient"
                className={styles.suggestion_form_label}
              >
                Ingredient Name
              </label>
              <Autocomplete
                id="currentIngredient"
                options={this.props.productNames.map((option) => option)}
                // onChange={(ev)=>this.onTextFieldChange(ev)}
                value={this.state.currentIngredient}
                onChange={(ev, val) => this.handleProductNameInput(ev, val)}
                freeSolo
                renderInput={(params) => (
                  <TextField
                    {...params}
                    id="currentIngredient"
                    value={this.state.currentIngredient}
                    variant="outlined"
                    type="text"
                  />
                )}
                fullWidth
              />
            </div>
            <div className={styles.suggestion_form_2_col}>
              <div className={styles.suggestion_form_2_col_1}>
                <div className={styles.suggestion_form_group}>
                  <label
                    htmlFor="currentIngredientQuantity"
                    className={styles.suggestion_form_label}
                  >
                    Quantity
                  </label>
                  <TextField
                    inputProps={{ min: 0 }}
                    fullWidth
                    id="currentIngredientQuantity"
                    type="number"
                    onChange={this.onTextFieldChange}
                    variant="outlined"
                    placeholder="1.."
                    value={this.state.currentIngredientQuantity}
                  />
                </div>
              </div>

              <div className={styles.suggestion_form_2_col_2}>
                <div className={styles.suggestion_form_group}>
                  <label
                    htmlFor="currentIngredientMeasurement"
                    className={styles.suggestion_form_label}
                  >
                    Measurements
                  </label>
                  <Autocomplete
                    id="currentIngredientMeasurement"
                    options={this.state.measurements.map((option) => option)}
                    value={this.state.currentIngredientMeasurement}
                    onChange={this.handleIngredientMeasurement}
                    freeSolo
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        value={this.state.currentIngredientMeasurement}
                        id="currentIngredientMeasurement"
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
                onClick={this.addIngredientToMeal}
                className={styles.ingredient_button}
                style={{ width: "max-content" }}
                onKeyDown={(event) => {
                  if (event.key === "Enter") {
                    event.preventDefault(); // Prevent default form submission
                    this.addIngredientToMeal(event);
                  }
                }}
              >
                {" "}
                Add Ingredient
              </Button>
            </div>
            {/* // show all ingredients in two column table format */}
            {/* Show all Products in display format as expected in Meal Page*/}

            <Stack direction="row" spacing={1} className={styles.stack}>
              {ingredientStrings?.map((data, index) => (
                <Chip
                  key={index}
                  label={data}
                  className={styles.chip}
                  onClick={() => this.handleDeleteIngredientChip(data)}
                  onDelete={() => this.handleDeleteIngredientChip(data)}
                />
              ))}
            </Stack>
          </div>

          <h3>
            Kitchen Utensils<em>(optional)</em>
          </h3>
          <div className={styles.suggestion_form}>
            <div className={styles.suggestion_form_group}>
              <label
                htmlFor="kitchen_utensils"
                className={styles.suggestion_form_label}
              >
                Utensils Name
              </label>
              <div className={styles.input_button}>
                <Autocomplete
                  multiple
                  id="kitchen_utensils"
                  freeSolo
                  clearOnBlur
                  onBlur={this.kitBlur}
                  options={this.state.utensils?.map((option) => option)}
                  // onChange={(ev,val)=>this.handleUtensilsDropdownChange(ev,val)}
                  onChange={(e, val) => this.handleKitchenUtensilInputName(val)}
                  renderInput={(params) => (
                    <TextField {...params} variant="outlined" />
                  )}
                  fullWidth
                  value={this.state.suggestedUtensils}
                />
                <Button
                  variant="contained"
                  disableRipple
                  onClick={this.addKitchenUtensil}
                  className={styles.ingredient_button}
                  style={{ width: "max-content" }}
                >
                  {" "}
                  Add Kitchen Utensils
                </Button>
              </div>
              {/* <ChipInput label=" className={styles.mb-2} fullWidth id="utensils" onChange={(chip) => this.updateUtensils(chip)} variant="outlined" /> */}
            </div>
            <Stack
              direction="row"
              justifyContent="flex-start"
              spacing={1}
              className={styles.stack}
            >
              {this.state.suggestedUtensils?.map((data, index) => (
                <Chip
                  key={index}
                  label={data}
                  className={styles.chip}
                  onClick={() => this.deleteUtensil(data)}
                  onDelete={() => this.deleteUtensil(data)}
                />
              ))}
            </Stack>
          </div>

          {/* add kitchen slider template here? */}

          <h3>Add Recipe Steps</h3>

          <div className={styles.suggestion_form}>

            {/* <Row>
                    <Col md={12}>
                      <ChipInput label="Instructions"  className={styles.mb-2} fullWidth  value={this.state.instructionsChip} onAdd={(chip) => this.handleAddInstructionStep(chip)} onDelete={(chip, index) =>this.handleDeleteInstructionsStep(chip, index)}   variant="outlined" />
                    </Col>               
                  </Row> */}

            <p> Upload photos/videos for different parts of recipe steps</p>

            {/* <Col md={12}  className="mb-2}>
                      <input accept="image/*,video/mp4,video/x-m4v,video/*" id="imgSrc1" type="file" className="mb-2" onChange={(ev)=>this.onhandleInstructionImg(ev)} />
                    </Col>    */}

            {/* <Col md={4}  style={{textAlign:"center", margin: "auto"}}> 
                      <Button variant="contained" color="primary"  disableRipple style={{color:"white", width:"300px"}}  onClick={this.addInstructionList}  > ADD NEW INSTRUCTION SET</Button>
                    </Col> */}

            <div
              className={
                stepInputs?.length > 0
                  ? "suggestion_recipe_steps more_steps"
                  : "suggestion_recipe_steps"
              }
            >
              <div className={styles.suggestion_recipe_step}>
                <div className={styles.suggestion_form_group}>
                  <label className={styles.suggestion_form_label}>
                    Step 1 Title
                  </label>

                  <TextField
                    value={this.state.instructionChunk1?.title}
                    id="chunk1Title"
                    onChange={(ev) => this.handleInstructionTitle(ev, 1)}
                    variant="outlined"
                  />
                </div>

                <div className={styles.suggestion_form_group}>
                  <label className={styles.suggestion_form_label}>
                    Instruction
                  </label>
                  <TextField
                    fullWidth
                    id="instructionChunk1"
                    onKeyDown={(chip) => this.handleAddInstructionStep(chip, 1)}
                    // onChange={(chip) => this.handleAddInstructionStep(chip, 1)}
                    variant="outlined"
                    required
                  />
                  {/* <ChipInput label="Instructions" className="mb-2" fullWidth 
                      value={this.state.instructionChunk1.instructionSteps} 
                      onAdd={(chip) => this.handleAddInstructionStep(chip, 1)} 
                      onDelete={(chip, index) => this.handleDeleteInstructionsStep(chip, 1)} variant="outlined" /> */}
                </div>
                <Stack direction="row" spacing={1} className={styles.stack}>
                  {this.state.instructionChunk1?.instructionSteps?.map(
                    (chip, index) => (
                      <Chip
                        key={index}
                        label={chip}
                        className={styles.chip}
                        onClick={() =>
                          this.handleDeleteInstructionsStep(chip, 1)
                        }
                        onDelete={() =>
                          this.handleDeleteInstructionsStep(chip, 1)
                        }
                      />
                    )
                  )}
                </Stack>
                <h3>Upload Media</h3>
                {/* <div className="suggestion_form_group}>

                    <input accept="image/*,video/mp4,video/x-m4v,video/*" id="instructionChunkContent1" name="instructionChunkContent1" type="file" className="mb-2" onChange={(ev) => this.onhandleInstructionImg(ev, 1)} />
                    </div> */}
                <div className={styles.suggestion_form_image}>
                  <div
                    onClick={() => this.uploadMediaStep(1)}
                    className={styles.suggestion_form_image_col_1}
                  >
                    <div className={styles.suggestion_form_image_icon_con}>
                      <AddIcon className={styles.suggestion_form_image_icon} />
                    </div>
                  </div>
                  <div className={styles.suggestion_form_image_col_2}>
                    <p>
                      Upload picture/video with : Jpeg,png,mp4,mpeg format and
                      not more than 2mb
                    </p>
                  </div>
                </div>

                <div>
                  <img
                    id="chunk1Image"
                    className={styles.suggestion_image}
                    alt="recipe_step1_image_or_video"
                    style={{
                      display: "none",
                      objectFit: "cover",
                      height: "100px",
                      width: "100px",
                      objectPosition: "center",
                    }}
                  />
                  <div
                    className={styles.closed}
                    onClick={() => this.deleteImg("chunk1Image")}
                  >
                    <AiOutlineClose className={styles.closeIcon} />
                  </div>
                </div>
                <div style={{ position: 'relative' }}>
                  <video
                    className={styles.suggestion_image}
                    id="chunk1Video"
                    style={{ display: "none" }}
                    controls
                  >
                    <p> Your browser does not support the video tag.</p>
                  </video>
                  <div
                    className={styles.closed}
                    onClick={() => this.deleteImg("chunk1Image")}
                  >
                    <AiOutlineClose className={styles.closeIcon} />
                  </div>
                </div>
              </div>

              {stepInputs?.map((id, index) => {
                return (
                  <div key={index} className={styles.suggestion_recipe_step} style={{ marginTop: '2rem' }}>
                    <div className={styles.suggestion_form_group}>
                      <label className={styles.suggestion_form_label}>
                        Step {id} Title
                      </label>
                      <TextField
                        id={"chunk" + id + "Title"}
                        value={this.state["instructionChunk" + id]?.title}
                        onChange={(ev) => this.handleInstructionTitle(ev, id)}
                        variant="outlined"
                      />
                    </div>

                    <div className={styles.suggestion_form_group}>
                      <label className={styles.suggestion_form_label}>
                        Instruction
                      </label>
                      <TextField
                        fullWidth
                        id={"instructionChunk" + id}
                        onKeyDown={(chip) =>
                          this.handleAddInstructionStep(chip, id)
                        }
                        variant="outlined"
                        required
                      />
                      {/* <ChipInput label="Instructions" className="mb-2" fullWidth 

                          value={this.state.instructionChunk2.instructionSteps} 
                          onAdd={(chip) => this.handleAddInstructionStep(chip, id)} 
                          onDelete={(chip, index) => this.handleDeleteInstructionsStep(chip, id)} variant="outlined" /> */}
                    </div>
                    <Stack direction="row" spacing={1} className={styles.stack}>
                      {this.state["instructionChunk" + id]?.instructionSteps?.map(
                        (chip, index) => (
                          <Chip
                            key={index}
                            label={chip}
                            className={styles.chip}
                            onClick={() =>
                              this.handleDeleteInstructionsStep(chip, id)
                            }
                            onDelete={() =>
                              this.handleDeleteInstructionsStep(chip, id)
                            }
                          />
                        )
                      )}
                    </Stack>
                    <h3>Upload Media</h3>
                    {/* <div className="suggestion_form_group}>
                        <input accept="image/*,video/mp4,video/x-m4v,video/*" id="instructionChunkContent2" name="instructionChunkContent2" type="file" className="mb-2" onChange={(ev) => this.onhandleInstructionImg(ev, 2)} />
                        </div> */}
                    <div className={styles.suggestion_form_image}>
                      <div
                        onClick={() => this.uploadMediaStep(id)}
                        className={styles.suggestion_form_image_col_1}
                      >
                        <div className={styles.suggestion_form_image_icon_con}>
                          <AddIcon
                            className={styles.suggestion_form_image_icon}
                          />
                        </div>
                      </div>
                      <div className={styles.suggestion_form_image_col_2}>
                        <p>
                          Upload picture/video with : Jpeg,png,mp4,mpeg format
                          and not more than 2mb
                        </p>
                      </div>
                    </div>

                    <p>
                      <img
                        id={"chunk" + id + "Image"}
                        height="100%"
                        width="100%"
                        className={styles.suggestion_image}
                        alt={"recipe_step" + id + "_image_or_video"}
                        style={{
                          display: "none",
                          objectFit: "cover",
                          objectPosition: "center",
                        }}
                      />
                      <video
                        className={styles.suggestion_image}
                        id={"chunk" + id + "Video"}
                        width="100%"
                        height='100%'
                        style={{ display: "none" }}
                        alt={"recipe_step" + id + "_image_or_video"}
                        controls

                      >
                        Your browser does not support the video tag.
                      </video>

                      <div
                        className={styles.closed}
                        onClick={() => this.deleteImg("chunk" + id + "Image")}
                      >
                        <AiOutlineClose className={styles.closeIcon} />
                      </div>
                    </p>
                  </div>
                );
              })}
            </div>
            <div className={styles.input_button}>
              {stepInputs?.length > 0 && (
                <Button
                  variant="contained"
                  disableRipple
                  onClick={() =>
                    this.removeStep(stepInputs[stepInputs.length - 1])
                  }
                  className={styles.ingredient_button}
                  style={{ width: "209px" }}
                >
                  {" "}
                  REMOVE STEP
                </Button>
              )}
              {stepInputs?.length < 5 && (
                <Button
                  variant="contained"
                  disableRipple
                  onClick={this.addMoreStep}
                  className={styles.ingredient_button}
                  style={{ width: "209px" }}
                >
                  {" "}
                  ADD MORE
                </Button>
              )}
            </div>
          </div>

          <h3>Add Meal Categories</h3>
          <div className={styles.suggestion_form}>
            <div className={styles.suggestion_form_group}>
              <label
                htmlFor="tags-outlined"
                className={styles.suggestion_form_label}
              >
                Suggest category for this meal
              </label>
              <div className={styles.input_button}>
                <Autocomplete
                  multiple
                  id="tags-outlined"
                  freeSolo
                  clearOnBlur
                  onBlur={this.categoryBlur}
                  // filterSelectedOptions
                  options={this.props.categories?.map((option) => option)}
                  // onChange={(ev,val)=>this.handleCategoryDropdownChange(ev,val)}
                  onChange={(e, newValue) =>
                    this.handleCategoryDropdownChange(newValue)
                  }
                  // getOptionLabel={option => option}
                  // renderTags={() => {}}
                  value={this.state.suggestedCategories}
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
                  label={this.capitalizeWords(data)}
                  className={styles.chip}
                  onClick={() => this.handleDeleteCategoryChip(data)}
                  onDelete={() => this.handleDeleteCategoryChip(data)}
                />
              ))}
            </Stack>
          </div>

          <h3>
            Tips <em>(optional)</em>
          </h3>
          <div className={styles.suggestion_form}>
            <div className={styles.suggestion_form_group}>
              <label htmlFor="tips" className={styles.suggestion_form_label}>
                Include any modifications to this meal you will like to add
              </label>
              <div className={styles.input_button}>
                {/* <ChipInput label="tips" className="mb-2" fullWidth value={this.state.tips} onAdd={(chip) => this.updateTip(chip)} onDelete={(chip, index) => this.deleteTip(chip, index)} variant="outlined" /> */}
                <TextField
                  id="tips"
                  value={this.state.tip}
                  fullWidth
                  onChange={this.handleTip}
                  onKeyUp={this.handleTip}
                  variant="outlined"
                  required
                />

                <Button
                  variant="contained"
                  disableRipple
                  onClick={this.updateTip}
                  className={styles.ingredient_button}
                  style={{ width: "max-content" }}
                >
                  {" "}
                  Add Tip
                </Button>
              </div>
            </div>
            <Stack direction="row" spacing={1} className={styles.stack}>
              {this.state.tips?.map((data, index) => (
                <Chip
                  key={index}
                  label={data}
                  className={styles.chip}
                  onClick={() => this.deleteTip(data)}
                  onDelete={() => this.deleteTip(data)}
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
            onClick={() => this.sendSuggestedMealToDB()}
          >
            {" "}
            Add Meal
          </Button>
          {/* </ThemeProvider> */}
          {/* </Col>
              </Row> */}
          <u>View privacy policy</u>
          <div id="ProductAdditionalDataDisplayed">
            <Popup2
              popupType="Meal Suggestion Preview"
              openModal={this.state.openModal}
              closeModal={this.closeModal}
              // name={this.state.mealName}
              name={this.state.itemMealName}
              // description={this.state.intro}
              description={this.state.intro}
              imageData={this.state.mealImagesData[0]}
              image={this.state.mealImage[0]}
              imagesData={this.state.mealImagesData}
              allImagesData={this.state.mealImagesData}
              categories={this.state.suggestedCategories}
              prepTime={this.state.prepTime}
              cookTime={this.state.cookTime}
              serves={this.state.servings}
              chef={this.state.chef || this.state.username}
              ingredientsList={this.state.ingredientStrings}
              utensilsList={this.state.suggestedUtensils}
              instructionChunk1={this.state.instructionChunk1?.title}
              instructionChunk2={this.state.instructionChunk2?.title}
              instructionChunk3={this.state.instructionChunk3?.title}
              instructionChunk4={this.state.instructionChunk4?.title}
              instructionChunk5={this.state.instructionChunk5?.title}
              instructionChunk6={this.state.instructionChunk6?.title}
              instructionChunk1Step={
                this.state.instructionChunk1?.instructionSteps
              }
              instructionChunk2Step={
                this.state.instructionChunk2?.instructionSteps
              }
              instructionChunk3Step={
                this.state.instructionChunk3?.instructionSteps
              }
              instructionChunk4Step={
                this.state.instructionChunk4?.instructionSteps
              }
              instructionChunk5Step={
                this.state.instructionChunk5?.instructionSteps
              }
              instructionChunk6Step={
                this.state.instructionChunk6?.instructionSteps
              }
              instructionChunk1DataName={this.state.instructionChunk1?.dataName || this.state.instructionChunk1DataName}
              instructionChunk2DataName={this.state.instructionChunk2?.dataName || this.state.instructionChunk2DataName}
              instructionChunk3DataName={this.state.instructionChunk3?.dataName || this.state.instructionChunk3DataName}
              instructionChunk4DataName={this.state.instructionChunk4?.dataName || this.state.instructionChunk4DataName}
              instructionChunk5DataName={this.state.instructionChunk5?.dataName || this.state.instructionChunk5DataName}
              instructionChunk6DataName={this.state.instructionChunk6?.dataName || this.state.instructionChunk6DataName}
              chunk1Content={this.state.chunk1ContentURL}
              chunk2Content={this.state.chunk2ContentURL}
              chunk3Content={this.state.chunk3ContentURL}
              chunk4Content={this.state.chunk4ContentURL}
              chunk5Content={this.state.chunk5ContentURL}
              chunk6Content={this.state.chunk6ContentURL}
              instructionWordlength={this.state.instructionWordlength}
              tips={this.state.tips}
              mealImageData={this.state.mealImagesData}
            />
          </div>
          {/* <Popup1></Popup1> */}
        </form>
      </div>
    );
  }
}

export default withRouter(SuggestMealForm);
