import styles from "./Analytics.module.css";
import MainCardLayout from "../../components/MainCardLayout/MainCardLayout";
import { IoMdDownload } from "react-icons/io";

const trendingIssues = [
  { issue: "Login failures", count: 342, trend: "+18%" },
  { issue: "Payment timeout", count: 289, trend: "+12%" },
  { issue: "OTP not received", count: 231, trend: "+9%" },
  { issue: "App crash on launch", count: 198, trend: "+6%" },
  { issue: "Profile update error", count: 164, trend: "+4%" },
];

const unresolvedIssues = [
  { issue: "Refund pending", openFor: "12 days", count: 87 },
  { issue: "Account suspension", openFor: "10 days", count: 73 },
  { issue: "Order stuck", openFor: "8 days", count: 65 },
  { issue: "Verification failed", openFor: "7 days", count: 59 },
  { issue: "Subscription issue", openFor: "6 days", count: 44 },
];

const topActions = [
  { action: "Reset password", used: 412 },
  { action: "Resend OTP", used: 368 },
  { action: "Manual refund", used: 301 },
  { action: "Account reactivation", used: 244 },
  { action: "Force logout", used: 198 },
];

const Analytics = () => {
  return (
    <MainCardLayout>
      <div className={styles.container}>
        <div className={styles.topContainer}>
          <h1>Analytics</h1>
          <div className={styles.buttonDesign}>
            <IoMdDownload />
            Export
          </div>
        </div>

        <div className={styles.grid}>
          {/* Trending Issues */}
          <div className={styles.card}>
            <h2>Top Trending Issues</h2>
            {trendingIssues.map((item, index) => (
              <div key={index} className={styles.row}>
                <span className={styles.primary}>{item.issue}</span>
                <div className={styles.meta}>
                  <div className={styles.yellowPill}> {item.count} cases </div> {item.trend}
                </div>
              </div>
            ))}
          </div>

          {/* Unresolved Issues */}
          <div className={styles.card}>
            <h2>Most Unresolved Issues</h2>
            {unresolvedIssues.map((item, index) => (
              <div key={index} className={styles.row}>
                <span className={styles.primary}>{item.issue}</span>
                <div className={styles.meta}>
                 <div className={styles.redPill}> {item.count} open </div>· {item.openFor}
                </div>
              </div>
            ))}
          </div>

          {/* Top Actions */}
          <div className={styles.card}>
            <h2>Most Used Actions</h2>
            {topActions.map((item, index) => (
              <div key={index} className={styles.row}>
                <span className={styles.primary}>{item.action}</span>
                <div className={styles.meta}>
                 <div className={styles.greenPill}> Used {item.used} times </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </MainCardLayout>
  );
};

export default Analytics;
