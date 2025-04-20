import { Autocomplete, Checkbox, FormControlLabel, Stack, TextField } from '@mui/material';
import { Controller, useForm } from 'react-hook-form';
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
  remainderPotId?: string;
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

  const { control, handleSubmit, watch } = useForm({
    values: data,
  });
  const pots = useQuery<Record<string, string>>('monzo/pots');
  const [showRemainderSelect, setShowRemainderSelect] = useState(false);
  const remainderPotId = watch('remainderPotId');

  const potsOptions = useMemo(
    () => pots.data && Object.keys(pots.data).map((potId) => ({ id: potId, label: pots.data[potId] })),
    [pots],
  );
  const selectedPot = potsOptions?.find((pots) => pots.id === remainderPotId);

  return (
    <Modal
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
            name="payDay"
            render={({ field: { onChange, value } }) => (
              <TextField label="Payday" value={value} type="number" onChange={onChange} />
            )}
          />
          <Controller
            control={control}
            name="paidOnHolidays"
            render={({ field: { onChange, value } }) => (
              <FormControlLabel
                hidden={data?.paidLastWorkingDay}
                label="Paid on holidays/weekends"
                control={<Checkbox checked={value} onChange={onChange} />}
              />
            )}
          />
          <Controller
            control={control}
            name="paidLastWorkingDay"
            render={({ field: { onChange, value } }) => (
              <FormControlLabel
                hidden={data?.paidOnHolidays}
                label="Paid Last working day"
                control={<Checkbox checked={value} onChange={onChange} />}
              />
            )}
          />
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
