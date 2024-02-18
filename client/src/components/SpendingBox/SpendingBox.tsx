import React, { useEffect, useState } from 'react';
import { Header, StyledSpendingBox, Title, Value, Option } from './SpendingBox.styled';
import { DedicatedFinance } from '../../../../shared/interfaces/finances';
import { Toggle } from '../Toggle';

interface Props {
  spendingValue: DedicatedFinance & { amountString: string };
  onValueChange: (finance: DedicatedFinance & { amountString: string }) => void;
}

export const SpendingBox = (props: Props) => {
  const formatAmountString = (value: string) => {
    if (!Number.isNaN(+value)) {
      props.onValueChange({ ...props.spendingValue, amountString: value });
    }
  };

  return props.spendingValue ? (
    <StyledSpendingBox $borderColor={props.spendingValue.colour}>
      <Title>{props.spendingValue.name}</Title>
      <Option>
        <Header>Amount</Header>
        <Value value={props.spendingValue.amountString} onChange={(ev) => formatAmountString(ev.currentTarget.value)} />
      </Option>
      <Option>
        <Header>Colour</Header>
        <Value
          type="color"
          value={props.spendingValue.colour}
          onChange={(ev) => props.onValueChange({ ...props.spendingValue, colour: ev.currentTarget.value })}
        />
      </Option>
      <Option style={{ visibility: props.spendingValue.id === '0' ? 'hidden' : 'visible' }}>
        <Header>Dynamic</Header>
        <Toggle
          value={!!props.spendingValue.dynamicPot}
          onChange={(ev) => props.onValueChange({ ...props.spendingValue, dynamicPot: ev })}
        />
      </Option>
    </StyledSpendingBox>
  ) : null;
};
