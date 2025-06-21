import { Control, Controller, useFieldArray } from 'react-hook-form';
import { FrontendFinance } from '@monzodash/api/finances/finances.interfaces';
import { Button, Stack, TextField, Typography } from '@mui/material';
import { Add, Delete, ExpandMore, ExpandLess } from '@mui/icons-material';
import { useState } from 'react';

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
  const [collapsed, setCollapsed] = useState(true);

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
        <Stack gap={2} sx={{ padding: 2 }} alignItems="flex-start" width="100%">
          <Stack direction="row" gap={2} alignItems="center">
            <Typography fontWeight="bold">Items</Typography>
            <Button
              onClick={() => setCollapsed(!collapsed)}
              variant="outlined"
              size="small"
              sx={{ minWidth: 'auto', padding: '4px 8px' }}
            >
              {collapsed ? <ExpandMore /> : <ExpandLess />}
            </Button>
          </Stack>
          {!collapsed && fields.map((field, itemIndex) => (
            <Stack key={field.id} direction="row" gap={2}>
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
              <Button onClick={() => remove(itemIndex)} startIcon={<Delete />} variant="outlined" color="error" />
            </Stack>
          ))}
        </Stack>
      </Stack>
    </Stack>
  );
};
