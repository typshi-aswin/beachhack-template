import React, { useMemo } from "react";
import styles from "./CustomerCard.module.css";

interface CustomerCardProps {
  name: string;
  time: string;
  phone: string;
  email: string;
  status?: string;
onClick?: () => void;
}

const images = [
  "/default-one.png",
  "/default-two.png",
  "/default-three.png",
  "/default-four.png",
  "/default-five.png"
];

const CustomerCard: React.FC<CustomerCardProps> = ({
  name,
  time,
  phone,
  email,
  status,
  onClick,
}) => {
  const randomImage = useMemo(() => {
    return images[Math.floor(Math.random() * images.length)];
  }, []);

  return (
    <div className={styles.card} onClick={onClick}>
      <div className={styles.header}>
        <img src={randomImage} alt="avatar" className={styles.avatar} />

        <div>
          <div className={styles.name}>{name}</div>
          <div className={styles.time}>{time}</div>
        </div>
      </div>

      <div className={styles.body}>
        <div className={styles.row}>📞 {phone}</div>
        <div className={styles.row}>✉️ {email}</div>
      </div>

      {status && <div className={styles.status}>{status}</div>}
    </div>
  );
};

export default CustomerCard;
