import { FormControl, Input } from '@mui/material';
import React from 'react';
import { DedicatedFinance } from '../../../../shared/interfaces/finances';
import {
  SpendingInput,
  SpendingRowContainer,
  SpendingRowHeader,
  SpendingRowItem,
  SpendingRowItems,
  SpendingRowLabel,
} from './SpendingRow.styled';

interface SpendingRowProps extends DedicatedFinance {
  onRowUpdate: (update: DedicatedFinance) => void;
}

export const SpendingRow = ({ id, name, amount, colour, dynamicPot, onRowUpdate }: SpendingRowProps): JSX.Element => {
  const onSpendingRowUpdate = (finance: DedicatedFinance): void => {
    onRowUpdate && onRowUpdate(finance);
  };

  return (
    <SpendingRowContainer>
      <SpendingRowHeader>{name}</SpendingRowHeader>
      <SpendingRowItems>
        <SpendingRowItem>
          <SpendingRowLabel>{id === '0' ? 'Salary Amount' : 'Pot Outgoings'}</SpendingRowLabel>
          <FormControl fullWidth>
            <SpendingInput
              startAdornment={<div style={{ margin: '4px 5px 5px 0' }}>£</div>}
              type="number"
              value={amount}
              onChange={(event: React.ChangeEvent<HTMLInputElement>): void =>
                onSpendingRowUpdate({
                  id,
                  name,
                  amount: event.target.valueAsNumber,
                  colour,
                  dynamicPot,
                })
              }
            />
          </FormControl>
        </SpendingRowItem>
        <SpendingRowItem>
          <SpendingRowLabel>Colour</SpendingRowLabel>
          <FormControl fullWidth>
            <SpendingInput
              type="color"
              disableUnderline
              value={colour}
              onChange={(event: React.ChangeEvent<HTMLInputElement>): void =>
                onSpendingRowUpdate({
                  id,
                  name,
                  amount,
                  colour: event.target.value,
                  dynamicPot,
                })
              }
            />
          </FormControl>
        </SpendingRowItem>
        {id !== '0' && (
          <SpendingRowItem>
            <SpendingRowLabel>Dynamic?</SpendingRowLabel>
            <FormControl fullWidth>
              <SpendingInput
                type="checkbox"
                disableUnderline
                value={dynamicPot}
                disabled={id === '0'}
                onChange={(event: React.ChangeEvent<HTMLInputElement>): void =>
                  onSpendingRowUpdate({
                    id,
                    name,
                    amount,
                    colour,
                    dynamicPot: event.target.checked,
                  })
                }
              />
            </FormControl>
          </SpendingRowItem>
        )}
      </SpendingRowItems>
    </SpendingRowContainer>
  );
};
