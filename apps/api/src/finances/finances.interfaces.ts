export interface FinanceItem {
  id?: string;
  name: string;
  amount: number;
  financeId?: string;
}

export interface Finance {
  id: string;
  name: string;
  colour: string;
  items: FinanceItem[];
}

export interface FrontendFinance extends Omit<Finance, 'items'> {
  items: (Omit<FinanceItem, 'amount'> & { amount: string })[];
}

export interface CurrentFinances {
  balancePence: number;
  daysTilPay: number;
  perDayPence: number;
}
