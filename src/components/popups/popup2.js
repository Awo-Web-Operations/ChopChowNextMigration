import React, { Component, createRef } from "react";
import CancelIcon from "@mui/icons-material/Cancel";
import ArrowCircleRightIcon from "@mui/icons-material/ArrowCircleRight";
import ArrowCircleLeftIcon from "@mui/icons-material/ArrowCircleLeft";
import Image from "next/image";
import printImage from "../../../public/assets/logos/print.png";
import twitterImage from "../../../public/assets/logos/twitter.png";
import facebookImage from "../../../public/assets/logos/facebook.png";
import instagramImage from "../../../public/assets/logos/instagram.png";
import styles from "./popup2.module.css";
import ReactToPrint from "react-to-print";
import ComponentToPrint from "../mealsPage/ComponentToPrint";
import { BsFillShareFill } from "react-icons/bs";
import { ShareSocial } from "react-share-social";
import {
  FacebookShareButton,
  FacebookIcon,
  TwitterShareButton,
} from "react-share";

class Popup2 extends Component {
  constructor(props) {
    super(props);
    this.state = {
      product_fetched: false,
      curIn: 1,
      length: 0,
      resave: 0,
    };
    this.modalRef = createRef();
  }

  incIn = () => {
    this.setState({
      ...this.state,
      curIn: this.state.curIn + 1,
    });
  };

  decIn = () => {
    if (this.state.curIn > 1) {
      this.setState({
        ...this.state,
        curIn: this.state.curIn - 1,
      });
    }
  };

  edit = () => {
    console.log(this.props, 'this.p')
    const {
      name,
      imagesData,
      description,
      categories,
      ingredientsList,
      ingredientGroupList,
      ingredientsInItem,
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
      cookTime,
      prepTime,
      serves,
      instructionChunk1,
      instructionChunk2,
      instructionChunk3,
      instructionChunk4,
      instructionChunk5,
      instructionChunk6,
      chunk1Content,
      chunk2Content,
      chunk3Content,
      chunk4Content,
      chunk5Content,
      chunk6Content,
      ingredeints_in_item,
    } = this.props;

    // Determine step inputs based on instruction chunks
    var stepInputs = [];
    if (instructionChunk1) stepInputs = [];
    if (instructionChunk2) stepInputs = [2];
    if (instructionChunk3) stepInputs = [2, 3];
    if (instructionChunk4) stepInputs = [2, 3, 4];
    if (instructionChunk5) stepInputs = [2, 3, 4, 5];
    if (instructionChunk6) stepInputs = [2, 3, 4, 5, 6];

    // Format ingredient group list
    let group = ingredientGroupList.map(ingredient => ({
      productName: ingredient.product_name?.join(" "),
      productImgPath: null,
      quantity: ingredient.quantity,
      measurement: ingredient.measurement,
      properIngredientStringSyntax: ingredient.properIngredientStringSyntax,
    }));

    // Define meal object, including conditionally setting image_or_video_content_1
    let meal = {
      mealId: this.props.id,
      mealName: name,
      intro: description,
      mealImagesData: imagesData,
      ingredientGroupList: group,
      ingredientStrings: ingredientsList,
      ingredeintsInItem: ingredientsInItem,
      suggestedUtensils: this.props.utensilsList,
      cookTime,
      prepTime,
      chunk1Content,
      chunk2Content,
      chunk3Content,
      chunk4Content,
      chunk5Content,
      chunk6Content,
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
      instructionChunk1,
      instructionChunk2,
      instructionChunk3,
      instructionChunk4,
      instructionChunk5,
      instructionChunk6,
      instructionWordlength: this.props.instructionWordlength,
      suggestedCategories: categories,
      servings: serves,
      tips: this.props.tips,
      stepInputs,
    };

    // Add image_or_video_content_1 if imagesData exists
    // if (imagesData && imagesData.length > 0) {
    //   meal.image_or_video_content_1 = imagesData[0]; // Set to the first image as an example
    // }
    for (let i = 0; i <= imagesData.length; i++) {
      meal[`image_or_video_content_${i + 1}`] = imagesData[i]
    }

    // Save data to local storage and navigate
    localStorage.setItem("suggestionType", "Meal");
    localStorage.setItem("mealId", this.props.id);
    localStorage.setItem("suggestMealForm_", JSON.stringify(meal));
    window.location.assign(`/suggestmeal?id=${this.props.id}&item_type=Meal`);
  };


  handleShareClick = () => {
    const shareUrl =
      "https://www.instagram.com/share/create/?url=" +
      encodeURIComponent("http://localhost:3000/suggestmeal");
    window.open(shareUrl, "_blank");
  };

  handleClickOutside = (event) => {
    if (
      this.modalRef.current &&
      !this.modalRef.current.contains(event.target)
    ) {
      this.props.closeModal();
    }
  };
  componentDidMount() {
    document.addEventListener("mousedown", this.handleClickOutside);
    console.log(this.props, "props----");
    let length = 0;

    setTimeout(() => {
      for (let i = 1; i <= 6; i++) {
        console.log(
          this.props["instructionChunk" + i] &&
          this.props["instructionChunk" + i + "Step"]?.length,
          "geee"
        );
        if (
          this.props["instructionChunk" + i] &&
          this.props["instructionChunk" + i + "Step"]?.length
        ) {
          length = length + 1;
        }
      }
      this.setState({
        ...this.state,
        length,
      });
    }, 1000);
    console.log(length, "length");
  }
  componentWillUnmount() {
    document.removeEventListener("mousedown", this.handleClickOutside);
  }
  shouldShowRightArrow = () => {
    const { curIn, length, instructionChunk } = this.props;
    return curIn < length && (instructionChunk[curIn] || instructionChunk[curIn + 1]);
  };
  render() {
    const {
      popupType,
      imageData,
      imagesData,
      name,
      description,
      categories,
      ingredientsList,
      ingredientsInItem,
      instructionChunk1,
      isDashboard,
      chunk1Content,
    } = this.props;
    const { curIn, length } = this.state;

    console.log("propss", this.props);
    var allowedImageExtensions = /(\.jpg|\.jpeg|\.png|\.)$/i;
    var allowedVideoExtensions = /(\.mp4|\.m4v|\.)$/i;
    return (
      <>
        {this.props.openModal && (
          <div className={styles.popup2_container}>
            <div className={styles.popup2} ref={this.modalRef}>
              <div className={styles.popup2_top}>
                <h2>{popupType}</h2>
                <CancelIcon
                  onClick={this.props.closeModal}
                  className={styles.popup2_cancel_con}
                />
              </div>
              <div className={styles.popup2_row_2}>
                <div className={styles.popup2_col_1}>
                  <div className={styles.img_col}>
                    {imagesData?.length !== 0 && (
                      <Image
                        src={imagesData[0] || ""}
                        alt="pop up"
                        className={styles.popup2_main_img}
                        height={160}
                        width={100}
                      />
                    )}
                    {imagesData?.length > 0 && (
                      <div className={styles.popup2_images}>
                        {imagesData.slice(1).map((data, index) => (
                          <Image
                            key={index}
                            alt="pop up"
                            src={data}
                            className={styles.popup2_image}
                            height={70}
                            width={100}
                            objectFit="cover"
                            objectPosition="center"
                          />
                        ))}
                      </div>
                    )}
                  </div>
                  <div className={styles.del}>
                    <h2 className={styles.popup2_name}>{name}</h2>
                    <ul className={styles.popup2_del}>
                      <li>
                        <p style={{ color: "#6D6D6D" }}>Cook time:</p>
                        <h5>
                          {this.props.cookTime} Minute
                          {parseInt(this.props.cookTime) > 1 ? "s" : ""}
                        </h5>
                      </li>
                      <li>
                        <p style={{ color: "#6D6D6D" }}>Prep time:</p>
                        <h5>
                          {this.props.prepTime} Minute
                          {parseInt(this.props.prepTime) > 1 ? "s" : ""}
                        </h5>
                      </li>
                      <li>
                        <p style={{ color: "#6D6D6D" }}>Serves:</p>
                        <h5>
                          {this.props.serves}{" "}
                          {parseInt(this.props.serves) > 1
                            ? "people"
                            : "person"}
                        </h5>
                      </li>
                      <li>
                        <p style={{ color: "#6D6D6D" }}>Chef:</p>
                        <h5>{this.props.chef}</h5>
                      </li>
                    </ul>
                    <p className={styles.popup2_description}>
                      Intro:
                      <br />
                      {description}
                    </p>
                  </div>
                </div>
                <div className={styles.popup2_col_2}>
                  <div className={styles.popup2_details}>
                    <div>
                      <h3 className={styles.popup2_category_name}>
                        Ingredients
                      </h3>
                      <table className={styles.table}>
                        <thead>
                          <tr>
                            <th className={styles.th}>Names</th>
                            <th className={styles.th}>Quantity</th>
                            <th className={styles.th}>Measurement</th>
                          </tr>
                        </thead>
                        {!isDashboard ? (
                          ingredientsList?.map((ingredient, index) => (
                            <tr
                              style={{
                                background:
                                  index % 2 === 0 ? "#F1F1F1" : "#FFFFFF",
                              }}
                              key={index}
                            >
                              <td className={styles.td}>
                                {ingredient.split("of").length > 1
                                  ? ingredient.split("of")[1]
                                  : ingredient.split(" ")[1]}
                              </td>
                              <td className={styles.td}>
                                {ingredient.split("of").length > 1
                                  ? ingredient.split(" ")[0]
                                  : ingredient.split(" ")[0]}
                              </td>
                              <td className={styles.td}>
                                {ingredient.split("of").length > 1
                                  ? ingredient.split(" ")[1]
                                  : ""}
                              </td>
                            </tr>
                          ))
                        ) : (
                          <>
                            {ingredientsInItem.map((elem, index) => (
                              <tr
                                style={{
                                  background:
                                    index % 2 === 0 ? "#F1F1F1" : "#FFFFFF",
                                }}
                                key={index}
                              >
                                <td className={styles.td}>
                                  {elem.item_name}
                                </td>
                                <td className={styles.td}>
                                  {elem.item_quantity}
                                </td>
                                <td className={styles.td}>{elem.item_measurement}</td>
                              </tr>
                            ))}
                          </>
                        )}
                      </table>
                    </div>
                    <div className={styles.popup2_categories}>
                      <h3 className={styles.popup2_category_name}>
                        Meal Category
                      </h3>
                      <p
                        className={styles.popup2_category}
                        style={{ textTransform: "capitalize" }}
                      >
                        {categories?.map((cat) => (
                          <span>{cat} &nbsp; &nbsp;</span>
                        ))}
                      </p>
                    </div>
                  </div>
                </div>
                <div className={styles.popup2_col_3}>
                  <h2>Recipe Steps</h2>
                  <div className={styles.popup2_steps}>
                    <>
                      {allowedImageExtensions.exec(
                        this.props[`instructionChunk${curIn}DataName`]
                      ) && (
                          <Image
                            src={this.props["chunk" + curIn + "Content"]}
                            alt={this.props["instructionChunk" + curIn]?.title}
                            className={styles.popup2_step_img}
                            height={150}
                            width={70}
                            objectFit="cover"
                            objectPosition="center"
                          />
                        )}

                      {allowedVideoExtensions.exec(
                        this.props[`instructionChunk${curIn}DataName`]
                      ) && (
                          <video
                            controls
                            className={styles.popup2_step_img}
                            height={150}
                            width={70}
                            src={this.props[`chunk${curIn}Content`]}
                            type="video/mp4"

                          >
                            {/* <source
                            src={this.props[`chunk${curIn}Content`]}
                            type="video/mp4"
                          />
                          Your browser does not support the video tag. */}
                          </video>
                        )}
                      <div className={styles.del}>
                        <h2 className={styles.popup2_step_name}>
                          {this.props["instructionChunk" + curIn]}
                        </h2>
                        <p className={styles.popup2_instructions}>
                          {this.props["instructionChunk" + curIn + "Step"]?.map(
                            (step, index) => (
                              <div key={index}>
                                {index + 1}. {step}
                                <br />
                              </div>
                            )
                          )}
                        </p>
                      </div>
                    </>

                    {this.props["instructionChunk" + (curIn + 1)] &&

                      <ArrowCircleRightIcon
                        onClick={this.incIn}
                        className={styles.popup2_inc_con}
                      />
                    }
                    {curIn > 1 && (
                      <ArrowCircleLeftIcon
                        onClick={this.decIn}
                        className={styles.popup2_dec_con}
                      />
                    )}
                  </div>
                </div>
              </div>
              <div className={styles.popup2_footer}>
                <p style={{ alignItems: "center" }} className={styles.shares}>
                  <BsFillShareFill style={{ marginRight: ".5rem" }} />
                  Share this product:
                </p>
                <div>
                  <FacebookShareButton
                    url={"https://localhost:3000/suggestmeal"}
                    quote={"Dummy text!"}
                    hashtag="#muo"
                  >
                    <span className={styles.iconSpan}>
                      <Image
                        src="/assets/icons/Vector.svg"
                        alt="facebook"
                        height={17}
                        width={17}
                        className={styles.icons}
                        objectFit="cover"
                        objectPosition="center"
                      />
                    </span>
                  </FacebookShareButton>
                </div>
                <div
                  onClick={() => this.handleShareClick()}
                  style={{ cursor: "pointer" }}
                >
                  <span className={styles.iconSpan1}>
                    <Image
                      src="/assets/icons/Vector (2).svg"
                      alt="instagram"
                      height={17}
                      width={17}
                      className={styles.icons}
                      objectFit="cover"
                      objectPosition="center"
                    />
                  </span>
                </div>

                <div>
                  <TwitterShareButton
                    url={
                      "https://twitter.com/VillageParrot/status/1661378988491538434?s=20"
                    }
                    quote={"Dummy text!"}
                    hashtag="#muo"
                  >
                    <span className={styles.iconSpan2}>
                      <Image
                        src="/assets/icons/Vector (1).svg"
                        alt="twitter"
                        height={17}
                        width={17}
                        className={styles.icons}
                        objectFit="cover"
                        objectPosition="center"
                      />
                    </span>
                  </TwitterShareButton>
                </div>

                <span className={styles.iconSpan3}>
                  <Image
                    src="/assets/icons/logos_whatsapp-icon.svg"
                    alt="whatsapp"
                    height={17}
                    width={17}
                    className={styles.icons}
                    objectFit="cover"
                    objectPosition="center"
                  />
                </span>

                <ReactToPrint
                  trigger={() => {
                    // NOTE: could just as easily return <SomeComponent />. Do NOT pass an `onClick` prop
                    // to the root node of the returned component as it will be overwritten.
                    return (
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          marginLeft: "4rem",
                        }}
                      >
                        <p className={styles.para}>Print Preview</p>
                        <Image
                          alt="print"
                          src="/assets/icons/Vector (3).svg"
                          height={20}
                          width={20}
                          className={styles.printIcon}
                        />
                      </div>
                    );
                  }}
                  content={() => this.componentRef}
                />
                {this.props.suggested && (
                  <button onClick={this.edit} className={styles.edit_button2}>
                    Edit
                  </button>
                )}
                <div style={{ display: "none" }}>
                  <ComponentToPrint
                    ref={(el) => (this.componentRef = el)}
                    mealName={this.props.name}
                    mealImage={this.props.image || this.props.imagesData}
                    categories={this.props.categories}
                    allImagesData={this.props.allImagesData}
                    prepTime={this.props.prepTime}
                    cookTime={this.props.cookTime}
                    serves={this.props.serves}
                    componentRef={this.componentRef}
                    openModal={this.props.openModal}
                    closeModal={this.props.closeModal}
                    ingredientsList={this.props.ingredientsList}
                    utensilsList={this.props.utensilsList}
                    instructionChunk1={this.props.instructionChunk1}
                    instructionChunk2={this.props.instructionChunk2}
                    instructionChunk3={this.props.instructionChunk3}
                    instructionChunk4={this.props.instructionChunk4}
                    instructionChunk5={this.props.instructionChunk5}
                    instructionChunk6={this.props.instructionChunk6}
                    instructionChunk1Step={this.props.instructionChunk1Step}
                    instructionChunk2Step={this.props.instructionChunk2Step}
                    instructionChunk3Step={this.props.instructionChunk3Step}
                    instructionChunk4Step={this.props.instructionChunk4Step}
                    chunk1Content={this.props.chunk1Content}
                    chunk2Content={this.props.chunk2Content}
                    chunk3Content={this.props.chunk3Content}
                    chunk4Content={this.props.chunk4Content}
                    chunk5Content={this.props.chunk5Content}
                    chunk6Content={this.props.chunk6Content}
                    instructionWordlength={this.props.instructionWordlength}
                    tips={this.props.tips}
                    mealImageData={this.props.imageData}
                  />
                </div>
              </div>
            </div>
          </div>
        )}
      </>
    );
  }
}

export default Popup2;
