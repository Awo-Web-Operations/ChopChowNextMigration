import img_logo from "../../../public/assets/logos/chopchow-logo.png";
import styles from "./header.module.css";

import Link from "next/link";
import React, { useEffect, useState, useContext, useRef } from "react";
import { MobileHeader } from "../mobile/header-mobile";
import { FaCheck } from "react-icons/fa6";
import { RiMessage2Fill } from "react-icons/ri";
import { IoSearchCircle, IoSearchOutline } from "react-icons/io5";
import Image from "next/image";
import {
  ArrowDownIcon,
  ArrowLeftFillIcon,
  BasketIcon2,
  CartIcon,
  CartIcon2,
  DashBoardIcon,
  FaqIcon,
  HomeIcon2,
  NotificationIcon,
  Order3Icon,
  UserIcon,
} from "../icons";
import { connect, useSelector, useDispatch } from "react-redux";
import { getPath } from "../../actions/Common";
import { usePathname, useRouter } from "next/navigation";
import { userSignOut, verifyToken, setOpenLogin } from "../../actions";
import { triggerAlert } from "../../actions/";
import CartContext from "../../../pages/store/cart-context";
import { useAuth } from "../../context/auth.context";
// import profile_pic from "../assets/icons/user-icon.jpg"
import moment from "moment";
import { useMediaQuery } from "../../hooks/usemediaquery";
import { MobileSearch } from "../dropdown/mobile-search";
import axios from "../../util/Api";
import { matches } from "lodash";
import NavLink from "../../hooks/navlink";

function Header(props) {
  // const [isAuthenticated, setIsAuthenticatedState] = useState(false);
  // const [customerId, setCustomerIdState] = useState(null);
  // const [username, setUsernameState] = useState(null);
  // const [showNotif, setshowNotifState] = useState(true);
  const { isOpen, setIsOpen } = useAuth();
  const [openLogin, setOpenLoginState] = useState(false);
  const [user, setUser] = useState({});
  const router = useRouter();
  const [showDropdown, setShowDropdown] = useState(true);
  const [notifications, setNotifications] = useState([]);
  const [showSignup, setShowSignUp] = useState(false);
  const { authUser } = useSelector((state) => state.Auth);
  const [openUserDetails, setOpenUserDetails] = useState(false);
  const cartCtx = useContext(CartContext);
  const matches = useMediaQuery("(min-width: 1025px)");
  const isLandscape = useMediaQuery("(orientation: landscape)");
  const [prevScrollPos, setPrevScrollPos] = useState(0);
  const [visible, setVisible] = useState(true);
  //const { items } = cartCtx;
  const [activeNav, setActiveNav] = useState(0);
  const dispatch = useDispatch();

  const pathname = usePathname(); // Get the current pathname



  // const handleSetActiveNav = (id, path) => {
  //   setActiveNav(id);
  //   router.push(path);
  // };

  const { cartItems: items } = useSelector((state) => {
    return state.Cart;
  });

  const goToCart = () => {
    router.push("/cart");
  };

  const updateNotification = async (id) => {
    try {
      const response = await axios.patch(`/user/notification/${id}`);

      getAllNotifications();
    } catch (err) {
      console.log(`Error updating notification with ID ${id}:`, err);
    }
  };
  function toggleNotification(e) {
    const notification = document.getElementById("notification");

    if (notification.style.display === "grid") {
      notification.style.display = "none";
    } else {
      notification.style.display = "grid";
    }
    e.stopPropagation();
  }

  document.addEventListener("click", () => {
    const notification = document.getElementById("notification");

    if (notification) {
      notification.style.display = "none";
    }
  });

  const getOneItemById = async (id, commentId) => {
    try {
      const response = await axios.get(`/items/item/${id}`);
      const data = Array.isArray(response.data?.data)
        ? response.data?.data[0]
        : {};
      if (data?.item_name) {
        router.push(
          `/${data?.item_type === "Meal" ? "meal" : "product"}/${data?.item_name
          }?id=${commentId}`
        );
      }
    } catch (e) {
      console.log(e);
    }
  };

  const dropdownRef = useRef(null);
  const toggleUserDetails = () => {
    if (!openUserDetails || dropdownRef.current === event.target) {
      setOpenUserDetails(!openUserDetails);
    }
  };
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpenUserDetails(false);
      }
    };

    document.addEventListener("click", handleClickOutside);

    return () => document.removeEventListener("click", handleClickOutside);
  }, []);
  function toggleLogin() {
    setOpenLoginState(!openLogin);
  }
  const menu = [
    {
      name: "Home",
      path: "/",
      icon: <HomeIcon2 color={pathname === "/" ? "#F47900" : "#6D6D6D"} />,
    },
    {
      name: "Order",
      path: "#",
      icon: <Order3Icon color={pathname === "#" ? "#F47900" : "#6D6D6D"} />,
    },
    {
      name: "Grocery List",
      path: "/groceries",
      icon: <BasketIcon2 color={pathname === "/groceries" ? "#F47900" : "#6D6D6D"} />,
    },
    {
      name: "Cart",
      path: "#",
      icon: <CartIcon2 color={pathname === "#" ? "#F47900" : "#6D6D6D"} />,
    },
  ];

  function logout() {
    props.logout();
    router.push("/");
  }
  const unreadMessages = notifications.filter((message) => !message.read);
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user" || "{}"));
    setUser(user);
  }, []);

  const getAllNotifications = async () => {
    try {
      const response = await axios.get(`/user/notifications`);
      setNotifications(response.data.data);
    } catch (err) {
      console.log(err);
    }
  };
  useEffect(() => {
    getAllNotifications();
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollPos = window.pageYOffset;
      setVisible(prevScrollPos > currentScrollPos || currentScrollPos < 10);
      setPrevScrollPos(currentScrollPos);
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [prevScrollPos]);

  return (
    <>
      <div className={styles.navbar}>
        <div className={styles.navbar_top_container}>
          <div className={styles.navbar_top}>
            <div className={styles.navbar_top_logo_search}>
              <Link href="/">
                <Image
                  className={styles.navbar_top_logo_img}
                  src={img_logo}
                  alt="logo"
                />
              </Link>
              {/* <div className={styles.searchbar}>
                <MobileSearch setShowDropdown={setShowDropdown} />
              </div> */}
            </div>
            <div className={styles.navbar_top_details}>
              <div className={styles.searchIcon}>
                <IoSearchOutline color="rgba(244, 121, 0, 1)" size={20} />
              </div>
              {!props.auth.isAuthenticated && authUser === null ? (
                <Link legacyBehavior href="/login">
                  <a className={styles.navbar_user_loginbtn}>Log In/Register</a>
                </Link>
              ) : (
                <div className={styles.navbar_user_info} ref={dropdownRef}>
                  {authUser?.profile_picture !== "" &&
                    authUser?.profile_picture !== undefined ? (
                    <div onClick={toggleUserDetails}>
                      {" "}
                      <Image
                        id="userImg"
                        width={34}
                        height={34}
                        src={authUser?.profile_picture}
                        alt={props?.auth?.authUser?.username}
                        className={styles.navbar_user_img}
                      />
                    </div>
                  ) : (
                    <div onClick={toggleUserDetails}>
                      <UserIcon style={styles.navbar_user_img} />
                    </div>
                  )}

                  <h4
                    onClick={toggleUserDetails}
                    id="userName"
                    className={styles.navbar_user_name}
                  >
                    {props?.auth?.authUser?.username}
                  </h4>
                  <div
                    onClick={toggleUserDetails}
                    style={{ marginTop: "-1rem" }}
                  >
                    <ArrowDownIcon
                      id="usericon"
                      style={styles.navbar_user_icon}
                    />
                  </div>

                  {openUserDetails && (
                    <div className={styles.userdetails}>
                      <Link href="/dashboard">
                        <div
                          className={
                            styles.navbar_user_signedin_link +
                            " " +
                            styles.black
                          }
                        >
                          <DashBoardIcon style={styles.navbar_main_link_icon} />
                          <h3>Dashboard</h3>
                        </div>
                      </Link>

                      <Link href="/dashboard/userprofile">
                        <div
                          className={
                            styles.navbar_user_signedin_link +
                            " " +
                            styles.black
                          }
                        >
                          <UserIcon style={styles.navbar_main_link_icon} />
                          <h3>Profile</h3>
                        </div>
                      </Link>
                      <Link href="/suggestmeal">
                        <div
                          className={
                            styles.navbar_user_signedin_link +
                            " " +
                            styles.black
                          }
                          style={{ marginTop: "-1rem", alignItems: "center" }}
                        >
                          {/* <Image src={openIcon} alt="profile" /> */}
                          <div className={styles.navbar_main_link_icon}>
                            <img src="/assets/icons/fastfood.svg" />
                          </div>
                          <h3>Suggest A Meal</h3>
                        </div>
                      </Link>
                      <div className={styles.navbar_user_signedin_logout}>
                        <div>
                          <div
                            onClick={logout}
                            className={
                              styles.navbar_user_signedin_link +
                              " " +
                              styles.white
                            }
                          >
                            <ArrowLeftFillIcon
                              style={styles.navbar_main_link_icon2}
                            />
                            <h3>Logout</h3>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}
              <button className={styles.navbar_user_upgradebtn}>
                Subscribe
              </button>
              <div className={styles.navbar_top_details_col}>
                {matches ? (
                  <>
                    {!props.auth.isAuthenticated && authUser === null ? (
                      ""
                    ) : (
                      <div
                        style={{
                          position: "relative",
                          display: "flex",
                        }}
                      >
                        <div
                          id="noticon"
                          onClick={(e) => toggleNotification(e)}
                        >
                          <NotificationIcon
                            id="notImg"
                            style={styles.navbar_top_details_col_icon}
                          />
                        </div>
                        <h5
                          id="notText"
                          style={{
                            cursor: "pointer",
                          }}
                          className={styles.notitext}
                          onClick={(e) => toggleNotification(e)}
                        >
                          Notification
                        </h5>
                        <span id="notNo" className={styles.numberofitems}>
                          {unreadMessages?.length}
                        </span>
                      </div>
                    )}
                  </>
                ) : (
                  <>
                    {" "}
                    {!props.auth.isAuthenticated && authUser === null ? (
                      ""
                    ) : (
                      <div style={{ position: "relative", display: "flex" }}>
                        <Link href="/notification">
                          <NotificationIcon
                            id="notImg"
                            style={styles.navbar_top_details_col_icon}
                          />
                        </Link>
                        <span
                          id="notNo"
                          style={{ marginLeft: "2px" }}
                          className={styles.numberofitems}
                        >
                          {unreadMessages?.length}
                        </span>
                      </div>
                    )}
                  </>
                )}
                <div>
                  {matches ? (
                    <>
                      {!props.auth.isAuthenticated && authUser === null ? (
                        ""
                      ) : (
                        <div
                          style={{ display: "flex", cursor: "pointer" }}
                          onClick={goToCart}
                        >
                          <div>
                            <CartIcon
                              id="notImg"
                              style={styles.navbar_top_details_col_icon2}
                            />
                          </div>
                          <h5
                            style={{ marginLeft: "2px" }}
                            className={styles.notitext}
                          >
                            Cart
                          </h5>

                          <span
                            className={styles.numberofitems}
                            id="notNo"
                            style={{
                              position: "relative",
                              right: "2px",
                            }}
                          >
                            {items?.length > 0 ? items.length : 0}
                          </span>
                        </div>
                      )}
                    </>
                  ) : (
                    <>
                      {!props.auth.isAuthenticated && authUser === null ? (
                        ""
                      ) : (
                        <div
                          className={styles.show}
                          style={{ cursor: "pointer" }}
                          onClick={goToCart}
                        >
                          <div>
                            <CartIcon
                              id="notImg"
                              style={styles.navbar_top_details_col_icon2}
                            />
                          </div>

                          <span
                            className={styles.numberofitems}
                            id="notNo"
                            style={{
                              position: "relative",
                              right: "2px",
                            }}
                          >
                            {items?.length > 0 ? items.length : 0}
                          </span>
                        </div>
                      )}
                    </>
                  )}
                </div>
                <div className={styles.show}>
                  <div>
                    <FaqIcon />
                  </div>
                  <h5 style={{}} className={styles.notitext}>
                    FAQ
                  </h5>
                </div>
                <div id="notification" className={styles.summaries_min}>
                  <div className={styles.summary_min}>
                    <div className={styles.summary_min_head}>
                      <h3 className={styles.summary_min_h3}>Notification</h3>
                    </div>
                    <div className={styles.summary_min_notifications}>
                      <div className={styles.not}>
                        {[...notifications]
                          ?.sort(
                            (a, b) =>
                              new Date(b.createdAt).getTime() -
                              new Date(a.createdAt).getTime()
                          )
                          ?.map((elem) => (
                            <div
                              style={{ cursor: "pointer" }}
                              className={styles.summary_notification}
                              onClick={() => {
                                if (elem.message.includes("Suggested Meal")) {
                                  updateNotification(elem._id);
                                  router.push("/dashboard/suggestedmeals");
                                } else {
                                  getOneItemById(
                                    elem?.notifiable?.item,
                                    elem?.notifiable?._id
                                  );
                                }
                              }}
                            >
                              {elem.message.includes("Suggested Meal") ? (
                                <div className={styles.rounded}>
                                  <FaCheck color="black" size={14} />
                                </div>
                              ) : (
                                <div className={styles.rounded2}>
                                  <RiMessage2Fill size={15} color="#FFF" />
                                </div>
                              )}
                              <div
                                className={styles.summary_notification_Details}
                              >
                                <h3
                                  className={styles.summary_notification_desc}
                                >
                                  {elem.message}
                                </h3>
                                <p className={styles.summary_notification_link}>
                                  {elem.message.includes("Suggested Meal") ? (
                                    <p onClick={() => { }}>View Item</p>
                                  ) : (
                                    <p>View Comment</p>
                                  )}
                                </p>
                                <p className={styles.summary_notification_time}>
                                  {moment(elem.createdAt).fromNow()}
                                </p>
                              </div>
                              <div
                                className={
                                  !elem.read ? styles.readDot : styles.readDot2
                                }
                              />
                            </div>
                          ))}
                      </div>

                      <div className={styles.navbar_top_details_col}>
                        <div id="notification" className={styles.summaries_min}>
                          <div className={styles.summary_min}>
                            <div className={styles.summary_min_head}>
                              <h3 className={styles.summary_min_h3}>
                                Notification
                              </h3>
                            </div>
                            <div className={styles.summary_min_notifications}>
                              <div className={styles.summary_notification}>
                                <div className={styles.tick}>
                                  <FaCheck />
                                </div>
                                <div
                                  className={
                                    styles.summary_notification_Details
                                  }
                                >
                                  <h3
                                    className={styles.summary_notification_desc}
                                  ></h3>
                                  <p
                                    className={styles.summary_notification_time}
                                  ></p>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              {matches ? (
                ""
              ) : (
                <div
                  className={
                    visible ? styles.navbar_down : styles.navbar_down_2
                  }
                >
                  {menu.map((item, id) => (
                    <Link key={id} href={item.path} className={pathname === item.path ? styles.activeOne : styles.links}>
                      <div className={styles.navbar_down_col_icon}>
                        {item.icon}
                      </div>
                      <p>{item.name}</p>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
        {/* {isOpen && <Auth />} */}
      </div>
    </>
  );
}

function mapDispatchToProps(dispatch) {
  return {
    getPath: (path) => dispatch(getPath(path)),
    setOpenLogin: (login) => dispatch(setOpenLogin(login)),

    logout: () => dispatch(userSignOut()),
    verifyToken: (user, token) => dispatch(verifyToken(user, token)),
    resetSnack: (showSnack, snackMessage) =>
      dispatch(triggerAlert({ snackMessage, showSnack })),
  };
}

function mapStateToProp(state) {
  return {
    path: state.Common.path,
    auth: state.Auth,
    openLogin: state.Auth.openLogin,
    error: state.Common.error,
    message: state.Common.message,
    showSnack: state?.Common?.showSnack,
    snackMessage: state?.Common?.snackMessage,
    snackDuration: state?.Common?.snackDuration,
  };
}

export default connect(mapStateToProp, mapDispatchToProps)(Header);

export function Header2({ pathname, activeSubLink, setActiveSubLink }) {
  const router = useRouter();
  const [openDropdown, setOpenDropdown] = useState(false);
  const dropdownRef = useRef(null);

  const currentPathname = pathname || "";

  useEffect(() => {
    const sublinkPaths = [
      "/marketplace/stores",
      "/marketplace/meals",
      "/marketplace/products",
      "/marketplace/utensils",
      "/marketplace/categories",
      "/marketplace/collections",
    ];
    const index = sublinkPaths.indexOf(currentPathname);
    if (index !== -1) {
      setActiveSubLink(index + 1);
    }
  }, [currentPathname, setActiveSubLink]);

  const handleActiveSubLink = (id) => {
    setActiveSubLink(id);
    setOpenDropdown(true);
    if (id > 0) {
      const sublinkPaths = [
        "/marketplace/stores",
        "/marketplace/meals",
        "/marketplace/products",
        "/marketplace/utensils",
      ];
      router.push(sublinkPaths[id - 1]);
    }
  };

  const handleMarketplaceClick = () => {
    if (currentPathname === "/marketplace") {
      setOpenDropdown((prev) => !prev);
      setActiveSubLink(0);
    } else {
      setOpenDropdown(true);
      router.push("/marketplace");
    }
  };

  const handleClickOutside = (event) => {
    if (
      dropdownRef.current &&
      !dropdownRef.current.contains(event.target) &&
      !event.target.closest(".marketplace-button")
    ) {
      setOpenDropdown(false);
    }
  };

  useEffect(() => {
    if (openDropdown) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [openDropdown]);

  const matches = useMediaQuery("(min-width: 900px)");

  useEffect(() => {
    if (currentPathname.startsWith("/marketplace")) {
      setOpenDropdown(true);
    } else {
      setOpenDropdown(false);
    }
  }, [currentPathname, activeSubLink]);

  return (
    <div className={styles.navbar2}>
      <div className={styles.navbar_main_container}>
        <div className={styles.navbar_main}>
          <ul className={styles.navbar_main_links}>
            <li className={styles.navbar_main_link}>
              <span
                className={
                  currentPathname.startsWith("/marketplace")
                    ? "marketplace-button"
                    : "marketplace-button2"
                }
                onClick={handleMarketplaceClick}
              >
                Marketplace
              </span>
            </li>
            <li className={styles.navbar_main_link}>
              <NavLink href="/chef">Chefs</NavLink>
            </li>
            <li className={styles.navbar_main_link}>
              <NavLink href="/blog">Blog</NavLink>
            </li>
          </ul>

          <div className={styles.navbar_main_grocery}>
            <Link href="/suggestmeal">
              <span
                className={
                  currentPathname === "/suggestmeal"
                    ? styles.activelink
                    : styles.inactivelink
                }
              >
                Suggest a Meal
              </span>
            </Link>
            <Link href="/groceries">
              <span
                className={
                  currentPathname === "/groceries"
                    ? styles.activelink
                    : styles.inactivelink
                }
              >
                Grocery List
              </span>
            </Link>
          </div>
        </div>
      </div>

      {matches
        ? openDropdown &&
        currentPathname.startsWith("/marketplace") && (
          <div className={styles.subheader}>
            <div className={styles.subrow}>
              {[
                "",
                "Stores",
                "Meals",
                "Products",
                "Utensils",
                "Categories",
                "Collection",
              ].map((elem, index, array) => (
                <span key={index} style={{ display: "flex", gap: "1.4rem" }}>
                  <p
                    className={
                      activeSubLink === index
                        ? styles.activesubrowText
                        : styles.subrowText
                    }
                    onClick={() => handleActiveSubLink(index)}
                  >
                    {elem}
                  </p>
                  {index > 0 && index !== array.length - 1 && (
                    <p className={styles.subrowText}>|</p>
                  )}
                </span>
              ))}
            </div>
          </div>
        )
        : openDropdown &&
        currentPathname.startsWith("/marketplace") && (
          <div className={styles.subheader} ref={dropdownRef}>
            <div className={styles.subrow}>
              {[
                "",
                "Stores",
                "Meals",
                "Products",
                "Utensils",
                "Categories",
                "Collection",
              ].map((elem, index, array) => (
                <>
                  <span key={index}>
                    <p
                      className={
                        activeSubLink === index
                          ? styles.activesubrowText2
                          : styles.subrowText
                      }
                      onClick={() => handleActiveSubLink(index)}
                    >
                      {elem}
                    </p>
                  </span>
                  {index > 0 && index !== array.length - 1 && (
                    <div className={styles.dropdownborder} />
                  )}
                </>
              ))}
            </div>
          </div>
        )}
    </div>
  );
}
