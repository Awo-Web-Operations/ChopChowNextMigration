import React, { Component, createRef } from "react";
import CancelIcon from "@mui/icons-material/Cancel";
import styles from "./popup.module.css";
import Image from "next/image";

class Popup1 extends Component {
  constructor(props) {
    super(props);
    this.state = {
      product_fetched: false,
    };
    this.modalRef = createRef();
  }
  componentDidMount() {
    document.addEventListener("mousedown", this.handleClickOutside);
  }

  componentWillUnmount() {
    document.removeEventListener("mousedown", this.handleClickOutside);
  }

  handleClickOutside = (event) => {
    if (
      this.modalRef.current &&
      !this.modalRef.current.contains(event.target)
    ) {
      this.props.closeModal();
    }
  };
  edit = () => {
    const {
      name,
      itemType,
      intro,
      description,
      categories,
      ingredientList,
      ingredientStrings,
      sizesList,
      ingredientGroupList,
      ingredientsInItem,
      item_description,
      image,
      imageData,
    } = this.props;

    let group = ingredientGroupList.map((ingredient) => {
      return {
        productName: ingredient.item_name,
        // productImgFile: this.state.currentProductImgSrc,
        productImgPath: null,

        // these are added to ingredient packets on submit, and not relevant in product object details
        quantity: ingredient.quantity,
        measurement: ingredient.measurement,
        properIngredientStringSyntax: ingredient.properIngredientStringSyntax,
      };
    });
    console.log(this.props, "DISPLAY");
    console.log(group);
    let product = {
      productName: description,
      utensilName: description,
      intro,
      imageData,
      productImagesData: imageData,
      productDescription: intro,
      ingredientsInItem,
      itemType,
      item_description: item_description,
      descriptionStrings: item_description,
      // descriptionGroupList: item_description,
      // ingredientNames,
      // do we need product group list AND strings ?
      ingredientGroupList: group,
      // descriptionGroupList,
      sizeGroupList: sizesList,
      // store product names of inputted strings to compare with db products
      ingredientStrings: ingredientsInItem,
      // nutritionalStrings,
      sizeStrings: sizesList,
      // do we want to use current ingredient formats ? Yes.
      // currentIngredient,
      // currentIngredientMeasurement,
      // sizeQuantity,
      // sizeMeasurement,
      // currentIngredientQuantity,
      // currentProductImgSrc,
      // currentProductDisplayIndex,

      // currentStore,
      // quantity,

      // we need to update how we create image paths
      // productImg_path,
      // new_product_ingredients,
      // currProductIndexInDBsProductsList,
      // currStoreIndexIfExistsInProductsList,
      suggestedCategories: categories,
    };
    localStorage.setItem("suggestionType", "Product");
    localStorage.setItem("productId", this.props.id);
    localStorage.setItem("suggestProductForm", JSON.stringify(product));
    console.log(this.props, "orop");
    if (this.props.itemType === "Product") {
      window.location.assign(
        `/suggestproduct?id=${this.props.id}&item_type=Product`
      );
    }
    if (this.props.itemType === "Utensil") {
      localStorage.setItem("suggestionType", "Kitchen Utensil");
      localStorage.setItem("utensilId", this.props.id);
      localStorage.setItem("suggestUtensilForm", JSON.stringify(product));
      window.location.assign(
        `/suggestUtensil?id=${this.props.id}&item_type=Kitchen Utensil`
      );
    }
  };

  render() {
    const {
      popup,
      imageData,
      imagesData,
      name,
      description,
      categories,
      descriptionsList,
      ingredientList,
      sizesList,
      nutritionalStrings,
      ingredientGroupList,
      ingredientsInItem,
      item_description,
    } = this.props;
    console.log(imageData, "imageData");
    console.log(this.props.ingredientList, "DISPLAY");
    console.log("item_description", item_description);

    return (
      <>
        {this.props.openModal && (
          <div className={styles.popup_container}>
            <div className={styles.popup} ref={this.modalRef}>
              <div className={styles.popup_col_1}>
                <div>
                  <Image
                    src={Array.isArray(imageData) ? imageData[0] : imageData}
                    className={styles.popup_main_img}
                    alt="pop up"
                    height={250}
                    width={410}
                    objectFit="cover"
                    objectPosition="center"
                    filter="drop-shadow(0px 4px 10px rgba(0, 0, 0, 0.1))"
                    border-radius="8px"
                  />
                </div>
                <div className={styles.popup_images}>
                  {(Array.isArray(imageData)
                    ? [...imageData.slice(1)]
                    : imagesData
                  ).map((data, index) => {
                    console.log("data", data);
                    return (
                      <Image
                        key={index}
                        alt="pop up"
                        src={data}
                        height={100}
                        width={100}
                        className={styles.popup_image}
                        objectFit="cover"
                        objectPosition="center"
                        filter="drop-shadow(0px 4px 10px rgba(0, 0, 0, 0.9))"
                      />
                    );
                  })}
                </div>
                <div className={styles.popup_categories2}>
                  <h3 className={styles.popup_category_name}>
                    Product Category
                  </h3>
                  <p className={styles.popup_category}>
                    {categories.map((cat) => cat + ", ")}
                  </p>
                </div>
              </div>
              <div className={styles.popup_col_2}>
                <div className={styles.popup_top}>
                  <div></div>
                  <CancelIcon
                    onClick={this.props.closeModal}
                    className={styles.popup2_cancel_con}
                  />
                </div>
                <div className={styles.popup_details}>
                  <h2 className={styles.popup_name}>{name}</h2>
                  <p className={styles.popup_description}>{description}</p>
                  {popup === "product" && (
                    <React.Fragment>
                      <div className={styles.popup_categories}>
                        <h3 className={styles.popup_category_name}>
                          Product Ingredients
                        </h3>
                        {/* <p className={styles.popup_category}>
                          {ingredientList?.map((ingredient) => {
                            return (
                              (ingredient.split("of").length > 1
                                ? ingredient.split("of")[1] +
                                  "(" +
                                  ingredient.split(" ")[0] +
                                  ingredient.split(" ")[1] +
                                  ")"
                                : ingredient.split(" ")[1] +
                                  ingredient.split(" ")[0]) + ", "
                            );
                          })}
                        </p> */}
                        <p className={styles.popup_category}>
                          {ingredientList?.map((ingredient, idx) => (
                            <div>{ingredient}, </div>
                          ))}
                        </p>
                      </div>
                      {/* <div className={styles.popup_categories}>
                        <h3 className={styles.popup_category_name}>
                          Product Description
                        </h3>
                        <p className={styles.popup_category}>
                          {item_description.map((descrip) => (
                            <div key={descrip._id}>
                              <div>{descrip?.formatted_string}</div>
                              <br />
                            </div>
                          ))}
                        </p>
                      </div> */}

                      {/* <div>
                        <p>{nutritionalStrings}</p>
                      </div> */}
                    </React.Fragment>
                  )}
                  {popup === "kitchen" && (
                    <div className={styles.popup_sizes}>
                      <h3>Descriptions</h3>
                      <div className={styles.popup_size}>
                        {descriptionsList.map((descriptionSyntax, index) => (
                          <React.Fragment key={index}>
                            <p>{descriptionSyntax.split("-")[1]}</p>
                            <div></div>
                            <p>{descriptionSyntax.split("-")[0]}</p>
                          </React.Fragment>
                        ))}
                      </div>
                    </div>
                  )}
                  <div className={styles.popup_categories}>
                    <h3 className={styles.popup_category_name}>
                      Product Category
                    </h3>
                    <p className={styles.popup_category}>
                      {categories.length !== 1
                        ? categories.map((cat) => cat + ", ")
                        : categories.map((cat) => cat)}
                    </p>
                  </div>
                  <div className={styles.popup_sizes}>
                    <h3>Size</h3>
                    <div className={styles.popup_size}>
                      <React.Fragment>
                        <p>{sizesList?.toString()}</p>
                      </React.Fragment>
                    </div>
                  </div>
                </div>

                {this.props.suggested && (
                  <button onClick={this.edit} className={styles.edit_button2}>
                    Edit
                  </button>
                )}
              </div>
            </div>
          </div>
        )}
      </>
    );
  }
}

export default Popup1;
