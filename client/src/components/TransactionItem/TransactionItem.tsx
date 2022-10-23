import React from 'react';
import { StyledHeader, StyledIcon, StyledMerchant, StyledInfo, StyledCurrency } from './TransactionItem.styled';
import DefaultIcon from './transaction.png';

interface Props {
  Merchant: string;
  Icon?: string;
  Type: 'incoming' | 'outgoing';
  Amount: number;
}

const TransactionItem = ({ Merchant, Icon = DefaultIcon, Type, Amount }: Props): JSX.Element => {
  return (
    <StyledHeader>
      <StyledIcon src={Icon ? Icon : DefaultIcon} />
      <StyledInfo>
        <StyledMerchant>{Merchant}</StyledMerchant>
        <StyledCurrency Type={Type}>{Amount}</StyledCurrency>
      </StyledInfo>
    </StyledHeader>
  );
};

export { TransactionItem };
