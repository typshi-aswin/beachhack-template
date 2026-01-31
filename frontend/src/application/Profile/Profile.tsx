import { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import MainCardLayout from "../../components/MainCardLayout/MainCardLayout";
import styles from "./Profile.module.css";
import { getSingleCustomer } from "../../apis/customer";
import { CustomerType } from "../../types";

const profileImages = [
  "/default-one.png",
  "/default-two.png",
  "/default-three.png",
  "/default-four.png",
  "/default-five.png",
];

const timelineEvents = [
  {
    date: new Date("2024-01-20T10:00:00"),
    type: "CHAT",
    description: "First contact initiated",
    meta: "Sentiment: Positive (0.68)",
  },
  {
    date: new Date("2024-01-25T14:30:00"),
    type: "EMAIL",
    description: "Order not received",
    meta: "Sentiment: Negative (-0.65)",
  },
  {
    date: new Date("2024-01-28T10:15:00"),
    type: "CHAT",
    description: "Refund & delivery issue discussed",
    meta: "Sentiment: Neutral (0.12)",
  },
  {
    date: new Date("2024-01-28T10:30:00"),
    type: "CALL",
    description: "Escalated to supervisor",
    meta: "High friction detected (0.82)",
  },
];

const Profile = () => {
  const params = useParams();
  const customerId = params["customer-id"];

  const [customer, setCustomer] = useState<CustomerType>();
  const [showTimeline, setShowTimeline] = useState(false);

  const profileImage = useMemo(() => {
    return profileImages[Math.floor(Math.random() * profileImages.length)];
  }, []);

  useEffect(() => {
    if (!customerId) return;

    getSingleCustomer(customerId, setCustomer);
  }, [customerId]);

  type TimelineRange = "1W" | "1M" | "3M" | "6M" | "1Y";

  const [timelineRange, setTimelineRange] = useState<TimelineRange>("1W");

  const getRangeStartDate = (range: TimelineRange) => {
    // Anchor to latest event date instead of real current date
    const latestEventDate =
      timelineEvents
        .map((e) => e.date)
        .sort((a, b) => b.getTime() - a.getTime())[0] || new Date();

    const d = new Date(latestEventDate);

    switch (range) {
      case "1W":
        d.setDate(d.getDate() - 7);
        break;
      case "1M":
        d.setMonth(d.getMonth() - 1);
        break;
      case "3M":
        d.setMonth(d.getMonth() - 3);
        break;
      case "6M":
        d.setMonth(d.getMonth() - 6);
        break;
      case "1Y":
        d.setFullYear(d.getFullYear() - 1);
        break;
    }

    return d;
  };

  const filteredTimelineEvents = timelineEvents
    .filter((event) => event.date >= getRangeStartDate(timelineRange))
    .sort((a, b) => b.date.getTime() - a.date.getTime());

  const timelineWithLatest = filteredTimelineEvents.map((event, index) => ({
    ...event,
    isLatest: index === 0,
  }));

  return (
    <MainCardLayout>
      <div className={styles.container}>
        {/* ================= TOP CONTAINER ================= */}
        <div className={styles.topCard}>
          <img src={profileImage} className={styles.avatar} />

          <div className={styles.basicInfo}>
            <h2>{customer ? customer.name : "Loading..."}</h2>

            <p>{customer?.primary_email}</p>
            <p>{customer?.primary_phone}</p>
          </div>

          <div className={styles.metaInfo}>
            <span>
              Last interaction:{" "}
              {customer?.last_interaction_at
                ? new Date(customer.last_interaction_at).toLocaleString()
                : "—"}
            </span>
          </div>
        </div>
        {/* ================= CUSTOMER SUMMARY ================= */}
        <div className={styles.sectionCard}>
          <div className={styles.summaryHeader}>
            <h3>Customer Summary</h3>

            <button
              className={styles.timelineToggle}
              onClick={() => setShowTimeline((prev) => !prev)}
            >
              {showTimeline ? "Hide chat timeline" : "View chat timeline"}
            </button>
          </div>

          <p className={styles.summaryText}>
            Customer is primarily enquiring about delivery delays and refund
            status. Initial interactions were positive, but sentiment declined
            after repeated follow-ups regarding an undelivered order. Issue was
            escalated due to high friction during a recent call. No unresolved
            blockers currently remain.
          </p>

          {/* ===== TIMELINE (COLLAPSIBLE) ===== */}
          {showTimeline && (
            <>
              {/* FILTERS */}
              <div className={styles.timelineFilters}>
                {(["1W", "1M", "3M", "6M", "1Y"] as TimelineRange[]).map(
                  (range) => (
                    <button
                      key={range}
                      className={`${styles.filterPill} ${
                        timelineRange === range ? styles.activeFilter : ""
                      }`}
                      onClick={() => setTimelineRange(range)}
                    >
                      {range}
                    </button>
                  ),
                )}
              </div>

              {/* TIMELINE */}
              <div className={styles.timeline}>
                {timelineWithLatest.map((event, index) => (
                  <div
                    key={index}
                    className={`${styles.timelineItem} ${
                      event.isLatest ? styles.latest : ""
                    }`}
                  >
                    <div className={styles.timelineTimeSide}>
                      {event.date.toLocaleString()}
                    </div>

                    <div className={styles.timelineDot} />

                    <div className={styles.timelineContent}>
                      <strong className={styles.timelineType}>
                        {event.type}
                      </strong>
                      <p>{event.description}</p>
                      <small>{event.meta}</small>
                    </div>
                  </div>
                ))}

                {timelineWithLatest.length === 0 && (
                  <p className={styles.noTimeline}>
                    No interactions in this period
                  </p>
                )}
              </div>
            </>
          )}
        </div>

        {/* ================= CHANGES SINCE LAST CONTACT ================= */}
        <div className={styles.sectionCard}>
          <h3>Changes Since Last Contact (3 days ago)</h3>

          <div className={styles.changeBlock}>
            <div className={styles.added}>
              <strong>ADDED</strong>
              <p>budget_range: 12–15L (confidence: 84%)</p>
              <span>“Now looking at cars up to 15 lakh” — Jan 28, 10:15</span>
            </div>

            <div className={styles.modified}>
              <strong>MODIFIED</strong>
              <p>preferred_fuel: diesel → petrol</p>
              <span>“Actually I want petrol now” — Jan 28, 10:17</span>
            </div>

            <div className={styles.resolved}>
              <strong>RESOLVED</strong>
              <p>delivery_issue (resolved 2 days ago)</p>
            </div>
          </div>
        </div>

        {/* ================= FRICTION & HEALTH ================= */}
        <div className={styles.sectionCard}>
          <h3>Customer Health & Friction</h3>

          <div className={styles.healthGrid}>
            <div className={styles.healthItem}>
              <span>Friction Score</span>
              <strong>61 / 100</strong>
              <small className={styles.improving}>Improving</small>
            </div>

            <div className={styles.healthItem}>
              <span>Engagement Health</span>
              <strong>High</strong>
              <small>Consistent responses</small>
            </div>

            <div className={styles.healthItem}>
              <span>Risk Level</span>
              <strong>Low</strong>
              <small>No unresolved blockers</small>
            </div>
          </div>
        </div>
      </div>
    </MainCardLayout>
  );
};

export default Profile;
