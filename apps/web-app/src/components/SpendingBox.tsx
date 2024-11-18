import { Control, Controller } from 'react-hook-form';
import { DedicatedFinance } from '@api/finances/finances.interfaces';
import { Stack, TextField, Typography } from '@mui/material';

interface Props {
  control: Control<{
    data: DedicatedFinance[];
  }>;
  value: DedicatedFinance;
  index: number;
}

export const SpendingBox = (props: Props) => {
  const { index, control, value } = props;

  return (
    <Stack
      sx={(theme) => ({ border: `2px solid ${value.colour}`, padding: theme.spacing(1) })}
      alignItems="center"
      gap={2}
    >
      <Typography fontWeight="bold">{value.name}</Typography>
      <Stack direction="row" gap={2}>
        <Controller
          render={({ field: { onChange, value } }) => (
            <TextField label="Amount" value={value} type="tel" onChange={onChange} />
          )}
          control={control}
          name={`data.${index}.amount`}
        />
        <Controller
          render={({ field: { onChange, value } }) => (
            <TextField label="Colour" value={value} type="color" onChange={onChange} sx={{ width: '100px' }} />
          )}
          control={control}
          name={`data.${index}.colour`}
        />
      </Stack>
    </Stack>
  );
};
