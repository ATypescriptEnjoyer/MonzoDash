import { ChevronLeft, ChevronRight } from '@mui/icons-material';
import { Box, IconButton, Stack, Typography } from '@mui/material';
import { LineChart } from '@mui/x-charts';
import moment from 'moment';
import { useMemo } from 'react';

interface Props {
  data: { month: number; year: number; data: { [k: number]: number } };
  onChangeDate: (month: number, year: number) => void;
}

export const Chart = (props: Props) => {
  const { data, onChangeDate } = props;
  const chartDate = `${data.year}-${data.month.toString().padStart(2, '0')}`;
  const momentDate = moment(chartDate);

  const fwdDisabled = useMemo(() => moment().format('YYYY-MM') === chartDate, [chartDate]);

  const mapData = useMemo(
    () =>
      Object.keys(data.data).length == 0
        ? []
        : [...Array(momentDate.daysInMonth()).keys()].map((index) => ({
            x: index + 1,
            y: data.data[index + 1] ?? null,
          })),
    [data.data, momentDate],
  );

  const handleDateChange = (direction: 'f' | 'b') => {
    if (direction === 'f' && !fwdDisabled) {
      onChangeDate(data.month + 1 === 13 ? 1 : data.month + 1, data.month + 1 === 13 ? data.year + 1 : data.year);
    } else if (direction === 'b') {
      onChangeDate(data.month - 1 === 0 ? 12 : data.month - 1, data.month - 1 === 0 ? data.year - 1 : data.year);
    }
  };

  return (
    <Stack flex={1}>
      <Stack direction="row" alignItems="center" gap={2} sx={{ justifyContent: { xs: 'center', md: 'flex-start' } }}>
        <IconButton disabled={chartDate === '2020-01'} onClick={() => handleDateChange('b')}>
          <ChevronLeft />
        </IconButton>
        <Typography width="200px" textAlign="center" variant="h5">
          {momentDate.format('MMMM YYYY')}
        </Typography>
        <IconButton disabled={fwdDisabled} onClick={() => handleDateChange('f')}>
          <ChevronRight />
        </IconButton>
      </Stack>
      <Box height={450}>
        <LineChart
          series={[{ data: mapData.reduce((prev, curr) => [...prev, curr.y], [] as number[]) }]}
          xAxis={[{ data: mapData.reduce((prev, curr) => [...prev, curr.x], [] as number[]) }]}
        />
      </Box>
    </Stack>
  );
};
