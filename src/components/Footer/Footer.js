import Image from "next/image";
import Link from "next/link";
import React from "react";
import img_logo from "../../../public/assets/logos/CC_Logo_no_bg.png"
import styles from './Footer.module.css'
import facebookImg from "../../../public/assets/icons/Facebook+Icon+Black 1.png";
import instagramImg from "../../../public/assets/icons/instagram-icon-free-7 1.png";


const Footer = ({
  footer = 'shape 1'
}) => {

  return (
    <div className={styles.footer_container}>
      {
        footer === 'shape 1' && <div className={styles.footer_row_1}>
          <div className={styles.footer_row_1_container}>

            <div className={styles.footer_row_1_join_us_form}>

              <React.Fragment>
                <input placeholder="Enter email to subscribe to our newsletter" aria-label="News Letter" type="email" name="email" className={styles.footer_row_1_join_us_input} />
                <button className={styles.footer_row_1_button}>Subscribe</button>
              </React.Fragment>

            </div>
          </div>
        </div>
      }
      {
        footer === 'shape 2' && <section className="section_sub">
          <h1>Subscribe to our Newsletter Today</h1>
          <p>Dont miss anything! Be  the first to get our exclusive offers and latest news</p>
          <div className="section_box_container">
            <div className="section_box_container_cont">
              <input placeholder="Enter your email" className="section_box_container_input" />
            </div>
            <button className="section_box_container_button">Subscribe</button>
          </div>
        </section>
      }
      <div className={styles.footer_row_2}>
        <div className={styles.footer_row_22}>
          <div className={styles.footer_row_2_navigations}>
            <h3 className={styles.footer_row_2_navigation_h3}>Pages</h3>
            <ul className={styles.footer_row_2_navigation_lists}>
              <Link href="/dashboard" className={styles.footer_row_2_navigation_link} target="_blank">

                <li className={styles.footer_row_2_navigation_list}>
                  Dashboard
                </li>
              </Link>
              <Link href="/grocery" className={styles.footer_row_2_navigation_link} target="_blank">

                <li className={styles.footer_row_2_navigation_list}>
                  Grocery List
                </li>
              </Link>
              <Link href="/suggestmeal" className={styles.footer_row_2_navigation_link}target="_blank" >

                <li className={styles.footer_row_2_navigation_list}>
                  Suggest A Meal
                </li>
              </Link>
            </ul>
          </div>
          <div className={styles.footer_row_2_navigations}>
            <h3 className={styles.footer_row_2_navigation_h3}>Resources</h3>
            <ul className={styles.footer_row_2_navigation_lists}>
              <Link
                href="/login"
                className={styles.footer_row_2_navigation_link}
                target="_blank"
              >

                <li className={styles.footer_row_2_navigation_list}>
                  Login/My account
                </li>
              </Link>
              <Link
                href="/signup"
                className={styles.footer_row_2_navigation_link}
                target="_blank"
              >

                <li className={styles.footer_row_2_navigation_list}>Sign Up</li>
              </Link>
              <Link href="#" className={styles.footer_row_2_navigation_link} >

                <li className={styles.footer_row_2_navigation_list}>Shipping Return</li>
              </Link>
              <Link href="#" className={styles.footer_row_2_navigation_link} >

                <li className={styles.footer_row_2_navigation_list}>FAQ + Support</li>
              </Link>
            </ul>
          </div>
          <div className={styles.footer_row_2_navigations + " " + styles.lastnavbox}>
            <h3 className={styles.footer_row_2_navigation_h3}>Company</h3>
            <ul className={styles.footer_row_2_navigation_lists}>
              <Link href="#" className={styles.footer_row_2_navigation_link} >

                <li className={styles.footer_row_2_navigation_list}>About Us</li>
              </Link>
              <Link href="#" className={styles.footer_row_2_navigation_link} >

                <li className={styles.footer_row_2_navigation_list}>
                  Careers
                </li>
              </Link>
              <Link href="/marketplace/stores" className={styles.footer_row_2_navigation_link} target="_blank">

                <li className={styles.footer_row_2_navigation_list}>
                  Partners
                </li>
              </Link>
              <Link href="/termsofservice" className={styles.footer_row_2_navigation_link} target="_blank">

                <li className={styles.footer_row_2_navigation_list}>
                  Terms of Service
                </li>
              </Link>
              <Link href="/privacypolicy" className={styles.footer_row_2_navigation_link} target="_blank" >

                <li className={styles.footer_row_2_navigation_list}>
                  Privacy and Policy
                </li>
              </Link>
            </ul>
          </div>
        </div>
        <div className={styles.footer_row_2_details}>
          <div className={styles.footer_main_logo}>
            <Image
              src={img_logo}
              alt="chop chow"
              className={styles.footer_main_logo_img + " " + styles.lazyload}
            />
          </div>
          <div className={styles.footer_row_2_h2}>
            Adding convenience to home made mealsTM
          </div>
          <div className={styles.footer_top_social_links}>
            <Link
              href="https://www.instagram.com/chopchowmarket/"
              aria-label="Check out our instagram page"
              target="_blank"
            >

              <Image className={styles.footer_top_social_link_logo} src={instagramImg} alt='instagram' />
            </Link>
            <Link
              href="https://www.facebook.com/profile.php?id=100063699115096"
              aria-label="Check out our facebook page"
              target="_blank"
            >

              <Image className={styles.footer_top_social_link_logo} src={facebookImg} alt='instagram' />
            </Link>
          </div>
          <h3 className={styles.footer_row_2_h3}>
            {new Date().getFullYear()} Copyright: <span>ChopChowSD</span>
          </h3>
        </div>
      </div>
    </div>
  );
};

export default Footer;
