import { WebhookTransaction } from '../monzo/monzo.interfaces';

export const isValidTransaction = (transaction: WebhookTransaction): boolean =>
  transaction.type === 'transaction.created' && transaction.data.amount === 0;
