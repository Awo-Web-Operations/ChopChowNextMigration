import styles from "./suggesteddescription.module.css";
import axios from "../../util/Api";
import { CloseFillIcon, FillterIcon } from "../../components/icons";
import { IoMdCloseCircle } from "react-icons/io";
import { useRouter } from "next/router";

export const SuggestedDescription = ({
  descriptions,
  updateDescription,
  deleteDescription,
  status,
  setStatus,
  filteredDescription,
  handleFilteredDescription
}) => {
  const handleStatus = () => {
    if (status === "all") {
      setStatus("Pending");
    } else if (status === "Pending") {
      setStatus("Rejected");
    } else if (status === "Rejected") {
      setStatus("Draft");
    } else if (status === "Draft") {
      setStatus("Public");
    } else {
      setStatus("all");
    }
  };
  const router = useRouter()
  return (
    <div className={styles.container}>
      <table
        style={{ width: "100%", display: "grid", gridTemplateColumns: "1fr" }}
      >
        <thead>
          <tr className={styles.th1}>
            <td className={styles.td} onClick={() => {
              handleFilteredDescription(
                "description_key",
                Number(filteredDescription?.description_key) === 1
                  ? -1
                  : 1
              );
            }}>Name</td>
            <td className={styles.td}>
              <p>
                Formatted string
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
                console.log(item_status, 'itemstatus', router?.query, router?.query?.item_status === 'Public')
                router.push({
                  pathname: router.pathname,
                  query: {
                    ...router.query,
                    item_status,
                  },
                });
                handleFilteredDescription("status", item_status);
              }}>
                Status <FillterIcon style={styles.FillterIcon} />
              </p>
            </td>
            <td className={styles.td}>
              <p onClick={() => {
                handleFilteredDescription(
                  "createdAt",
                  Number(filteredDescription?.createdAt) === 1
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
          {descriptions.map((element) => (
            <tr key={element?._id} className={styles.tr1}>
              <td className={styles.td1}>
                {element?.description_key?.split("_").join(" ")}
              </td>
              <td className={styles.td1}>{element?.formatted_string}</td>
              <td className={styles.td1}>
                <p
                  className={
                    element.status === "Public"
                      ? styles.statusText
                      : element.status === "Pending"
                        ? styles.statusText2
                        : element.status === "Rejected"
                          ? styles.rejected
                          : styles.statusText2
                  }
                  style={{ textTransform: "capitalize" }}
                >
                  {element?.status}
                </p>
              </td>
              <td className={styles.td1}>
                {new Date(element?.createdAt)?.toLocaleDateString()}
              </td>
              <td className={styles.td1}>
                <select
                  onChange={(e) => {
                    updateDescription({
                      status: e.target.value,
                      _id: element?._id,
                    });
                  }}
                  className={styles.selected}
                >
                  <option selected={element.status === "Public"} value="Public">
                    Public
                  </option>
                  <option
                    selected={element.status === "Rejected"}
                    value="Rejected"
                  >
                    Rejected
                  </option>
                  <option
                    selected={element.status === "Pending"}
                    value="Pending"
                  >
                    Pending
                  </option>
                  <option selected={element.status === "Draft"} value="Draft">
                    Draft
                  </option>
                </select>
                <IoMdCloseCircle
                  size={22}
                  style={{ marginLeft: ".8rem", cursor: "pointer" }}
                  color="grey"
                  onClick={() => deleteDescription(element._id)}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
