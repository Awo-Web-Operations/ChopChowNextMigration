import {
  DashBoardIcon,
  HotMealIcon,
  InventoryIcon,
  OrderIcon,
  GroceryIcon,
  PowerIcon,
  StoreMgtIcon,
  SupportIcon,
  UserIcon,
  StoreMgtIcon2,
  ChatIcon,
  AdminMgtIcon,
  MealRequestIcon,
  BlogSettingsIcon,
} from "../icons";
import Link from "next/link";
import styles from "./header.module.css";
import { connect, useSelector } from "react-redux";
import React, { useEffect, useState } from "react";
import { setOpenLogin, userSignOut } from "../../actions";
import { useRouter } from "next/router";
import { useAuth } from "../../context/auth.context";
import icon from "../../../public/assets/fa_shopping-basket.png";
import Image from "next/image";

function SideNav2(props) {
  const { isOpen, setIsOpen } = useAuth();
  const router = useRouter();
  const selectedUserType = useSelector(
    (state) => state?.userType?.selectedUserType
  );

  function toggleLogin() {
    props.setOpenLogin(!props.openLogin);
    setIsOpen(!isOpen);
  }

  function logout() {
    props.logout();
    router.push("/");
  }

  const [user, setUser] = useState({});

  useEffect(() => {
    const data = JSON.parse(localStorage.getItem("user") || "{}");
    setUser(data);
  }, []);
  return (
    <div className={styles.sidenav_links_con}>
      <div className={styles.sidenav_links}>
        {props.auth.authUser && (
          <React.Fragment>
            <Link href="/dashboard">
              <div
                className={
                  styles.sidenav_link +
                  " " +
                  (props.path === "/dashboard" && styles.active)
                }
              >
                <DashBoardIcon style={styles.sidenav_link_icon} />
                Dashboard
              </div>
            </Link>
            {/* {props.auth.authUser.user_type === "supplier" && (
              <Link href="/dashboard/inventory">
                <div
                  className={
                    styles.sidenav_link +
                    " " +
                    (props.path === "/dashboard/inventory" && styles.active)
                  }
                >
                  <InventoryIcon style={styles.sidenav_link_icon} />
                  Inventory
                </div>
              </Link>
            )} */}
            <Link href="/dashboard/orders/orders">
              <div
                className={
                  styles.sidenav_link +
                  " " +
                  (props.path === "/dashboard/orders/orders" && styles.active)
                }
              >
                <OrderIcon style={styles.sidenav_link_icon} />
                Order
              </div>
            </Link>
            <Link href="/groceries">
              <div
                className={
                  styles.sidenav_link +
                  " " +
                  (props.path === "/groceries" && styles.active)
                }
              >
                {/* <GroceryIcon style={styles.sidenav_link_icon} /> */}
                <div
                  style={{ display: "flex", alignItems: "center", gap: "10px" }}
                >
                  <Image src={icon} />
                  Grocery List
                </div>
              </div>
            </Link>
            {selectedUserType === "admin" && (
              <Link href="/dashboard/suggestedmeals">
                <div
                  className={
                    styles.sidenav_link +
                    " " +
                    (props.path === "/dashboard/suggestedmeals" &&
                      styles.active)
                  }
                >
                  <HotMealIcon style={styles.sidenav_link_icon} />
                  Meal Request
                </div>
              </Link>
            )}

            {selectedUserType === "supplier" && (
              <Link href="/dashboard/suggestedmeals">
                <div
                  className={
                    styles.sidenav_link +
                    " " +
                    (props.path === "/dashboard/suggestedmeals" &&
                      styles.active)
                  }
                >
                  <MealRequestIcon style={styles.sidenav_link_icon} />
                  Meal/Product Suggestion
                </div>
              </Link>
            )}
            <Link href={`/chef/${user?.username}/${user?._id}`}>
              <div
                className={
                  styles.sidenav_link +
                  " " +
                  (props.path === "/dashboard/userprofile" && styles.active)
                }
              >
                <UserIcon style={styles.sidenav_link_icon} />
                My Profile
              </div>
            </Link>
            <Link href="/dashboard/userprofile">
              <div
                className={
                  styles.sidenav_link +
                  " " +
                  (props.path === "/dashboard/userprofile" && styles.active)
                }
              >
                <StoreMgtIcon style={styles.sidenav_link_icon} />
                Profile Settings
              </div>
            </Link>

            {selectedUserType === "supplier" && (
              <Link href="/dashboard/manage-store">
                <div
                  className={
                    styles.sidenav_link +
                    " " +
                    (props.path === "/dashboard/manage-store" && styles.active)
                  }
                >
                  <StoreMgtIcon2 style={styles.sidenav_link_icon} />
                  Manage Stores
                </div>
              </Link>
            )}
            {selectedUserType === "admin" && (
              <Link href="/dashboard/management">
                <div
                  className={
                    styles.sidenav_link +
                    " " +
                    (props.path === "/dashboard/management" && styles.active)
                  }
                >
                  <AdminMgtIcon style={styles.sidenav_link_icon} />
                  Admin Mgt
                </div>
              </Link>
            )}
            {selectedUserType === "admin" && (
              <Link href="/dashboard/management">
                <div
                  className={
                    styles.sidenav_link +
                    " " +
                    (props.path === "/dashboard/management" && styles.active)
                  }
                >
                  <ChatIcon style={styles.sidenav_link_icon} />
                  Chat
                </div>
              </Link>
            )}
            {selectedUserType === "admin" && (
              <Link href="/dashboard/blog/create">
                <div
                  className={
                    styles.sidenav_link +
                    " " +
                    (props.path === "/dashboard/blog/create" && styles.active)
                  }
                >
                  <BlogSettingsIcon style={styles.sidenav_link_icon} />
                  Blog Settings
                </div>
              </Link>
            )}
            {selectedUserType !== "admin" && (
              <Link href="/support">
                <div
                  className={
                    styles.sidenav_link +
                    " " +
                    (props.path === "/dashboard/support" && styles.active)
                  }
                >
                  <SupportIcon style={styles.sidenav_link_icon} />
                  Support
                </div>
              </Link>
            )}
          </React.Fragment>
        )}
      </div>
      <div className={styles.side_bottom}>
        {props.showBottom && props.auth.authUser && (
          <div onClick={logout} className={styles.sidenav_link}>
            <PowerIcon style={styles.sidenav_link_icon} />
            <p>Logout</p>
          </div>
        )}
        {props.showBottom && !props.auth.authUser && (
          <Link href="/login">
            <div onClick={toggleLogin} className={styles.sidenav_link}>
              <PowerIcon style={styles.sidenav_link_icon} />
              <p>Log In</p>
            </div>
          </Link>
        )}
      </div>
    </div>
  );
}

function mapDispatchToProps(dispatch) {
  return {
    logout: () => dispatch(userSignOut()),
    setOpenLogin: (login) => dispatch(setOpenLogin(login)),
  };
}

function mapStateToProp(state) {
  return {
    path: state.Common.path,
    openLogin: state.Auth.openLogin,
    auth: state.Auth,
    showSnack: state.showSnack,
    snackMessage: state.snackMessage,
    snackDuration: state.snackDuration,
  };
}

export default connect(mapStateToProp, mapDispatchToProps)(SideNav2);
