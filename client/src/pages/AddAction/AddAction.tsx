import React, { useState, useEffect } from 'react';
import { AppBar, UnselectableTypography } from '../../components';
import {
  DashboardContainer,
  DashboardContent,
  ActionContainer,
  ActionSection,
  TriggerActionContainer,
} from './AddAction.styled';
import { ApiConnector } from '../../network';
import { TriggerRow } from './TriggerRow';

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

  return (
    <DashboardContainer>
      <AppBar />
      <DashboardContent>
        <UnselectableTypography variant="h4" fontWeight="300" color="inherit">
          New Action
        </UnselectableTypography>
        <ActionContainer>
          <ActionSection>
            <UnselectableTypography variant="h5" fontWeight="300" color="inherit">
              Trigger (when this criteria is met)
            </UnselectableTypography>
            <TriggerActionContainer>
              {rows.map((row, index) => (
                <TriggerRow data={row} key={index} keys={keys} onUpdate={handleUpdate(index)} />
              ))}
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
    </DashboardContainer>
  );
};
