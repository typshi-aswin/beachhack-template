export type CustomerType = {
 id: string;
  primary_email: string;
  primary_phone: string;
  name: string;
  last_interaction_at: Date | null;
  consent_flags: Record<string, boolean>;
};


export type FactType = {
  key: string;
  value: string;
  is_pii: boolean;
  fact_id: string;
  evidence: string;
  confidence: number;
  segment_id: string;
};

export type FrictionType = {
  level: "low" | "medium" | "high";
  score: number;
  reasons: string[];
};

export type SummaryType = {
  confidence: number;
  summary_long: string;
  summary_short: string;
};

export type IntentType = {
  intent: string;
  confidence: number;
  evidence_segments: string[];
};

export type CustomerOperationViewType = {
  id: string;
  channel: string;
  facts: FactType[];
  friction: FrictionType;
  summary: SummaryType;
  intent: IntentType;
};
