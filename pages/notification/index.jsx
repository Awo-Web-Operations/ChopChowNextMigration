import { useEffect, useState } from "react";
import styles from "../../src/components/mobile/notification.module.css";
import { IoIosArrowRoundBack } from "react-icons/io";
import axios from "../../src/util/Api";
import { FaCheck } from "react-icons/fa6";
import { RiMessage2Fill } from "react-icons/ri";
import moment from "moment";
import GoBack from "../../src/components/CommonComponents/goBack";
import { useRouter } from "next/navigation";
import { BsArrowLeft } from "react-icons/bs";

const Notification = () => {
  const [notifications, setNotifications] = useState([]);
  const getAllNotifications = async () => {
    try {
      const response = await axios.get(`/user/notifications`);
      setNotifications(response.data.data);
      console.log(response.data.data, "noti");
    } catch (err) {
      console.log(err);
    }
  };
  const router = useRouter();
  const updateNotification = async (id) => {
    try {
      const response = await axios.patch(`/user/notification/${id}`);

      getAllNotifications();
    } catch (err) {
      console.log(`Error updating notification with ID ${id}:`, err);
    }
  };
  const getOneItemById = async (id, commentId) => {
    try {
      console.log(id);
      const response = await axios.get(`/items/item/${id}`);
      const data = Array.isArray(response.data?.data)
        ? response.data?.data[0]
        : {};
      console.log(response.data);
      if (data?.item_name) {
        router.push(
          `/${data?.item_type === "Meal" ? "meal" : "product"}/${
            data?.item_name
          }?id=${commentId}`
        );
      }
    } catch (e) {
      console.log(e);
    }
  };
  useEffect(() => {
    getAllNotifications();
  }, []);
  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div
          style={{ width: "20px", height: "20px" }}
          onClick={() => router.back()}
        >
          <BsArrowLeft size={20} />
        </div>
        <h1 className={styles.title}>Notifications</h1>
      </div>
      <div className={styles.not}>
        {notifications
          ?.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
          .map((elem) => (
            <div
              className={
                elem.read === false
                  ? styles.summary_notification
                  : styles.summary_notification2
              }
              onClick={() => updateNotification(elem._id)}
            >
              {elem.message.includes("Suggested Meal") ? (
                <div className={styles.rounded}>
                  <FaCheck color="black" size={14} />
                </div>
              ) : (
                <div className={styles.rounded2}>
                  <RiMessage2Fill size={15} color="#FFF" />
                </div>
              )}
              <div className={styles.summary_notification_Details}>
                <h3 className={styles.summary_notification_desc}>
                  {elem.message}
                </h3>
                <p className={styles.summary_notification_link}>
                  {elem.message.includes("Suggested Meal") ? (
                    <p
                      onClick={() => {
                        router.push("/dashboard/suggestedmeals");
                      }}
                    >
                      View Item
                    </p>
                  ) : (
                    <p
                      onClick={() =>
                        getOneItemById(
                          elem?.notifiable?.item,
                          elem?.notifiable?._id
                        )
                      }
                    >
                      View Comment
                    </p>
                  )}
                </p>
                <p className={styles.summary_notification_time}>
                  {moment(elem.createdAt).fromNow()}
                </p>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
};
export default Notification;
