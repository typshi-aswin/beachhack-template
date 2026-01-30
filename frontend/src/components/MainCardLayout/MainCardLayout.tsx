
import styles from './MainCardLayout.module.css';
import Sidebar from '../Sidebar/Sidebar';

const MainCardLayout = ({ children }: { children: React.ReactNode }) => {
    return(
        <div className={styles.outerContainer}>
            <Sidebar />
            <div className={styles.mainCard}>
                {children}
            </div>
        </div>
    );
};

export default MainCardLayout;
