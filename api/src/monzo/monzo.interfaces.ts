interface WebhookTransactionDataCounterparty {
  name: string;
}

interface WebhookTransactionDataMerchant {
  name: string;
  logo: string;
}

interface WebhookTransactionData {
  id: string;
  created: Date;
  amount: number;
  merchant?: WebhookTransactionDataMerchant;
  counterparty?: WebhookTransactionDataCounterparty;
}

export interface WebhookTransaction {
  type: 'transaction.created' | 'transaction.updated';
  data: WebhookTransactionData;
}