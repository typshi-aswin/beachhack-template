import styles from "./Sidebar.module.css";
import { GoHome } from "react-icons/go";
import { IoMdPeople } from "react-icons/io";
import { useNavigate } from "react-router-dom";
import { MdOutlineLogout } from "react-icons/md";
import { SiGoogleanalytics } from "react-icons/si";
import { logout } from "../../utils/logout";

const Sidebar = () => {
  const currentPath = location.pathname;
  const navigate = useNavigate();
  const name = localStorage.getItem("name") || "User";
  return (
    <div className={styles.container}>
      <div className={styles.topContainer}>
        <div className={styles.header}>
          <p>CustomerX</p>
          <span>a customer service system</span>
        </div>

        <div className={styles.sidebarMenu}>
          <div
            className={`${styles.menuItem} ${currentPath.includes("/dashboard") ? styles.activeMenuItem : ""}`}
            onClick={() => navigate("/dashboard")}
          >
            <GoHome size={25} />
            <p>Dashboard</p>
          </div>
          <div
            className={`${styles.menuItem} ${currentPath.includes("/chat") ? styles.activeMenuItem : ""}`}
            onClick={() => navigate("/chat")}
          >
            <IoMdPeople size={25} />
            <p>Customer Chat</p>
          </div>
          <div
            className={`${styles.menuItem} ${currentPath.includes("/analytics") ? styles.activeMenuItem : ""}`}
            onClick={() => navigate("/analytics")}
          >
            <SiGoogleanalytics size={20} />
            <p>Analytics</p>
          </div>
        </div>
      </div>

      <div className={styles.bottomContainer}>
        <div className={styles.avatarContainer}>
          <img src="/default-three.png" alt="profile picture" />
        </div>
        <div className={styles.textContainer}>
          <p> {name} </p>
          <span> Agent</span>
        </div>
        <div className={styles.logoutButton} onClick={logout} title="Logout">
          <MdOutlineLogout color="#eb4034" size={25} />
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
