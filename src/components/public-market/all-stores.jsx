import { useState, useEffect, useRef } from "react";
import axios from "../../util/Api";
import styles from "./stores.module.css";
import { MealDropDown } from "./dropdown";
import Image from "next/image";
import { BiSolidDownArrow } from "react-icons/bi";
import StorePics from "../../../public/assets/store_pics/store.jpeg";
import { FaAngleLeft, FaAngleRight } from "react-icons/fa6";
import { MobileSearch } from "../dropdown/mobile-search";

export const AllStores = () => {
  const alphabets = [
    "A",
    "B",
    "C",
    "D",
    "E",
    "F",
    "G",
    "H",
    "I",
    "J",
    "K",
    "L",
    "M",
    "N",
    "O",
    "P",
    "Q",
    "R",
    "S",
    "T",
    "U",
    "V",
    "W",
    "X",
    "Y",
    "Z",
  ];

  const [activeLetter, setActiveLetter] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(false);

  const handleActiveLetter = (elem, id) => {
    setActiveLetter(id);
    fetchStores(currentPage, elem)
  };
  const [stores, setStores] = useState([]);
  const [isShow, setIsShow] = useState(false);
  const [selected, SetSelected] = useState(null);
  const [showDropdown, setShowDropdown] = useState(true);
  const [storeInfo, setStoreInfo] = useState({
    id: 0,
    name: "",
    image: "",
    description: "",
    address: "",
    rating: 0,
  });
  const ref = useRef();

  const [selectedStore, setSelectedStore] = useState({
    items: [],
    supplier: {},
  });

  const fetchOneStore = async (storeId) => {
    try {
      const response = await axios(
        `/inventory/get-store-inventory/${storeId}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      setSelectedStore(response.data.data);
      setIsShow(true);
    } catch (error) {
      console.log(error);
    }
  };
  console.log(stores, "one store");
  const fetchStores = async (page = 1, activeLetter = '') => {
    setIsLoading(true);
    const params = {};
    if(activeLetter){
      params.startsWith = activeLetter
    }
    try {
      const response = await axios(`/stores/getallstores/${page}?limit=10&status=PUBLIC`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        params: {
          ...params
        }
      });
      console.log(response.data.data.products, "resp");
      const allItems = response.data.data.products;
      const totalItems = response.data.data.count;

      const filteredStores = allItems

      const totalPages = Math.ceil(totalItems / 20);
      setTotalPages(totalPages);
      setStores(filteredStores)
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchStores(currentPage);
  }, [currentPage]);
  console.log(selectedStore, "storess");
  useEffect(() => {
    // Get the hash value from the URL
    const hash = window.location.hash;

    // Use the hash value as the target ID for scrolling
    const targetId = hash ? hash.substring(1) : "store";

    // Scroll to the target section
    if (targetId) {
      const element = document.getElementById(targetId);
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
      }
    }
  }, []);

  const handlePageClick = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const handleNextPage = () => {
    if (currentPage <= totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePreviousPage = () => {
    if (currentPage !== 0) {
      setCurrentPage(currentPage -1);
    }
  };

  return (
    <div className={styles.storeContainer1}>
      <div className={styles.marketplace}>
        <h1>Stores</h1>
      </div>
      <div className={styles.topcontainer}>
        <p className={styles.marketplaceText}>
          Have a walk-in experience at your favourite stores from the comfort of your home.
        </p>
        <div className={styles.flexItems}>
          <div className={styles.filter}>
            <p>Filter by: Distance</p>
            <BiSolidDownArrow color="rgba(109, 109, 109, 0.5)" size={15} />
          </div>
          <div className={styles.filter}>
            <p>Sort: Name A-Z</p>
            <BiSolidDownArrow color="rgba(109, 109, 109, 0.5)" size={15} />
          </div>
        </div>
      </div>
      <div className={styles.searchbar}>
          <MobileSearch setShowDropdown={setShowDropdown} />
        </div>
      <div className={styles.alphabetContainer}>
        {alphabets.map((elem, index) => (
          <span
            onClick={() => handleActiveLetter(elem, index)}
            className={
              activeLetter === index ? styles.activespan : styles.inactivespan
            }
          >
            <p
              className={
                activeLetter === index
                  ? styles.activeLetter
                  : styles.inactiveletter
              }
            >
              {elem}
            </p>
          </span>
        ))}
      </div>
      <div className={styles.storeImgContainer}>
        <div className={styles.storeFlex}>
          <div className={styles.storediv}>
            <img src="/assets/store_pics/store.jpeg" />
          </div>
          <div className={styles.storeDetails}>
            <h3>Sweet Sensations</h3>
            <p>
              At Sweet Sensations, we're dedicated to crafting irresistible
              treats that tantalize your taste buds and warm your heart. From
              decadent chocolate delights to delicate pastries, each creation is
              made with passion and precision
            </p>
            <p className={styles.storeLocation}>Accra- Ghana</p>
          </div>
        </div>
      </div>
      <div className={styles.stores}>
        {stores
          .map((store, id) => {
            return (
              <>
                <div>
                  <div key={id} className={styles.cardWrapper}>
                    <div
                      className={styles.card}
                      onClick={() => {
                        fetchOneStore(store._id);
                        SetSelected(id);
                        setStoreInfo({
                          id: store._id,
                          name: store?.store_name,
                          image: store?.profile_picture,
                          description: store?.description,
                          address:
                            store?.supplier_address?.address +
                            ", " +
                            store?.supplier_address?.city +
                            " - " +
                            store?.supplier_address?.country,
                          rating: store?.average_rating,
                        });
                      }}
                    >
                      {
                        <div>
                          <Image
                            src={
                              store?.profile_picture
                                ? store?.profile_picture
                                : "/assets/store_pics/no-image-store.png"
                            }
                            className={styles.storeImg}
                            width={200}
                            height={200}
                            objectFit="cover"
                            objectPosition="center"
                          />
                          <p className={styles.name}>{store?.store_name}</p>
                          <p
                            className={styles.storeName}
                            style={{ marginTop: ".4rem" }}
                          >
                            {store?.supplier_address
                              ? store?.supplier_address?.city +
                                " - " +
                                store?.supplier_address?.country
                              : ""}
                          </p>
                        </div>
                      }
                    </div>
                  </div>
                  {isShow && selected === id && (
                    <MealDropDown
                      storeInfo={storeInfo}
                      setIsShow={setIsShow}
                      selectedStore={selectedStore}
                      id={storeInfo?.id}
                      name={storeInfo?.name}
                    />
                  )}
                </div>
              </>
            );
          })}
      </div>

      <div className={styles.paginationContainer}>
        <div
          onClick={handlePreviousPage}
          disabled={currentPage === 1}
          className={
            currentPage === 1 ? styles.disableButn : styles.paginationButton2
          }
        >
          <FaAngleLeft
            size={17}
            color={currentPage === 1 ? "#6D6D6D" : "#52575C"}
          />
        </div>
        {[1, 2].map((pageNumber) => (
          <div
            key={pageNumber}
            className={
              currentPage === pageNumber
                ? styles.activepaginationButton
                : styles.paginationButton2
            }
            onClick={() => handlePageClick(pageNumber)}
          >
            {pageNumber}
          </div>
        ))}
        <div onClick={handleNextPage} className={styles.paginationButton2}>
          <FaAngleRight size={17} />
        </div>
      </div>
    </div>
  );
};
