interface WebhookTransactionDataCounterparty {
  name: string;
}

interface WebhookTransactionDataMerchant {
  name: string;
  logo: string;
  group_id: string;
}

export interface WebhookTransactionData {
  id: string;
  created: string;
  amount: number;
  merchant?: WebhookTransactionDataMerchant;
  counterparty?: WebhookTransactionDataCounterparty;
  category?: string;
  description?: string;
  notes?: string;
  account_id?: string;
}

export interface WebhookTransaction {
  type: 'transaction.created' | 'transaction.updated';
  data: WebhookTransactionData;
  ignoreProcessing?: boolean;
}

export interface Owner {
  user_id: string;
  preferred_name: string;
  preferred_first_name: string;
}

export interface Account {
  id: string;
  closed: boolean;
  created: Date;
  description: string;
  type: string;
  currency: string;
  country_code: string;
  owners: Owner[];
}
