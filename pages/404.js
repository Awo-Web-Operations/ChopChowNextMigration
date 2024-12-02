import Image from "next/image";
import Header, { Header2 } from "../src/components/Header/Header";
import Sidenav from "../src/components/Header/sidenav";
import image from "../public/assets/homepage/404.png";
import styles from "../src/components/mobile/404.module.css";
import Footer from "../src/components/Footer/Footer";

export default function Custom404() {
  return (
    <div>
      <Header />
      <Sidenav />
      <div
        className={styles.container}
      >
        <div className={styles.img}>
          <img src={"/assets/homepage/404.png"} />
        </div>
        <h1 className={styles.Custom404}>404</h1>
        <p className={styles.page}>Ooops... Page not Found</p>
      </div>
      <Footer />
    </div>
  );
}
