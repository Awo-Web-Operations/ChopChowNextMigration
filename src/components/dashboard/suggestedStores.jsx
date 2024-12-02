import styles from "./suggesteddescription.module.css";
import axios from "../../util/Api";
import { CloseFillIcon, FillterIcon } from "../../components/icons";
import { IoMdCloseCircle } from "react-icons/io";
import Store from "../individualPage/Store";
import WestIcon from "@mui/icons-material/West";
import moment from "moment";
import { useState } from "react";
import Head from "next/head";
import { useRouter } from "next/router";
import { connect } from "react-redux";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";

const SuggestedStores = ({
  allstores,
  openStoreSuggestion,
  setOpenStoreSuggestion,
  updateStoreStatus,
  toggleChangeStoreStatus,
  setStoreStatus,
  deleteStore,
  changeStoreStatus,
  storeStatus,
  filteredStores,
  setFilteredStores,
  handleFilterStores
}) => {
  console.log(allstores, "alll");
  const [selectedStore, setSelectedStore] = useState("");
  const [selected, setSelected] = useState({
    items: [],
    supplier: {},
  });

  const handleClickStore = (storeId) => {
    fetchOneStore()
  };
  const closeStoreSuggestion = () => {
    setOpenStoreSuggestion(false);
  };
  const fetchOneStore = async (id) => {
    try {
      const response = await axios(`/stores/getstore/${id}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      console.log(response.data.data, "one store");
      setSelected(response.data.data);
    } catch (error) {
      console.log(error);
    }
  };
  console.log(selected, 'selected')
  const router = useRouter();
  return (
    <>
      <Head>
        <title>Store</title>
        <meta
          key="title"
          name="viewport"
          content="initial-scale=1.0, width=device-width"
        />
      </Head>
      <div className={styles.container}>
        <table
          style={{ width: "100%", display: "grid", gridTemplateColumns: "1fr" }}
        >
          <thead>
            <tr className={styles.th1}>
              <td className={styles.td} onClick={() => {
                handleFilterStores(
                  "store_name",
                  Number(filteredStores?.store_name) === 1
                    ? -1
                    : 1
                );
              }}>Name</td>
              <td className={styles.td}>
                <p onClick={() => {
                  handleFilterStores(
                    "country",
                    Number(filteredStores?.country) === 1
                      ? -1
                      : 1
                  );
                }}>
                  Country <FillterIcon style={styles.FillterIcon} />
                </p>
              </td>
              <td className={styles.td}>
                <p style={{ cursor: "pointer" }}
                  onClick={() => {
                    let item_status = "Public";
                    if (router?.query?.item_status === "Public") {
                      item_status = "Draft";
                    } else if (
                      router?.query?.item_status === "Draft"
                    ) {
                      item_status = "Pending";
                    } else if (
                      router?.query?.item_status === "Pending"
                    ) {
                      item_status = "Rejected";
                    } else if (
                      router?.query?.item_status === "Rejected"
                    ) {
                      item_status = "Public";
                    }
                    console.log(router, 'router?.query?.item_status')

                    router.push({
                      pathname: router.pathname,
                      query: {
                        ...router.query,
                        item_status,
                      },
                    });
                    handleFilterStores("status", item_status);
                  }}
                >
                  Status <FillterIcon style={styles.FillterIcon} />
                </p>
              </td>
              <td className={styles.td}>
                <p onClick={() => {
                  handleFilterStores(
                    "createdAt",
                    Number(filteredStores?.createdAt) === 1
                      ? -1
                      : 1
                  )
                }}>
                  Date created <FillterIcon style={styles.FillterIcon} />
                </p>
              </td>
              <td className={styles.td}>Action</td>
            </tr>
          </thead>
          <tbody>
            {allstores.map((element) => (
              <tr key={element?._id} className={styles.tr1}>
                <td
                  className={styles.td1}
                  onClick={() => {
                    fetchOneStore(element._id);
                    setOpenStoreSuggestion(true);
                  }}
                >
                  {element?.store_name}
                </td>
                <td className={styles.td1}>
                  <span style={{ textTransform: "capitalize" }}>
                    {element?.supplier_address?.country}
                  </span>
                </td>
                <td className={styles.td1}>
                  <span style={{ textTransform: "uppercase" }}>
                    {element?.status.slice(0, 1)}
                  </span>
                  <span style={{ textTransform: "lowercase" }}>
                    {element?.status.slice(1)}
                  </span>
                </td>
                <td className={styles.td1}>
                  {new Date(element?.createdAt)?.toLocaleDateString()}
                </td>
                <td className={styles.td1}>
                  <div onClick={() => deleteStore(element?._id)}>
                    <IoMdCloseCircle
                      size={22}
                      style={{ marginLeft: ".8rem", cursor: "pointer" }}
                      color="grey"
                    />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {openStoreSuggestion && (
          <div
            style={{
              position: "absolute",
              top: "11%",
              left: "270px",
              paddingRight: "2rem",
              zIndex: 20,
              background: "white",
              width: "calc(100% - 270px)",
              height: "100vh",
            }}
          >
            <div
              style={{
                background: `url(${selected?.supplier?.background_picture
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
                      <div onClick={() => closeStoreSuggestion()}>
                        <WestIcon className={styles.goback_header_page_arrow} />
                      </div>
                      <li onClick={() => closeStoreSuggestion()}>back</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
            <div className={styles.date}>
              <p>
                Store Created:{" "}
                <p style={{ marginLeft: ".2rem" }}>
                  {" "}
                  {moment(
                    selected?.supplier?.createdAt
                  ).format("MMMM Do, YYYY")}
                </p>
              </p>
            </div>
            <div
              style={{
                display: "flex",
                alignItems: "flex-start",
                justifyContent: "flex-end",
              }}
            >
              <p
                style={{
                  width: "10rem",
                  marginTop: "3rem",
                  textTransform: "capitalize",
                }}
                className={
                  selected?.supplier?.status === "PENDING"
                    ? styles.statusText2
                    : selected?.supplier?.status === "PUBLIC"
                      ? styles.statusText
                      : styles.rejected
                }
              >
                {selected?.supplier?.status}
              </p>
              <div className={styles.status_update}>
                <div
                  onClick={() => toggleChangeStoreStatus()}
                  className={styles.select_box}
                >
                  <p style={{ textTransform: "capitalize" }}>
                    {storeStatus.length > 0
                      ? storeStatus
                      : selected?.supplier?.status}
                  </p>
                  <ArrowDropDownIcon className={styles.select_box_icon} />
                </div>
                {changeStoreStatus && (
                  <div className={styles.select_options2}>
                    <p
                      onClick={() => {
                        updateStoreStatus("PUBLIC", selected.supplier._id)
                      }}
                    >
                      Public
                    </p>
                    <p
                      onClick={() =>
                        updateStoreStatus("PENDING", selected.supplier._id)
                      }
                    >
                      Pending
                    </p>
                    <p
                      onClick={() =>
                        updateStoreStatus("REJECTED", selected.supplier._id)
                      }
                    >
                      Rejected
                    </p>
                  </div>
                )}
              </div>
            </div>
            <Store
              store={selected.supplier}
              items={
                selected.items
              }
            />
          </div>
        )}
      </div >
    </>
  );
};
function mapStateToProp(state) {
  return {
    auth: state.Auth,
  };
}

export default connect(mapStateToProp)(SuggestedStores);
