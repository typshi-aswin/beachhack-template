import { useEffect, useState } from "react";
import styles from "./Dashboard.module.css";
import MainCardLayout from "../../components/MainCardLayout/MainCardLayout";
import { IoMdDownload } from "react-icons/io";
import CustomerCard from "../../components/CustomerCard/CustomerCard";
import { getAllCustomers } from "../../apis/customer";
import { CustomerType } from "../../types";
import { useNavigate } from "react-router-dom";
import { getAllOperationViews } from "../../apis/operations";
import { CustomerOperationViewType } from "../../types";

const Dashboard = () => {
  const navigate = useNavigate();
  const [customers, setCustomers] = useState<CustomerType[]>();
  useEffect(() => {
    getAllCustomers(setCustomers);
  }, []);
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");

  const [searchResults, setSearchResults] =
    useState<CustomerOperationViewType[]>();

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedQuery(searchQuery.trim());
    }, 400);

    return () => {
      clearTimeout(handler);
    };
  }, [searchQuery]);

  const filteredSearchResults = searchResults?.filter((item) => {
    const q = debouncedQuery.toLowerCase();

    return (
      item.summary.summary_long.toLowerCase().includes(q) ||
      item.summary.summary_short.toLowerCase().includes(q) ||
      item.intent.intent.toLowerCase().includes(q) ||
      item.facts.some(
        (fact) =>
          fact.key.toLowerCase().includes(q) ||
          fact.value.toLowerCase().includes(q) ||
          fact.evidence.toLowerCase().includes(q),
      )
    );
  });

  useEffect(() => {
    if (!debouncedQuery) {
      setSearchResults(undefined);
      return;
    }

    getAllOperationViews(setSearchResults);
  }, [debouncedQuery]);

  return (
    <MainCardLayout>
      <div className={styles.container}>
        <div className={styles.topContainer}>
          <h1>Customers</h1>
          <input
            className={styles.searchInput}
            type="text"
            placeholder="Search conversations, intents, facts..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />

          <div className={styles.buttonDesign}>
            <IoMdDownload />
            Export
          </div>
        </div>

        <div className={styles.cardsContainer}>
          {/* ===== SEARCH MODE ===== */}
          {searchQuery && (
            <>
              {filteredSearchResults?.map((item) => (
                <div
                  key={item.id}
                  className={styles.searchCard}
                  onClick={() => navigate(`/${item.id}/view`)}
                >
                  <div className={styles.searchHeader}>
                    <span className={styles.channel}>{item.channel}</span>
                    <span className={styles.friction}>
                      {item.friction.level.toUpperCase()} •{" "}
                      {Math.round(item.friction.score * 100)}%
                    </span>
                  </div>

                  <h4>{item.summary.summary_short}</h4>

                  <div className={styles.factRow}>
                    {item.facts.slice(0, 2).map((fact) => (
                      <span key={fact.fact_id} className={styles.factChip}>
                        {fact.key}: {fact.is_pii ? "••••" : fact.value}
                      </span>
                    ))}
                  </div>

                  <div className={styles.intentRow}>
                    Intent: <strong>{item.intent.intent}</strong> (
                    {Math.round(item.intent.confidence * 100)}%)
                  </div>
                </div>
              ))}

              {filteredSearchResults?.length === 0 && (
                <p>No matching conversations found.</p>
              )}
            </>
          )}

          {/* ===== DEFAULT MODE ===== */}
          {!searchQuery &&
            customers?.map((customer) => (
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
                onClick={() => navigate(`/${customer.id}/profile`)}
              />
            ))}

          {!customers && !searchQuery && <p>Loading customers...</p>}
        </div>
      </div>
    </MainCardLayout>
  );
};

export default Dashboard;
