//Profile.tsx
import { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import MainCardLayout from "../../components/MainCardLayout/MainCardLayout";
import styles from "./Profile.module.css";
import { getSingleCustomer } from "../../apis/customer";
import { CustomerType, CustomerOperationViewType } from "../../types";
import { getCustomerOperationView } from "../../apis/operations";

const profileImages = [
  "/default-one.png",
  "/default-two.png",
  "/default-three.png",
  "/default-four.png",
  "/default-five.png",
];

const Profile = () => {
  const params = useParams();
  const customerId = params["customer-id"];
  const [operationViews, setOperationViews] = useState<CustomerOperationViewType[]>([]);
  const [customer, setCustomer] = useState<CustomerType>();

  useEffect(() => {
    if (!customerId) return;

    getSingleCustomer(customerId, setCustomer);
    // Update this to handle array response
    getCustomerOperationView(customerId, (data: any) => {
      // Handle both array and single object responses
      if (Array.isArray(data)) {
        setOperationViews(data);
      } else if (data) {
        setOperationViews([data] as CustomerOperationViewType[]);
      } else {
        setOperationViews([]);
      }
    });
  }, [customerId]);

  const profileImage = useMemo(() => {
    return profileImages[Math.floor(Math.random() * profileImages.length)];
  }, []);

  // Format date from created_at
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  // Sort conversations by created_at (newest first)
  const sortedConversations = useMemo(() => {
    return [...operationViews].sort((a, b) => 
      new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    );
  }, [operationViews]);

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

        {/* ================= HISTORY SECTION ================= */}
        <div className={styles.sectionCard}>
          <div className={styles.historyHeader}>
            <h3>History</h3>
            <span className={styles.conversationCount}>
              {sortedConversations.length} conversation{sortedConversations.length !== 1 ? 's' : ''}
            </span>
          </div>

          {sortedConversations.length === 0 ? (
            <p className={styles.noHistory}>No conversation history available.</p>
          ) : (
            <div className={styles.historyContainer}>
              {sortedConversations.map((conversation, index) => (
                <div key={conversation.id || index} className={styles.conversationCard}>
                  {/* Conversation Header */}
                  <div className={styles.conversationHeader}>
                    <div className={styles.conversationMeta}>
                      <span className={styles.conversationDate}>
                        {formatDate(conversation.created_at.toString())}
                      </span>
                      <span className={`${styles.channelBadge} ${styles[conversation.channel.toLowerCase()]}`}>
                        {conversation.channel}
                      </span>
                      <span className={`${styles.frictionBadge} ${styles[conversation.friction.level]}`}>
                        {conversation.friction.level} friction
                      </span>
                    </div>
                    <div className={styles.conversationIntent}>
                      <strong>Intent:</strong> {conversation.intent.intent} 
                      <small> ({Math.round(conversation.intent.confidence * 100)}%)</small>
                    </div>
                  </div>

                  {/* Summary Section (like timeline) */}
                  <div className={styles.summarySection}>
                    <div className={styles.summaryHeader}>
                      <h4>Summary</h4>
                      <small>Confidence: {Math.round(conversation.summary.confidence * 100)}%</small>
                    </div>
                    <p className={styles.summaryText}>
                      {conversation.summary.summary_long}
                    </p>
                  </div>

                  {/* Facts Section */}
                  <div className={styles.factsSection}>
                    <h4>Key Facts</h4>
                    {conversation.facts.length === 0 ? (
                      <p className={styles.noFacts}>No facts extracted</p>
                    ) : (
                      <div className={styles.factsGrid}>
                        {conversation.facts.map((fact) => (
                          <div key={fact.fact_id} className={styles.factCard}>
                            <div className={styles.factHeader}>
                              <span className={styles.factKey}>{fact.key}</span>
                              {fact.is_pii && (
                                <span className={styles.piiBadge}>PII</span>
                              )}
                            </div>
                            <div className={styles.factValue}>{fact.value}</div>
                            <div className={styles.factMeta}>
                              <small>Confidence: {Math.round(fact.confidence * 100)}%</small>
                              {fact.evidence && (
                                <div className={styles.factEvidence}>
                                  <em>"{fact.evidence}"</em>
                                </div>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Suggested Actions (if any) */}
                  {conversation.suggested_actions && conversation.suggested_actions.length > 0 && (
                    <div className={styles.actionsSection}>
                      <h4>Suggested Actions</h4>
                      <div className={styles.actionsList}>
                        {conversation.suggested_actions.map((action, actionIndex) => (
                          <div key={actionIndex} className={styles.actionItem}>
                            <strong>{action.action_type}</strong>
                            <p>{action.reason}</p>
                            <small>Score: {Math.round(action.score * 100)}%</small>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* ================= CHANGES SINCE LAST CONTACT ================= */}
        <div className={styles.sectionCard}>
          <h3>Changes Since Last Contact (3 days ago)</h3>

          <div className={styles.changeBlock}>
            <div className={styles.added}>
              <strong>ADDED</strong>
              <p>budget_range: 12–15L (confidence: 84%)</p>
              <span>"Now looking at cars up to 15 lakh" — Jan 28, 10:15</span>
            </div>

            <div className={styles.modified}>
              <strong>MODIFIED</strong>
              <p>preferred_fuel: diesel → petrol</p>
              <span>"Actually I want petrol now" — Jan 28, 10:17</span>
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
              <strong>
                {operationViews.length > 0
                  ? Math.round(operationViews[0].friction.score * 100)
                  : "—"}{" "}
                / 100
              </strong>
              <small
                className={
                  operationViews[0]?.friction.level === "high"
                    ? styles.bad
                    : operationViews[0]?.friction.level === "medium"
                      ? styles.neutral
                      : styles.improving
                }
              >
                {operationViews[0]?.friction.level || "—"}
              </small>
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