import { useEffect, useState } from "react";
import {
  container,
  center,
} from "../../src/components/dashboard/dashboard.module.css";
import Header from "../../src/components/Header/Header";
import SideNav from "../../src/components/Header/sidenav";
import styles from "../../src/components/dashboard/createstore.module.css";
import profileStyles from "../../src/components/dashboard/profile.module.css";
import {
  suggestion_form_image,
  suggestion_form_image_col_1,
  suggestion_form_image_col_2,
  suggestion_form_image_icon,
  suggestion_form_image_icon_con,
  suggestion_form_group,
  suggestion_form_label,
} from "../../src/components/suggestionPages/suggestion.module.css";
import { Button, TextField } from "@mui/material";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { TimePicker } from "@mui/x-date-pickers/TimePicker";
import { styled } from "@mui/material/styles";
import Switch from "@mui/material/Switch";
import AddIcon from "@mui/icons-material/Add";
import GoBack from "../../src/components/CommonComponents/goBack";
import axios from "../../src/util/Api";
import { connect, useDispatch } from "react-redux";
import PhoneInput from "react-phone-input-2";
import { getUser } from "../../src/actions";
import { useRouter } from "next/router";
import { useParams } from "next/navigation";
import GooglePlacesAutocomplete from "../../src/components/dashboard/googleplacesautocomplete";
import { getAllISOCodes } from "iso-country-currency";
import { setSelectedUserType } from "../../src/reducers/userSlice";

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

const CreateStore = (props) => {
  const [status, setStatusState] = useState("");
  const [message, setMessageState] = useState("");
  const router = useRouter();
  const params = useParams();
  const [formState, setFormState] = useState({
    email: "",
    phone_number: "",
    store_name: "",
    city: "",
    state: "",
    zip_code: "",
    country: "",
    address: "",
    profile_picture: "",
    profile_picture_name: "",
    profile_picture_data: "",
    background_picture: "",
    background_picture_name: "",
    background_picture_data: "",
    description: "",
    lng: "",
    lat: "",
    place_id: "",
    address: "",
  });
  const {
    email,
    phone_number,
    store_name,
    city,
    state,
    country,
    zip_code,
    address,
    description,
  } = formState;
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
  const days = [
    "sunday",
    "monday",
    "tuesday",
    "wednesday",
    "thursday",
    "friday",
    "saturday",
  ];

  const dispatch = useDispatch();

  function handleChange(e) {
    setFormState({ ...formState, [e.target.name]: e.target.value });
  }

  function handlePhoneChange(e) {
    setFormState({ ...formState, ["phone_number"]: e });
  }

  function handleTime(time, day, when) {
    // times[day][when] = time;
    setTimes({ ...times, [day]: { ...times[day], [when]: time } });
  }

  function handleDayAvailabiltyChange(value, day, when) {
    setTimes({ ...times, [day]: { ...times[day], [when]: value } });
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
        image.src = URL.createObjectURL(event.target.files[0]);
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
        image.src = URL.createObjectURL(event.target.files[0]);
      }
    } else {
      alert("Invalid image type");
    }
  }

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

  function createStore() {
    let supplier_address = {
      phone_number: phone_number,
      street: address,
      city: city,
      zip_code: zip_code,
      country: country,
      lng: formState.lng,
      lat: formState.lat,
      place_id: formState.place_id,
      address: formState.address,
    };
    let createStoreObject = new FormData();

    const handleFormat = (val) => {
      return new Date(val).toLocaleTimeString();
    };
    const formattedTime = {};
    for (let ele in times) {
      formattedTime[ele] = {
        ...times[ele],
        from: handleFormat(times[ele]?.from),
        to: handleFormat(times[ele]?.to),
      };
    }

    createStoreObject.append("store_name", store_name);
    createStoreObject.append("phone_number", phone_number);
    createStoreObject.append("profile_picture", formState.profile_picture);
    createStoreObject.append(
      "background_picture",
      formState.background_picture
    );
    createStoreObject.append("email", email);
    createStoreObject.append("description", formState.description);
    createStoreObject.append("hours", JSON.stringify(formattedTime));
    createStoreObject.append("store_owner", props.auth.authUser?._id);
    createStoreObject.append(
      "supplier_address",
      JSON.stringify(supplier_address)
    );

    axios
      .post("/stores/createstore", createStoreObject)
      .then((response) => {
        if (response.status >= 200 && response.status < 300) {
          // this.setState({ booleanOfDisplayOfDialogBoxConfirmation: true });
          getUser(props.auth.authUser?._id);
          router.push("/dashboard/suggestedmeals");
          setStatusState("success");
          setMessageState("Store created");
          dispatch(setSelectedUserType("supplier"));
          setTimeout(() => {
            setStatusState("");
            setMessageState("");
          }, 5000);
          // window.location.href = "/SuggestMeal"
        } else {
          setStatusState("error");
          setMessageState("Error creating store");
          setTimeout(() => {
            setStatusState("");
            setMessageState("");
          }, 5000);
        }
      })
      .catch(() => {
        setStatusState("error");
        setMessageState("Error creating store");
        setTimeout(() => {
          setStatusState("");
          setMessageState("");
        }, 5000);
      });
  }

  useEffect(() => {
    if (router.query?.storename) {
      setFormState({
        ...formState,
        store_name: router.query.storename,
      });
    }
  }, [router]);

  return (
    <div className={container}>
      <div className="alert">
        {status === "error" && <div className="alert-danger">{message}</div>}
        {status === "success" && <div className="alert-success">{message}</div>}
      </div>
      <Header />
      <SideNav />
      <div className={center}>
        <div className={styles.createstore}>
          <div className={styles.header2}>
            <div className={styles.header2_col_1}>
              <GoBack />
            </div>
          </div>
          <div className={profileStyles.profile_basic_info_con}>
            <h3>Create A Store</h3>
            <div className={profileStyles.profile_basic_info}>
              <div className={profileStyles.profile_form}>
                <div className={profileStyles.profile_form_group}>
                  <label
                    htmlFor="store_name"
                    className={profileStyles.profile_form_label}
                  >
                    Store Name
                  </label>
                  <input
                    type="text"
                    name="store_name"
                    value={store_name}
                    placeholder="Store Name"
                    onChange={handleChange}
                    className={profileStyles.profile_form_input}
                  />
                  {/* {this.props.errors.accountname && <div className={profileStyles.errorMsg}>{this.props.errors.accountname}</div>} */}
                </div>

                <div className={profileStyles.profile_form_group}>
                  <label
                    htmlFor="email"
                    className={profileStyles.profile_form_label}
                  >
                    Email
                  </label>
                  <input
                    type="text"
                    name="email"
                    value={email}
                    placeholder="Email"
                    onChange={handleChange}
                    className={profileStyles.profile_form_input}
                  />
                </div>
                <div className={profileStyles.profile_form_group}>
                  <label
                    htmlFor="phone_number"
                    className={profileStyles.profile_form_label}
                  >
                    Phone Number
                  </label>
                  <PhoneInput
                    inputClass={styles.login_form_input}
                    country={"us"}
                    name="phone_number"
                    value={phone_number}
                    onChange={(phone) => handlePhoneChange(phone)}
                  />
                </div>
                <div className={profileStyles.profile_form_group}>
                  <label
                    htmlFor="address"
                    className={profileStyles.profile_form_label}
                  >
                    Address
                  </label>
                  {/* <input
                                        type="tel"
                                        name="address"
                                        value={address}
                                        placeholder="Your Address"
                                        onChange={handleChange}
                                        className={profileStyles.profile_form_input}
                                    /> */}
                  <div>
                    <GooglePlacesAutocomplete
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
                          address,
                          place_id,
                          lat,
                          lng,
                          zip_code,
                          country,
                          state,
                          city,
                        });
                      }}
                    />
                  </div>
                </div>
                <div className={profileStyles.profile_form_col_2}>
                  <div className={profileStyles.profile_form_group}>
                    <label
                      htmlFor="city"
                      className={profileStyles.profile_form_label}
                    >
                      City
                    </label>
                    <input
                      value={city}
                      onChange={handleChange}
                      name="city"
                      type="text"
                      className={profileStyles.profile_form_input}
                    />
                    {/* {this.props.errors.city && <div className={profileStyles.errorMsg}>{this.props.errors.accountname}</div>} */}
                  </div>
                  <div className={profileStyles.profile_form_group}>
                    <label
                      htmlFor="state"
                      className={profileStyles.profile_form_label}
                    >
                      State
                    </label>
                    <input
                      value={state}
                      onChange={handleChange}
                      name="state"
                      type="text"
                      className={profileStyles.profile_form_input}
                    />
                    {/* {this.props.errors.lastname && <div className={profileStyles.errorMsg}>{this.props.errors.lastname}</div>} */}
                  </div>
                </div>
                <div className={profileStyles.profile_form_col_2}>
                  <div className={profileStyles.profile_form_group}>
                    <label
                      htmlFor="zip_code"
                      className={profileStyles.profile_form_label}
                    >
                      Zip Code
                    </label>
                    <input
                      value={zip_code}
                      onChange={handleChange}
                      name="zip_code"
                      type="text"
                      className={profileStyles.profile_form_input}
                    />
                    {/* {this.props.errors.zip_code && <div className={profileStyles.errorMsg}>{this.props.errors.accountname}</div>} */}
                  </div>
                  <div className={profileStyles.profile_form_group}>
                    <label
                      htmlFor="country"
                      className={profileStyles.profile_form_label}
                    >
                      Country
                    </label>
                    <input
                      value={country}
                      onChange={handleChange}
                      name="country"
                      type="text"
                      className={profileStyles.profile_form_input}
                    />
                    {/* {this.props.errors.lastname && <div className={profileStyles.errorMsg}>{this.props.errors.lastname}</div>} */}
                  </div>
                </div>

                <div className={styles.form_group}>
                  <h3>Upload Profile Picture</h3>

                  <div className={suggestion_form_image}>
                    <div className={suggestion_form_image_col_1}>
                      <img
                        id="profile_picture"
                        width="100%"
                        alt="profile"
                        style={{ display: "none" }}
                      />
                      <div
                        onClick={() => uploadImage("profile")}
                        className={suggestion_form_image_icon_con}
                      >
                        <AddIcon className={suggestion_form_image_icon} />
                      </div>
                    </div>
                    <div className={suggestion_form_image_col_2}>
                      <p>
                        Upload picture with : Jpeg or Png format and not more
                        than 500kb
                      </p>
                    </div>
                  </div>
                </div>

                <div className={styles.form_group}>
                  <h3>Upload Background Picture</h3>

                  <div className={suggestion_form_image}>
                    <div className={suggestion_form_image_col_1}>
                      <img
                        id="background_picture"
                        width="100%"
                        alt="background"
                        style={{ display: "none" }}
                      />
                      <div
                        onClick={() => uploadImage("background")}
                        className={suggestion_form_image_icon_con}
                      >
                        <AddIcon className={suggestion_form_image_icon} />
                      </div>
                    </div>
                  </div>
                </div>

                <div className={styles.form_group}>
                  <h3>Description</h3>
                  <div className={suggestion_form_group}>
                    <label
                      htmlFor="description"
                      className={suggestion_form_label}
                    >
                      Description
                    </label>
                    <TextField
                      value={description}
                      onChange={handleChange}
                      name="description"
                      multiline
                      id="description"
                      fullWidth
                      variant="outlined"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className={profileStyles.profile_basic_info_con}>
            <h3>Set Working Hours</h3>
            <div className={profileStyles.profile_basic_info}>
              <div className={profileStyles.profile_workinghours_con}>
                <p>Configure the standard hours of operation for this store</p>
                <div className={profileStyles.profile_workinghour_days}>
                  {days.map((day) => {
                    return (
                      <div className={profileStyles.profile_workinghour_day}>
                        <h3>{day}</h3>
                        <div
                          className={profileStyles.profile_workinghour_switch}
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
                        <div className={profileStyles.profile_workinghour_date}>
                          <LocalizationProvider dateAdapter={AdapterDayjs}>
                            <TimePicker
                              value={times[day]["from"]}
                              onChange={(time) => handleTime(time, day, "from")}
                              renderInput={(params) => (
                                <TextField {...params} />
                              )}
                            />
                          </LocalizationProvider>
                        </div>
                        <h4>To</h4>
                        <div className={profileStyles.profile_workinghour_date}>
                          <LocalizationProvider dateAdapter={AdapterDayjs}>
                            <TimePicker
                              value={times[day]["to"]}
                              onChange={(time) => handleTime(time, day, "to")}
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
          </div>
          <Button
            variant="contained"
            className={styles.ingredient_button}
            style={{ width: "100%" }}
            onClick={() => createStore()}
          >
            {" "}
            Create Store
          </Button>
        </div>
        {/* <TransferToInventory /> */}
      </div>
    </div>
  );
};

// export default CreateStore

function mapStateToProp(state) {
  return {
    auth: state.Auth,
  };
}

export default connect(mapStateToProp)(CreateStore);
