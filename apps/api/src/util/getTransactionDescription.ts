import { WebhookTransactionData } from '../monzo/monzo.interfaces';
import { Pot } from '../monzo/monzo.service';

export const getTransactionDescription = (transaction: WebhookTransactionData, pots: Pot[]): { description: string, internal: boolean } => {
  const description = transaction.merchant?.name || transaction.counterparty?.name;
  if (description === 'Flex') {
    return { description: transaction.notes, internal: true };
  }
  if (description) {
    return { description, internal: false };
  }
  if (transaction.description.startsWith('pot_')) {
    const potName = pots.find((pot) => pot.id === transaction.description)?.name || 'pot';
    return { description: `${transaction.amount > 0 ? 'Withdrawal from' : 'Deposit to'} ${potName}`, internal: true };
  }
  return { description: 'Unknown Transaction', internal: false };
};
