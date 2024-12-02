import styles from "../grocery/grocery.module.css";
import Image from "next/image";
import { AiFillStar } from "react-icons/ai";
export const Cards = ({ similar }) => {
  return (
    <div className={styles.sugImages}>
      {similar?.slice(0, 6).map((elem) => (
        <div style={{ width: "100%" }}>
          <div style={{ width: "100%" }}>
            <img
              src={elem.itemImage0}
              layout="responsive"
              style={{
                boxShadow: "rgba(0, 0, 0, 0.1) 0px 4px 12px",
                borderRadius: "8px",
                width: '100%',
                height: '130px'
              }}
              objectFit="cover"
              objectPosition="center"
            />
          </div>
          <div
            className={styles.flex2}
            style={{ width: "100%", marginTop: ".7rem" }}
          >
            <p className={styles.name2}>{elem.item_name}</p>
            <p className={styles.name3}>
              {elem?.item_price ? elem?.item_price : "N/A"}
            </p>
          </div>
          <p className={styles.store2}>
            {elem?.store ? elem?.store : "No Store"}
          </p>
          <div className={styles.flex2} style={{ width: "100%" }}>
            <div className={styles.rating}>
              <AiFillStar size={15} color="rgba(4, 213, 5, 1)" />
              <AiFillStar size={15} color="rgba(4, 213, 5, 1)" />
              <AiFillStar size={15} color="rgba(4, 213, 5, 1)" />
              <AiFillStar color="grey" size={15} />
              <AiFillStar color="grey" size={15} />
            </div>
            <p className={styles.minutes}>
              {Number(elem.meal_cook_time || 0) +
                Number(elem.meal_prep_time || 0)}{" "}
              Mins
            </p>
          </div>
        </div>
      ))}
    </div>
  );
};
