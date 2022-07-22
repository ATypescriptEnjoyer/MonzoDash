import React, { useState, useEffect } from 'react';
import { UnselectableTypography } from '../../components';
import {
  DashboardContent,
  ActionContainer,
  ActionSection,
  TriggerActionContainer,
  AddContainer,
  AddButton,
} from './AddTrigger.styled';
import { ApiConnector } from '../../network';
import { TriggerRow } from './TriggerRow';
import { Add } from '@mui/icons-material';
import { FormControl, Input, InputLabel, Paper } from '@mui/material';

export interface TriggerKey {
  id: number;
  key: string;
}

export interface RowData {
  keyId: number;
  operator: string;
  value: string;
}

export const AddTrigger = (): JSX.Element => {
  const [keys, setKeys] = useState<TriggerKey[]>([]);
  const [triggerName, setTriggerName] = useState('');

  const [rows, setRows] = useState<{ keyId: number; operator: string; value: string }[]>([
    {
      keyId: 0,
      operator: '',
      value: '',
    },
  ]);

  useEffect(() => {
    const getKeys = async (): Promise<void> => {
      const { data } = await ApiConnector.get<TriggerKey[]>('/actions/options');
      setKeys(data);
    };
    getKeys();
  });

  const handleUpdate = (index: number) => (data: RowData) => {
    const updatedRows = [...rows];
    updatedRows[index] = data;
    setRows(updatedRows);
  };

  const handleAddTrigger = (): void => {
    setRows([
      ...rows,
      {
        keyId: 0,
        operator: '',
        value: '',
      },
    ]);
  };

  return (
    <DashboardContent>
      <UnselectableTypography variant="h4" fontWeight="300" color="inherit">
        New Trigger
      </UnselectableTypography>
      <Paper
        sx={{
          width: 240,
          marginTop: 2,
        }}
      >
        <FormControl
          variant="standard"
          sx={{
            m: 1,
            width: 220,
          }}
        >
          <InputLabel shrink id="value">
            Trigger Name
          </InputLabel>
          <Input
            aria-labelledby="value"
            id="value"
            name="value"
            value={triggerName}
            onChange={(event): void => setTriggerName(event.target.value as string)}
          />
        </FormControl>
      </Paper>
      <ActionContainer>
        <ActionSection>
          <UnselectableTypography variant="h5" fontWeight="300" color="inherit">
            Conditions
          </UnselectableTypography>
          <TriggerActionContainer>
            {rows.map((row, index) => (
              <>
                {index > 0 && (
                  <UnselectableTypography variant="h5" fontWeight="300" color="inherit">
                    And
                  </UnselectableTypography>
                )}
                <TriggerRow data={row} key={index} keys={keys} onUpdate={handleUpdate(index)} />
              </>
            ))}
            <AddButton onClick={handleAddTrigger}>
              <AddContainer>
                <Add />
                <UnselectableTypography>Add Trigger</UnselectableTypography>
              </AddContainer>
            </AddButton>
          </TriggerActionContainer>
        </ActionSection>
      </ActionContainer>
    </DashboardContent>
  );
};
