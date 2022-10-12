export class Transaction {
  id: string;
  created: Date;
  logoUrl?: string;
  amount: number;
  type: "incoming" | "outgoing";
  description: string;
}
