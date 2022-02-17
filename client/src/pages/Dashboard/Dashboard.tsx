import React, { useState, useEffect } from 'react';
import { UnselectableTypography } from '../../components';
import { DashboardContent, TableContainer } from './Dashboard.styled';
import { Owner } from '../../../../shared/interfaces/monzo';
import { ApiConnector } from '../../network';
import { ActionsTable } from './ActionsTable';
import { AutomationRecord } from '../../interfaces/AutomationRecord';
import { useNavigate } from 'react-router-dom';

export const Dashboard = (): JSX.Element => {
  const [name, setName] = useState('');
  const [actions, setActions] = useState<AutomationRecord[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const getName = async (): Promise<void> => {
      const { data } = await ApiConnector.get<Owner>('/monzo/getUser');
      const firstName = (data as Owner).preferred_first_name;
      setName(firstName);
    };
    getName();
  }, []);

  useEffect(() => {
    const getActions = async (): Promise<void> => {
      const { data } = await ApiConnector.get<AutomationRecord[]>('/actions/getAll');
      setActions(data);
    };
    getActions();
  }, []);

  const handleDeleteRecords = async (ids: number[]): Promise<boolean> => {
    const promises = ids.map(async (id) => {
      return {
        id,
        result: (await ApiConnector.delete<{ success: boolean }>(`/actions/delete/${id}`)).data.success,
      };
    });
    const finishedPromises = await Promise.all(promises);
    const filterDeletedActions = actions.filter((action) => {
      const deletedRecord = finishedPromises.find((promise) => promise.id === action.id);
      return !deletedRecord || !deletedRecord.result;
    });
    setActions(filterDeletedActions);
    return !finishedPromises.some((value) => !value.result);
  };

  const handleAddRecord = async (): Promise<void> => {
    navigate('/app/actions/add');
  };

  return (
    <DashboardContent>
      <UnselectableTypography variant="h4" fontWeight="300" color="inherit">
        Welcome Back, {name}
      </UnselectableTypography>
      <TableContainer>
        <ActionsTable onAddRecord={handleAddRecord} actions={actions} onDeleteRecords={handleDeleteRecords} />
      </TableContainer>
    </DashboardContent>
  );
};
