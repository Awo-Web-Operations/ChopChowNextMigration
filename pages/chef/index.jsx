import Head from "next/head";
import Header, { Header2 } from "../../src/components/Header/Header";
import Footer from "../../src/components/Footer/Footer";
import styles from "../../src/components/chef/chefs.module.css";

import { useEffect, useState } from "react";
import { useRouter } from "next/router";

import axios from "../../src/util/Api";
import { UserIcon } from "../../src/components/icons";
import { FaAngleLeft, FaAngleRight } from "react-icons/fa6";

const AllChefsPage = () => {
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
  const router = useRouter();
  const handleActiveLetter = (id) => {
    setActiveLetter(id);
  };

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [suppliers, setSuppliers] = useState([]);
  const [topSuppliers, setTopSuppliers] = useState([]);

  const fetchSuppliers = async (page, activeLetter) => {
    setIsLoading(true);
    const params = {};
    if (activeLetter) {
      params.startsWith = activeLetter;
    }
    try {
      const response = await axios(`/stores/all-supplier/${page}`, {
        method: "GET",
        // params: {
        //   ...params
        // },
        headers: {
          "Content-Type": "application/json",
        },
      });
      const allSuppliers = response.data.data;

      if (allSuppliers.length === 0) {
        const lastPageWithItems = page - 1;
        setTotalPages(lastPageWithItems);
      } else {
        setSuppliers(allSuppliers);
      }
      const lettersWithStores = allSuppliers.map((item) =>
        item.item_name[0].toUpperCase()
      );
      setAvailableLetters([...new Set(lettersWithStores)]);
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetTopSuppliers = async () => {
    setIsLoading(true);
    try {
      const response = await axios(`/stores/top-supplier`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const allSuppliers = response.data.data;

      setTopSuppliers(allSuppliers);
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePageClick = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const handleNextPage = () => {
    if (currentPage === totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePreviousPage = () => {
    if (currentPage !== totalPages) {
      setCurrentPage(currentPage - 1);
    }
    if (currentPage === 1) {
      setCurrentPage(currentPage);
    }
  };
  useEffect(() => {
    fetchSuppliers(currentPage);
  }, [currentPage]);

  useEffect(() => {
    fetTopSuppliers();
  }, []);

  return (
    <div className={styles.ChefContainer}>
      <Head>
        <title>Chop Chow Chef</title>
        <meta
          key="title"
          name="viewport"
          content="initial-scale=1.0, width=device-width"
        />
        <meta
          name="description"
          content="Discover Chef's recipes and grocery lists on Chop Chow"
        />
      </Head>
      <Header />
      <Header2 />
      <div className={styles.container}>
        <div className={styles.title}>
          <h1>Chefs</h1>
          <p>
            Find and connect with your favourite local and international chefs
            with ease.
          </p>
        </div>
        <div className={styles.inputContainer}>
          <input placeholder="Search for Chef" />
          <div className={styles.inputBtn}>
            <p>Search</p>
          </div>
        </div>
        <div className={styles.section}>
          <h2 className={styles.topPick}>Chopchow Top Pick</h2>
          <div className={styles.topPicks}>
            <div className={styles.allpicks}>
              {topSuppliers.map((elem) => (
                <div
                  style={{ textAlign: "center" }}
                  onClick={() =>
                    router.push(`/chef/${elem?.username}/${elem?._id}`)
                  }
                >
                  <div className={styles.border}>
                    <div className={styles.topPickImg}>
                      {elem?.profile_picture ? (
                        <img
                          src={elem?.profile_picture}
                          style={{ width: "100%", height: "100%" }}
                        />
                      ) : (
                        <div>
                          <UserIcon style={styles.topPickImg} />
                        </div>
                      )}
                    </div>
                  </div>
                  <p className={styles.username}>
                    {elem?.first_name
                      ? `${elem?.first_name} ${elem?.last_name}`
                      : `${elem?.username}`}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div>
          <h2 className={styles.topPick2}>All Chefs</h2>
          <div className={styles.alphabetContainer2}>
            {alphabets.map((elem, index) => (
              <span
                onClick={() => handleActiveLetter(index)}
                className={
                  activeLetter === index
                    ? styles.activespan
                    : styles.inactivespan
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
          <div className={styles.allpicks}>
            {suppliers.map((elem) => (
              <div
                className={styles.card}
                onClick={() =>
                  router.push(
                    `/chef/${elem?.user?.username}/${elem?.user?._id}`
                  )
                }
              >
                <div className={styles.border2}>
                  <div className={styles.topPickImg}>
                    {elem?.user?.profile_picture ? (
                      <img
                        src={elem?.user?.profile_picture}
                        style={{ width: "100%", height: "100%" }}
                      />
                    ) : (
                      <div>
                        <UserIcon style={styles.topPickImg} />
                      </div>
                    )}
                  </div>
                </div>
                <p className={styles.username}>
                  {elem?.user?.first_name
                    ? `${elem.user?.first_name} ${elem.user?.last_name}`
                    : `${elem.user?.username}`}
                </p>
              </div>
            ))}
          </div>
        </div>
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
      <Footer />
    </div>
  );
};
export default AllChefsPage;
