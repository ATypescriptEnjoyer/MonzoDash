export interface Transaction {
  title: string;
  transactions: TransactionItem[];
}

export interface TransactionItem {
  id: string;
  created: Date;
  logoUrl?: string;
  amount: number;
  type: "incoming" | "outgoing";
  description: string;
  internal?: boolean;
}
