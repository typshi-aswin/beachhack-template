import styles from './Dashboard.module.css';
import MainCardLayout from '../../components/MainCardLayout/MainCardLayout';

const Dashboard = () => {
    return (
        <MainCardLayout>
            <div className={styles.container}>
                Hi
            </div>
        </MainCardLayout>
    );

};

export default Dashboard;
