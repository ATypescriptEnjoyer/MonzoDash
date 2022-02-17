import { FormControl, InputLabel, MenuItem, Paper, Input } from '@mui/material';
import React from 'react';
import { TriggerKey } from '../AddAction';
import { StyledSelect, StyledTriggerRow } from './TriggerRow.styled';

interface RowData {
  keyId: number;
  operator: string;
  value: string;
}

interface Props {
  keys: TriggerKey[];
  data: RowData;
  onUpdate: ({ keyId, operator, value }: RowData) => void;
}

const Operators: { key: string; value: string }[] = [
  {
    key: 'EQUALS',
    value: 'Equals',
  },
  {
    key: 'NOT_EQUALS',
    value: 'Is Not',
  },
  {
    key: 'GREATER_THAN',
    value: 'Greater Than',
  },
  {
    key: 'LESS_THAN',
    value: 'Less Than',
  },
];

export const TriggerRow = ({ keys, data, onUpdate }: Props): JSX.Element => {
  const handleChange = (key: string, value: string): void => {
    onUpdate({
      ...data,
      [key]: value,
    });
  };

  return (
    <StyledTriggerRow>
      <Paper>
        <FormControl
          variant="standard"
          sx={{
            m: 1,
            minWidth: 120,
          }}
        >
          <InputLabel shrink id="select-key">
            Trigger Key
          </InputLabel>
          <StyledSelect
            labelId="select-key"
            id="key"
            name="keyId"
            value={data.keyId}
            label="Trigger Key"
            onChange={(event): void => handleChange(event.target.name, event.target.value as string)}
          >
            {[
              {
                id: 0,
                key: '',
              },
              ...keys,
            ].map(({ id, key }) => (
              <MenuItem key={id} value={id}>
                {key}
              </MenuItem>
            ))}
          </StyledSelect>
        </FormControl>
      </Paper>
      <Paper>
        <FormControl
          variant="standard"
          sx={{
            m: 1,
            minWidth: 120,
          }}
        >
          <InputLabel shrink id="select-operator">
            Operator
          </InputLabel>
          <StyledSelect
            labelId="select-operator"
            id="operator"
            name="operator"
            value={data.operator}
            label="Operator"
            onChange={(event): void => handleChange(event.target.name, event.target.value as string)}
          >
            {[
              {
                key: '',
                value: '',
              },
              ...Operators,
            ].map(({ key, value }) => (
              <MenuItem key={key} value={value}>
                {value}
              </MenuItem>
            ))}
          </StyledSelect>
        </FormControl>
      </Paper>
      <Paper>
        <FormControl
          variant="standard"
          sx={{
            m: 1,
            minWidth: 120,
          }}
        >
          <InputLabel shrink id="value">
            Value
          </InputLabel>
          <Input
            aria-labelledby="value"
            id="value"
            name="value"
            value={data.value}
            onChange={(event): void => handleChange(event.target.name, event.target.value as string)}
          />
        </FormControl>
      </Paper>
    </StyledTriggerRow>
  );
};
