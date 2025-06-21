import { Box, Stack, Tooltip, Typography } from '@mui/material';
import { useMemo } from 'react';
import { useFieldArray, useForm, useWatch } from 'react-hook-form';
import { FrontendFinance } from '@monzodash/api/finances/finances.interfaces';
import { Modal } from './Modal';
import { SpendingBox } from './SpendingBox';
import { Loader } from './Loader';
import { pieArcLabelClasses, PieChart, PieValueType } from '@mui/x-charts';
import { MakeOptional } from '@mui/x-charts/internals';

type PieItem = (MakeOptional<PieValueType, "id"> & { amount: number });

interface Props {
  open: boolean;
  onSubmit: (data: FrontendFinance[]) => void;
  onClose: () => void;
  data?: FrontendFinance[];
  isLoading: boolean;
  salary: number;
}

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

  const PieChartData: PieItem[] = useMemo(() => {
    if (!formWatch) {
      return [];
    }

    let potPayments = 0;

    const spendingBarData = formWatch
      .filter((value) => value.items.reduce((prev, curr) => prev + +curr.amount, 0) !== 0)
      .map((value) => {
        const percent = (value.items.reduce((prev, curr) => prev + +curr.amount, 0) / salary) * 100;
        potPayments += percent;
        return (
          {
            amount: value.items.reduce((prev, curr) => prev + +curr.amount, 0),
            value: percent,
            label: value.name,
            color: value.colour,
          }
        );
      });

    const salaryPercent = 100 - potPayments;

    return [
      {
        amount: salary,
        value: salaryPercent,
        label: 'Salary',
        color: 'green',
      },
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
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%', height: '100%' }}>
              <PieChart
                sx={{
                  "& .MuiPieArc-root": { stroke: 'none' }, [`& .${pieArcLabelClasses.root}`]: {
                    fontWeight: 'bold',
                  },
                }}
                slotProps={{
                  legend: {
                    position: { vertical: 'top', horizontal: 'middle' },
                    direction: 'row',
                  },
                }}
                margin={{ right: 0 }}

                series={[
                  {
                    highlightScope: { fade: 'global', highlight: 'item' },
                    valueFormatter: (value) => `£${(value as PieItem).amount.toFixed(2)} (${(value as PieItem).value.toFixed(2)}%)`,
                    arcLabel: (item) => `${(item as unknown as PieItem).value.toFixed(2)}%`,
                    arcLabelMinAngle: 25,
                    data: PieChartData,
                    innerRadius: 60,
                    outerRadius: 200,
                    paddingAngle: 5,
                    cornerRadius: 5,

                  }

                ]}
              />
            </Box>
            {leftoverText}
          </Stack>
        </Stack>
      )}
    </Modal>
  );
};
