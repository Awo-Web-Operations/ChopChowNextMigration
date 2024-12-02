import { HiLocationMarker } from "react-icons/hi";
import {
  useState,
  useEffect,
  useCallback,
  useImperativeHandle,
  forwardRef,
  useRef,
} from "react";
import styles from "./public-market.module.css";
import { FadeLoader } from "react-spinners";
import { HiMiniClock } from "react-icons/hi2";
import * as BaseAxios from "axios";
import { debounce } from "lodash";
import axios from "../../util/Api";
import { useRouter } from "next/router";

export const AddressInput = forwardRef((props, ref) => {
  const {
    showLocation,
    showAddress,
    setShowAddress,
    setShowLocation,
    showCurrentLocation,
    setShowCurrentLocation,
    currentAddress,
    isLoading,
    setCurrentAddress,
    setIsLoading
  } = props;

  const [allStores, setAllStores] = useState([]);
  const [longlat, setLongLat] = useState({
    latitude: "",
    longitude: "",
  });
  const router = useRouter();
  const pageRef = useRef();


  useImperativeHandle(ref, () => {
    return {
      handleGetStoreByLocation() {
        getAllStores(currentAddress);
      },
    };
  });
  const getAllStores = async (address) => {
    try {
      const response = await axios(`/stores/list/${address}`, {
        method: "POST",
        data: {
          lat: longlat.latitude,
          lng: longlat.longitude,
        },
        headers: {
          "Content-Type": "application/json",
        },
      });
      console.log(response.data.data.supplier, "supplier");
      setAllStores(response.data.data.supplier);
    } catch (error) {
      console.log(error);
    }
  };
  console.log(allStores, 'all')

  useEffect(() => {
    document.addEventListener(
      "click",
      (e) => {
        if (pageRef.current && !pageRef.current.contains(e.target)) {
          setShowLocation(false);
          setShowAddress(false);
        }
      },
      true
    );
  }, []);

  const onSuccess = useCallback(async (location) => {
    if (location?.coords?.latitude && location?.coords?.longitude) {
      setIsLoading(true);
      try {
        setLongLat({
          longitude: location?.coords?.longitude,
          latitude: location?.coords?.latitude,
        });
        const res = await BaseAxios.get(
          `https://maps.googleapis.com/maps/api/geocode/json?latlng=${location?.coords?.latitude},${location?.coords?.longitude}&key=AIzaSyDJ2OXLQoX_83t-DYmg-zIs3keZmNAZHzk`
        );
        const data = res.data;
        const curr_location =
          data?.results?.find(
            (ele) =>
              ele?.types?.includes("street_address") ||
              ele?.types?.includes("route")
          )?.formatted_address || "";
        setCurrentAddress(curr_location);
        setIsLoading(false);
      } catch (e) {
        console.log(e);
        setIsLoading(false);
      }
    }
  }, []);

  const onError = useCallback((error) => {
    console.log(error, "error");
    window.alert(error?.message || "Unable to get location");
  }, []);

  useEffect(() => {
   
  }, []);

  return (
    <div className={styles.search2} ref={pageRef}>
      <input
        onFocus={() => {
          setShowCurrentLocation(false);
          setShowLocation(!showLocation);
          setShowAddress(!showAddress);
        }}
        autoComplete="off"
        type="text"
        name="name"
        onChange={(e) => {
          if (e.target.value) {
            console.log(e.target.value);
            let debounce_fun = debounce(function () {
              getAllStores(e.target.value);
            }, 500);

            debounce_fun();
          }
        }}
        placeholder="Enter Delivery Address"
        className={styles.searchbar}
      />
      
      <div
        onClick={() => {
          setShowLocation(!showLocation);
          setShowCurrentLocation(true);
          navigator.geolocation.getCurrentPosition(onSuccess, onError);
          console.log(showLocation, "showLocation");
        }}
      >
        <HiLocationMarker
          size={17}
          className={styles.locationIcon}
          fill="#949494"
        />
      </div>

      {showLocation && (
        <div className={styles.locationDropdown}>
          {showCurrentLocation && (
            <div>
              <div className={styles.row}>
                <HiLocationMarker size={19} fill="#F47900" />
                <p className={styles.rowName}>My Current Location</p>
              </div>
              {isLoading ? (
                <div className={styles.loader}>
                  <FadeLoader
                    color="#000"
                    loading={true}
                    aria-label="Loading Spinner"
                    data-testid="loader"
                  />
                </div>
              ) : (
                <p className={styles.address}>{currentAddress}</p>
              )}
            </div>
          )}
          <div>
            <p className={styles.rowName} style={{ paddingTop: "2rem" }}>
              Stores found ({allStores.length})
            </p>
            <div
              style={{
                borderBottom: "1px solid rgba(0, 0, 0, 0.20)",
                width: "100%",
                marginTop: "1rem",
              }}
            />
          </div>
          <div className={styles.allstores}>
            {
              // allStores.length === 0
              //     ? (

              //         <div className={styles.result}>
              //             <p>No Result Found</p>
              //             <button onClick={() => router.push("/suggest-store")}>
              //                 Suggest Store
              //             </button>
              //         </div>
              //     )
              //     :
              allStores.map((elem, idx) => (
                <>
                  <div
                    className={styles.oneStore}
                    key={idx}
                    onClick={() => router.push(`/store/${elem?._id}`)}
                  >
                    <h6 className={styles.storename}>{elem?.store_name}</h6>
                    <p className={styles.storeaddress}>{elem?.address}</p>
                    <div className={styles.row}>
                      <div className={styles.row}>
                        <HiMiniClock size={22} color="#F47900" />
                        <div
                          className={styles.row}
                          style={{ paddingLeft: "1rem" }}
                        >
                          <p className={styles.storestatus}>
                            {elem?.is_open ? "Open" : "Close"}
                          </p>
                          <p className={styles.storetime}>
                            {elem?.opening_time}
                          </p>
                        </div>
                      </div>
                      <div
                        className={styles.row}
                        style={{ paddingLeft: "3rem" }}
                      >
                        <HiLocationMarker size={19} fill="#F47900" />
                        <p className={styles.storetime}>
                          {elem?.miles_away} miles away
                        </p>
                      </div>
                    </div>
                  </div>
                  {idx !== allStores.length - 1 ? (
                    <div
                      style={{
                        borderBottom: "1px solid rgba(0, 0, 0, 0.20)",
                        width: "100%",
                        marginTop: "1rem",
                      }}
                    />
                  ) : null}
                </>
              ))
            }
          </div>
        </div>
      )}
    </div>
  );
});
