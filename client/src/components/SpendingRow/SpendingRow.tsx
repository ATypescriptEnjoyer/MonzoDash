import { FormControl, Input } from '@mui/material';
import React from 'react';
import { DedicatedFinance } from '../../../../shared/interfaces/finances';
import { UnselectableTypography } from '../UnselectableTypography';
import { SpendingRowContainer, SpendingRowItem } from './SpendingRow.styled';

interface SpendingRowProps extends DedicatedFinance {
  onRowUpdate: (update: DedicatedFinance) => void;
}

export const SpendingRow = ({ id, name, amount, colour, onRowUpdate }: SpendingRowProps): JSX.Element => {
  const onSpendingRowUpdate = (finance: DedicatedFinance): void => {
    onRowUpdate && onRowUpdate(finance);
  };

  return (
    <SpendingRowContainer>
      <SpendingRowItem>
        <UnselectableTypography sx={{ marginBottom: '20px' }} variant="subtitle1" fontWeight="300" color="inherit">
          Pot Name
        </UnselectableTypography>
        <FormControl fullWidth>
          <Input value={name} disabled />
        </FormControl>
      </SpendingRowItem>
      <SpendingRowItem>
        <UnselectableTypography sx={{ marginBottom: '20px' }} variant="subtitle1" fontWeight="300" color="inherit">
          Dedicated From Pot
        </UnselectableTypography>
        <FormControl fullWidth>
          <Input
            startAdornment={<div style={{ margin: '4px 5px 5px 0' }}>£</div>}
            type="number"
            value={amount}
            onChange={(event: React.ChangeEvent<HTMLInputElement>): void =>
              onSpendingRowUpdate({
                id,
                name,
                amount: event.target.valueAsNumber,
                colour,
              })
            }
          />
        </FormControl>
      </SpendingRowItem>
      <SpendingRowItem>
        <UnselectableTypography sx={{ marginBottom: '20px' }} variant="subtitle1" fontWeight="300" color="inherit">
          Colour
        </UnselectableTypography>
        <FormControl fullWidth>
          <Input
            type="color"
            value={colour}
            onChange={(event: React.ChangeEvent<HTMLInputElement>): void =>
              onSpendingRowUpdate({
                id,
                name,
                amount,
                colour: event.target.value,
              })
            }
          />
        </FormControl>
      </SpendingRowItem>
    </SpendingRowContainer>
  );
};
