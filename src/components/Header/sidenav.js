import styles from "./header.module.css";
import React, { useState } from "react";
import openIcon from "../../../public/assets/icons/eva_menu-open.png";
import Image from "next/image";
import img_logo from "../../../public/assets/logos/CC_Logo_no_bg.png";
import closeIcon from "../../../public/assets/icons/eva_menu-close.png";
import Link from "next/link";
import Sidenav2 from "./sidenav2";
import { connect, useSelector } from "react-redux";
import { UserIcon } from "../icons";

function SideNav(props) {
  function openSidenav(e) {
    document.getElementById("mySidenav").style.display = "grid";
    document.addEventListener("click", (e) => {
      if (document.getElementById("mySidenav")) {
        if (
          e.target.id !== "openIcon" &&
          e.target.id !== "openbutton" &&
          e.target.id !== "side_top"
        )
          document.getElementById("mySidenav").style.display = "none";
      }
    });

    window.event.returnValue = false;
  }
  const selectedUserType = useSelector((state) => state.userType.selectedUserType);

  return (
    <div className={styles.navbar_side}>
      <div
        id="openbutton"
        className={styles.openbtn}
        aria-label="Toggle Sidebar"
      >
        <Image
          onClick={openSidenav}
          id="openIcon"
          src={openIcon}
          alt="open nav"
        />
      </div>
      <div id="mySidenav" className={styles.sidenav}>
        <div id="side_top" className={styles.sidenav_top}>
          <div className={styles.sidenav_top_row_1}>
            <div>
              <Image src={closeIcon} alt="close nav" />
            </div>
            <div>
              <Link href="/" className={styles.social_link}>
                <Image
                  src={img_logo}
                  alt="logo"
                  className={styles.sidenav_logo}
                />
              </Link>
            </div>
          </div>

          <div className={styles.sidenav_top_row_2}>
            {props?.auth?.authUser?.profile_picture ? (
              <Image
                width={100}
                height={100}
                src={props?.auth?.authUser?.profile_picture}
                alt={props?.auth?.authUser?.first_name}
                className={styles.sidenav_top_row_2_img}
              />
            ) : (
              <div className={styles.sidenav_top_row_2_img}>
                <UserIcon />
              </div>
            )}
            <div>
              {props?.auth?.authUser?.first_name &&
                <h3>
                {props?.auth?.authUser?.first_name +
                  " " +
                  props?.auth?.authUser?.last_name}
              </h3>
              }
              <p className={styles.sidenav_top_row_2_text}>
                {selectedUserType}
              </p>
            </div>
          </div>
        </div>
        <Sidenav2 showBottom={true} />
      </div>
    </div>
  );
}



// export default SideNav;

function mapStateToProp(state) {
  return {
    path: state.Common.path,
    auth: state.Auth,
  };
}

export default connect(mapStateToProp)(SideNav);
