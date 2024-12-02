import Head from "next/head";
import Header, { Header2 } from "../../../src/components/Header/Header";
import GoBack from "../../../src/components/CommonComponents/goBack";
import Footer from "../../../src/components/Footer/Footer";
import styles from "../../../src/components/chef/chef.module.css";
import Image from "next/image";
import { BsFillShareFill } from "react-icons/bs";
import {
  FacebookShareButton,
  TwitterShareButton,
  WhatsappShareButton,
} from "react-share";
import { useEffect, useState } from "react";
import MyTabs from "../../../src/components/tabs/tab";
import { useRouter } from "next/router";
import axios from "../../../src/util/Api";
import {
  WhatsappEIcon,
  FacebookEIcon,
  TwitterEIcon,
  UserIcon,
} from "../../../src/components/icons";
import InstagramBasicApi from "../../../src/components/SocialShare/InstagramBasicApi";

const ChefPage = () => {
  const [activeKey, setActiveKey] = useState("2");
  const router = useRouter();
  const [user, setUser] = useState({});
  const fetchUserDetails = async (id) => {
    try {
      const response = await axios(`/user/findUser/${id}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      setUser(response.data.data);
    } catch (error) {
      console.log(error);
    }
  };
  console.log("rrr");

  useEffect(() => {
    if (router.query.id) {
      fetchUserDetails(router.query.id);
    }
  }, [router.query.id]);

  const handleTabChange = (key) => {
    setActiveKey(key);
  };
  const url = "https://www.chopchow.app/";

  function CheckStringsEnd(str) {
    let result = "";
    if (typeof str !== "string" || str.length === 0) {
      return str; // Return unchanged if not a string or empty string
    }

    // Check if the string ends with 's'
    if (str.endsWith("s")) {
      return str + "'"; // Append apostrophe to the string
    }
    result = str + "'s";
    return result; // Return unchanged if the string doesn't end with 's'
  }
  return (
    <div className={styles.ChefContainer}>
      <Head>
        <title>Chop Chow Chef</title>
        <meta
          key="title"
          name="viewport"
          content="initial-scale=1.0, width=device-width"
        />
        <meta
          name="description"
          content="Discover Chef's recipes and grocery lists on Chop Chow"
        />
      </Head>
      <Header />
      <Header2 />
      <div className={styles.chefBg}>
        <div className={styles.bgAlign}>
          <div className={styles.flex}>
            <GoBack />
            {user?.profile_picture ? (
              <Image
                src={user?.profile_picture}
                className={styles.chefImg}
                width={200}
                height={200}
              />
            ) : (
              <div>
                <UserIcon style={styles.chefImg} />
              </div>
            )}
          </div>
          <h5 style={{ textTransform: "capitalize" }}>
            {user.first_name} {user.last_name}
          </h5>
        </div>
      </div>
      <div className={styles.share}>
        <span style={{ marginRight: "2rem" }}>
          <BsFillShareFill /> share this Page:
        </span>
        <div className={styles.share}>
          <div className={styles.icon}>
            <FacebookShareButton
              url={url + "chef/" + user._id}
              quote={"Chop chow awesome"}
              hashtag={`#${user.first_name} ${user.last_name}  #recipes   #ChopChow`}
              title={"Share to Facebook"}
            >
              <FacebookEIcon />
              {/* <span className={styles.iconSpan}>
                                <Image src="/assets/icons/Vector.svg" alt='facebook'

                                    height={"17"} width={"17"} className={styles.icons}

                                    objectFit="cover"
                                    objectPosition="center" />
                            </span> */}
            </FacebookShareButton>
          </div>
          {/* <div onClick={() => this.handleShareClick()} style={{ cursor: "pointer" }} className={styles.icon}>
                        <span className={styles.iconSpan1}>

                            <Image src="/assets/icons/Vector (2).svg" alt='instagram'
                                height={"17"} width={"17"} className={styles.icons}

                                objectFit="cover"
                                objectPosition="center" />
                        </span>
                    </div> */}

          <div style={{ cursor: "pointer" }} className={styles.icon}>
            <WhatsappShareButton
              title={user.first_name}
              url={url + "chef/" + user._id}
            >
              <WhatsappEIcon />
            </WhatsappShareButton>
          </div>

          <div>
            <TwitterShareButton
              className={styles.icon}
              url={url + "chef/" + user._id}
              title={
                "View" +
                " " +
                user.first_name +
                " " +
                CheckStringsEnd(user.last_name) +
                " " +
                "Recipes"
              }
              via="ChopChowMarket"
            >
              <TwitterEIcon />
            </TwitterShareButton>
          </div>
        </div>
      </div>
      <InstagramBasicApi />
      <MyTabs id={router.query.id} />

      <Footer />
    </div>
  );
};
export default ChefPage;
