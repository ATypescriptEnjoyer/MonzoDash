import React, { useState, useEffect } from 'react';
import { UnselectableTypography } from '../../components';
import {
  DashboardContent,
  ActionContainer,
  ActionSection,
  TriggerActionContainer,
  AddContainer,
  AddButton,
} from './AddAction.styled';
import { ApiConnector } from '../../network';
import { TriggerRow } from './TriggerRow';
import { Add } from '@mui/icons-material';

export interface TriggerKey {
  id: number;
  key: string;
}

export interface RowData {
  keyId: number;
  operator: string;
  value: string;
}

export const AddAction = (): JSX.Element => {
  const [keys, setKeys] = useState<TriggerKey[]>([]);
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
        New Action
      </UnselectableTypography>
      <ActionContainer>
        <ActionSection>
          <UnselectableTypography variant="h5" fontWeight="300" color="inherit">
            When
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
        <ActionSection>
          <UnselectableTypography variant="h5" fontWeight="300" color="inherit">
            Action (do this)
          </UnselectableTypography>
          <TriggerActionContainer></TriggerActionContainer>
        </ActionSection>
      </ActionContainer>
    </DashboardContent>
  );
};
