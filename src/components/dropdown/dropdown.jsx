import { IoMdCloseCircle } from "react-icons/io";
import Image from "next/image";
import styles from "../grocery/grocery.module.css";
import yellow from "../../../public/assets/meal_pics/yellow.jpeg";

export const CardDropdown = ({ element }) => {
  console.log(element, 'element')
  return (
    <div className={styles.dropdown1}>
      <div className={styles.headtext}>
        <p className={styles.subtext2}> Added Ingredients</p>
      </div>
      <div>
        {element?.item?.ingredeints_in_item?.map((ingredient) => (
          <>
            <div key={ingredient._id} className={styles.tr3}>
              <span style={{ display: "flex", alignItems: "center" }}>
                <input type="checkbox" className={styles.checkbox1} />
                <Image
                  src="/assets/store_pics/no-image-product.png"
                  width={35}
                  height={35}
                  objectFit="cover"
                  objectPosition="center"
                />
              </span>
              <span style={{ display: "flex", alignItems: "center" }}>
                <p>{ingredient?.item_name}</p>
              </span>
              <span className={styles.tdata}>
                <p>
                  {ingredient?.item_quantity} {ingredient?.item_measurement}
                </p>
              </span>
              <span className={styles.tdata}>
                <p>
                  {ingredient?.item_price ? `$${ingredient.item_price}` : "N/A"}
                </p>
              </span>
              <span className={styles.textcenter2}>
                <p className={styles.textcenter}>30 minutes</p>
              </span>
              <span className={styles.tdata}>
                <IoMdCloseCircle className={styles.close} color="#949494" />
              </span>
            </div>
            <div className={styles.border1}></div>
          </>
        ))}
      </div>
    </div>
  );
};
