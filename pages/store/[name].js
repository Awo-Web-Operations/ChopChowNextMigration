import { useRouter } from "next/router";
import Head from "next/head";
import Store from "../../src/components/individualPage/Store";
import { meal_container } from "../../src/components/individualPage/meal.module.css";
import Header, { Header2 } from "../../src/components/Header/Header";
import Sidenav from "../../src/components/Header/sidenav";
import SearchIcon from "@mui/icons-material/Search";
import styles from "../../src/components/individualPage/store.module.css";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import WestIcon from "@mui/icons-material/West";
import axios from "../../src/util/Api";
import { useEffect, useState } from "react";
import moment from "moment";

const IndividualStore = () => {
    const [props, setProps] = useState({
        store: {}
    })
    const router = useRouter();
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

    useEffect(() => {

        (async () => {
            try {
                const selectedItemId = localStorage.getItem('storeId');
                let store = await axios.get(`/stores/getstore/${selectedItemId}`);
                console.log(store, 'store')
                setProps({
                    store: store?.data
                })
            } catch (e) {
                console.log(e)
            }

        })()
        // if(props?.store && props?.store?.data && props?.store?.data.stores.length === 0){
        //     window.location.assign('/')
        // }
    }, []);
    console.log(props, 'hello')
    return (
        <div>
            <Head>
                <title>Chop Chow Store</title>
                <meta
                    key="title"
                    name="viewport"
                    content="initial-scale=1.0, width=device-width"
                />
                <meta name="description" content="Chop Chow Store." />
            </Head>
            <Header />
            <Header2 />
            <Sidenav />
            <div className={meal_container}>
                {/* <div className={styles.meal_section_1}>
                    <div className={styles.meal_section_1_col_1}>
                        <GoBack />
                    </div>
                    <div className={styles.meal_section_1_col_2}>
                        <p className={styles.meal_section_1_col_2_p}> Choose type</p>
                        <div className={styles.select_container}>
                            <div className={styles.select_box}>
                            </div>
                        </div>
                    </div>
                </div> */}
                <div
                    style={{
                        background: `url(${props?.store?.data?.supplier.background_picture
                            ? props?.store?.data?.supplier.background_picture
                            : "/assets/store_pics/no-image-store.png"
                            })`,
                        width: "100%",
                        backgroundPosition: "center",
                        backgroundSize: "cover",
                        backgroundRepeat: "no-repeat",
                    }}
                    className={styles.banner_container}
                >
                    {/* <!-- <h1>Book a Consultation</h1> --> */}
                    <div className={styles.banner2container}>
                        <div className={styles.store_section_1}>
                            <div className={styles.store_section_1_col_1}>
                                <ul className={styles.goback_header_pages}>
                                    <div onClick={router.back}>
                                        <WestIcon className={styles.goback_header_page_arrow} />
                                    </div>
                                    <li onClick={router.back}>back</li>
                                </ul>
                            </div>
                        </div>
                        <div className={styles.store_row_1_join_us_form}>
                            <>
                                <div className={styles.select_container}>
                                    <div className={styles.select_box}>
                                        <p>All Categories</p>
                                        <ArrowDropDownIcon className={styles.select_box_icon} />
                                    </div>
                                    {/* <div className={styles.select_options}>
                                            <p>Public</p>
                                            <p>Pending</p>
                                            <p>Rejected</p>
                                        </div> */}
                                </div>
                                <div className={styles.search_box}>
                                    <p className={styles.search_icon}>
                                        <SearchIcon className={styles.search_icon} />
                                    </p>
                                    <input
                                        type="text"
                                        name="search"
                                        // onChange={handleSearch}
                                        // onKeyUp={searchSuggested}
                                        className={styles.search_input}
                                        placeholder="Search Meals, Ingredient and Products"
                                    />
                                </div>
                                <button className={styles.store_row_1_button}>Search</button>
                            </>
                        </div>
                    </div>
                </div>

                {/* <p className={styles.dateCreated} style={{width:'95%', textAlign:'end'}}>Store Created: {props?.store?.data.products[0].createdAt && new Date(props?.store?.data.products[0].createdAt).getDate() + ' ' + months[new Date(props?.store?.data.products[0].createdAt).getMonth()] + ' ,'+ new Date(props?.store?.data.products[0].createdAt).getFullYear()} </p> */}
                <div style={{ width: "95%" }}>
                    <div className={styles.date}>
                        <p>
                            Store Created:
                            <p style={{ marginLeft: ".2rem" }}>
                                {moment(props?.store?.data?.supplier.createdAt).format(
                                    "MMMM Do, YYYY"
                                )}
                            </p>
                        </p>
                    </div>
                    <Store
                        props={props}
                        store={props?.store?.data?.supplier}
                        items={props?.store?.data?.items}
                    />
                </div>
            </div>
        </div>
    );
};

export default IndividualStore;

// export async function getServerSideProps(context) {
//     // const res = await fetch('https://.../posts')
//     // const posts = await res.json()
//     // console.log(context)
//     console.log(context, 'context')
//     let { id = '', name } = context.params;
//     // const selectedItemId = localStorage.getItem('selectedItemId');

//     let store = await axios.get(`/stores/getstore/${id}`);

//     // console.log(meal.data)

//     return {
//         props: {
//             store: store?.data,
//         },
//         // Next.js will attempt to re-generate the page:
//         // - When a request comes in
//         // - At most once every second
//         // revalidate: 86400, // In seconds
//     };
// }

