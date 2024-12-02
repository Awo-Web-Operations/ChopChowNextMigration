import { useRouter } from "next/router";
import { GoTriangleUp } from "react-icons/go";
import styles from "../../components/public-market/public-market.module.css";
import { useRef, useState } from "react";
import axios from "../../util/Api";
import { useEffect } from "react";
import { useMediaQuery } from "../../hooks/usemediaquery";

export const SearchDropdown = ({ setShowDropdown }) => {
  const router = useRouter();
  const [show, setShow] = useState(false);
  const [value, setValue] = useState("");
  const [items, setItems] = useState([]);
  const [store, setStore] = useState([]);
  const matches = useMediaQuery("(min-width: 600px)");
  const [showCategory, setShowCategory] = useState(false);
  const [categories, setCategories] = useState([
    {
      label: "All categories",
      value: true,
    },
    {
      label: "Stores",
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
  const ref = useRef();
  const filteredItem = () => {
    return items.filter((elem) => elem.item_type === "Meal");
  };
  const filteredProduct = () => {
    return items.filter((elem) => elem.item_type === "Product");
  };
  const filteredUtensils = () => {
    return items.filter((elem) => elem.item_type === "Utensils");
  };
  const [oneStore, setOneStore] = useState({
    visible: false,
    id: "",
    name: ""
  });
  const getItem = async (name) => {
    try {
      const response = await axios.get(`/items/filter/${name}`);
      const resp = response.data.data.map((element) => {
        return {
          label: element.item_name,
          value: element._id,
          image: element?.itemImage0,
          price: element?.item_price ? `$${element?.item_price}` : "No Price",
          store: element?.store_available?.store_name || "No store",
          item_type: element?.item_type,
        };
      });
      setItems(resp);
      console.log(response.data.data, "resp");
    } catch (error) {
      console.log(error);
    }
    return name;
  };
  console.log(items, "item");

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
  useEffect(() => {
    document.addEventListener(
      "click",
      (e) => {
        if (ref.current && !ref.current.contains(e.target)) {
          setShowDropdown(false);
        }
      },
      true
    );
  }, []);
  return (
    <div className={styles.two2} ref={ref}>
      <div>
        <div
          className={styles.searchbox}
          onClick={() => setShowCategory(!showCategory)}
        >
          {categories[0].value && categories.some((ele) => !ele.value)
            ? "All categories"
            : categories.find((ele) => ele.value).label}
          <GoTriangleUp
            className={!showCategory ? styles.rotate : styles.nonrotate}
            size={15}
          />
        </div>

        {showCategory && (
          <div className={styles.categories}>
            {categories.map((option) => (
              <p
                style={{ color: "black" }}
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
      </div>
      <div className={styles.searchflex}>
        <div className={styles.searchfield}>
          <input
            placeholder="Search"
            autoComplete="off"
            onFocus={() => setShow(true)}
            value={value}
            onChange={(e) => {
              setValue(e.target.value);
              getItem(e.target.value);
              getStore(e.target.value);
            }}
            type="text"
            name="search"
          />
          {show && (
            <div className={styles.searchDropdown}>
              <>
                <>
                  {categories.find((ele) => ele.label === "Stores")?.value && (
                    <>
                      <h4 className={styles.storeTitle}>
                        Stores ({store.length})
                      </h4>
                      <div className={styles.bord} />
                      <div className={styles.list}>
                        {store.length === 0 ? (
                          Boolean(value) ? (
                            <div className={styles.result}>
                              <p>No Result Found</p>
                              <button
                                onClick={() =>
                                  router.push(`/suggest-store/${value}`)
                                }
                              >
                                Suggest Store
                              </button>
                            </div>
                          ) : null
                        ) : (
                          store.slice(0, 4).map((stores) => (
                            <p
                              key={stores.value}
                              onClick={() => {
                                setOneStore({
                                  visible: true,
                                  id: stores.value,
                                  name: stores.label
                                });
                                setValue(stores.label);
                              }}
                              style={{ cursor: "pointer" }}
                            >
                              {stores.label}
                            </p>
                          ))
                        )}
                      </div>
                    </>
                  )}
                </>
              </>
              <>
                {categories.find((ele) => ele.label === "Meals")?.value && (
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
                            <button onClick={() => router.push("/suggestmeal")}>
                              Suggest Meal
                            </button>
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
                                  id: elem.value,
                                });
                                setValue(elem.label);
                                console.log(oneStore, 'one sttt')
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
                {categories.find((ele) => ele.label === "Products")?.value && (
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
                            <button onClick={() => router.push("/suggestmeal")}>
                              Suggest Product
                            </button>
                          </div>
                        ) : null
                      ) : (
                        filteredProduct()
                          ?.slice(0, 4)
                          .map((elem) => (
                            <p
                              key={elem.value}
                              onClick={() => {
                                setOneStore({
                                  visible: false,
                                  id: elem.value,
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
                {categories.find((ele) => ele.label === "Kitchen Utensils")
                  ?.value && (
                  <>
                    <h4 className={styles.storeTitle}>
                      Kitchen Utensils ({filteredUtensils().length})
                    </h4>
                    <div className={styles.bord} />
                    <div className={styles.list}>
                      {filteredUtensils().length === 0 ? (
                        Boolean(value) ? (
                          <div className={styles.result}>
                            <p>No Result Found</p>
                            <button onClick={() => router.push("/suggestmeal")}>
                              Suggest Utensil
                            </button>
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
                                  id: elem.value,
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
          onClick={() => {
            if (oneStore.visible) {
              localStorage.setItem("storeId", id)
              router.push(`/store/${oneStore.name}`)
            } else {
              items.item_type === "Meal"
                ? router.push(`/meal/${value}`)
                : items.item_type === "Product"
                ? router.push(`/product/${value}`)
                : router.push(`/product/${value}`);
            }
          }}
        >
          Search
        </button>
      </div>
    </div>
  );
};


