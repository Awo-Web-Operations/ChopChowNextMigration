import styles from "../../components/modal/modal.module.css";
import { useCallback, useEffect, useRef, useState } from "react";
import { AiFillCloseCircle } from "react-icons/ai";
import axios from "../../util/Api";
import { toast } from "react-toastify";
import { getLocalGroceryList } from "../../util";

export const Modal = ({
  show,
  setShow,
  fetchList,
  details = {
    listName: "",
    description: "",
    id: "",
  },
  setDetails,
  addItemToGrocery,
  isUserOnline,
}) => {
  const targetElementRef = useRef(null);
  const [modalState, setModalState] = useState({
    listName: details.listName,
    description: details.description,
  });
  const { listName, description } = modalState;

  function onChange(e) {
    setModalState({ ...modalState, [e.target.name]: e.target.value });
  }

  const handleCreateLocalGroceryList = useCallback(() => {
    const localGrocery = getLocalGroceryList();
    const payload = {
      createdAt: new Date(),
      description,
      groceryItems: [],
      listName,
      status: "Private",
      user: JSON.parse(localStorage.getItem("user") || "{}"),
      _id: localGrocery?.length + 1,
    };

    console.log("handleCreate line 88 popup modal", payload)
    const chechHasAlreadyBeenAddedLocally = localGrocery.some(
      (ele) => ele?.listName === listName
    );
    if (chechHasAlreadyBeenAddedLocally)
      return alert(
        `Grocery list with name ${listName} has already been created`
      );

    localStorage.setItem(
      "grocery-list",
      JSON.stringify([...localGrocery, payload])
    );
    setShow(false);
    fetchList();
    toast.success("Grocery list created locally successfully");
  }, [description, listName, getLocalGroceryList, setShow, localStorage]);

  const editLocalList = useCallback(() => {
    let localGrocery = getLocalGroceryList();
    localGrocery = localGrocery.map((element) => {
      if (element?._id === details.id) {
        return {
          ...element,
          listName,
          description,
        };
      } else {
        return element;
      }
    });
    localStorage.setItem("grocery-list", JSON.stringify([...localGrocery]));
    setShow(false);
    fetchList();
    toast.success("Grocery list edited locally successfully");
  }, [
    listName,
    description,
    details,
    getLocalGroceryList,
    localStorage,
    setShow,
  ]);

  const handleCreate = async () => {
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    console.log("handleCreate line 88 popup modal", user)
    if (!Boolean(Object.keys(user).length)) {
      handleCreateLocalGroceryList();
    } else {
      if (!modalState.listName && !modalState.description) {
        return alert("Enter List Name and description");
      }
      try {
        const user = JSON.parse(localStorage.getItem("user"));
        let payload = {
          listName: modalState.listName,
          user: user._id,
        };
        if (modalState.description) {
          payload.description = modalState.description;
        }

        const response = await axios(`/groceries/create`, {
          method: "POST",
          data: payload,
        });
        if (addItemToGrocery) {
          addItemToGrocery(modalState.listName);
        }
        fetchList();

        if (!addItemToGrocery) {
          toast.success("Grocery list created successfully");
        }
        setShow(!show);
      } catch (error) {
        console.log(error);
      }
    }
  };

  const handleEdit = async () => {
    if (!isUserOnline) {
      editLocalList();
    } else {
      if (!modalState.listName && !modalState.description) {
        return alert("Enter List Name and description");
      }
      try {
        const response = await axios(`/groceries/create/${details.id}`, {
          method: "PATCH",
          data: {
            listName: modalState.listName,
            description: modalState.description,
          },
        });
        fetchList();
        setDetails({
          listName: "",
          description: "",
          id: "",
        });
        toast.success("Grocery list edited successfully");
        setShow(!show);
      } catch (error) {
        console.log(error);
      }
    }
  };
  console.log(details, "details");
  return (
    <div className={styles.modal} ref={targetElementRef}>
      <div className={styles.modal_card}>
        <div className={styles.flex2}>
          <h5 className={styles.header}>Create New Grocery List</h5>
          <div
            onClick={() => {
              setDetails({
                listName: "",
                description: "",
                id: "",
              });
              setShow(false);
            }}
          >
            <AiFillCloseCircle color="#949494" size={28} />
          </div>
        </div>
        <div style={{ width: "100%" }}>
          <p className={styles.label}>Title</p>
          <input
            name="listName"
            value={listName}
            onChange={onChange}
            className={styles.input1}
          />
        </div>
        <div style={{ marginTop: "2.5rem" }}>
          <p className={styles.label}>Description</p>
          <textarea
            name="description"
            value={description}
            onChange={onChange}
            className={styles.input2}
          />
        </div>
        <div
          className={styles.modal_btn}
          onClick={() => {
            if (details.listName && details.id) {
              handleEdit();
            } else {
              handleCreate();
            }
          }}
        >
          <p> {details.listName && details.id ? "Update" : "Create"} Now</p>
        </div>
      </div>
    </div>
  );
};
