import { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import MainCardLayout from "../../components/MainCardLayout/MainCardLayout";
import styles from "./ConversationView.module.css";
import { getAllOperationViews } from "../../apis/operations";
import { CustomerOperationViewType } from "../../types";

const ConversationView = () => {
  const params = useParams();
  const conversationId = params["conversation_id"];

  const [allConversations, setAllConversations] = useState<CustomerOperationViewType[]>();
  const [conversation, setConversation] = useState<CustomerOperationViewType>();

  useEffect(() => {
    if (!conversationId) return;

    getAllOperationViews(setAllConversations);
  }, [conversationId]);

  useEffect(() => {
    if (!allConversations || !conversationId) return;

    const found = allConversations.find((item) => item.id === conversationId);

    setConversation(found);
  }, [allConversations, conversationId]);

  const frictionLabel = useMemo(() => {
    if (!conversation) return "";

    return `${conversation.friction.level.toUpperCase()} • ${Math.round(
      conversation.friction.score * 100,
    )}%`;
  }, [conversation]);

  if (!conversation) {
    return (
      <MainCardLayout>
        <div className={styles.container}>
          <p>Loading conversation details…</p>
        </div>
      </MainCardLayout>
    );
  }

  const confidencePercent = Math.round(conversation.summary.confidence * 100);

  return (
    <MainCardLayout>
      <div className={styles.container}>
        {/* ================= HEADER ================= */}
        <div className={styles.header}>
          <div>
            <h2>Conversation Details</h2>
            <span className={styles.channel}>{conversation.channel}</span>
          </div>

          <div className={styles.frictionBadge}>{frictionLabel}</div>
        </div>

        {/* ================= SUMMARY ================= */}
        <div className={styles.card}>
          <h3>Summary</h3>
          <p>{conversation.summary.summary_long}</p>
          <div
            className={`${styles.pill} ${
              confidencePercent >= 75
                ? styles.pillGreen
                : confidencePercent >= 50
                  ? styles.pillYellow
                  : styles.pillRed
            }`}
          >
            <small>Confidence: {confidencePercent}%</small>
          </div>
        </div>

        {/* ================= INTENT ================= */}
        <div className={styles.card}>
          <h3>Detected Intent</h3>
          <div className={styles.intentRow}>
            <strong>{conversation.intent.intent}</strong>
            <span>{Math.round(conversation.intent.confidence * 100)}%</span>
          </div>
        </div>

        {/* ================= FACTS ================= */}
        <div className={styles.card}>
          <h3>Extracted Facts</h3>

          <div className={styles.factGrid}>
            {conversation.facts.map((fact) => (
              <div key={fact.fact_id} className={styles.factItem}>
                <span className={styles.factKey}>{fact.key}</span>
                <span className={styles.factValue}>
                  {fact.is_pii ? "••••••" : fact.value}
                </span>
                <small>Confidence: {Math.round(fact.confidence * 100)}%</small>
                <p className={styles.evidence}>“{fact.evidence}”</p>
              </div>
            ))}
          </div>
        </div>

        {/* ================= FRICTION DETAILS ================= */}
        <div className={styles.card}>
          <h3>Friction Analysis</h3>

          <div className={styles.frictionDetails}>
            <strong>Level: {conversation.friction.level}</strong>
            <span>Score: {Math.round(conversation.friction.score * 100)}%</span>
          </div>

          <ul className={styles.reasonList}>
            {conversation.friction.reasons.map((reason, index) => (
              <li key={index}>{reason}</li>
            ))}
          </ul>
        </div>
      </div>
    </MainCardLayout>
  );
};

export default ConversationView;
