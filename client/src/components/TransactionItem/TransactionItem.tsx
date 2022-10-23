import React from 'react';
import { StyledHeader, StyledIcon, StyledMerchant, StyledInfo, StyledCurrency } from './TransactionItem.styled';

interface Props {
  Merchant: string;
  Icon?: string;
  Type: 'incoming' | 'outgoing';
  Amount: number;
}

const TransactionItem = ({ Merchant, Icon = '/icons/transaction.png', Type, Amount }: Props): JSX.Element => {
  return (
    <StyledHeader>
      <StyledIcon src={Icon ? Icon : '/icons/transaction.png'} />
      <StyledInfo>
        <StyledMerchant>{Merchant}</StyledMerchant>
        <StyledCurrency Type={Type}>{Amount}</StyledCurrency>
      </StyledInfo>
    </StyledHeader>
  );
};

export { TransactionItem };
