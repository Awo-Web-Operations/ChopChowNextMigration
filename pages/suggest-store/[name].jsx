import Head from "next/head";
import React, {
  useState,
  useEffect,
  useRef,
  useCallback,
  Fragment,
} from "react";
import Header, { Header2 } from "../../src/components/Header/Header";
import GoBack from "../../src/components/CommonComponents/goBack";
import styles from "../../src/components/suggest-store/suggest-store.module.css";
import { useRouter } from "next/router";
import { MdStoreMallDirectory } from "react-icons/md";
import { IoIosPlay } from "react-icons/io";
import { SuccessModal } from "../../src/components/suggest-store/success-modal";
import GooglePlacesAutocomplete from "../../src/components/dashboard/googleplacesautocomplete";
import axios from "../../src/util/Api";

const SuggestStore = () => {
  const [index, setIndex] = useState(1);
  const [show, setShow] = useState(false);
  const router = useRouter();
  const ref = useRef(false);
  const [storeId, setStoreId] = useState("");
  const [details, setDetails] = useState({
    title: "",
    isStoreOwner: null,
    storeType: null,
  });
  const [formState, setFormState] = useState({
    store_name: "",
    city: "",
    state: "",
    zip_code: "",
    country: "",
    address: "",
    lng: "",
    lat: "",
    place_id: "",
  });

  useEffect(() => {
    if (router.query?.name) {
      setDetails({
        ...details,
        title: router.query.name,
      });
    }
  }, [router]);

  const handleCreate = async () => {
    let supplier_address = {
      ...formState,
    };
    const user = JSON.parse(localStorage.getItem("user"));
    const form = new FormData();
    form.append("supplier_address", JSON.stringify(supplier_address));
    form.append("store_name", details.title);
    if (details.isStoreOwner) {
      form.append("email", user?.email);
      form.append("store_owner", user?._id);
    } else {
      form.append("store_admin", user?._id);
    }
    axios.post("/stores/createstore", form).then((response) => {
      if (response.status >= 200 && response.status < 300) {
        setStoreId(response.data?.data?._id);
        setShow(true);
      }
    });
  };
  const handleNext = useCallback(() => {
    if (details?.storeType === "detailed") {
      router.push(`/dashboard/createstore?storename=${details.title}`);
    } else {
      if (index === 4) {
        handleCreate();
      } else {
        if (ref.current) {
          setIndex((prev) => prev + 2);
          ref.current = false;
        } else {
          setIndex((prev) => prev + 1);
        }
      }
    }
  }, [details, index, handleCreate]);
  const handlePrevious = useCallback(() => {
    if (index !== 1) {
      if (index === 3 && !details.isStoreOwner) {
        setIndex((prev) => prev - 2);
      } else {
        setIndex((prev) => prev - 1);
      }
    } else {
      router.push("/marketplace");
    }
  }, [details, index]);

  return (
    <div className={styles.container}>
      <Head>
        <title>Suggest a Store on Chop Chow </title>
        <meta
          key="title"
          name="viewport"
          content="initial-scale=1.0, width=device-width"
        />
        <meta
          name="description"
          content="Suggest local stores near you without owning the store.
        Manage your stores to include pictures and prices. We partner with chefs and stores to sell thier products"
        />
      </Head>
      <Header />
      <Header2 />
      <div className={styles.top}>
        <GoBack />
      </div>
      <div className={styles.pageTitle}>
        <div className={styles.store}>
          <MdStoreMallDirectory />
        </div>
        <p>Suggest Store</p>
      </div>
      <div className={styles.questionContainer}>
        <div className={styles.flex}>
          <IoIosPlay color="#F47900" size={20} />
          <p>Step {index}/4</p>
          {/* First Question */}
        </div>
        <div>
          {index === 1 && (
            <>
              <p className={styles.question}>
                Are you the store owner({details.title})
              </p>
              <div className={styles.flex} style={{ paddingTop: "3rem" }}>
                <div className={styles.radio}>
                  <div className={styles.radioDiv}>
                    <input
                      onChange={() => {
                        setDetails({
                          ...details,
                          isStoreOwner: true,
                        });
                        ref.current = false;
                      }}
                      type="radio"
                      value="yes"
                      name="radio"
                    />
                  </div>
                  <label className={styles.label}>Yes</label>
                </div>
                <div className={styles.radio}>
                  <div className={styles.radioDiv}>
                    <input
                      onChange={() => {
                        setDetails({
                          ...details,
                          isStoreOwner: false,
                        });
                        ref.current = true;
                      }}
                      type="radio"
                      name="radio"
                      value="no"
                    />
                  </div>
                  <label className={styles.label}>No</label>
                </div>
              </div>
            </>
          )}
          {index === 2 && (
            <>
              {details.isStoreOwner ? (
                <>
                  <p className={styles.question}>
                    Would you prefer a quick or detailed setup
                  </p>
                  <div className={styles.flex} style={{ paddingTop: "3rem" }}>
                    <div className={styles.radio}>
                      <div className={styles.radioDiv}>
                        <input
                          onChange={() =>
                            setDetails({
                              ...details,
                              storeType: "quick",
                            })
                          }
                          type="radio"
                          name="radio"
                          value="quick"
                        />
                      </div>
                      <label className={styles.label}>Quick setup</label>
                    </div>
                    <div className={styles.radio}>
                      <div className={styles.radioDiv}>
                        <input
                          onChange={() =>
                            setDetails({
                              ...details,
                              storeType: "detailed",
                            })
                          }
                          type="radio"
                          value="detailed"
                          name="radio"
                        />
                      </div>
                      <label className={styles.label}>Detailed setup</label>
                    </div>
                  </div>
                </>
              ) : (
                <></>
              )}
            </>
          )}
          {index === 3 && (
            <>
              {details.isStoreOwner || !details.isStoreOwner ? (
                <div className={styles.fragment}>
                  <p className={styles.question}>Store Name</p>
                  <input
                    onChange={(e) =>
                      setDetails({
                        ...details,
                        isStoreOwner: true,
                        title: e.target.value,
                      })
                    }
                    value={details.title}
                    type="text"
                    name="text"
                    placeholder="Enter store name"
                  />
                </div>
              ) : (
                <></>
              )}
            </>
          )}
          {index === 4 && (
            <>
              {details.isStoreOwner || !details.isStoreOwner ? (
                <div className={styles.fragment}>
                  <p className={styles.question}>Store address</p>
                  {/* <input
                    onChange={() =>
                      setDetails({
                        ...details,
                        isStoreOwner: true,
                      })
                    }
                    type="text"
                    name="text"
                    placeholder="Enter store Address"
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
                        setFormState({
                          ...formState,
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
              ) : (
                <></>
              )}
            </>
          )}
          <div className={styles.btns}>
            <button className={styles.outlineBtn} onClick={handlePrevious}>
              {index === 1 ? "Close" : "Back"}
            </button>
            <button className={styles.btn} onClick={handleNext}>
              Next
            </button>
          </div>
        </div>
      </div>
      {show && (
        <SuccessModal
          storeId={storeId}
          title={`Store Created Successfully`}
          text={` Congratulations you have successfully created a store,
       \n
          To manage your store, click “Manage store”`}
          button={true}
          btnTitle={`Public Market`}
          btnTitle2={`Manage Store`}
        />
      )}
    </div>
  );
};
export default SuggestStore;
