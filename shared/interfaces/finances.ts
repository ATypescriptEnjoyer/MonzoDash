export interface DedicatedFinance {
  id: string;
  colour: string;
  name: string;
  amount: number;
}

export interface CurrentFinances {
  balancePence: number;
  daysTilPay: number;
  perDayPence: number;
}
