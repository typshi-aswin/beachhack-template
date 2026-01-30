import styles from "./Dashboard.module.css";
import MainCardLayout from "../../components/MainCardLayout/MainCardLayout";
import { IoMdDownload } from "react-icons/io";
import CustomerCard from "../../components/CustomerCard/CustomerCard";

const Dashboard = () => {
  const dummyCustomers = [
    {
      name: "Brooklyn Simmons",
      time: "Today 10:30 PM",
      phone: "239 555-0108",
      email: "brooklyn@example.com",
      status: "Dead",
    },
    {
      name: "Leslie Alexander",
      time: "Yesterday 8:15 PM",
      phone: "415 555-0123",
      email: "leslie@example.com",
      status: "Active",
    },
    {
      name: "Cody Fisher",
      time: "Today 9:00 AM",
      phone: "302 555-0198",
      email: "cody@example.com",
      status: "Inactive",
    },
    {
      name: "Jenny Wilson",
      time: "Today 11:45 AM",
      phone: "212 555-0176",
      email: "jenny@example.com",
      status: "Active",
    },
    {
      name: "Guy Hawkins",
      time: "Yesterday 6:20 PM",
      phone: "646 555-0142",
      email: "guy@example.com",
    },
    {
      name: "Kathryn Murphy",
      time: "Today 2:10 PM",
      phone: "718 555-0119",
      email: "kathryn@example.com",
      status: "Dead",
    },
    {
      name: "Darlene Robertson",
      time: "Today 1:05 PM",
      phone: "310 555-0184",
      email: "darlene@example.com",
      status: "Active",
    },
    {
      name: "Savannah Nguyen",
      time: "Yesterday 4:40 PM",
      phone: "408 555-0167",
      email: "savannah@example.com",
    },
    {
      name: "Kristin Watson",
      time: "Today 12:00 PM",
      phone: "516 555-0101",
      email: "kristin@example.com",
      status: "Inactive",
    },
    {
      name: "Wade Warren",
      time: "Today 7:50 AM",
      phone: "973 555-0193",
      email: "wade@example.com",
      status: "Active",
    },
  ];

  return (
    <MainCardLayout>
      <div className={styles.container}>
        <div className={styles.topContainer}>
          <h1> Customers </h1>
          <div className={styles.buttonDesign}>
            <IoMdDownload />
            Export
          </div>
        </div>

        <div className={styles.cardsContainer}>
          {dummyCustomers.map((customer, index) => (
            <CustomerCard
              key={index}
              name={customer.name}
              time={customer.time}
              phone={customer.phone}
              email={customer.email}
              status={customer.status}
            />
          ))}
        </div>
      </div>
    </MainCardLayout>
  );
};

export default Dashboard;
