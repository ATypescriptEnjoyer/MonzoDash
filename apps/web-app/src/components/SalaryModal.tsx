import { Autocomplete, Checkbox, FormControlLabel, Stack, TextField, Typography } from '@mui/material';
import { Controller, useForm, useWatch } from 'react-hook-form';
import { Modal } from './Modal';
import { Loader } from './Loader';
import { useMemo, useState } from 'react';
import { useQuery } from '../api';

export interface SalaryData {
  id: string;
  name: string;
  payDay: number;
  paidOnHolidays: boolean;
  paidLastWorkingDay: boolean;
  moveRemaining: boolean;
  remainderPotId?: string | null;
  salary: number;
}

interface Props {
  open: boolean;
  onSubmit: (data: SalaryData) => void;
  onClose: () => void;
  data?: SalaryData;
  isLoading: boolean;
}

export const SalaryModal = (props: Props) => {
  const { onClose, onSubmit, open, data, isLoading } = props;

  const { control, handleSubmit } = useForm({
    values: data,
  });
  const pots = useQuery<Record<string, string>>('monzo/pots');
  const [showRemainderSelect, setShowRemainderSelect] = useState(!!data?.remainderPotId);
  const remainderPotId = useWatch({ control, name: 'remainderPotId' });
  const paidLastWorkingDay = useWatch({ control, name: 'paidLastWorkingDay' });

  const potsOptions = useMemo(
    () => pots.data && Object.keys(pots.data).map((potId) => ({ id: potId, label: pots.data[potId] })),
    [pots],
  );
  const selectedPot = potsOptions?.find((pots) => pots.id === remainderPotId);

  return (
    <Modal
      maxWidth="sm"
      open={open}
      onSubmit={handleSubmit((data) =>
        onSubmit({ ...data, remainderPotId: showRemainderSelect ? data.remainderPotId : null }),
      )}
      onClose={onClose}
      title="Update Salary Details"
    >
      {isLoading && <Loader />}
      {!isLoading && (
        <Stack
          gap={2.5}
          sx={(theme) => ({
            padding: theme.spacing(2),
          })}
        >
          <Controller
            control={control}
            name="name"
            render={({ field: { onChange, value } }) => (
              <TextField label="Employer Name" value={value} onChange={onChange} />
            )}
          />
          <Controller
            control={control}
            name="salary"
            render={({ field: { onChange, value } }) => (
              <TextField slotProps={{ input: { startAdornment: <Typography marginRight={0.5} variant="body1">£</Typography> } }} label="Salary" value={value} type="number" onChange={(e) => onChange(e.target.value.length > 0 ? +e.target.value.replace(/[^0-9.]/g, '') : '')} />
            )}
          />
          <Controller
            control={control}
            name="paidOnHolidays"
            render={({ field: { onChange, value } }) => (
              <FormControlLabel
                label="Paid on holidays/weekends"
                control={<Checkbox checked={value} onChange={onChange} />}
              />
            )}
          />

          {/* Paid last working day */}
          <Controller
            control={control}
            name="paidLastWorkingDay"
            render={({ field: { onChange, value } }) => (
              <FormControlLabel
                label="Paid Last working day"
                control={<Checkbox checked={value} onChange={onChange} />}
              />
            )}
          />
          {!paidLastWorkingDay && <Controller
            control={control}
            name="payDay"
            render={({ field: { onChange, value } }) => (
              <TextField label="Payday" value={value} type="number" onChange={onChange} />
            )}
          />}
          {/* End of Paid last working day */}

          <FormControlLabel
            label="Move remaining funds to pot"
            control={
              <Checkbox checked={showRemainderSelect} onChange={() => setShowRemainderSelect(!showRemainderSelect)} />
            }
          />
          {potsOptions && (
            <Controller
              control={control}
              name="remainderPotId"
              render={({ field: { onChange } }) => (
                <Autocomplete
                  hidden={!showRemainderSelect}
                  onChange={(_, value) => onChange(value?.id)}
                  value={selectedPot ?? potsOptions?.[0]}
                  disablePortal
                  options={potsOptions ?? []}
                  renderInput={(params) => <TextField {...params} label="Pots" />}
                />
              )}
            />
          )}
        </Stack>
      )}
    </Modal>
  );
};
