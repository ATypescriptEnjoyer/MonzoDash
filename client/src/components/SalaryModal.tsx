import { Checkbox, FormControlLabel, Stack, TextField } from '@mui/material';
import { Controller, useForm } from 'react-hook-form';
import { Modal } from './Modal';

export interface SalaryData {
  id: string;
  name: string;
  payDay: number;
  paidOnHolidays: boolean;
  paidLastWorkingDay: boolean;
}

interface Props {
  open: boolean;
  onSubmit: (data: SalaryData) => void;
  onClose: () => void;
  data: SalaryData;
}

export const SalaryModal = (props: Props) => {
  const { onClose, onSubmit, open, data } = props;

  const { control, handleSubmit } = useForm({ values: data });

  return (
    <Modal open={open} onSubmit={handleSubmit(onSubmit)} onClose={onClose} title="Update Salary Details">
      <Stack gap={2.5}>
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
              hidden={data.paidLastWorkingDay}
              label="Paid on holidays/weekends"
              control={<Checkbox value={value} onChange={onChange} />}
            />
          )}
        />
        <Controller
          control={control}
          name="paidLastWorkingDay"
          render={({ field: { onChange, value } }) => (
            <FormControlLabel
              hidden={data.paidOnHolidays}
              label="Paid Last working day"
              control={<Checkbox value={value} onChange={onChange} />}
            />
          )}
        />
      </Stack>
    </Modal>
  );
};
