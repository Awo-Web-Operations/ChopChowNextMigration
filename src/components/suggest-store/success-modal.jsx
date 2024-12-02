import styles from "./suggest-store.module.css";
import { useRouter } from "next/navigation";
export const SuccessModal = ({
  storeId,
  title,
  text,
  button,
  button2,
  btnTitle,
  btnTitle2,
  btnTitle3,
  onClick
}) => {
  const router = useRouter();
  return (
    <div className={styles.modalContainer}>
      <div className={styles.modal}>
        <div className={styles.gif}>
          <img src="/assets/icons/success.gif" alt="" />
        </div>
        <p className={styles.successMessage}>{title}</p>
        <p className={styles.successText}>{text}</p>
        <div className={styles.flex}>
          {button ? (
            <div className={styles.btns}>
              <button
                className={styles.outlineBtn}
                onClick={() => router.push("/marketplace")}
              >
                {btnTitle}
              </button>
              <button
                className={styles.btn}
                onClick={() =>
                  router.push(`/dashboard/management?storeId=${storeId}`)
                }
              >
                {btnTitle2}
              </button>
            </div>
          ) : (
            ""
          )}
          {button2 && (
            <div className={styles.btns}>
              <button
                className={styles.btn}
                onClick={
                  onClick
                }
              >
                {btnTitle3}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
