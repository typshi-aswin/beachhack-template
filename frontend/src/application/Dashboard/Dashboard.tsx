import { useEffect, useState } from "react";
import styles from "./Dashboard.module.css";
import MainCardLayout from "../../components/MainCardLayout/MainCardLayout";
import { IoMdDownload } from "react-icons/io";
import CustomerCard from "../../components/CustomerCard/CustomerCard";
import { getAllCustomers } from "../../apis/customer";
import { CustomerType } from "../../types";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {

    const navigate = useNavigate();
  const [customers, setCustomers] = useState<CustomerType[]>();
  useEffect(() => {
    getAllCustomers(setCustomers);
  }, []);

  return (
    <MainCardLayout>
      <div className={styles.container}>
        <div className={styles.topContainer}>
          <h1>Customers</h1>
          <div className={styles.buttonDesign}>
            <IoMdDownload />
            Export
          </div>
        </div>

        <div className={styles.cardsContainer}>
          {customers?.map((customer, _) => (
            <CustomerCard
              key={customer.id}
              name={customer.name}
              email={customer.primary_email}
              phone={customer.primary_phone}
              time={
                customer.last_interaction_at
                  ? new Date(customer.last_interaction_at).toLocaleString()
                  : "-"
              }
              onClick={() => navigate(`/${customer.id}/profile`) }
            />
          ))}

          {!customers && <p>Loading customers...</p>}
        </div>
      </div>
    </MainCardLayout>
  );
};

export default Dashboard;
