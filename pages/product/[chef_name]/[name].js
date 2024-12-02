import { useRouter } from "next/router";
import Head from "next/head";
import Product from "../../../src/components/individualPage/Product";
import styles from "../../../src/components/individualPage/meal.module.css";
import GoBack from "../../../src/components/CommonComponents/goBack";
import Header, { Header2 } from "../../../src/components/Header/Header";
import Sidenav from "../../../src/components/Header/sidenav";
import axios from "../../../src/util/Api";
import { useEffect, useState } from "react";
import moment from "moment";

const individualProductPage = () => {
  const router = useRouter();
  const [props, setProps] = useState({});
  // useEffect(() => {
  //     if(props.product && props.product.data && props.product.data.products.length === 0){
  //         window.location.assign('/')
  //     }
  // })

  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  const getProduct = async (name) => {
    console.log("name", name);
    // let meal = await axios.get(`/meals/get-meal/${id}`)
    let product = await axios.get(`/items/user/${name}`);
    // console.log(product.data.data, "get props");

    setProps(product.data.data[0] || {});
  };
  useEffect(() => {
    console.log("query--", router.query?.name);
    if (router.query?.name) {
      getProduct(router.query?.name);
    }
  }, [router.query?.name]);

  return (
    <div>
      <Head>
        <title>Chop Chow Product</title>
        <meta
          key="title"
          name="viewport"
          content="initial-scale=1.0, width=device-width"
        />
        <meta name="description" content="Chop Chow Product" />
      </Head>
      <Header />
      <Header2 />
      <Sidenav />
      <div className={styles.meal_container}>
        <div className={styles.meal_section_1}>
          <div className={styles.meal_section_1_col_1}>
            <GoBack />
          </div>
          <div className={styles.meal_section_1_col_2}>
            <p className={styles.meal_section_1_col_2_p}>
              Created: {moment(props?.createdAt).format("MMMM Do, YYYY")}
            </p>
            {/* <p className={styles.meal_section_1_col_2_p}> {new Date(props?.createdAt).toLocaleDateString()}</p> */}

            {/* <p className={styles.meal_section_1_col_2_p}>{props.product.data.products[0]?.createdAt && new Date(props.product.data.products[0]?.createdAt).getDate() + ' ' + months[new Date(props.product.data.products[0]?.createdAt).getMonth()] + ' ,'+ new Date(props.product.data.products[0]?.createdAt).getFullYear()}</p> */}
            <div className={styles.select_container}>
              <div className={styles.select_box}></div>
            </div>
          </div>
        </div>
        <div style={{ width: "95%" }}>
          {/* {props.product && props.product.data && props.product.data.products.length > 0 && */}
          <Product
            product={props}
            callback={() => getProduct(router.query?.name)}
          />
        </div>
      </div>
    </div>
  );
};

export default individualProductPage;

export async function getServerSideProps(context) {
  // const res = await fetch('https://.../posts')
  // const posts = await res.json()
  // console.log(context)
  // let {name} = context.params
  // let product = await axios.get('/products/get-all-products/1?publicly_available=Public&_id='+name)

  // console.log(meal.data)

  return {
    props: {
      // product: product.data
    },
    // Next.js will attempt to re-generate the page:
    // - When a request comes in
    // - At most once every second
    // revalidate: 86400, // In seconds
  };
}
