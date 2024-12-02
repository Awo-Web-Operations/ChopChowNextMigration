import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Head from "next/head";
import styles from "../../src/components/dashboard/dashboard.module.css";
import Header from "../../src/components/Header/Header";
import SideNav from "../../src/components/Header/sidenav";
import {
  BagIcon,
  BatteryIcon,
  CloseFillIcon,
  LineChartIcon,
  ListIcon,
  TagIcon,
  ThumbsUpIcon,
  UsersIcon,
} from "../../src/components/icons";
import Sidenav2 from "../../src/components/Header/sidenav2";
import GoBack from "../../src/components/CommonComponents/goBack";
import { connect, useDispatch, useSelector } from "react-redux";
import { getUser } from "../../src/actions";
import axios from "../../src/util/Api";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement } from "chart.js";
import {
  initializeUserType,
  setSelectedUserType,
  setUserType,
} from "../../src/reducers/userSlice";
ChartJS.register(ArcElement);

const DashboardHomePage = (props) => {
  const router = useRouter();
  const { id } = router.query;

  const [driverMode, setDriverModeState] = useState(false);
  const [page, setPageState] = useState(1);
  const [mealCount, setMealCountState] = useState(0);
  const [pendingMealCount, setPendingMealCountState] = useState(0);
  const [publicMealCount, setPublicMealCountState] = useState(0);
  const [userCount, setUserCountState] = useState(0);
  const [orderCount, setOrderCountState] = useState(0);
  const [productCount, setProductCountState] = useState(0);
  const [pendingProductCount, setPendingProductCountState] = useState(0);
  const [publicProductCount, setPublicProductCountState] = useState(0);
  const [kitchenUtensilCount, setKitchenUtensilCountState] = useState(0);
  const [changeType, setChangeTypeState] = useState(false);
  const [suggestions, setSuggestionsState] = useState([]);
  const [searchType, setSearchType] = useState("Meal");
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
    if (props.auth.authUser !== null) {
      if (props.auth.authUser.user_type === "admin") {
        axios.get("/analytics/get-users-count/").then((res) => {
          setUserCountState(res.data.data?.docCount);
        });
        axios
          .get("/analytics/get-meals-count/?publicly_available=Pending")
          .then((res) => {
            setPendingMealCountState(res.data.data?.docCount);
          });
        axios
          .get("/analytics/get-meals-count/?publicly_available=Public")
          .then((res) => {
            setPublicMealCountState(res.data.data?.docCount);
          });
        axios.get("/analytics/get-orders-count/").then((res) => {
          setOrderCountState(res.data.data?.docCount);
        });
        axios
          .get("/analytics/get-products-count/?publicly_available=Pending")
          .then((res) => {
            setPendingProductCountState(res.data.data?.docCount);
          });
        axios
          .get("/analytics/get-products-count/?publicly_available=Public")
          .then((res) => {
            setPublicProductCountState(res.data.data?.docCount);
          });
      } else if (props.auth.authUser.user_type === "customer") {
        axios.get("/analytics/get-orders-count/").then((res) => {});
        axios
          .get("/analytics/get-meals-count/?user=" + props.auth.authUser._id)
          .then((res) => {
            setMealCountState(res.data.data?.docCount);
          });
        axios.get("/analytics/get-orders-count/").then((res) => {});
      }

      let url;
      if (searchType === "Meal") {
        if (props.auth.authUser.user_type === "admin") {
          url = "/meals/get-meals/1";
        }
      } else if (searchType === "Product") {
        if (props.auth.authUser.user_type === "admin") {
          url = "/products/get-all-products/1";
        }
      } else {
        if (props.auth.authUser.user_type === "admin") {
          url = "/categories/get-all-categories/1";
        }
      }

      if (props.auth.authUser.user_type === "admin") {
        axios.get(url).then((data) => {
          if (data.data.data) {
            if (searchType === "Meal") {
              setSuggestionsState(data.data.data.meals);
            } else if (searchType === "Product") {
              setSuggestionsState(data.data.data.products);
            }
          }
        });
      }
    }
  }, [props.auth]);

  const requestChart = {
    datasets: [
      {
        data: [publicMealCount, publicProductCount, kitchenUtensilCount],
        backgroundColor: ["#F47900", "#04D505", "#F40707"],
        borderWidth: 0,
        cutout: "70%",
      },
    ],
  };

  const userChart = {
    datasets: [
      {
        data: [300, 50, 100],
        backgroundColor: ["#F47900", "#04D505", "#F40707"],
        borderWidth: 0,
        cutout: "70%",
      },
    ],
  };
  const dispatch = useDispatch();

  const reduxState = useSelector((state) => {});

  const selectedUserType = useSelector(
    (state) => state.userType.selectedUserType
  );
  const userTypeArray = useSelector(
    (state) => state?.Auth?.authUser?.user_type
  );
  useEffect(() => {
    if (props.auth.authUser?.user_type) {
      dispatch(setUserType(props.auth.authUser?.user_type));
    }
  }, [props.auth.authUser?.user_type, dispatch]);

  function toggleMode(type) {
    dispatch(setSelectedUserType(type));
    toggleChangeType();
  }

  function handleSearchType(type) {
    setSearchType(type);
    let url;
    if (type === "Meal") {
      if (props.auth.authUser.user_type?.[0] === "admin") {
        url = "/meals/get-meals/1";
      }
    } else if (type === "Product") {
      if (props.auth.authUser.user_type?.[0] === "admin") {
        url = "/products/get-all-products/1";
      }
    } else {
      if (props.auth.authUser.user_type?.[0] === "admin") {
        url = "/categories/get-all-categories/1";
      }
    }
    axios.get(url).then((data) => {
      if (data.data.data) {
        if (type === "Meal") {
          setSuggestionsState(data.data.data.meals);
        } else if (type === "Product") {
          setSuggestionsState(data.data.data.products);
        } else {
          setSuggestionsState(data.data.data.categories);
        }
      }
    });
  }

  function toggleChangeType() {
    setChangeTypeState(!changeType);
  }
  return (
    <div
      className={
        styles.container +
        " " +
        (props.auth.authUser && props.auth.authUser.user_type === "admin"
          ? styles.col3
          : styles.col2)
      }
    >
      <Head>
        <title>Chop Chow Dashboard</title>
        <meta
          key="title"
          name="viewport"
          content="initial-scale=1.0, width=device-width"
        />
        <meta
          name="description"
          content="View your suggested meals 
                and grocery list on your Chop Chow dashboard"
        />
      </Head>
      <Header />
      <SideNav />
      <div className={styles.left}>
        <Sidenav2 showBottom={false} />
      </div>
      <div className={styles.empty}></div>
      <div className={styles.center}>
        {props.auth.authUser &&
          props.auth.authUser.user_type === "driver" &&
          (props.auth.authUser.driver_hours.length < 1 ||
            (props.auth.authUser.driver_car_plate_number &&
              props.auth.authUser.driver_car_plate_number.length > 0) ||
            (props.auth.authUser.driver_car_picture &&
              props.auth.authUser.driver_car_picture.length > 0) ||
            (props.auth.authUser.driver_car_model &&
              props.auth.authUser.driver_car_model.length > 0)) && (
            <div className="alert-warning">
              Provide required data as a driver
            </div>
          )}
        <div className={styles.header2}>
          <div className={styles.header2_col_1}>
            <GoBack />
          </div>
          {/* {props.auth.authUser && props.auth.authUser.user_type !== 'admin' && props.auth.authUser.user_type !== 'driver' && 
                <div className={styles.header2_col_2}>
                    <div className={styles.mode_con}>
                        <div onClick={() => toggleMode(props.auth.authUser.user_type)} className={styles.mode + ' ' + styles.left_mode + ' '+(driverMode? '': styles.active_mode)}>{props.auth.authUser.user_type} mode</div>
                        <div onClick={() => toggleMode('driver')} className={styles.mode + ' ' + styles.right_mode + ' '+(driverMode? styles.active_mode : '')}>Driver mode</div>
                    </div>
                </div>} */}
        </div>
        {props.auth.authUser && (
          <>
            <div className={styles.dashboard_header}>
              <h3>
                Hello {props.auth.authUser.username}
                {props.auth.authUser.super_app_admin && (
                  <span>(Super Admin)</span>
                )}
              </h3>

              <div className={styles.select_container}>
                <div onClick={toggleChangeType} className={styles.select_box}>
                  <p>{selectedUserType || userTypeArray[0]}</p>
                  <ArrowDropDownIcon className={styles.select_box_icon} />
                </div>
                {changeType && (
                  <div className={styles.select_options2}>
                    {props.auth.authUser.super_app_admin && (
                      <p onClick={() => toggleMode("admin")}>Admin</p>
                    )}
                    <p onClick={() => toggleMode("customer")}>Customer</p>
                    {props.auth.authUser.user_type.includes("supplier") && (
                      <p onClick={() => toggleMode("supplier")}>Supplier</p>
                    )}
                    <p onClick={() => toggleMode("driver")}>Driver</p>
                  </div>
                )}
              </div>
            </div>
            <div className={styles.overview_con}>
              <h3>Overview</h3>
              <div className={styles.overview}>
                <div className={styles.box2}>
                  <div className={styles.box_purpose2}>
                    <div></div>
                    <p className={styles.box_duration}>Today</p>
                  </div>
                  <div className={styles.value_con}>
                    <div className={styles.value_con2 + " " + styles.red}>
                      {(props.auth.authUser.user_type?.[0] === "customer" ||
                        props.auth.authUser.user_type?.[0] === "driver") && (
                        <TagIcon />
                      )}
                      {props.auth.authUser.user_type?.[0] === "admin" && (
                        <BatteryIcon />
                      )}
                      {props.auth.authUser.user_type?.[0] === "supplier" && (
                        <LineChartIcon />
                      )}
                    </div>
                    <div>
                      <h3 className={styles.box_name}>
                        {props.auth.authUser.user_type?.[0] === "customer" &&
                          "Completed Order"}
                        {props.auth.authUser.user_type?.[0] === "admin" &&
                          "Requests"}
                        {props.auth.authUser.user_type?.[0] === "supplier" &&
                          "Total Sales"}
                        {props.auth.authUser.user_type?.[0] === "driver" &&
                          "Total Revenue"}
                      </h3>
                      <p className={styles.value}>
                        {props.auth.authUser.user_type === "customer" &&
                          orderCount}
                        {props.auth.authUser.user_type === "driver" && "$0"}
                        {props.auth.authUser.user_type === "supplier" && "$0"}
                        {props.auth.authUser.user_type === "admin" &&
                          pendingMealCount +
                            pendingProductCount +
                            kitchenUtensilCount}
                      </p>
                    </div>
                  </div>
                </div>
                <div className={styles.box2}>
                  <div className={styles.box_purpose2}>
                    <div></div>
                    {(props.auth.authUser.user_type === "driver" ||
                      props.auth.authUser.user_type === "admin") && (
                      <p className={styles.box_duration}>Monthly</p>
                    )}
                  </div>
                  <div className={styles.value_con}>
                    <div className={styles.value_con2 + " " + styles.orange}>
                      {(props.auth.authUser.user_type === "customer" ||
                        props.auth.authUser.user_type === "supplier") && (
                        <BagIcon />
                      )}
                      {props.auth.authUser.user_type === "admin" && <TagIcon />}
                      {props.auth.authUser.user_type === "driver" && (
                        <ThumbsUpIcon />
                      )}
                    </div>
                    <div>
                      <h3 className={styles.box_name}>
                        {props.auth.authUser.user_type === "customer" &&
                          "Total Suggestion"}
                        {props.auth.authUser.user_type === "driver" &&
                          "Total Order Fulfilled"}
                        {props.auth.authUser.user_type === "supplier" &&
                          "Total Inventory Products"}
                        {props.auth.authUser.user_type === "admin" &&
                          "Total Users"}
                      </h3>
                      <p className={styles.value}>
                        {props.auth.authUser.user_type === "customer" &&
                          mealCount}
                        {props.auth.authUser.user_type === "driver" &&
                          orderCount}
                        {props.auth.authUser.user_type === "supplier" &&
                          orderCount}
                        {props.auth.authUser.user_type === "admin" && userCount}
                      </p>
                    </div>
                  </div>
                </div>
                <div className={styles.box2}>
                  <div className={styles.box_purpose2}>
                    <div></div>
                    {props.auth.authUser.user_type === "admin" && (
                      <p className={styles.box_duration}>Weekly</p>
                    )}
                  </div>
                  <div className={styles.value_con}>
                    <div className={styles.value_con2 + " " + styles.green}>
                      {props.auth.authUser.user_type === "admin" ? (
                        <UsersIcon />
                      ) : (
                        <ListIcon />
                      )}
                    </div>
                    <div>
                      <h3 className={styles.box_name}>
                        {props.auth.authUser.user_type === "admin"
                          ? "Total Orders"
                          : "Orders in queue"}
                      </h3>
                      <p className={styles.value}>
                        {props.auth.authUser.user_type === "customer" &&
                          orderCount}
                        {props.auth.authUser.user_type === "driver" &&
                          orderCount}
                        {props.auth.authUser.user_type === "supplier" &&
                          orderCount}
                        {props.auth.authUser.user_type === "admin" &&
                          orderCount}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            {props.auth.authUser.user_type === "admin" && (
              <div className={styles.chart_con}>
                <div className={styles.chart_col}>
                  <h3>Categories</h3>
                  <div className={styles.chart}>
                    <div className={styles.chart_circle}>
                      <Doughnut data={requestChart} width={400} height={400} />

                      <div className={styles.chart_circle_total}>
                        <p>Total</p>
                        <h3>
                          {publicMealCount +
                            publicProductCount +
                            kitchenUtensilCount}
                        </h3>
                      </div>
                    </div>
                    <div className={styles.chart_breakdown_con}>
                      <div className={styles.chart_breakdown}>
                        <div
                          className={styles.chart_breakdown_bullet}
                          style={{ background: "#F47900" }}
                        ></div>
                        <div className={styles.chart_breakdown_details}>
                          <p>Meal</p>
                          <div>
                            {publicMealCount > 0 ? (
                              <h5>
                                {Math.round(
                                  (publicMealCount /
                                    (publicProductCount +
                                      kitchenUtensilCount +
                                      publicMealCount)) *
                                    100
                                )}
                                %
                              </h5>
                            ) : (
                              <h5>0%</h5>
                            )}
                            <h5>{publicMealCount}</h5>
                          </div>
                        </div>
                      </div>
                      <div className={styles.chart_breakdown}>
                        <div
                          className={styles.chart_breakdown_bullet}
                          style={{ background: "#04D505" }}
                        ></div>
                        <div className={styles.chart_breakdown_details}>
                          <p>Product</p>
                          <div>
                            {publicProductCount > 0 ? (
                              <h5>
                                {Math.round(
                                  (publicProductCount /
                                    (publicProductCount +
                                      kitchenUtensilCount +
                                      publicMealCount)) *
                                    100
                                )}
                                %
                              </h5>
                            ) : (
                              <h5>0%</h5>
                            )}
                            <h5>{publicProductCount}</h5>
                          </div>
                        </div>
                      </div>
                      <div className={styles.chart_breakdown}>
                        <div
                          className={styles.chart_breakdown_bullet}
                          style={{ background: "#CF0000" }}
                        ></div>
                        <div className={styles.chart_breakdown_details}>
                          <p>Kitchen Utensils</p>
                          <div>
                            {kitchenUtensilCount > 0 ? (
                              <h5>
                                {Math.round(
                                  (kitchenUtensilCount /
                                    (publicProductCount +
                                      kitchenUtensilCount +
                                      publicMealCount)) *
                                    100
                                )}
                                %
                              </h5>
                            ) : (
                              <h5>0%</h5>
                            )}
                            <h5>{kitchenUtensilCount}</h5>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className={styles.chart_col}>
                  <h3>User Stats</h3>
                  <div className={styles.chart}>
                    <div className={styles.chart_circle}>
                      <Doughnut data={userChart} width={400} height={400} />

                      <div className={styles.chart_circle_total}>
                        <p>Total</p>
                        <h3>2142</h3>
                      </div>
                    </div>
                    <div className={styles.chart_breakdown_con}>
                      <div className={styles.chart_breakdown}>
                        <div
                          className={styles.chart_breakdown_bullet}
                          style={{ background: "#F47900" }}
                        ></div>
                        <div className={styles.chart_breakdown_details}>
                          <p>Meal</p>
                          <div>
                            <h5>40%</h5>
                            <h5>1965</h5>
                          </div>
                        </div>
                      </div>
                      <div className={styles.chart_breakdown}>
                        <div
                          className={styles.chart_breakdown_bullet}
                          style={{ background: "#04D505" }}
                        ></div>
                        <div className={styles.chart_breakdown_details}>
                          <p>Product</p>
                          <div>
                            <h5>35%</h5>
                            <h5>1877</h5>
                          </div>
                        </div>
                      </div>
                      <div className={styles.chart_breakdown}>
                        <div
                          className={styles.chart_breakdown_bullet}
                          style={{ background: "#CF0000" }}
                        ></div>
                        <div className={styles.chart_breakdown_details}>
                          <p>Kitchen Utensils</p>
                          <div>
                            <h5>25%</h5>
                            <h5>544</h5>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
            <div className={styles.dashboard_container}>
              <h3>
                {(props.auth.authUser.user_type === "customer" ||
                  props.auth.authUser.user_type === "supplier") &&
                  "Recent Order"}
                {props.auth.authUser.user_type === "admin" && "Requests"}
                {props.auth.authUser.user_type === "driver" && "Recent Request"}
              </h3>
              <div className={styles.dashboard}>
                {props.auth.authUser.user_type === "admin" && (
                  <>
                    <div className={styles.mode_con2}>
                      <div
                        onClick={() => handleSearchType("Meal")}
                        className={
                          styles.mode2 +
                          " " +
                          styles.left_mode2 +
                          " " +
                          (searchType === "Meal" ? styles.active_mode2 : "")
                        }
                      >
                        Meal
                      </div>
                      <div
                        onClick={() => handleSearchType("Product")}
                        className={
                          styles.mode2 +
                          " " +
                          " " +
                          (searchType === "Product" ? styles.active_mode2 : "")
                        }
                      >
                        Product
                      </div>
                      <div
                        onClick={() => handleSearchType("Category")}
                        className={
                          styles.mode2 +
                          " " +
                          styles.right_mode2 +
                          " " +
                          (searchType === "Category" ? styles.active_mode2 : "")
                        }
                      >
                        Category
                      </div>
                    </div>
                    <table className={styles.request_table}>
                      <thead>
                        <tr
                          className={styles.request_tr}
                          style={{ backgroundColor: "transparent" }}
                        >
                          <th className={styles.request_th}>Request ID</th>
                          <th className={styles.request_th}>{searchType}</th>
                          <th
                            className={
                              styles.request_th + " " + styles.hideData
                            }
                          >
                            Category
                          </th>
                          <th
                            className={styles.request_th}
                            style={{ textAlign: "center" }}
                          >
                            Status
                          </th>
                          {/* <th className={styles.request_th + " " + styles.hideData}>Price</th> */}
                          <th
                            className={
                              styles.request_th + " " + styles.hideData
                            }
                          >
                            Date
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {suggestions.map((suggestion) => {
                          return (
                            <tr
                              key={suggestion._id}
                              className={styles.refId + " " + styles.request_tr}
                            >
                              <td className={styles.request_td}>
                                {suggestion._id}
                              </td>
                              <td className={styles.request_td}>
                                {searchType === "Meal"
                                  ? suggestion.meal_name
                                  : searchType === "Product"
                                  ? suggestion.product_name
                                  : suggestion.category_name}
                              </td>
                              <td
                                className={
                                  styles.request_td + " " + styles.hideData
                                }
                              >
                                {/* {searchType === 'Meal' ? 
                                                    suggestion.meal_categories && suggestion.meal_categories.length > 0 && JSON.parse(suggestion.meal_categories[0])[0] :
                                                    searchType === 'Product' ?
                                                    suggestion.product_categories && suggestion.product_categories.length > 0 && suggestion.product_categories[0] :
                                                    suggestion.product_categories && suggestion.product_categories.length > 0 && suggestion.product_categories[0]
                                                    } */}
                              </td>
                              <td
                                className={
                                  styles.request_td +
                                  " " +
                                  styles.status +
                                  " " +
                                  (suggestion.status === "Draft" ||
                                  suggestion.status === "Pending"
                                    ? styles.pending
                                    : suggestion.status === "Public"
                                    ? styles.approve
                                    : suggestion.status === "Rejected"
                                    ? styles.rejected
                                    : "")
                                }
                              >
                                {searchType === "Category"
                                  ? suggestion.publicly_available
                                  : suggestion.status}
                              </td>
                              {/* <td className={styles.request_td + " " + styles.hideData}>afa</td> */}
                              <td
                                className={
                                  styles.request_td + " " + styles.hideData
                                }
                              >
                                {suggestion.createdAt &&
                                  new Date(suggestion.createdAt).getDate() +
                                    " " +
                                    months[
                                      new Date(suggestion.createdAt).getMonth()
                                    ] +
                                    " ," +
                                    new Date(
                                      suggestion.createdAt
                                    ).getFullYear()}
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </>
                )}
                {props.auth.authUser.user_type === "customer" && (
                  <table className={styles.request_table}>
                    <thead>
                      <tr
                        className={styles.request_tr}
                        style={{ backgroundColor: "transparent" }}
                      >
                        <th className={styles.request_th}>Order Number</th>
                        <th className={styles.request_th}>Supplier</th>
                        <th
                          className={styles.request_th}
                          style={{ textAlign: "center" }}
                        >
                          Status
                        </th>
                        <th
                          className={styles.request_th + " " + styles.hideData}
                        >
                          Type
                        </th>
                        <th
                          className={styles.request_th + " " + styles.hideData}
                        >
                          Price
                        </th>
                        <th
                          className={styles.request_th + " " + styles.hideData}
                        >
                          Date
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className={styles.refId + " " + styles.request_tr}>
                        <td className={styles.request_td}>dfdsf</td>
                        <td className={styles.request_td}>asf</td>
                        <td
                          className={
                            styles.request_td +
                            " " +
                            styles.status +
                            " " +
                            styles.rejected
                          }
                          style={{ textAlign: "center" }}
                        >
                          saf
                        </td>
                        <td
                          className={styles.request_td + " " + styles.hideData}
                        >
                          safa
                        </td>
                        <td
                          className={styles.request_td + " " + styles.hideData}
                        >
                          afa
                        </td>
                        <td
                          className={styles.request_td + " " + styles.hideData}
                        >
                          afa
                        </td>
                      </tr>

                      <tr className={styles.refId + " " + styles.request_tr}>
                        <td className={styles.request_td}>dfdsf</td>
                        <td className={styles.request_td}>asf</td>
                        <td
                          className={
                            styles.request_td +
                            " " +
                            styles.status +
                            " " +
                            styles.pending
                          }
                          style={{ textAlign: "center" }}
                        >
                          saf
                        </td>
                        <td
                          className={styles.request_td + " " + styles.hideData}
                        >
                          safa
                        </td>
                        <td
                          className={styles.request_td + " " + styles.hideData}
                        >
                          afa
                        </td>
                        <td
                          className={styles.request_td + " " + styles.hideData}
                        >
                          afa
                        </td>
                      </tr>
                    </tbody>
                  </table>
                )}

                {props.auth.authUser.user_type === "supplier" && (
                  <table className={styles.request_table}>
                    <thead>
                      <tr
                        className={styles.request_tr}
                        style={{ backgroundColor: "transparent" }}
                      >
                        <th className={styles.request_th}>Order Number</th>
                        <th className={styles.request_th}>Customer</th>
                        <th
                          className={styles.request_th}
                          style={{ textAlign: "center" }}
                        >
                          Status
                        </th>
                        <th
                          className={styles.request_th + " " + styles.hideData}
                        >
                          Type
                        </th>
                        <th
                          className={styles.request_th + " " + styles.hideData}
                        >
                          Price
                        </th>
                        <th
                          className={styles.request_th + " " + styles.hideData}
                        >
                          Date
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className={styles.refId + " " + styles.request_tr}>
                        <td className={styles.request_td}>dfdsf</td>
                        <td className={styles.request_td}>asf</td>
                        <td
                          className={
                            styles.request_td +
                            " " +
                            styles.status +
                            " " +
                            styles.rejected
                          }
                          style={{ textAlign: "center" }}
                        >
                          saf
                        </td>
                        <td
                          className={styles.request_td + " " + styles.hideData}
                        >
                          safa
                        </td>
                        <td
                          className={styles.request_td + " " + styles.hideData}
                        >
                          afa
                        </td>
                        <td
                          className={styles.request_td + " " + styles.hideData}
                        >
                          afa
                        </td>
                      </tr>

                      <tr className={styles.refId + " " + styles.request_tr}>
                        <td className={styles.request_td}>dfdsf</td>
                        <td className={styles.request_td}>asf</td>
                        <td
                          className={
                            styles.request_td +
                            " " +
                            styles.status +
                            " " +
                            styles.pending
                          }
                          style={{ textAlign: "center" }}
                        >
                          saf
                        </td>
                        <td
                          className={styles.request_td + " " + styles.hideData}
                        >
                          safa
                        </td>
                        <td
                          className={styles.request_td + " " + styles.hideData}
                        >
                          afa
                        </td>
                        <td
                          className={styles.request_td + " " + styles.hideData}
                        >
                          afa
                        </td>
                      </tr>
                    </tbody>
                  </table>
                )}

                {props.auth.authUser.user_type === "driver" && (
                  <div className={styles.order_groups}>
                    <div
                      className={styles.orders_head}
                      style={{ backgroundColor: "transparent" }}
                    >
                      <div className={styles.orders_th}>Order Groups</div>
                      <div className={styles.orders_th}>Pickup Location</div>
                      <div className={styles.orders_th}>Delivery Location</div>
                      <div className={styles.orders_th}>Total</div>
                      <div className={styles.orders_th}>Pending</div>
                      <div className={styles.orders_th}>Picked</div>
                      <div className={styles.orders_th}>Fulfilled</div>
                    </div>
                    <div className={styles.orders_body}>
                      <table className={styles.orders_table}>
                        <tbody>
                          <tr className={styles.refId + " " + styles.orders_tr}>
                            <td
                              style={{ color: "#000000" }}
                              className={styles.orders_td}
                            >
                              dfdsf
                            </td>
                            <td
                              style={{ color: "#000000" }}
                              className={styles.orders_td}
                            >
                              asf
                            </td>
                            <td
                              style={{ color: "#000000" }}
                              className={styles.orders_td}
                            >
                              safa
                            </td>
                            <td className={styles.orders_td}>saf</td>
                            <td className={styles.orders_td}>afa</td>
                            <td className={styles.orders_td}>afa</td>
                            <td className={styles.orders_td}>afa</td>
                          </tr>

                          <tr className={styles.refId + " " + styles.orders_tr}>
                            <td
                              style={{ color: "#000000" }}
                              className={styles.orders_td}
                            >
                              dfdsf
                            </td>
                            <td
                              style={{ color: "#000000" }}
                              className={styles.orders_td}
                            >
                              asf
                            </td>
                            <td
                              style={{ color: "#000000" }}
                              className={styles.orders_td}
                            >
                              safa
                            </td>
                            <td
                              className={styles.orders_td}
                              style={{ textAlign: "center" }}
                            >
                              saf
                            </td>
                            <td className={styles.orders_td}>afa</td>
                            <td className={styles.orders_td}>afa</td>
                            <td className={styles.orders_td}>afa</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
              </div>
            </div>
            {props.auth.authUser.user_type === "admin" && (
              <>
                <div className={styles.show}>
                  <div
                    className={styles.dashboard_container}
                    style={{ padding: "0 10px" }}
                  >
                    <h3>Order Groups</h3>
                    <div className={styles.order_groups}>
                      <div
                        className={styles.orders_head}
                        style={{ backgroundColor: "transparent" }}
                      >
                        <div className={styles.orders_th}>Order Groups</div>
                        <div className={styles.orders_th}>Pickup Location</div>
                        <div className={styles.orders_th}>
                          Delivery Location
                        </div>
                        <div className={styles.orders_th}>Total</div>
                        <div className={styles.orders_th}>Pending</div>
                        <div className={styles.orders_th}>Picked</div>
                        <div className={styles.orders_th}>Fulfilled</div>
                      </div>
                      <div className={styles.orders_body}>
                        <table className={styles.orders_table}>
                          <tbody>
                            <tr
                              className={styles.refId + " " + styles.orders_tr}
                            >
                              <td
                                style={{ color: "#000000" }}
                                className={styles.orders_td}
                              >
                                dfdsf
                              </td>
                              <td
                                style={{ color: "#000000" }}
                                className={styles.orders_td}
                              >
                                asf
                              </td>
                              <td
                                style={{ color: "#000000" }}
                                className={styles.orders_td}
                              >
                                safa
                              </td>
                              <td className={styles.orders_td}>saf</td>
                              <td className={styles.orders_td}>afa</td>
                              <td className={styles.orders_td}>afa</td>
                              <td className={styles.orders_td}>afa</td>
                            </tr>

                            <tr
                              className={styles.refId + " " + styles.orders_tr}
                            >
                              <td
                                style={{ color: "#000000" }}
                                className={styles.orders_td}
                              >
                                dfdsf
                              </td>
                              <td
                                style={{ color: "#000000" }}
                                className={styles.orders_td}
                              >
                                asf
                              </td>
                              <td
                                style={{ color: "#000000" }}
                                className={styles.orders_td}
                              >
                                safa
                              </td>
                              <td
                                className={styles.orders_td}
                                style={{ textAlign: "center" }}
                              >
                                saf
                              </td>
                              <td className={styles.orders_td}>afa</td>
                              <td className={styles.orders_td}>afa</td>
                              <td className={styles.orders_td}>afa</td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                </div>
                <div className={styles.chart_con2}>
                  <div className={styles.chart_col}>
                    <h3>Categories</h3>
                    <div className={styles.chart}>
                      <div className={styles.chart_circle}>
                        <Doughnut
                          data={requestChart}
                          width={400}
                          height={400}
                        />

                        <div className={styles.chart_circle_total}>
                          <p>Total</p>
                          <h3>
                            {publicMealCount +
                              publicProductCount +
                              kitchenUtensilCount}
                          </h3>
                        </div>
                      </div>
                      <div className={styles.chart_breakdown_con}>
                        <div className={styles.chart_breakdown}>
                          <div
                            className={styles.chart_breakdown_bullet}
                            style={{ background: "#F47900" }}
                          ></div>
                          <div className={styles.chart_breakdown_details}>
                            <p>Meal</p>
                            <div>
                              {publicMealCount > 0 ? (
                                <h5>
                                  {Math.round(
                                    (publicMealCount /
                                      (publicProductCount +
                                        kitchenUtensilCount +
                                        publicMealCount)) *
                                      100
                                  )}
                                  %
                                </h5>
                              ) : (
                                <h5>0%</h5>
                              )}
                              <h5>{publicMealCount}</h5>
                            </div>
                          </div>
                        </div>
                        <div className={styles.chart_breakdown}>
                          <div
                            className={styles.chart_breakdown_bullet}
                            style={{ background: "#04D505" }}
                          ></div>
                          <div className={styles.chart_breakdown_details}>
                            <p>Product</p>
                            <div>
                              {publicProductCount > 0 ? (
                                <h5>
                                  {Math.round(
                                    (publicProductCount /
                                      (publicProductCount +
                                        kitchenUtensilCount +
                                        publicMealCount)) *
                                      100
                                  )}
                                  %
                                </h5>
                              ) : (
                                <h5>0%</h5>
                              )}
                              <h5>{publicProductCount}</h5>
                            </div>
                          </div>
                        </div>
                        <div className={styles.chart_breakdown}>
                          <div
                            className={styles.chart_breakdown_bullet}
                            style={{ background: "#CF0000" }}
                          ></div>
                          <div className={styles.chart_breakdown_details}>
                            <p>Kitchen Utensils</p>
                            <div>
                              {kitchenUtensilCount > 0 ? (
                                <h5>
                                  {Math.round(
                                    (kitchenUtensilCount /
                                      (publicProductCount +
                                        kitchenUtensilCount +
                                        publicMealCount)) *
                                      100
                                  )}
                                  %
                                </h5>
                              ) : (
                                <h5>0%</h5>
                              )}
                              <h5>{kitchenUtensilCount}</h5>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className={styles.chart_col}>
                    <h3>User Stats</h3>
                    <div className={styles.chart}>
                      <div className={styles.chart_circle}>
                        <Doughnut data={userChart} width={400} height={400} />

                        <div className={styles.chart_circle_total}>
                          <p>Total</p>
                          <h3>2142</h3>
                        </div>
                      </div>
                      <div className={styles.chart_breakdown_con}>
                        <div className={styles.chart_breakdown}>
                          <div
                            className={styles.chart_breakdown_bullet}
                            style={{ background: "#F47900" }}
                          ></div>
                          <div className={styles.chart_breakdown_details}>
                            <p>Meal</p>
                            <div>
                              <h5>40%</h5>
                              <h5>1965</h5>
                            </div>
                          </div>
                        </div>
                        <div className={styles.chart_breakdown}>
                          <div
                            className={styles.chart_breakdown_bullet}
                            style={{ background: "#04D505" }}
                          ></div>
                          <div className={styles.chart_breakdown_details}>
                            <p>Product</p>
                            <div>
                              <h5>35%</h5>
                              <h5>1877</h5>
                            </div>
                          </div>
                        </div>
                        <div className={styles.chart_breakdown}>
                          <div
                            className={styles.chart_breakdown_bullet}
                            style={{ background: "#CF0000" }}
                          ></div>
                          <div className={styles.chart_breakdown_details}>
                            <p>Kitchen Utensils</p>
                            <div>
                              <h5>25%</h5>
                              <h5>544</h5>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </>
            )}
          </>
        )}
      </div>
      {props.auth.authUser && props.auth.authUser.user_type === "admin" && (
        <>
          <div className={styles.right}>
            <div
              className={styles.dashboard_container}
              style={{ padding: "0 10px" }}
            >
              <h3>Order Groups</h3>
              <div className={styles.order_groups}>
                <div
                  className={styles.orders_head}
                  style={{ backgroundColor: "transparent" }}
                >
                  <div className={styles.orders_th}>Order Groups</div>
                  <div className={styles.orders_th}>Pickup Location</div>
                  <div className={styles.orders_th}>Delivery Location</div>
                  <div className={styles.orders_th}>Total</div>
                  <div className={styles.orders_th}>Pending</div>
                  <div className={styles.orders_th}>Picked</div>
                  <div className={styles.orders_th}>Fulfilled</div>
                </div>
                <div className={styles.orders_body}>
                  <table className={styles.orders_table}>
                    <tbody>
                      <tr className={styles.refId + " " + styles.orders_tr}>
                        <td
                          style={{ color: "#000000" }}
                          className={styles.orders_td}
                        >
                          dfdsf
                        </td>
                        <td
                          style={{ color: "#000000" }}
                          className={styles.orders_td}
                        >
                          asf
                        </td>
                        <td
                          style={{ color: "#000000" }}
                          className={styles.orders_td}
                        >
                          safa
                        </td>
                        <td className={styles.orders_td}>saf</td>
                        <td className={styles.orders_td}>afa</td>
                        <td className={styles.orders_td}>afa</td>
                        <td className={styles.orders_td}>afa</td>
                      </tr>

                      <tr className={styles.refId + " " + styles.orders_tr}>
                        <td
                          style={{ color: "#000000" }}
                          className={styles.orders_td}
                        >
                          dfdsf
                        </td>
                        <td
                          style={{ color: "#000000" }}
                          className={styles.orders_td}
                        >
                          asf
                        </td>
                        <td
                          style={{ color: "#000000" }}
                          className={styles.orders_td}
                        >
                          safa
                        </td>
                        <td
                          className={styles.orders_td}
                          style={{ textAlign: "center" }}
                        >
                          saf
                        </td>
                        <td className={styles.orders_td}>afa</td>
                        <td className={styles.orders_td}>afa</td>
                        <td className={styles.orders_td}>afa</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
          <div className={styles.empty}></div>
        </>
      )}
    </div>
  );
};

function mapDispatchToProps(dispatch) {
  return {
    getUser: (id) => dispatch(getUser(id)),
  };
}

function mapStateToProp(state) {
  return {
    auth: state.Auth,
  };
}

export default connect(mapStateToProp, mapDispatchToProps)(DashboardHomePage);
