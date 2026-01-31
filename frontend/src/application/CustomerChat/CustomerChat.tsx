import { useEffect, useState } from "react";
import MainCardLayout from "../../components/MainCardLayout/MainCardLayout";
import styles from "./CustomerChat.module.css";
import { getAllCustomers } from "../../apis/customer";
import { createOperation } from "../../apis/operations";
import { CustomerType } from "../../types";
import { ChatMessagePayload } from "../../apis/operations";

type Sender = "agent" | "customer";

interface Message {
  id: string;
  sender: Sender;
  text: string;
  timestamp: number;
}

interface Conversation {
  customer: CustomerType;
  messages: Message[];
}

const CustomerChat = () => {
  const [started, setStarted] = useState(false);
  const [customers, setCustomers] = useState<CustomerType[]>();
  const [activeConversation, setActiveConversation] =
    useState<Conversation | null>(null);

  const [input, setInput] = useState("");
  const [sender, setSender] = useState<Sender>("agent");

  useEffect(() => {
    if (started) {
      getAllCustomers(setCustomers);
    }
  }, [started]);

  const startConversation = (customer: CustomerType) => {
  setActiveConversation({
    customer,
    messages: [],
  });
};


  const sendMessage = () => {
    if (!input.trim() || !activeConversation) return;

    const newMessage: Message = {
      id: crypto.randomUUID(),
      sender,
      text: input,
      timestamp: Date.now(),
    };

    setActiveConversation({
      ...activeConversation,
      messages: [...activeConversation.messages, newMessage],
    });

    setInput("");
  };

  const submitConversation = async () => {
    if (!activeConversation) return;
    const payload = {
      primary_email: activeConversation.customer.primary_email,
      channel: "Mail",
      chat_data: activeConversation.messages.map(
        (msg): ChatMessagePayload => ({
          id: msg.id,
          role: msg.sender === "agent" ? "assistant" : "user",
          text: msg.text,
        }),
      ),
    };

    await createOperation(payload);
    setActiveConversation(null);
  };

  return (
    <MainCardLayout>
      <div className={styles.container}>
        {!started ? (
          <button
            className={styles.startButton}
            onClick={() => setStarted(true)}
          >
            Start Conversation
          </button>
        ) : (
          <div className={styles.chatWrapper}>
            {/* ================= CUSTOMER LIST ================= */}
            <div className={styles.customerList}>
              <h3>Customers</h3>
              {customers?.map((customer) => (
                <div
                  key={customer.id}
                  className={styles.customerItem}
                  onClick={() => startConversation(customer)}
                >
                  {customer.name}
                </div>
              ))}
            </div>

            {/* ================= CHAT WINDOW ================= */}
            <div className={styles.chatWindow}>
              {!activeConversation ? (
                <div className={styles.emptyState}>
                  Select a customer to start chatting
                </div>
              ) : (
                <>
                  <div className={styles.header}>
                    {activeConversation.customer.name}
                  </div>

                  <div className={styles.messages}>
                    {activeConversation.messages.map((msg) => (
                      <div
                        key={msg.id}
                        className={`${styles.message} ${
                          msg.sender === "agent"
                            ? styles.agent
                            : styles.customer
                        }`}
                      >
                        {msg.text}
                      </div>
                    ))}
                  </div>

                  <div className={styles.controls}>
                    <select
                      value={sender}
                      onChange={(e) => setSender(e.target.value as Sender)}
                    >
                      <option value="agent">Agent</option>
                      <option value="customer">Customer</option>
                    </select>

                    <input
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      placeholder="Type message..."
                    />

                    <button onClick={sendMessage}>Send</button>
                    <button
                      className={styles.submitButton}
                      onClick={submitConversation}
                    >
                      End & Save
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </MainCardLayout>
  );
};

export default CustomerChat;
