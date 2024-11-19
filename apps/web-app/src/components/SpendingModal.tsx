import { Box, Stack, Typography } from '@mui/material';
import { useMemo } from 'react';
import { useFieldArray, useForm } from 'react-hook-form';
import { DedicatedFinance } from '@monzodash/api/finances/finances.interfaces';
import { Modal } from './Modal';
import { SpendingBox } from './SpendingBox';
import { Loader } from './Loader';

interface Props {
  open: boolean;
  onSubmit: (data: DedicatedFinance[]) => void;
  onClose: () => void;
  data?: DedicatedFinance[];
  isLoading: boolean;
}

export const SpendingModal = (props: Props) => {
  const { data, onClose, onSubmit, open, isLoading } = props;
  const { control, handleSubmit, getValues, watch } = useForm({ values: { data: data ?? [] } });
  const { fields } = useFieldArray({
    control,
    name: 'data' as never,
  });
  const formWatch = watch();

  const leftoverText = useMemo(() => {
    const salary = formWatch.data?.find((val) => val.id === '0');
    const potPayments =
      formWatch.data?.filter((val) => val.id !== '0').reduce((prev, curr) => prev + curr.amount, 0) || 0;
    const color = salary?.colour ?? 'green';
    const leftover = (salary?.amount ?? 0) - potPayments;
    return (
      <Typography textAlign="center" sx={{ color }}>
        {`You'll have £${leftover.toFixed(2)} leftover in your current account!`}
      </Typography>
    );
  }, [formWatch]);

  const spendingBar = useMemo(() => {
    if (!formWatch.data) {
      return null;
    }
    const salary = formWatch.data.find((val) => val.id === '0');
    const restSum = formWatch.data.filter((val) => val.id !== '0').reduce((prev, curr) => prev + curr.amount, 0);

    const spendingBarData = formWatch.data
      .filter((value) => value.amount !== 0)
      .map((value) => {
        const percent =
          value.id === '0'
            ? ((value.amount - restSum) / value.amount) * 100
            : (value.amount / (salary?.amount ?? 1)) * 100;
        return (
          <Box
            key={value.id}
            sx={{
              height: { xs: '100%', md: `${percent}%` },
              width: { xs: `${percent}%`, md: '100%' },
              transition: 'height 0.5s ease-in-out',
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
      open={open}
      onSubmit={handleSubmit(({ data }) => onSubmit(data))}
      onClose={onClose}
      title="Update Dedicated Spending"
    >
      {isLoading && <Loader />}
      {!isLoading && (
        <Stack maxHeight="100%" gap={2} sx={{ flexDirection: { xs: 'column-reverse', md: 'row' } }}>
          <Stack gap={1} maxHeight="600px" flex={0.6} sx={{ overflowY: 'auto' }}>
            {fields?.map((field, index) => (
              <SpendingBox key={field.id} control={control} value={getValues().data[index]} index={index} />
            ))}
          </Stack>
          <Stack
            sx={(theme) => ({
              gap: { xs: theme.spacing(2), md: '0' },
            })}
            flex={0.4}
            alignItems="center"
            justifyContent="space-evenly"
          >
            <Stack
              sx={{
                flexDirection: { xs: 'row', md: 'column' },
                height: { xs: '50px', md: '75%' },
                width: { xs: '100%', md: '60px' },
              }}
            >
              {spendingBar}
            </Stack>
            {leftoverText}
          </Stack>
        </Stack>
      )}
    </Modal>
  );
};
