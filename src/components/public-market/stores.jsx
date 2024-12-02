import { useState, useEffect, useRef } from "react";
import axios from "../../util/Api";
import styles from "./stores.module.css";
import { MealDropDown } from "./dropdown";
import Image from "next/image";
import { Element } from "react-scroll";
import { BiSolidDownArrow } from "react-icons/bi";

export const Stores = () => {
  const [stores, setStores] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [isShow, setIsShow] = useState(false);
  const [selected, setSelected] = useState(null);
  const [storeInfo, setStoreInfo] = useState({
    id: 0,
    name: "",
    image: "",
    description: "",
    address: "",
    rating: 0,
  });
  const [uniqueItemIds, setUniqueItemIds] = useState(new Set());
  const [selectedStore, setSelectedStore] = useState({
    items: [],
    supplier: {},
  });
  const [hasMoreData, setHasMoreData] = useState(true);

  const handleLoadMore = () => {
    setCurrentPage((prev) => prev + 1);
  };

  const fetchOneStore = async (Id) => {
    try {
      const response = await axios.get(`/inventory/get-store-inventory/${Id}`);
      setSelectedStore(response.data.data);
      console.log(response.data.data, 'response.data.data')
      setIsShow(true);
    } catch (error) {
      console.error("Error fetching store inventory:", error);
    }
  };

  const fetchStores = async (page) => {
    try {
      const response = await axios.get(`/stores/getallstores/${page}?limit=10&status=PUBLIC`);
      const allItems = response.data.data.products;
      console.log(allItems, 'all')
      const totalItems = response.data.data.count;

      const newItems = allItems.filter((item) => !uniqueItemIds.has(item._id));

      if (newItems.length > 0) {
        setStores((prev) => [...prev, ...newItems]);
        setUniqueItemIds((prev) => new Set([...prev, ...newItems.map((item) => item._id)]));
      }

      const totalPages = Math.ceil(totalItems / 10);
      setTotalPages(totalPages);

      setHasMoreData(page < totalPages);
    } catch (error) {
      console.error("Error fetching stores:", error);
    }
  };

  useEffect(() => {
    fetchStores(currentPage);
  }, [currentPage]);

  useEffect(() => {
    const hash = window.location.hash;
    const targetId = hash ? hash.substring(1) : "store";

    const element = document.getElementById(targetId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  }, []);

  return (
    <div className={styles.storeContainer1}>
      <div className={styles.topcontainer1}>
        <Element id="store" style={{ fontSize: "2rem", marginBottom: "1rem" }}>
          Stores
        </Element>
        <div className={styles.filter}>
          <p>Filter by: Distance</p>
          <BiSolidDownArrow color="rgba(109, 109, 109, 0.5)" size={15} />
        </div>
      </div>
      <div className={styles.stores}>
        {stores.map((store, id) => (
          <div key={id} style={{ display: "flex", flexDirection: "column" }}>
            <div className={`${styles.cardWrapper}`}>
              <div
                className={styles.card}
                onClick={() => {
                  fetchOneStore(store._id);
                  setSelected(id);
                  setStoreInfo({
                    id: store._id,
                    name: store?.store_name,
                    image: store?.profile_picture,
                    description: store?.description,
                    address: `${store?.supplier_address?.address}, ${store?.supplier_address?.city} - ${store?.supplier_address?.country}`,
                    rating: store?.average_rating,
                  });
                }}
              >
                <Image
                  src={store?.profile_picture || "/assets/store_pics/no-image-store.png"}
                  className={styles.storeImg}
                  width={200}
                  height={200}
                  objectFit="cover"
                  objectPosition="center"
                />
                <p className={styles.name}>{store?.store_name}</p>
                <p className={styles.storeName} style={{ marginTop: ".4rem" }}>
                  {store?.supplier_address
                    ? `${store?.supplier_address?.city} - ${store?.supplier_address?.country}`
                    : ""}
                </p>
              </div>
            </div>
            {isShow && selected === id && (
              <MealDropDown
                isShow={isShow}
                storeInfo={storeInfo}
                setIsShow={setIsShow}
                selectedStore={selectedStore}
                id={storeInfo?.id}
                name={storeInfo?.name}
              />
            )}
          </div>
        ))}
      </div>

      <p
        className={styles.view}
        onClick={hasMoreData ? handleLoadMore : null}
      >
        {hasMoreData ? "View More" : "View More"}
      </p>
      <div className={styles.border} />
    </div>
  );
};
