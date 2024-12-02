import Link from "next/link";
import React, { useEffect, useState } from "react";
import styles from "../../components/Header/header.module.css";
import { useRouter } from "next/router";

export const MobileHeader = () => {
  const [activeLink, setActiveLink] = useState(null);
  const [prevScrollPos, setPrevScrollPos] = useState(0);
  const [visible, setVisible] = useState(true);
  const router = useRouter();

  const handleSetActive = (id, path) => {
    console.log("Navigating to:", path); // Debug log
    setActiveLink(id);
    router.push(path);
  };

  const menuItems = [
    { name: "Marketplace", path: "/marketplace" },
    { name: "Chef", path: "#" },
    { name: "Blog", path: "#" },
  ];

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollPos = window.pageYOffset;
      setVisible(prevScrollPos > currentScrollPos || currentScrollPos < 10);
      setPrevScrollPos(currentScrollPos);
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [prevScrollPos]);

  return (
      <div className={visible ? styles.navbar2 : styles.navbar_down_2}>
        <div className={styles.navbar_main_container}>
          <div className={styles.navbar_main}>
            <ul className={styles.navbar_main_links}>
              {menuItems?.map((elem, id) => (
                <li
                  className={styles.navbar_main_link}
                  key={id}
                  onClick={() => handleSetActive(id, elem.path)}
                >
                  <p
                    className={
                      activeLink === id
                        ? styles.activelink
                        : styles.inactivelink
                    }
                  >
                    {elem.name}
                  </p>
                </li>
              ))}
            </ul>

            <div className={styles.navbar_main_grocery}>
              <Link href="/groceries">Grocery Lists</Link>
            </div>
          </div>
        </div>
      </div>
  );
};
