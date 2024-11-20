export interface DedicatedFinance {
  id: string;
  colour: string;
  name: string;
  amount: number;
  dynamicPot?: boolean;
}

export interface CurrentFinances {
  balancePence: number;
  daysTilPay: number;
  perDayPence: number;
}
