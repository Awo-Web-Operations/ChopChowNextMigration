import { useRouter } from "next/router";
import Head from "next/head";
import Sidenav2 from "../../src/components/Header/sidenav2";
import Header from "../../src/components/Header/Header";
import SideNav from "../../src/components/Header/sidenav";
import styles from "../../src/components/dashboard/management.module.css";
import profileStyles from "../../src/components/dashboard/profile.module.css";
import { Button, TextField } from "@mui/material";
import {
  container,
  col2,
  left,
  empty,
  center,
} from "../../src/components/dashboard/dashboard.module.css";
import { useState, useEffect, useCallback, useRef } from "react";
import axios from "../../src/util/Api";
import { GoTriangleUp } from "react-icons/go";
import { useMediaQuery } from "../../src/hooks/usemediaquery";
import { IoIosCloseCircle } from "react-icons/io";
import { BsFillCreditCard2BackFill } from "react-icons/bs";
import { FaPhoneAlt } from "react-icons/fa";
import Image from "next/image";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { TimePicker } from "@mui/x-date-pickers/TimePicker";
import { styled } from "@mui/material/styles";
import Switch from "@mui/material/Switch";
import GooglePlacesAutocomplete from "../../src/components/dashboard/googleplacesautocomplete";
import { toast } from "react-toastify";
import moment from "moment";
import { ModalPopup } from "../../src/components/modal/modal";
import { FormModal } from "../../src/components/modal/form-modal";
import { SuccessModal } from "../../src/components/suggest-store/success-modal";
import { getAllISOCodes } from "iso-country-currency";
import { SubAdmins } from "../../src/components/management";

const List = [
  {
    name: "Store Info",
    id: 1,
  },
  {
    name: "Meals/Products",
    id: 2,
  },
  {
    name: "Payment method",
    id: 3,
  },
  {
    name: "Set Hours",
    id: 4,
  },
  {
    name: "Sub Admins",
    id: 5,
  },
  {
    name: "Drivers",
    id: 6,
  },
];
const AntSwitch = styled(Switch)(({ theme }) => ({
  width: 58,
  height: 27,
  padding: 0,
  borderRadius: 15,
  display: "flex",
  "&:active": {
    "& .MuiSwitch-thumb": {
      width: 15,
    },
    "& .MuiSwitch-switchBase.Mui-checked": {
      transform: "translateX(9px)",
    },
  },
  "& .MuiSwitch-switchBase": {
    padding: 2,
    "&.Mui-checked": {
      transform: "translateX(28px)",
      color: "#fff",
      "& + .MuiSwitch-track": {
        opacity: 1,
        backgroundColor: "#ffffff",
      },
      "& > .MuiSwitch-thumb": {
        backgroundColor: theme.palette.mode === "dark" ? "#949494" : "#04D505",
      },
    },
  },
  "& .MuiSwitch-thumb": {
    boxShadow: "0 2px 4px 0 rgb(0 35 11 / 20%)",
    width: 26.22,
    height: 23,
    borderRadius: 11,
    backgroundColor: theme.palette.mode === "dark" ? "#04D505" : "#949494",
    transition: theme.transitions.create(["width"], {
      duration: 200,
    }),
  },
  "& .MuiSwitch-track": {
    width: 58,
    height: 27,
    borderRadius: 16 / 2,
    opacity: 1,
    backgroundColor: "#ffffff",
    boxSizing: "border-box",
  },
}));
const Management = () => {
  const router = useRouter();
  const { id, storeId } = router.query;
  const [active, setActive] = useState(1);
  const [user, setUser] = useState({});
  const [showCategory, setShowCategory] = useState(false);
  const ref = useRef();
  const [value, setValue] = useState("");
  const [filteredItems, setFilteredItems] = useState([]);
  const [storeData, setStoreData] = useState(null);
  const [show, setShow] = useState(false);
  const [items, setItems] = useState([]);
  const [store, setStore] = useState([]);
  const [oneStore, setOneStore] = useState("");
  const [open, setOpen] = useState(false);
  const [openSuccessModal, setOpenSuccessModal] = useState(false);
  const [userInventory, setUserInventory] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const matches = useMediaQuery("(min-width: 700px)");
  const days = [
    "sunday",
    "monday",
    "tuesday",
    "wednesday",
    "thursday",
    "friday",
    "saturday",
  ];
  const [times, setTimes] = useState({
    sunday: {
      from: "2018-01-01T00:00:00.000Z",
      to: "2018-01-01T00:00:00.000Z",
      open: true,
    },
    monday: {
      from: "2018-01-01T00:00:00.000Z",
      to: "2018-01-01T00:00:00.000Z",
      open: true,
    },
    tuesday: {
      from: "2018-01-01T00:00:00.000Z",
      to: "2018-01-01T00:00:00.000Z",
      open: true,
    },
    wednesday: {
      from: "2018-01-01T00:00:00.000Z",
      to: "2018-01-01T00:00:00.000Z",
      open: true,
    },
    thursday: {
      from: "2018-01-01T00:00:00.000Z",
      to: "2018-01-01T00:00:00.000Z",
      open: true,
    },
    friday: {
      from: "2018-01-01T00:00:00.000Z",
      to: "2018-01-01T00:00:00.000Z",
      open: true,
    },
    saturday: {
      from: "2018-01-01T00:00:00.000Z",
      to: "2018-01-01T00:00:00.000Z",
      open: true,
    },
  });
  function handleTime(time, day, when) {
    // times[day][when] = time;
    setTimes({ ...times, [day]: { ...times[day], [when]: time } });
  }

  const filteredItem = () => {
    if (storeId)
      return userInventory?.filter((elem) => elem.item_type === "Meal");
  };

  const filteredProduct = () => {
    return userInventory?.filter((elem) => elem.item_type === "Product");
  };

  const filteredUtensils = () => {
    return userInventory?.filter((elem) => elem.item_type === "Utensils");
  };
  const [filteredMeals, setFilteredMeals] = useState(filteredItem());
  const [filteredProducts, setFilteredProducts] = useState(filteredProduct());

  useEffect(() => {
    setFilteredMeals(filteredItem());
    setFilteredProducts(filteredProduct());
  }, []);

  function handleDayAvailabiltyChange(value, day, when) {
    setTimes({ ...times, [day]: { ...times[day], [when]: value } });
  }
  const handleSearch = () => {
    const filteredMeals = value
      ? filteredItem().filter((meal) =>
        meal.label.toLowerCase().includes(value.toLowerCase())
      )
      : filteredItem();

    const filteredProducts = value
      ? filteredProduct().filter((product) =>
        product.label.toLowerCase().includes(value.toLowerCase())
      )
      : filteredProduct();

    setFilteredMeals(filteredMeals);
    setFilteredProducts(filteredProducts);
  };

  const [formState, setFormState] = useState({
    store_name: "",
    email: "",
    phone: "",
    intro: "",
    profile_picture: {},
    background_picture: {},
    phone_number: "",
    store_owner: "",
    supplier_address: {
      city: "",
      state: "",
      zip_code: "",
      country: "",
      address: "",
    },
  });

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user" || "{}"));
    setUser(user);
    handleGetStore();
  }, [storeId]);

  const handleActive = (id) => {
    setActive(id);
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormState({
      ...formState,
      [name]: value,
    });
  };

  const fetchOneUserInventory = async (name) => {
    try {
      const user = JSON.parse(localStorage.getItem("user") || "{}")?._id;
      const response = await axios.get(`/inventory/user-inventory/${user}`);
      console.log(response.data?.data, "Full API Response");

      const resp = response.data.data.inventoryItems.map((element, index) => {
        console.log(`Mapping element at index ${index}:`, element);
        return {
          label: element.item?.item_name,
          value: element._id,
          image: element?.item?.itemImage0,
          price: element?.item?.item_price
            ? `${element?.item?.item_price}`
            : "No Price",
          stores: element?.storeId?.map((store) => store._id) || ["No store"],
          item_type: element?.item_type,
          currency: element.storeId?.[0]?.currency?.symbol || "$",
          item_id: element?.item?._id,
        };
      });
      
      console.log(resp, 'rep')
      setUserInventory(resp);
      setFilteredMeals(
        resp.filter(
          (item) => item.item_type === "Meal" && item?.stores.includes(storeId)
        )
      );
      setFilteredProducts(
        resp.filter(
          (item) => item.item_type === "Product" && item?.stores.includes(storeId)
        )
      );


    } catch (error) {
      console.log(error);
    }
    return name;
  };


  const getStore = async (name) => {
    try {
      const response = await axios.get(`/stores/store/${name}`);
      const resp = response.data.data.supplier.map((element) => {
        return {
          label: element.store_name,
          value: element._id,
        };
      });
      setStore(resp);
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    const path = router.asPath.split("#");
    if (Array.isArray(path) && path.length === 2) {
      const doc = document.querySelector(`#${path[1]}`);
      if (doc) {
        doc.scrollIntoView();
      }
    }
  }, []);
  useEffect(() => {
    document.addEventListener(
      "click",
      (e) => {
        if (ref.current && !ref.current.contains(e.target)) {
          setShow(false);
        }
      },
      true
    );
  }, []);

  function uploadImage(picture) {
    if (picture === "profile") {
      const input = document.createElement("input");
      input.accept = "image/*,video/mp4,video/x-m4v,video/*";
      input.id = "profileImage";
      input.name = "profileImage";
      input.type = "file";
      input.onchange = (ev) => onUpdateImage(ev, picture);
      input.hidden = true;
      input.click();
    } else {
      const input = document.createElement("input");
      input.accept = "image/*,video/mp4,video/x-m4v,video/*";
      input.id = "backgroundImage";
      input.name = "backgroundImage";
      input.type = "file";
      input.onchange = (ev) => onUpdateImage(ev, picture);
      input.hidden = true;
      input.click();
    }
  }

  function onUpdateImage(event, picture) {
    if (event.target.files[0] === undefined) return;
    var allowedImageExtensions = /(\.jpg|\.jpeg|\.png|\.)$/i;

    if (allowedImageExtensions.exec(event.target.files[0].name)) {
      if (picture === "profile") {
        setFormState({
          ...formState,
          ["profile_picture"]: event.target.files[0],
          ["profile_picture_name"]: event.target.files[0].name,
          ["profile_picture_data"]: URL.createObjectURL(event.target.files[0]),
        });
        var image = document.getElementById("profile_picture");
        image.style.display = "block";
        // image.src = URL.createObjectURL(event.target.files[0]);
        // setFormState({
        //   ...formState,
        //   profile_picture: URL.createObjectURL(event.target.files[0]),
        // });
      } else {
        setFormState({
          ...formState,
          ["background_picture"]: event.target.files[0],
          ["background_picture_name"]: event.target.files[0].name,
          ["background_picture_data"]: URL.createObjectURL(
            event.target.files[0]
          ),
        });
        var image = document.getElementById("background_picture");
        image.style.display = "block";
        // image.src = URL.createObjectURL(event.target.files[0]);
        // setFormState({
        //   ...formState,
        //   background_picture: URL.createObjectURL(event.target.files[0]),
        // });
      }
    } else {
      alert("Invalid image type");
    }
  }

  const handleGetStore = useCallback(async () => {
    if (storeId) {
      try {
        const response = await axios.get(`/stores/getstore/${storeId}`);
        const store = response?.data?.data?.supplier;
        setFormState({
          store_name: store?.store_name,
          email: store?.email,
          phone_number: store?.phone_number,
          store_owner: store?.store_owner,
          supplier_address: {
            city: store?.supplier_address?.city,
            state: store?.supplier_address?.state,
            zip_code: store?.supplier_address?.zip_code,
            country: store?.supplier_address?.country,
            address: store?.supplier_address?.address,
          },
          profile_picture: store?.profile_picture || "",
          background_picture: store?.background_picture || "",
          store_owner: store?.store_owner || "",
        });
        setStoreData(store);
        if (store?.background_picture) {
          const image = document.querySelector("#background_picture");
          image.src = store?.background_picture;
        }
        if (store?.profile_picture) {
          const image = document.querySelector("#profile_picture");
          image.src = store?.profile_picture;
        }
        const hours = store?.hours;

        if (Object.keys(hours).length) {
          let time = {};
          days.forEach((element) => {
            const from = hours[element]?.from;
            const to = hours[element]?.to;
            const inputDate = "2018-01-01";
            const fromTimeString = `${inputDate}T${from}.000Z`;
            const fromDateTime = moment(fromTimeString).format();

            const toTimeString = `${inputDate}T${to}.000Z`;
            const toDateTime = moment(toTimeString).format();
            time[element] = {
              from: fromDateTime,
              to: toDateTime,
              open: hours[element]?.open,
            };
          });
          setTimes(time);
        }
      } catch (error) {
        console.log(error);
      }
    }
  }, [storeId]);

  const [categories, setCategories] = useState([
    {
      label: "All categories",
      value: true,
    },
    {
      label: "Meals",
      value: true,
    },
    {
      label: "Products",
      value: true,
    },
    {
      label: "Kitchen Utensils",
      value: true,
    },
  ]);

  const deleteItem = async (id) => {
    try {
      const res = await axios.delete(`/items/delete/${id}`);
      if (res.status === 202) {
        getItem();
        toast.success("Deleted successful");
      } else {
        toast.error("This Item does not exist!");
      }
    } catch (e) {
      console.log(e, "errr");
    }
  };
  const handleUpdateProfile = useCallback(async () => {
    try {
      const form = new FormData();
      for (let element in formState) {
        if (formState[element]) {
          if (element === "supplier_address" || element === "currency") {
            form.append(element, JSON.stringify(formState[element]));
          } else {
            form.append(element, formState[element]);
          }
        }
      }
      const response = await axios.put(`/stores/updatestore/${storeId}`, form);
      handleGetStore();
      toast.success("Store updated");
    } catch (e) { }
  }, [formState, storeId]);

  const handleChangeTime = useCallback(async () => {
    const handleFormat = (val) => {
      return new Date(val).toLocaleTimeString();
    };
    const form = new FormData();
    const formattedTime = {};
    for (let ele in times) {
      formattedTime[ele] = {
        ...times[ele],
        from: handleFormat(times[ele]?.from),
        to: handleFormat(times[ele]?.to),
      };
    }
    form.append("hours", JSON.stringify(formattedTime));
    try {
      const response = await axios.put(`/stores/updatestore/${storeId}`, form);
      toast.success("Store updated");
    } catch (e) { }
  }, [times]);

  const deleteInventory = async (id, item_id) => {
    try {
      const res = await axios.delete(
        `/inventory/delete-inventory/${id}?item_id=${item_id}`
      );
      if (res.status === 202) {
        fetchOneUserInventory();
        toast.success("Deleted successful");
      } else {
        toast.error("This Item does not exist!");
      }
    } catch (e) {
      console.log(e, "errr");
    }
  };
  useEffect(() => {
    fetchOneUserInventory();
  }, []);
  console.log(userInventory, "respp")
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
        <div>
          {open && <ModalPopup setOpen={setOpen} />}
          {openModal && (
            <FormModal
              setOpenSuccessModal={setOpenSuccessModal}
              setOpenModal={setOpenModal}
              _id={storeId}
            />
          )}
          {openSuccessModal && (
            <SuccessModal
              storeId={storeId}
              title={`Submitted Successfully`}
              text={`Thank you for your submission, Our dedicated team will 
              now carefully review your claim. Rest assured, we'll keep you
               updated on the progress every step of the way.`}
              button2={true}
              btnTitle3={`Back to Store`}
              onClick={() => router.push(`/store/${storeId}`)}
            />
          )}
          <div className={styles.flex}>
            {matches ? (
              <>
                <div className={styles.summaryCard}>
                  {List.map((elem) => (
                    <div
                      key={elem.id}
                      onClick={() => {
                        if (
                          elem.name === "Store Info" ||
                          elem.name === "Meals/Products"
                        ) {
                          handleActive(elem.id);
                        } else {
                          if (formState.store_owner) {
                            handleActive(elem.id);
                          } else {
                            setOpen(true);
                          }
                        }
                      }}
                      className={styles.active}
                    >
                      <div
                        className={
                          active === elem.id ? styles.border : styles.noborder
                        }
                      ></div>
                      <h6
                        className={
                          active === elem.id &&
                            formState.store_owner !== undefined
                            ? styles.activeText
                            : formState.store_owner === "" &&
                              [3, 4, 5, 6].includes(elem.id)
                              ? styles.undefinedOwnerText
                              : styles.name
                        }
                      >
                        {elem.name}
                      </h6>
                    </div>
                  ))}
                </div>
                <div className={styles.border_bottom} />
              </>
            ) : (
              <div className={styles.summaryCard2}>
                {List.map((elem) => (
                  <div
                    key={elem.id}
                    onClick={() => {
                      if (
                        elem.name === "Store Info" ||
                        elem.name === "Meals/Products"
                      ) {
                        handleActive(elem.id);
                      } else {
                        if (formState.store_owner) {
                          handleActive(elem.id);
                        } else {
                          setOpen(true);
                        }
                      }
                    }}
                    className={
                      active === elem.id && formState.store_owner !== undefined
                        ? styles.active2
                        : formState.store_owner === "" &&
                          [3, 4, 5, 6].includes(elem.id)
                          ? styles.undefinedOwnerText
                          : styles.inactive
                    }
                  >
                    <h6
                      className={
                        active === elem.id &&
                          formState.store_owner !== undefined
                          ? styles.activeText2
                          : formState.store_owner === "" &&
                            [3, 4, 5, 6].includes(elem.id)
                            ? styles.undefinedOwnerText
                            : styles.name
                      }
                    >
                      {elem.name}
                    </h6>
                  </div>
                ))}
              </div>
            )}
            <div className={styles.store}>
              {active === 1 && (
                <>
                  <div className={styles.flextitle}>
                    {!Boolean(formState.store_owner) && (
                      <button onClick={() => setOpenModal(true)}>
                        Claim this Store
                      </button>
                    )}
                  </div>
                  <div className={styles.storeInfo}>
                    <div>
                      <h5 className={styles.h5}>
                        Upload Store Profile Picture
                      </h5>
                      <div
                        onClick={() => uploadImage("profile")}
                        className={styles.bgimg}
                        style={{ position: "relative" }}
                      >
                        <img
                          id="profile_picture"
                          {...(formState.profile_picture && {
                            src:
                              formState?.profile_picture_data ??
                              formState.profile_picture,
                          })}
                          width="100%"
                          height="100%"
                          backgroundPosition="center"
                          alt=""
                          backgroundSize="cover"
                          style={{
                            position: "relative",
                            zIndex: 10,
                          }}
                        />
                        <p
                          style={{
                            position: "absolute",
                            zIndex: 5,
                          }}
                        >
                          +
                        </p>
                      </div>
                    </div>
                    <div className={styles.top}>
                      <h5 className={styles.h5}>Upload Background Image</h5>
                      <div
                        onClick={() => uploadImage("background")}
                        className={styles.bgimg}
                        style={{ position: "relative" }}
                      >
                        {" "}
                        <img
                          {...(formState.background_picture && {
                            src:
                              formState?.background_picture_data ??
                              formState.background_picture,
                          })}
                          id="background_picture"
                          width="100%"
                          height="100%"
                          backgroundPosition="center"
                          alt=""
                          backgroundSize="cover"
                          style={{
                            position: "relative",
                            backgroundPosition: "center",
                            backgroundSize: "cover",
                            zIndex: 10,
                          }}
                        />
                        <p
                          style={{
                            position: "absolute",
                            zIndex: 5,
                          }}
                        >
                          +
                        </p>
                      </div>
                    </div>
                    <div className={styles.contact}>
                      <p>Contact Information</p>
                      <div className={styles.column}>
                        <label>Store Name</label>
                        <input
                          onChange={handleChange}
                          value={formState.store_name}
                          type="text"
                          name="store_name"
                        />
                      </div>
                      <div className={styles.column}>
                        <label>Email Address</label>
                        <input
                          onChange={handleChange}
                          value={formState.email}
                          type="text"
                          name="email"
                        />
                      </div>
                      <div className={styles.column}>
                        <label>Phone Number</label>
                        <input
                          onChange={handleChange}
                          value={formState.phone_number}
                          type="text"
                          name="phone_number"
                        />
                      </div>
                      <div className={styles.columnflex}>
                        <div className={styles.column}>
                          <label>City</label>
                          <input
                            onChange={(e) => {
                              setFormState({
                                ...formState,
                                supplier_address: {
                                  city: e.target.value,
                                },
                              });
                            }}
                            value={formState.supplier_address.city}
                            type="text"
                            name="supplier_address.city"
                          />
                        </div>
                        <div className={styles.column}>
                          <label>State</label>
                          <input
                            onChange={(e) => {
                              setFormState({
                                ...formState,
                                supplier_address: {
                                  state: e.target.value,
                                },
                              });
                            }}
                            value={formState.supplier_address.state}
                            type="text"
                            name="supplier_address.state"
                          />
                        </div>
                      </div>
                      <div className={styles.columnflex}>
                        <div className={styles.column}>
                          <label>Zip Code</label>
                          <input
                            onChange={(e) => {
                              setFormState({
                                ...formState,
                                supplier_address: {
                                  zip_code: e.target.value,
                                },
                              });
                            }}
                            value={formState.supplier_address.zip_code}
                            type="text"
                            name="supplier_address.zip_code"
                          />
                        </div>
                        <div className={styles.column}>
                          <label>Country</label>
                          <input
                            onChange={(e) => {
                              setFormState({
                                ...formState,
                                supplier_address: {
                                  country: e.target.value,
                                },
                              });
                            }}
                            value={formState.supplier_address.country}
                            type="text"
                            name="supplier_address.country"
                          />
                        </div>
                      </div>
                      <div className={styles.column}>
                        <label>Address</label>

                        {/* <GooglePlacesAutocomplete
                          defaultInputValue={formState.supplier_address.address}
                          handleValueChange={(
                            address,
                            place_id,
                            lat,
                            lng,
                            zip_code,
                            country,
                            state,
                            city
                          ) => {
                            const countries = getAllISOCodes().find(
                              (ele) => ele?.countryName === country
                            );
                            setFormState({
                              ...formState,
                              currency: {
                                name: countries.countryName,
                                symbol: countries.symbol,
                              },
                              supplier_address: {
                                address,
                                place_id,
                                lat,
                                lng,
                                zip_code,
                                country,
                                state,
                                city,
                              },
                            });
                          }}
                        /> */}
                      </div>
                    </div>
                    <div className={styles.borderBottom} />
                    <div className={styles.contact}>
                      <p>Pickup Address</p>
                      <div className={styles.column}>
                        <label>Address</label>
                        <input
                          onchange={handleChange}
                          value={formState.address}
                          type="text"
                          name="address"
                        />
                      </div>
                    </div>
                    <div className={styles.contact}>
                      <p>Introduce your store to customers</p>
                      <div className={styles.column}>
                        <label>Intro</label>
                        <textarea
                          onChange={handleChange}
                          value={formState.intro}
                          type="text"
                          name="intro"
                        />
                      </div>
                    </div>
                  </div>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "flex-end",
                      marginTop: "1.5rem",
                    }}
                  >
                    <button
                      onClick={handleUpdateProfile}
                      className={styles.updateBtn}
                    >
                      Update Profile
                    </button>
                  </div>
                </>
              )}
              {active === 2 && (
                <div className={styles.storeInfo}>
                  <div className={styles.flexend2}>
                    <div ref={ref} className={styles.searchflex}>
                      <div className={styles.search}>
                        <input
                          placeholder="Search"
                          autoComplete="off"
                          onFocus={() => setShow(true)}
                          value={value}
                          onChange={(e) => {

                            setValue(e.target.value);
                            fetchOneUserInventory(e.target.value);
                          }}
                          type="text"
                          name="search"
                        />
                        {show && (
                          <div className={styles.searchDropdown}>
                            <>
                              {categories.find((ele) => ele.label === "Meals")
                                ?.value && (
                                  <>
                                    <h4 className={styles.storeTitle}>
                                      Meals ({filteredItem().length})
                                    </h4>
                                    <div className={styles.bord} />
                                    <div className={styles.list}>
                                      {filteredItem().length === 0 ? (
                                        Boolean(value) ? (
                                          <div className={styles.result}>
                                            <p>No Result Found</p>
                                          </div>
                                        ) : null
                                      ) : (
                                        filteredItem()
                                          ?.slice(0, 4)
                                          .map((elem) => (
                                            <p
                                              key={elem.value}
                                              onClick={() => {
                                                setOneStore({
                                                  visible: false,
                                                  id: "",
                                                });
                                                setValue(elem.label);
                                              }}
                                              style={{ cursor: "pointer" }}
                                            >
                                              {elem.label}
                                            </p>
                                          ))
                                      )}
                                    </div>
                                  </>
                                )}
                            </>
                            <>
                              {categories.find(
                                (ele) => ele.label === "Products"
                              )?.value && (
                                  <>
                                    <h4 className={styles.storeTitle}>
                                      Products ({filteredProduct().length})
                                    </h4>
                                    <div className={styles.bord} />
                                    <div className={styles.list}>
                                      {filteredProduct().length === 0 ? (
                                        Boolean(value) ? (
                                          <div className={styles.result}>
                                            <p>No Result Found</p>
                                          </div>
                                        ) : null
                                      ) : (
                                        filteredProduct()
                                          ?.slice(0, 4)
                                          .map(
                                            (elem) =>
                                              value &&
                                              elem.label
                                                .toLowerCase()
                                                .includes(
                                                  value.toLowerCase()
                                                ) && (
                                                <p
                                                  key={elem.value}
                                                  onClick={() => {
                                                    setOneStore({
                                                      visible: false,
                                                      id: "",
                                                    });
                                                    setValue(elem.label);
                                                  }}
                                                  style={{ cursor: "pointer" }}
                                                >
                                                  {elem.label}
                                                </p>
                                              )
                                          )
                                      )}
                                    </div>
                                  </>
                                )}
                            </>

                            <>
                              {categories.find(
                                (ele) => ele.label === "Kitchen Utensils"
                              )?.value && (
                                  <>
                                    <h4 className={styles.storeTitle}>
                                      Kitchen Utensils (
                                      {filteredUtensils().length})
                                    </h4>
                                    <div className={styles.bord} />
                                    <div className={styles.list}>
                                      {filteredUtensils().length === 0 ? (
                                        Boolean(value) ? (
                                          <div className={styles.result}>
                                            <p>No Result Found</p>
                                          </div>
                                        ) : null
                                      ) : (
                                        filteredUtensils()
                                          ?.slice(0, 4)
                                          .map((elem) => (
                                            <p
                                              key={elem.value}
                                              onClick={() => {
                                                setOneStore({
                                                  visible: false,
                                                  id: "",
                                                });
                                                setValue(elem.label);
                                              }}
                                              style={{ cursor: "pointer" }}
                                            >
                                              {elem.label}
                                            </p>
                                          ))
                                      )}
                                    </div>
                                  </>
                                )}
                            </>
                          </div>
                        )}
                      </div>
                      <button
                        className={styles.searchbtn}
                        style={{ cursor: "pointer" }}
                        onClick={() => {
                          handleSearch();
                        }}
                      >
                        Search
                      </button>
                    </div>
                    <div className={styles.flexend}>
                      <p className={styles.filter}>Filter</p>
                      <div
                        className={styles.searchbox}
                        onClick={() => setShowCategory(!showCategory)}
                      >
                        {categories[0].value &&
                          categories.some((ele) => !ele.value)
                          ? "All categories"
                          : categories.find((ele) => ele.value).label}
                        <GoTriangleUp
                          className={
                            !showCategory ? styles.rotate : styles.nonrotate
                          }
                          size={15}
                        />
                      </div>
                      {showCategory && (
                        <div className={styles.categories}>
                          {categories.map((option) => (
                            <p
                              onClick={() => {
                                let arr = [];
                                if (option.label === "All categories") {
                                  arr = categories.map((ele) => {
                                    return {
                                      ...ele,
                                      value: true,
                                    };
                                  });
                                } else {
                                  arr = categories.map((ele) => {
                                    if (ele.label === option.label) {
                                      return {
                                        ...ele,
                                        value: true,
                                      };
                                    } else {
                                      return {
                                        ...ele,
                                        value: false,
                                      };
                                    }
                                  });
                                }

                                setCategories(arr);
                              }}
                              key={option?.label}
                            >
                              {option?.label}
                            </p>
                          ))}
                        </div>
                      )}
                      <div
                        className={styles.suggestbtn}
                        onClick={() => router.push("/suggestmeal")}
                      >
                        <p>+ New Suggestion</p>
                      </div>
                    </div>
                  </div>

                  {categories.find((ele) => ele.label === "Meals")?.value && (
                    <div>
                      <div className={styles.span}>
                        <p>Meal</p>
                        <p className={styles.red}>Remove selection(s)</p>
                      </div>
                      <table className={styles.table}>
                        <thead className={styles.thead}>
                          <th>Name</th>
                          <th>Price</th>
                          <th style={{ textAlign: "center" }}>Action</th>
                        </thead>
                        <tbody style={{ width: "100%" }}>
                          {filteredMeals?.map((ele) => (
                            <tr className={styles.tr}>
                              <td
                                style={{
                                  display: "flex",
                                  alignItems: "center",
                                }}
                              >
                                <input type="checkbox" />
                                <Image
                                  src={ele.image}
                                  width={40}
                                  height={40}
                                  objectFit="contain"
                                  objectPosition="center"
                                  style={{ marginLeft: "1rem" }}
                                />
                                <p className={styles.label}>{ele?.label}</p>
                              </td>
                              <td
                                style={{
                                  display: "flex",
                                  alignItems: "center",
                                }}
                              >
                                <p className={styles.label2}>
                                  {ele.currency}
                                  {ele?.price}
                                </p>
                              </td>
                              <td
                                style={{ textAlign: "center" }}
                                onClick={() => {
                                  console.log(ele, "item_idd");
                                  deleteInventory(ele.value, ele?.item_id);
                                }}
                                className={styles.close2}
                              >
                                <IoIosCloseCircle color="#949494" size={20} />
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                  {categories.find((ele) => ele.label === "Products")
                    ?.value && (
                      <div className={styles.top}>
                        <div className={styles.span}>
                          <p>Product</p>
                          <p className={styles.red}>Remove selection(s)</p>
                        </div>
                        <table className={styles.table}>
                          <thead className={styles.thead}>
                            <th>Name</th>
                            <th>Price</th>
                            <th style={{ textAlign: "center" }}>Action</th>
                          </thead>
                          <tbody style={{ width: "100%" }}>
                            {filteredProducts?.map((ele) => (
                              <>
                                <tr className={styles.tr}>
                                  <td
                                    style={{
                                      display: "flex",
                                      alignItems: "center",
                                    }}
                                  >
                                    <input type="checkbox" />
                                    <Image
                                      src={ele.image}
                                      width={40}
                                      height={40}
                                      objectFit="contain"
                                      objectPosition="center"
                                      style={{ marginLeft: "1rem" }}
                                    />
                                    <p className={styles.label}>{ele?.label}</p>
                                  </td>
                                  <td
                                    style={{
                                      display: "flex",
                                      alignItems: "center",
                                    }}
                                  >
                                    <p className={styles.label2}>
                                      {ele.currency}
                                      {ele?.price}
                                    </p>
                                  </td>
                                  <td
                                    style={{ textAlign: "center" }}
                                    onClick={() =>
                                      deleteInventory(ele.value, ele.item_id)
                                    }
                                    className={styles.close2}
                                  >
                                    <IoIosCloseCircle color="#949494" size={20} />
                                  </td>
                                </tr>
                              </>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}

                  {/* <div className={styles.top}>
                  <div className={styles.flex}>
                    <p>Utensil</p>
                    <p className={styles.red}>Remove selection(s)</p>
                  </div>
                  <table className={styles.table}>
                    <thead className={styles.thead}>
                      <th>Name</th>
                      <th>Price</th>
                      <th style={{ textAlign: "center" }}>Action</th>
                    </thead>
                    <tbody style={{ width: "100%" }}>
                      {filteredUtensils()?.map((ele) => (
                        <tr className={styles.tr}>
                          <td style={{ display: "flex" }}>
                            <input type="checkbox" />
                            <p className={styles.label}>{ele?.label}</p>
                          </td>
                          <td>
                            <p>{ele?.price}</p>
                          </td>
                          <td style={{ textAlign: "center" }}>
                            <IoIosCloseCircle color="#949494" size={20} />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div> */}
                </div>
              )}
              {active === 3 && (
                <div className={styles.store23}>
                  <h5>Payment</h5>
                  <div className={styles.payment}>
                    <div className={styles.cards}>
                      <div className={styles.card}>
                        <BsFillCreditCard2BackFill />
                        <p>Cards</p>
                      </div>
                      <div className={styles.paypal}>
                        <img src="/assets/logos/paypal.png" />
                      </div>
                      <div className={styles.paypal}>
                        <img
                          src="/assets/logos/sezzle.png"
                          className={styles.sezzle}
                        />
                      </div>
                    </div>
                    <div>
                      <p>Choose card type</p>
                    </div>
                  </div>
                </div>
              )}
              {active === 4 && (
                <div>
                  <div>
                    <h5>Set Working Hours</h5>
                    <p>
                      Configure the standard hours of operation for this store
                    </p>
                    <div className={styles.payment}>
                      <div className={profileStyles.profile_workinghour_days}>
                        {days.map((day) => {
                          return (
                            <div
                              className={profileStyles.profile_workinghour_day}
                            >
                              <h3>{day}</h3>
                              <div
                                className={
                                  profileStyles.profile_workinghour_switch
                                }
                              >
                                <AntSwitch
                                  checked={times[day]["open"]}
                                  onChange={() =>
                                    handleDayAvailabiltyChange(
                                      !times[day]["open"],
                                      day,
                                      "open"
                                    )
                                  }
                                  inputProps={{ "aria-label": "ant design" }}
                                />
                                {times[day]["open"] ? "Open" : "Closed"}
                              </div>
                              <div
                                className={
                                  profileStyles.profile_workinghour_date
                                }
                              >
                                <LocalizationProvider
                                  dateAdapter={AdapterDayjs}
                                >
                                  <TimePicker
                                    value={times[day]["from"]}
                                    onChange={(time) =>
                                      handleTime(time, day, "from")
                                    }
                                    renderInput={(params) => (
                                      <TextField {...params} />
                                    )}
                                  />
                                </LocalizationProvider>
                              </div>
                              <h4>To</h4>
                              <div
                                className={
                                  profileStyles.profile_workinghour_date
                                }
                              >
                                <LocalizationProvider
                                  dateAdapter={AdapterDayjs}
                                >
                                  <TimePicker
                                    value={times[day]["to"]}
                                    onChange={(time) =>
                                      handleTime(time, day, "to")
                                    }
                                    renderInput={(params) => (
                                      <TextField {...params} />
                                    )}
                                  />
                                </LocalizationProvider>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "flex-end",
                      marginTop: "1.5rem",
                    }}
                  >
                    <button
                      onClick={handleChangeTime}
                      className={styles.updateBtn}
                    >
                      Update Hours
                    </button>
                  </div>
                </div>
              )}
              {active === 5 && (
                <SubAdmins
                  storeId={storeId}
                  storeData={storeData}
                  handleGetStore={handleGetStore}
                />
              )}
              {active === 6 && (
                <div>
                  <div className={styles.flex}>
                    <h5>Drivers</h5>
                  </div>
                  <div className={styles.subadmin}>
                    <div className={styles.flexstart}>
                      <div className={styles.user}>
                        <img src="/assets/icons/girl.jpg" />
                      </div>
                      <div style={{ marginLeft: "1.3rem" }}>
                        <h5 className={styles.admin_name}>Rachel Anterta</h5>
                        <p className={styles.car}>Hyundai Elantra - Black</p>
                        <div
                          className={styles.flexstart}
                          style={{ marginTop: "1rem" }}
                        >
                          <FaPhoneAlt color="#F47900" />
                          <p className={styles.number}>(406) 555-0120</p>
                        </div>
                      </div>
                    </div>
                    <div className={styles.center}>
                      <IoIosCloseCircle color="#949494" size={20} />
                      <p className={styles.remove}>Remove User</p>
                    </div>
                  </div>
                  <p className={styles.add}>Add New Driver</p>
                  <div className={styles.payment}>
                    <div className={styles.contact}>
                      <p>Contact Information</p>

                      <div className={styles.columnflex}>
                        <div className={styles.column}>
                          <label>First Name</label>
                          <input
                            onChange={handleChange}
                            value={formState.city}
                            type="text"
                            name="first_name"
                          />
                        </div>
                        <div className={styles.column}>
                          <label>Last Name</label>
                          <input
                            onChange={handleChange}
                            value={formState.state}
                            type="text"
                            name="Last Name"
                          />
                        </div>
                      </div>
                      <div className={styles.column}>
                        <label>Email Address</label>
                        <input
                          onChange={handleChange}
                          value={formState.address}
                          type="text"
                          name="email"
                        />
                      </div>
                      <div className={styles.column}>
                        <label>Phone Number</label>
                        <input
                          onChange={handleChange}
                          value={formState.address}
                          type="text"
                          name="number"
                        />
                      </div>
                    </div>
                    <div className={styles.contact}>
                      <p className={styles.title}>Car Details</p>
                      <div className={styles.column}>
                        <label>Car Name</label>
                        <input
                          onChange={handleChange}
                          value={formState.address}
                          type="text"
                          name="email"
                        />
                      </div>

                      <div className={styles.columnflex2}>
                        <div className={styles.column}>
                          <label>VIN</label>
                          <input
                            onChange={handleChange}
                            value={formState.city}
                            type="text"
                            name="first_name"
                          />
                        </div>
                        <div className={styles.column}>
                          <label>Color</label>
                          <input
                            onChange={handleChange}
                            value={formState.state}
                            type="text"
                            name="Last Name"
                          />
                        </div>
                      </div>
                      <div className={styles.column}>
                        <label>Plate Number</label>
                        <input
                          onChange={handleChange}
                          value={formState.address}
                          type="text"
                          name="number"
                        />
                      </div>
                      <div className={styles.flexend}>
                        <button className={styles.button2}> Add Driver</button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Management;
