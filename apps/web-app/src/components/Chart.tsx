import { ChevronLeft, ChevronRight } from '@mui/icons-material';
import { Box, Divider, IconButton, Stack, Typography, useTheme } from '@mui/material';
import { LineChart } from '@mui/x-charts';
import dayjs from 'dayjs';
import { useMemo } from 'react';
import { useWindowSize } from '@uidotdev/usehooks';

interface Props {
  data?: { month: number; year: number; data: { [k: number]: number } };
  onChangeDate: (month: number, year: number) => void;
  isLoading: boolean;
}

export const Chart = (props: Props) => {
  const { data, isLoading, onChangeDate } = props;
  const chartDate = data ? `${data.year}-${data.month.toString().padStart(2, '0')}` : 'Loading';
  const calculatedChartDate = dayjs(chartDate);
  const { width } = useWindowSize();
  const theme = useTheme();
  const fwdDisabled = useMemo(() => dayjs().format('YYYY-MM') === chartDate, [chartDate]);

  const mapData = useMemo(
    () =>
      !data || Object.keys(data.data).length === 0
        ? []
        : [...Array(calculatedChartDate.daysInMonth()).keys()].map((index) => ({
          x: index + 1,
          y: data.data[index + 1] ?? null,
        })),
    [data, calculatedChartDate],
  );

  const handleDateChange = (direction: 'f' | 'b') => {
    if (!data) return;
    if (direction === 'f' && !fwdDisabled) {
      onChangeDate(data.month + 1 === 13 ? 1 : data.month + 1, data.month + 1 === 13 ? data.year + 1 : data.year);
    } else if (direction === 'b') {
      onChangeDate(data.month - 1 === 0 ? 12 : data.month - 1, data.month - 1 === 0 ? data.year - 1 : data.year);
    }
  };

  return (
    <Stack flex={1} gap={2}>
      <Typography variant="h4" fontWeight="bold" sx={{ textAlign: { xs: 'center', md: 'left' } }}>Daily Spending</Typography>
      <Divider flexItem sx={{ background: (theme) => theme.palette.divider, backgroundColor: (theme) => theme.palette.primary.main }} />
      <Stack direction="row" alignItems="center" gap={2} sx={{ justifyContent: { xs: 'center', md: 'flex-start' } }}>
        <IconButton disabled={chartDate === '2020-01'} onClick={() => handleDateChange('b')}>
          <ChevronLeft />
        </IconButton>
        <Typography width="200px" textAlign="center" variant="h5">
          {calculatedChartDate.format('MMMM YYYY')}
        </Typography>
        <IconButton disabled={fwdDisabled} onClick={() => handleDateChange('f')}>
          <ChevronRight />
        </IconButton>
      </Stack>
      <Box height={450} maxWidth={width ?? 1920}>
        <LineChart
          loading={isLoading}
          series={[
            {
              data: mapData.reduce((prev, curr) => [...prev, curr.y], [] as number[]),
              color: theme.palette.primary.main,
              connectNulls: true,
              valueFormatter: (value) => (value ? `£${value}` : null),
            },
          ]}
          xAxis={[
            { data: mapData.reduce((prev, curr) => [...prev, `${curr.x}`], [] as string[]), scaleType: 'point' },
          ]}
        />
      </Box>
    </Stack>
  );
};
