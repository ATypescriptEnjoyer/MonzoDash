import { Control, Controller, useFieldArray } from 'react-hook-form';
import { FrontendFinance } from '@monzodash/api/finances/finances.interfaces';
import { Button, Stack, TextField, Typography } from '@mui/material';
import { Add, Delete } from '@mui/icons-material';

interface Props {
  control: Control<{
    data: FrontendFinance[];
  }>;
  value: FrontendFinance;
  index: number;
}

export const SpendingBox = (props: Props) => {
  const { index, control, value } = props;
  const { fields, append, remove } = useFieldArray({
    control,
    name: `data.${index}.items`,
  });

  return (
    <Stack>
      <Stack
        sx={(theme) => ({ border: `2px solid ${value.colour}`, padding: theme.spacing(1) })}
        alignItems="center"
        gap={2}
      >
        <Typography fontWeight="bold">{value.name}</Typography>
        <Stack direction="row" gap={2}>
          <Controller
            render={({ field: { onChange, value } }) => (
              <TextField label="Colour" value={value} type="color" onChange={onChange} sx={{ width: '100px' }} />
            )}
            control={control}
            name={`data.${index}.colour`}
          />
          <Button onClick={() => append({ name: 'New Item', amount: '' })} startIcon={<Add />} variant="outlined" color="primary">
            Add Item
          </Button>
        </Stack>
      </Stack>
      <Stack gap={2} sx={{ padding: 2 }}>
        {fields.map((field, itemIndex) => (
          <Stack key={field.id}>
            <Controller
              render={({ field: { onChange, value } }) => (
                <TextField label="Name" value={value} onChange={onChange} />
              )}
              control={control}
              name={`data.${index}.items.${itemIndex}.name`}
            />
            <Controller
              render={({ field: { onChange, value } }) => (
                <TextField label="Amount" value={value} type="tel" onChange={(e) => onChange(e.target.value)} />
              )}
              control={control}
              name={`data.${index}.items.${itemIndex}.amount`}
            />
            <Button onClick={() => remove(itemIndex)} startIcon={<Delete />} variant="outlined" color="error">
              Remove Item
            </Button>
          </Stack>
        ))}
      </Stack>
    </Stack>
  );
};
