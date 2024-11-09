import React, { useEffect, useState } from 'react';
import { Header, StyledSpendingBox, Title, Value, Option } from './SpendingBox.styled';
import { DedicatedFinance } from '../../../../shared/interfaces/finances';
import { Toggle } from '../Toggle';
import { UseFormGetValues, UseFormRegister } from 'react-hook-form';

interface Props {
  register: UseFormRegister<{
    data: DedicatedFinance[];
  }>;
  value: DedicatedFinance;
  index: number;
}

export const SpendingBox = (props: Props) => {
  const { index, register, value } = props;

  return (
    <StyledSpendingBox $borderColor={value.colour}>
      <Title>{value.name}</Title>
      <Option>
        <Header>Amount</Header>
        <Value type="number" {...register(`data.${index}.amount`, { valueAsNumber: true })} />
      </Option>
      <Option>
        <Header>Colour</Header>
        <Value {...register(`data.${index}.colour`)} />
      </Option>
    </StyledSpendingBox>
  );
};
