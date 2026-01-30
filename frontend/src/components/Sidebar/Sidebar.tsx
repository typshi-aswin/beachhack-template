import styles from './Sidebar.module.css';
import { GoHome } from "react-icons/go";
import { IoMdPeople } from "react-icons/io";
import { HiOutlineTicket } from "react-icons/hi2";
import { TbGymnastics } from "react-icons/tb";
import { useNavigate } from 'react-router-dom';
const Sidebar = () => {

    const currentPath = location.pathname;
    const navigate = useNavigate();
    return (
        <div className={styles.container}>
            <div className={styles.topContainer}>
                <div className={styles.header}>
                    <p>lightweight</p>
                    <span>A gym management system.</span>
                </div>

                <div className={styles.sidebarMenu}>
                    <div
                        className={`${styles.menuItem} ${currentPath.includes('/home') ? styles.activeMenuItem : ''}`}
                        onClick={() => navigate('/home')}>
                        <GoHome size={25} />
                        <p>Home</p>
                    </div>
                    <div
                        className={`${styles.menuItem} ${currentPath.includes('/users') ? styles.activeMenuItem : ''}`}
                        onClick={() => navigate('/users')}>
                        <IoMdPeople size={25} />
                        <p>Members</p>
                    </div>
                    <div 
                        className={`${styles.menuItem} ${currentPath.includes('/membership') ? styles.activeMenuItem : ''}`}
                        onClick={() => navigate('/membership')}>
                        <HiOutlineTicket size={25} />
                        <p>Membership</p>
                    </div>
                    <div 
                    className={`${styles.menuItem} ${currentPath.includes('/trainers') ? styles.activeMenuItem : ''}`}
                    onClick={() => navigate('/trainers')}>
                        <TbGymnastics size={25} />
                        <p>Trainers</p>
                    </div>
                </div>
            </div>

            <div className={styles.bottomContainer}>
                <div className={styles.avatarContainer}>
                    <img src="/profile_pic.jpg" alt="profile picture" />
                </div>
                <div className={styles.textContainer}>
                    <p> Aswin V Sivan </p>
                    <span> Administrator</span>
                </div>
            </div>
        </div>
    );
};

export default Sidebar;