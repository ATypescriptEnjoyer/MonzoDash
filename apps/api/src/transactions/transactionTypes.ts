export const TransactionTypes = [
  "category",
  "transport",
  "transfers",
  "shopping",
  "savings",
  "personal_care",
  "income",
  "holidays",
  "groceries",
  "gifts",
  "general",
  "expenses",
  "entertainment",
  "eating_out",
  "charity",
  "cash",
  "bills",
] as const;

export type TransactionType = (typeof TransactionTypes)[number];