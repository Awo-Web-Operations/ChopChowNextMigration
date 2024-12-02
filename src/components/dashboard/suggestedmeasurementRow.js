import styles from "./suggesteddescription.module.css";
import axios from "../../util/Api";
import { FillterIcon } from "../icons";
import { IoMdCloseCircle } from "react-icons/io";
import { useRouter } from "next/router";

export const SuggestedMeasurement = ({
  measurements,
  updateMeasurement,
  deleteMeasurement,
  status,
  setStatus,
  filteredMesr,
  handleFilteredMesr
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
          <tr className={styles.th}>
            <th className={styles.td} onClick={() => {
              handleFilteredMesr(
                "measurement_name",
                Number(filteredMesr?.measurement_name) === 1
                  ? -1
                  : 1
              )
            }}>Name</th>
            <th
              className={styles.td}
              style={{ cursor: "pointer" }}
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
                router.push({
                  pathname: router.pathname,
                  query: {
                    ...router.query,
                    item_status,
                  },
                });
                handleFilteredMesr("status", item_status);
              }}
            >
              Status <FillterIcon style={styles.FillterIcon} />
            </th>
            <th className={styles.td} onClick={() => {
              handleFilteredMesr(
                "createdAt",
                Number(filteredMesr?.createdAt) === 1
                  ? -1
                  : 1
              );
            }}>
              Date created <FillterIcon style={styles.FillterIcon} />
            </th>
            <th className={styles.td}>Action</th>
          </tr>
        </thead>
        <tbody>
          {measurements.map((element) => (
            <tr key={element?._id} className={styles.tr}>
              <td className={styles.td1}>
                {element?.measurement_name?.split("_").join(" ")}
              </td>
              <td className={styles.td1}>
                <p
                  style={{ textTransform: "capitalize" }}
                  className={
                    element.status === "Public"
                      ? styles.statusText3
                      : element.status === "Pending"
                        ? styles.statusText4
                        : element.status === "Rejected"
                          ? styles.rejected2
                          : styles.statusText4
                  }
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
                    updateMeasurement({
                      status: e.target.value,
                      measurement_name: element?.measurement_name,
                    });
                  }}
                  className={styles.selected}
                >
                  <option
                    selected={element.status === "Public"}
                    value="Public"
                    style={{ fontSize: ".5rem" }}
                  >
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
                  onClick={() =>
                    deleteMeasurement({
                      measurement_name: element?.measurement_name,
                    })
                  }
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
