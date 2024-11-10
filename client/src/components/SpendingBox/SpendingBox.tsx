import { UseFormRegister } from 'react-hook-form';
import { DedicatedFinance } from '../../../../shared/interfaces/finances';
import { Header, Option, StyledSpendingBox, Title, Value } from './SpendingBox.styled';

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
