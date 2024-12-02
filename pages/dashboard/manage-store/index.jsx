"use client";
import axios from "../../../src/util/Api";
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Head from "next/head";
import styles from "../../../src/components/dashboard/management.module.css";
import Sidenav2 from "../../../src/components/Header/sidenav2";
import Header from "../../../src/components/Header/Header";
import SideNav from "../../../src/components/Header/sidenav";
import {
  container,
  col2,
  left,
  empty,
  center,
} from "../../../src/components/dashboard/dashboard.module.css";
import moment from "moment";

const ManageStores = () => {
  const [allStores, setAllStores] = useState([]);
  const router = useRouter();
  const fetchOneUserStore = async () => {
    try {
      const user = JSON.parse(localStorage.getItem("user"))?._id;
      const response = await axios(`/stores/user/${user}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      console.log(response.data.data, "one store");
      setAllStores(response.data.data);
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    fetchOneUserStore();
  }, []);
  console.log(allStores, 'ALL')
  return (
    <div className={container + " " + col2}>
      <Head>
        <title>Chop Chow Management</title>
        <meta
          key="title"
          name="viewport"
          content="initial-scale=1.0, width=device-width"
        />
      </Head>
      <Header />
      <SideNav />
      <div className={left}>
        <Sidenav2 showBottom={false} />
      </div>
      <div className={empty}></div>
      <div className={center}>
        <h2>Manage Stores</h2>
        <div className={styles.searchStores}>
          <input type="text" name="search" placeholder="Search for store" />
          <button>Search</button>
        </div>
        <h5 className={styles.title}>Stores</h5>
        <div className={styles.choose_store}>
          <p>Choose a Store to manage</p>
          <div className={styles.allStores}>
            {allStores.map((elem) => (
              <div
                className={styles.one_store}
                onClick={() =>
                  router.push(`/dashboard/management?storeId=${elem._id}`)
                }
              >
                <img
                  src={
                    elem.background_picture
                      ? elem.background_picture
                      : "/assets/store_pics/no-image-store.png"
                  }
                />
                <p className={styles.storeName}>{elem?.store_name}</p>
                <p className={styles.createdAt}>
                  Created on {moment(elem?.createdAt).format("Do MMM, YYYY")}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
export default ManageStores;
