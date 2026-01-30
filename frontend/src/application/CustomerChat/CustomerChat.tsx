import { useState } from "react";
import MainCardLayout from "../../components/MainCardLayout/MainCardLayout";
import styles from "./CustomerChat.module.css";

type Sender = "agent" | "customer";

interface Message {
  id: string;
  sender: Sender;
  text: string;
  timestamp: number;
}

interface Conversation {
  customerId: string;
  customerName: string;
  messages: Message[];
}


const dummyCustomers = [
  { id: "1", name: "Brooklyn Simmons" },
  { id: "2", name: "Leslie Alexander" },
  { id: "3", name: "Cody Fisher" },
];

const CustomerChat = () => {
  const [started, setStarted] = useState(false);
  const [activeConversation, setActiveConversation] =
    useState<Conversation | null>(null);
  const [input, setInput] = useState("");
  const [sender, setSender] = useState<"agent" | "customer">("agent");
 console.log(activeConversation);
  const startConversation = (customer: { id: string; name: string }) => {
    setActiveConversation({
      customerId: customer.id,
      customerName: customer.name,
      messages: [],
    });
  };

  const sendMessage = () => {
    if (!input.trim() || !activeConversation) return;

    const newMessage = {
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
            {/* Customer list */}
            <div className={styles.customerList}>
              <h3>Customers</h3>
              {dummyCustomers.map((customer) => (
                <div
                  key={customer.id}
                  className={styles.customerItem}
                  onClick={() => startConversation(customer)}
                >
                  {customer.name}
                </div>
              ))}
            </div>

            {/* Chat window */}
            <div className={styles.chatWindow}>
              {!activeConversation ? (
                <div className={styles.emptyState}>
                  Select a customer to start chatting
                </div>
              ) : (
                <>
                  <div className={styles.header}>
                    {activeConversation.customerName}
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
                      onChange={(e) =>
                        setSender(e.target.value as "agent" | "customer")
                      }
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
