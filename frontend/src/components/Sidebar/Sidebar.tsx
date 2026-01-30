import styles from './Sidebar.module.css';
import { GoHome } from "react-icons/go";
import { IoMdPeople } from "react-icons/io";
import { useNavigate } from 'react-router-dom';
const Sidebar = () => {

    const currentPath = location.pathname;
    const navigate = useNavigate();
    const name = localStorage.getItem('name') || 'User';
    return (
        <div className={styles.container}>
            <div className={styles.topContainer}>
                <div className={styles.header}>
                    <p>CustomerX</p>
                    <span>a customer service system</span>
                </div>

                <div className={styles.sidebarMenu}>
                    <div
                        className={`${styles.menuItem} ${currentPath.includes('/home') ? styles.activeMenuItem : ''}`}
                        onClick={() => navigate('/dashboard')}>
                        <GoHome size={25} />
                        <p>Dashboard</p>
                    </div>
                    <div
                        className={`${styles.menuItem} ${currentPath.includes('/users') ? styles.activeMenuItem : ''}`}
                        onClick={() => navigate('/users')}>
                        <IoMdPeople size={25} />
                        <p>Customer Chat</p>
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
            </div>
        </div>
    );
};

export default Sidebar;