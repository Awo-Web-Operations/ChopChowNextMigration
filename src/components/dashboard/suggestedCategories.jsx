import styles from "./suggesteddescription.module.css";
import axios from "../../util/Api";
import { CloseFillIcon, FillterIcon } from "../../components/icons";
import { IoMdCloseCircle } from "react-icons/io";
import { useRouter } from "next/router";

export const SuggestedCategories = ({
  categories,
  status,
  setStatus,
  updateCategory,
  handleCatFilter,
  filteredCat,
  deleteCategory,
}) => {
  const router = useRouter()
  return (
    <div className={styles.container}>
      <table
        style={{ width: "100%", display: "grid", gridTemplateColumns: "1fr" }}
      >
        <thead>
          <tr className={styles.th1}>
            <td className={styles.td} onClick={() => {
              handleCatFilter(
                "category_name",
                Number(filteredCat?.category_name) === 1
                  ? -1
                  : 1
              )
            }}>Name</td>
            <td className={styles.td}>
              <p onClick={() => {
                let item_types = "Product";
                if (router?.query?.item_type === "Product") {
                  item_types = "Meal";
                } else if (router?.query?.item_type === "Meal") {
                  item_types = "Utensil";
                } else if (
                  router?.query?.item_type === "Utensil"
                ) {
                  item_types = "Product";
                }

                router.push({
                  pathname: router.pathname,
                  query: {
                    ...router.query,
                    item_type: item_types,
                  },
                });
                handleCatFilter("type", item_types)
              }}>
                Affliated Object <FillterIcon style={styles.FillterIcon} />
              </p>
            </td>
            <td className={styles.td}>
              <p style={{ cursor: "pointer" }} onClick={() => {
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
                handleCatFilter("status", item_status);
              }}>
                Status <FillterIcon style={styles.FillterIcon} />
              </p>
            </td>
            <td className={styles.td}>
              <p onClick={() => {
                handleCatFilter(
                  "createdAt",
                  Number(filteredCat?.createdAt) === 1
                    ? -1
                    : 1
                );
              }}>
                Date created <FillterIcon style={styles.FillterIcon} />
              </p>
            </td>
            <td className={styles.td}>Action</td>
          </tr>
        </thead>
        <tbody>
          {categories.map((element) => (
            <tr key={element?._id} className={styles.tr1}>
              <td className={styles.td1}>{element?.category_name}</td>
              <td className={styles.td1}>
                <span style={{ textTransform: "uppercase" }}>
                  {element?.affiliated_objects?.slice(0, 1)}
                </span>
                <span style={{ textTransform: "lowercase" }}>
                  {element?.affiliated_objects?.slice(1)}
                </span>
              </td>
              <td className={styles.td1}>
                <span
                  className={
                    (element.status === "Public") | "PUBLIC"
                      ? styles.statusText
                      : (element.status === "Pending") | "PENDING"
                        ? styles.statusText2
                        : (element.status === "Rejected") | "Rejected"
                          ? styles.rejected
                          : styles.statusText2
                  }
                >
                  <p style={{ textTransform: "capitalize" }}>
                    {element?.status}
                  </p>
                </span>
              </td>
              <td className={styles.td1}>
                {new Date(element?.createdAt)?.toLocaleDateString()}
              </td>
              <td className={styles.td1}>
                <select
                  onChange={(e) => {
                    updateCategory(element?._id, { status: e.target.value });
                  }}
                  className={styles.selected}
                >
                  <option selected={element.status === "PUBLIC"} value="Public">
                    Public
                  </option>
                  <option
                    selected={element.status === "REJECTED"}
                    value="Rejected"
                  >
                    Rejected
                  </option>
                  <option
                    selected={element.status === "PENDING"}
                    value="Pending"
                  >
                    Pending
                  </option>
                  <option selected={element.status === "DRAFT"} value="Draft">
                    Draft
                  </option>
                </select>
                <IoMdCloseCircle
                  onClick={() => deleteCategory(element._id)}
                  size={22}
                  style={{ marginLeft: ".8rem", cursor: "pointer" }}
                  color="grey"
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
