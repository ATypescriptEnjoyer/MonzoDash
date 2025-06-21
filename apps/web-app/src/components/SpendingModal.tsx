import { Box, Stack, Tooltip, Typography } from '@mui/material';
import { useMemo } from 'react';
import { useFieldArray, useForm, useWatch } from 'react-hook-form';
import { FrontendFinance } from '@monzodash/api/finances/finances.interfaces';
import { Modal } from './Modal';
import { SpendingBox } from './SpendingBox';
import { Loader } from './Loader';

interface Props {
  open: boolean;
  onSubmit: (data: FrontendFinance[]) => void;
  onClose: () => void;
  data?: FrontendFinance[];
  isLoading: boolean;
  salary: number;
}

const TooltipTitle = (name: string, salaryPercent: number) => {
  return (
    <Stack>
      <Typography>{name}</Typography>
      <Typography>{salaryPercent.toFixed(2)}%</Typography>
    </Stack>
  );
};

export const SpendingModal = (props: Props) => {
  const { data, onClose, onSubmit, open, isLoading, salary } = props;
  const { control, handleSubmit, getValues } = useForm({ values: { data: data ?? [] } });
  const { fields } = useFieldArray({
    control,
    name: 'data' as never,
  });
  const formWatch = useWatch({ control, name: 'data' });

  const leftoverText = useMemo(() => {
    const potPayments =
      formWatch?.reduce((prev, curr) => prev + curr.items.reduce((prev, curr) => prev + +curr.amount, 0), 0) || 0;
    const leftover = salary - potPayments;
    return (
      <Typography textAlign="center" sx={{ color: 'green' }}>
        {`You'll have £${leftover.toFixed(2)} leftover in your current account!`}
      </Typography>
    );
  }, [formWatch, salary]);

  const spendingBar = useMemo(() => {
    if (!formWatch) {
      return null;
    }

    let potPayments = 0;

    const spendingBarData = formWatch
      .filter((value) => value.items.reduce((prev, curr) => prev + +curr.amount, 0) !== 0)
      .map((value) => {
        const percent = (value.items.reduce((prev, curr) => prev + +curr.amount, 0) / salary) * 100;
        potPayments += percent;
        return (
          <Tooltip title={TooltipTitle(value.name, percent)} placement="right" key={value.id}>
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
            </Box>
          </Tooltip>
        );
      });

    const salaryPercent = 100 - potPayments;

    return [
      <Tooltip title={TooltipTitle('Salary', salaryPercent)} placement="right" key="salary">
        <Box key="salary" sx={{ height: { xs: '100%', md: `${salaryPercent}%` }, width: '100%', backgroundColor: 'green' }}>
        </Box>
      </Tooltip>,
      ...spendingBarData,
    ];
  }, [formWatch, salary]);

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
