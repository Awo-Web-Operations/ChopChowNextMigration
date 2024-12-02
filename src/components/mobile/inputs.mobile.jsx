import styles from "../grocery/grocery.module.css";
import { DropDownSelect } from "../select/select";
import Image from "next/image";

export const MobileInputs = ({
  getItem,
  setValue,
  setItemsToAdd,
  setIsShow,
  addItemToGrocery,
  itemsToAdd,
  item,
  measurements,
  addJsonDataToGroceryList
}) => {
  return (
    <div className={styles.grid2}>
      <DropDownSelect
        onChange={(value) => {
          getItem(value);
          setValue(value);
        }}
        noOptionsMessage={() => (
          <div className={styles.noOptions}>
            <p className={styles.no_item}>Item Not Found</p>
            <button className={styles.btn3} onClick={addJsonDataToGroceryList}>
              Add Item to List
            </button>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                marginTop: "2rem",
              }}
            >
              <div className={styles.line}></div>
              <p className={styles.or}>OR</p>
              <div className={styles.line}></div>
            </div>
            <p className={styles.add}>Add Details to Suggested Item</p>
            <button
              className={styles.btnOutline}
              onClick={() => setIsShow(true)}
            >
              Suggest Item
            </button>
          </div>
        )}
        options={item}
        onSelect={(option) =>
          setItemsToAdd({ ...itemsToAdd, itemId: option.value })
        }
        placeholder="Search meals, products and ingredients"
        formatOptionLabel={(e, { context }) =>
          context === "value" ? (
            <div>
              <p>{e.label}</p>
            </div>
          ) : (
            <div className={styles.data}>
              <div className={styles.flex3}>
                {e?.image && (
                  <Image
                    src={e?.image}
                    width={40}
                    objectPosition="center"
                    objectFit="cover"
                    height={40}
                    borderRadius="4px"
                    style={{ borderRadius: "4px" }}
                  />
                )}
                <p className={styles.labelName} style={{ marginLeft: "13px" }}>
                  {e.label}
                </p>
              </div>
              <div className={styles.second}>
                <p className={styles.labelName}>{e.store}</p>
              </div>
              <div className={styles.third}>
                <p className={styles.labelName} style={{ textAlign: "center" }}>
                  {" "}
                  {e.price}
                </p>
              </div>
            </div>
          )
        }
      />
      <div className={styles.subgrid}>
        <input
          placeholder="Quantity"
          value={itemsToAdd.quantity}
          onChange={(e) =>
            setItemsToAdd({ ...itemsToAdd, quantity: e.target.value })
          }
          className={styles.inputbg}
        />
        <DropDownSelect
          onChange={(value) => console.log(value)}
          onSelect={(option) =>
            setItemsToAdd({ ...itemsToAdd, measurement: option.value })
          }
          options={measurements}
          placeholder="Measurement"
        />
      </div>
      <button className={styles.btn2} onClick={() => addItemToGrocery()}>
        Add New Item
      </button>
    </div>
  );
};
