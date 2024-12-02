import React, { Component } from "react";
// import Banner from "./Banners/banner"
import Banner2 from "../src/components/Banners/banner2";
// import HomePageButtons from "./HomePage/HomePageButtons"
import styles from "../src/components/HomePage/home.module.css";
import EastIcon from "@mui/icons-material/East";

import foodImage from "../public/assets/homepage/food.png";
import utensilImage from "../public/assets/homepage/utensil.png";
import shopImage from "../public/assets/homepage/shop.png";
import supplierImage from "../public/assets/homepage/supplier.png";
import shoppingImage from "../public/assets/homepage/shopping.png";
import chefImage from "../public/assets/homepage/chef.png";

import KeyboardArrowLeftIcon from "@mui/icons-material/KeyboardArrowLeft";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import Image from "next/image";
import Head from "next/head";

class LandingPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      product_fetched: false,
      slideIndex: 1,
    };
  }

  componentDidMount() {
    let slideIndex = this.state.slideIndex;
    this.slider(slideIndex);
    setInterval(() => {
      this.plusSlides(slideIndex);
    }, 6000);
  }

  plusSlides = (n) => {
    let slideIndex = this.state.slideIndex;
    slideIndex += n;
    this.setState(
      {
        slideIndex,
      },
      () => {
        this.slider(slideIndex);
      }
    );
  };

  currentSlide = (n) => {
    let slideIndex = this.state.slideIndex;
    slideIndex = n;
    this.setState(
      {
        slideIndex,
      },
      () => {
        this.slider(n);
      }
    );
  };

  slider = (n) => {
    let { slideIndex } = this.state;

    let i;
    let slides = document.getElementsByClassName(styles.mySlides);

    let dots = document.getElementsByClassName(styles.dot);
    if (n > slides.length) {
      slideIndex = 1;
      this.setState({
        slideIndex,
      });
    }
    if (n < 1) {
      slideIndex = slides.length;
      this.setState({
        slideIndex,
      });
    }
    for (i = 0; i < slides.length; i++) {
      slides[i].style.display = "none";
    }
    for (i = 0; i < dots.length; i++) {
      dots[i].className = dots[i].className.replace(" active", "");
    }
    slides[slideIndex - 1].style.display = "grid";
    dots[slideIndex - 1].className += " active";
  };

  render() {
    return (
      <div className={styles.home_container}>
        {/* <Banner/> */}
        {/* Slideshow container */}
        <Head>
          <title>Chop Chow Cooking App</title>
          <meta
            key="title"
            name="viewport"
            content="initial-scale=1.0, width=device-width"
          />
          <meta
            name="description"
            content="Chop Chow app is
                     the ultimate kitchen utensil that adds 
                     convenience to your home cooking experience.
                      Discover new recipes or find new twists on your go-to meals.
                       Share your recipes on Chop Chow. We partner with food bloggers,
                        restaurants and marketplaces to provide a new experience
                         with cooking from home."
          />
        </Head>
        <div className={styles.home_section_1}>
          <div className={styles.slideshow_container}>
            {/* Full-width images with number and caption text */}
            <div className={styles.mySlides}>
              <div className={styles.slide_wrapper}></div>
              <div className={styles.slide_text}>
                <h2>Get the Best Ingredients for your Meals</h2>
                <a href="/" className={styles.slide_button}>
                  Shop Now
                </a>
              </div>
              {/* <Image src={banner1} className={styles.slide_image} /> */}
              <div
                className={styles.slide_image}
                style={{
                  backgroundImage: `url(/assets/homepage/banner-1.png)`,
                }}
              ></div>
            </div>

            <div className={styles.mySlides}>
              <div className={styles.slide_wrapper}></div>
              <div className={styles.slide_text}>
                <h2>Well Established local and international food suppliers</h2>
                <a href="/" className={styles.slide_button}>
                  Learn More
                </a>
              </div>
              <div
                className={styles.slide_image}
                style={{
                  backgroundImage: `url(/assets/homepage/grocery_bag.jpg)`,
                }}
              ></div>
              {/* <Image src={background} className={styles.slide_image} /> */}
            </div>

            <div className={styles.mySlides}>
              <div className={styles.slide_wrapper}></div>
              <div className={styles.slide_text}>
                <h2>Order from Multiple Stores in a Single Order</h2>
                <a href="/signup" className={styles.slide_button}>
                  Sign Up Now
                </a>
              </div>
              <div
                className={styles.slide_image}
                style={{
                  backgroundImage: `url(/assets/homepage/banner-2.png)`,
                }}
              ></div>
              {/* <Image src={banner2} className={styles.slide_image} /> */}
            </div>

            {/* Next and previous buttons */}
            <div className={styles.prev} onClick={() => this.plusSlides(-1)}>
              <KeyboardArrowLeftIcon className={styles.next_icon} />
            </div>
            <div className={styles.next} onClick={() => this.plusSlides(1)}>
              <KeyboardArrowRightIcon className={styles.next_icon} />
            </div>
            {/* The dots/circles */}
          </div>
          <div className={styles.dots}>
            <span
              className={styles.dot}
              onClick={() => this.currentSlide(1)}
            ></span>
            <span
              className={styles.dot}
              onClick={() => this.currentSlide(2)}
            ></span>
            <span
              className={styles.dot}
              onClick={() => this.currentSlide(3)}
            ></span>
          </div>
        </div>
        {/* <HomePageButtons/> */}
        <div className={styles.home_section_2}>
          <div className={styles.features}>
            <div className={styles.lines}>
              <div className={styles.line}></div>
              <div className={styles.line}></div>
            </div>
            <div className={styles.feature}>
              <div className={styles.feature_num}>
                <p>1</p>
              </div>

              <Image
                src={shoppingImage}
                alt="feature"
                className={styles.feature_img}
              />
              <h2 className={styles.feature_name}>All-in-One Shopping</h2>
              <p className={styles.feature_desc}>
                We're your one stop shop for multiple stores near you. With [app
                name], you can easily find all of the best shops in your area,
                including those that aren't well-known.
              </p>
            </div>
            <div className={styles.feature}>
              <div className={styles.feature_num}>
                <p>2</p>
              </div>
              <Image
                src={supplierImage}
                alt="feature"
                className={styles.feature_img}
              />
              <h2 className={styles.feature_name}>Fast Delivery</h2>
              <p className={styles.feature_desc}>
                We offer a wide range of delivery options that make it easy to
                get your favorite products delivered to you. If you want to
                schedule an order for a specific time, or if you just want to
                get it immediately, we've got you covered.
              </p>
            </div>
            <div className={styles.feature}>
              <div className={styles.feature_num}>
                <p>3</p>
              </div>
              <Image
                src={chefImage}
                alt="feature"
                className={styles.feature_img}
              />
              <h2 className={styles.feature_name}>Earn as a Chef</h2>
              <p className={styles.feature_desc}>
                Start a delivery business with ChopChow. You can set up your own
                storefront and earn money as a chef or restaurant. You can also
                hire drivers to deliver your food, or we can handle the
                logistics for you.
              </p>
            </div>
          </div>
        </div>
        <div className={styles.home_section_3}>
          <div className={styles.home_section_3_row}>
            <div className={styles.home_section_3_row_1}>
              <Image
                src={shopImage}
                alt="home"
                className={styles.home_section_3_row_1}
              />
            </div>
            <div className={styles.home_section_3_row_2}>
              <h3 className={styles.home_section_3_row_2_h3}>
                SEARCH LOCAL FOOD SUPPLIERS
              </h3>
              <p className={styles.home_section_3_row_2_p}>
                One of the most important features of ChopChow is that we make
                it easy for you to order food products from well established
                Local and international food suppliers to add convenience to
                cooking from home.
              </p>
              <div className={styles.home_section_3_row_2_link}>
                <p>Use Your Grocery List</p>
                <EastIcon className={styles.home_section_3_row_2_link_icon} />
              </div>
            </div>
          </div>
          <div className={styles.home_section_3_row}>
            <div
              className={`${styles.home_section_3_row_1} ${styles.row_reverse}`}
            >
              <Image
                src={utensilImage}
                alt="about us"
                className={styles.home_section_3_row_1}
              />
            </div>
            <div className={styles.home_section_3_row_2}>
              <h3 className={styles.home_section_3_row_2_h3}>
                GET RECOMMENDATIONS OF RECIPIES
              </h3>
              <p className={styles.home_section_3_row_2_p}>
                We know that you're an expert in the kitchen, but sometimes you
                just need a little help to make something new or different. Our
                app is designed to help you get creative with recipes, and learn
                from some of the best chefs in the world. You can search for
                your favorite meals or try something new, and we'll recommend
                different twists on how to make them.
              </p>
              <div className={styles.home_section_3_row_2_link}>
                <p>
                  <a href="/suggestmeal">Suggest A Meal </a>{" "}
                </p>
                <EastIcon className={styles.home_section_3_row_2_link_icon} />
              </div>
            </div>
          </div>

          <div className={styles.home_section_3_row}>
            <div className={styles.home_section_3_row_1}>
              <Image
                src={foodImage}
                alt="about us"
                className={styles.home_section_3_row_1}
              />
            </div>
            <div className={styles.home_section_3_row_2}>
              <h3 className={styles.home_section_3_row_2_h3}>
                HOME COOK INTERNATIONAL MEALS
              </h3>
              <p className={styles.home_section_3_row_2_p}>
                Learn to cook meals from around the world! We believe that
                cooking is a skill that everyone should have. So, we created our
                app to teach you how to cook international meals from scratch,
                just like the professionals do. We take you through step-by-step
                instructions on how to make your favorite dishes, with tips and
                tricks from professional chefs themselves! It's never been
                easier or more fun to learn how to cook!
              </p>
              <div className={styles.home_section_3_row_2_link}>
                <p>Shop Now</p>
                <EastIcon className={styles.home_section_3_row_2_link_icon} />
              </div>
            </div>
          </div>
        </div>
        <Banner2 />
      </div>
    );
  }
}

export default LandingPage;
