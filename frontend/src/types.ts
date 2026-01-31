export type CustomerType = {
 id: string;
  primary_email: string;
  primary_phone: string;
  name: string;
  last_interaction_at: Date | null;
  consent_flags: Record<string, boolean>;
};
