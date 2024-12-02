import React, { useState } from "react";
import { useDispatch } from "react-redux";
import styles from "../../components/dashboard/management.module.css";
import { TbDotsVertical } from "react-icons/tb";
import { addUserToStore, removeUserFromStore } from "../../actions/UserStore";
import { UserIcon } from "../icons";
import { toast } from "react-toastify";
import { AiOutlineClose } from "react-icons/ai";
import { RiDeleteBin6Line } from "react-icons/ri";

export const SubAdmins = ({ storeId, storeData, handleGetStore }) => {
  const dispatch = useDispatch();
  const [show, setShow] = useState(false);
  const [formState, setFormState] = useState({
    first_name: "",
    last_name: "",
    email: "",
    number: "",
  });
  const [selectedAdmin, setSelectedAdmin] = useState(null);

  const handleRemove = async () => {
    try {
      if (!selectedAdmin) {
        console.error("No subadmin selected to remove.");
        return;
      }
      await dispatch(removeUserFromStore(storeId, selectedAdmin));
      toast.success("Sub admin removed successfully");
      handleGetStore();
    } catch (error) {
      console.error("Error removing sub admin:", error);
      toast.error("Failed to remove sub admin. Please try again later.");
    } finally {
      setShow(false);
    }
  };

  console.log(selectedAdmin, "one store data");
  console.log(storeData, "storeData");
  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormState({
      ...formState,
      [name]: value,
    });
  };
  const handleSubmit = async () => {
    try {
      await dispatch(addUserToStore(storeId, formState));
      toast.success("Sub admin added successfully");
      handleGetStore();
    } catch (error) {
      console.log(error, "erryy");
      toast.error(error?.response?.data?.message?.messsage);
    }
  };

  return (
    <div>
      {/* <div className={styles.flex}>
        <h5>Admins</h5>
      </div>
      <div className={styles.subadmin}>
        <div className={styles.flexstart}>
          <div className={styles.user}>
            <img src="/assets/icons/girl.jpg" alt="Sub Admin" />
          </div>
          <div style={{ marginLeft: "1.5rem" }}>
            <h5 className={styles.admin_name}>Rachel Anterta</h5>
            <p className={styles.role}>Sub Admin</p>
          </div>
        </div>
        <div className={styles.center}>
          <TbDotsVertical color="#949494" size={20} />
        </div>
      </div> */}
      <div className={styles.flex} style={{ marginTop: "2rem" }}>
        <h5>Sub Admins</h5>
      </div>
      <div
        style={{
          gap: "2rem",
          display: "flex",
          flexDirection: "column",
          position: "relative",
        }}
      >
        {storeData?.store_sub_admins.map((elem) => (
          <div className={styles.subadmin}>
            {show && selectedAdmin == elem._id && (
              <div className={styles.removeAdmin}>
                <div
                  className={styles.closeContainer}
                  onClick={() => setShow(false)}
                >
                  <AiOutlineClose className={styles.closeIcon} />
                </div>
                <div
                  style={{ display: "flex", alignItems: "center", gap: "4px" }}
                  onClick={() => handleRemove()}
                >
                  <RiDeleteBin6Line style={{ marginTop: "1rem" }} color="red" />
                  <p>Remove sub-admin</p>
                </div>
              </div>
            )}
            <div className={styles.flexstart}>
              <div className={styles.user}>
                {elem.profile_picture ? (
                  <img src={elem?.profile_picture} alt="Sub Admin" />
                ) : (
                  <UserIcon />
                )}
              </div>
              <div style={{ marginLeft: "1.5rem" }}>
                <h5 className={styles.admin_name}>
                  {elem?.first_name} {elem?.last_name}
                </h5>
                <p className={styles.role}>Sub Admin</p>
              </div>
            </div>
            <div
              className={styles.center}
              onClick={() => {
                setSelectedAdmin(elem._id);
                setShow(true);
              }}
            >
              <TbDotsVertical color="#949494" size={20} />
            </div>
          </div>
        ))}
      </div>
      <p className={styles.add}>Add New Sub Admin</p>
      <div className={styles.payment}>
        <div className={styles.contact}>
          <p>Contact Information</p>

          <div className={styles.columnflex}>
            <div className={styles.column}>
              <label>First Name</label>
              <input
                onChange={handleChange}
                value={formState.first_name}
                type="text"
                name="first_name"
              />
            </div>
            <div className={styles.column}>
              <label>Last Name</label>
              <input
                onChange={handleChange}
                value={formState.last_name}
                type="text"
                name="last_name"
              />
            </div>
          </div>
          <div className={styles.column}>
            <label>Email Address</label>
            <input
              onChange={handleChange}
              value={formState.email}
              type="text"
              name="email"
            />
          </div>
          <div className={styles.column}>
            <label>Phone Number</label>
            <input
              onChange={handleChange}
              value={formState.number}
              type="text"
              name="number"
            />
          </div>
        </div>
      </div>
      <div className={styles.flexend}>
        <button className={styles.button} onClick={handleSubmit}>
          Send Link
        </button>
      </div>
    </div>
  );
};
