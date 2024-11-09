import { Stack, Typography } from '@mui/material';
import moment from 'moment';
import { useMemo, useState } from 'react';
import { colours } from '../theme';
import { LineChart } from '@mui/x-charts';

interface Props {
  data: { month: number; year: number; data: { [k: number]: number } };
}

export const Chart = (props: Props) => {
  const { data } = props;
  const mapData = useMemo(
    () =>
      [...Array(moment(`${data.year}-${data.month}`).daysInMonth()).keys()].map((index) => ({
        x: index + 1,
        y: data.data[index + 1] ?? null,
      })),
    [data],
  );

  return (
    <Stack flex={1}>
      <Typography variant="h5">{moment(`${data.year}-${data.month}`).format('MMMM YYYY')}</Typography>
      <LineChart
        sx={{ flex: 1 }}
        series={[{ data: mapData.reduce((prev, curr) => [...prev, curr.y], [] as number[]) }]}
        xAxis={[{ data: mapData.reduce((prev, curr) => [...prev, curr.x], [] as number[]) }]}
      />
    </Stack>
  );
};
