import { Box, Stack, Typography } from '@mui/material';
import { DedicatedFinance } from '../../../shared/interfaces/finances';
import { SpendingBox } from './SpendingBox';
import { useFieldArray, useForm } from 'react-hook-form';
import { Modal } from './Modal';
import { useMemo } from 'react';

interface Props {
  open: boolean;
  onSubmit: (data: DedicatedFinance[]) => void;
  onClose: () => void;
  data: DedicatedFinance[];
}

export const SpendingModal = (props: Props) => {
  const { data, onClose, onSubmit, open } = props;
  const { control, handleSubmit, register, getValues, watch } = useForm({ values: { data } });
  const { fields } = useFieldArray({
    control,
    name: 'data' as never,
  });
  const formWatch = watch();

  const leftoverText = useMemo(() => {
    const salary = formWatch.data?.find((val) => val.id === '0');
    const potPayments =
      formWatch.data?.filter((val) => val.id !== '0').reduce((prev, curr) => (prev += curr.amount), 0) || 0;
    const color = salary?.colour || 'green';
    const leftover = (salary?.amount || 0) - potPayments;
    return (
      <Typography textAlign="center" sx={{ color }}>
        You'll have £{leftover.toFixed(2)} leftover in your current account!
      </Typography>
    );
  }, [formWatch]);

  const spendingBar = useMemo(() => {
    const salary = formWatch.data.find((val) => val.id === '0');
    const restSum = formWatch.data.filter((val) => val.id !== '0').reduce((prev, curr) => (prev += curr.amount), 0);

    const spendingBarData = formWatch.data
      .filter((value) => value.amount !== 0)
      .map((value) => {
        const percent =
          value.id === '0'
            ? ((value.amount - restSum) / value.amount) * 100
            : (value.amount / (salary?.amount || 1)) * 100;
        return (
          <Box
            key={value.id}
            sx={{
              transition: 'height 0.5s ease-in-out',
              height: `${percent}%`,
              backgroundColor: value.colour,
              overflowY: 'hidden',
            }}
          >
            {percent.toFixed(2)}%
          </Box>
        );
      });

    return spendingBarData;
  }, [formWatch]);

  return (
    <Modal
      show={open}
      onSubmit={handleSubmit(({ data }) => onSubmit(data))}
      onClose={onClose}
      title="Update Dedicated Spending"
    >
      <Stack direction="row" gap={2}>
        <Stack gap={1} padding={3} maxHeight="600px" flex={0.7} sx={{ overflowY: 'auto' }}>
          {fields?.map((field, index) => (
            <SpendingBox key={field.id} register={register} value={getValues().data[index]} index={index} />
          ))}
        </Stack>
        <Stack flex={0.3} alignItems="center" justifyContent="space-evenly">
          <Box height="60%">{spendingBar}</Box>
          {leftoverText}
        </Stack>
      </Stack>
    </Modal>
  );
};
