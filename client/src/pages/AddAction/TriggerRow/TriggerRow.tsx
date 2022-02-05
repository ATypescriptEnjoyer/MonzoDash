import { FormControl, InputLabel, MenuItem } from '@mui/material';
import React from 'react';
import { TablePaper } from '../../Dashboard/ActionsTable/ActionsTable.styled';
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

export const TriggerRow = ({ keys, data, onUpdate }: Props): JSX.Element => {
  const handleChange = (key: string, value: string): void => {
    onUpdate({
      ...data,
      [key]: value,
    });
  };

  return (
    <StyledTriggerRow>
      <TablePaper>
        <FormControl
          variant="standard"
          sx={{
            m: 1,
            minWidth: 120,
          }}
        >
          <InputLabel id="select-key">Trigger Key</InputLabel>
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
      </TablePaper>
    </StyledTriggerRow>
  );
};
