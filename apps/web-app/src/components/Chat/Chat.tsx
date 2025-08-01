import { Autocomplete, Button, Divider, Stack, TextField, Typography } from "@mui/material";
import { useWebsockets } from "../../hooks/useWebsockets/useWebsockets";
import { useState } from "react";
import { UserMessage } from "./UserMessage";
import { AssistantMessage } from "./AssistantMessage";
import { Loader } from "../Loader";
import { v4 as uuidv4 } from 'uuid';
import { Send } from '@mui/icons-material';
import { useDebounce } from "@uidotdev/usehooks";
import { useQuery } from "../../api";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { Dayjs } from "dayjs";

interface ChatMessage {
  id: string;
  response: string;
}

export const Chat = () => {

  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<Record<string, { message: string, type: 'user' | 'assistant' }>>({});
  const [canMessage, setCanMessage] = useState(true);
  const [inProgress, setInProgress] = useState(false);
  const [startDate, setStartDate] = useState<Dayjs | null>(null);
  const [endDate, setEndDate] = useState<Dayjs | null>(null);
  const [merchant, setMerchant] = useState('');
  const debouncedMerchant = useDebounce(merchant, 500);
  const merchants = useQuery<string[]>(
    `transactions/merchants?search=${debouncedMerchant.trim()}`,
    { enabled: debouncedMerchant.trim().length >= 3 }
  );
  const merchantOptions = merchants.data?.map((merchant) => ({ label: merchant, value: merchant })) ?? [];
  const selectedMerchant = merchantOptions?.find((option) => option.value === merchant);


  const { isConnected, emit, enabled } = useWebsockets([
    {
      event: 'chat',
      callback: (data: ChatMessage): void => {
        const { id, response } = data;
        setMessages(messages => ({ ...messages, [id]: { message: response, type: 'assistant' } }));
        setCanMessage(true);
        setInProgress(false);
      },
    },
  ]);

  const handleSend = () => {
    if (!message.trim()) return;
    emit('chat', {
      message: message.trim(),
      startDate: startDate?.format('YYYY-MM-DD'),
      endDate: endDate?.format('YYYY-MM-DD'),
      merchant: merchant,
    });
    setCanMessage(false);
    setInProgress(true);
    setMessages(messages => ({ ...messages, [uuidv4()]: { message, type: 'user' } }));
    setMessage('');
  }

  if (!enabled) {
    return null;
  }

  return (
    <Stack height="100%" width="100%" gap={2} overflow="auto">
      <Typography variant="h4" fontWeight="bold" sx={{ textAlign: { xs: 'center', md: 'left' } }}>Virtual Accountant</Typography>
      <Stack>
        <Stack gap={2}>
          <Stack>
            <Typography variant="h6" sx={{ display: { xs: 'none', md: 'block' } }}>Filters</Typography>
            <Typography variant="caption">If date filter is not set, it will be set to 1 month from today.</Typography>
          </Stack>
          <Stack direction={{ xs: "column", md: "row" }} gap={2} alignItems="center" mb={2}>
            <DatePicker
              label="Start Date"
              sx={{ minWidth: { xs: '100%', md: 300 } }}
              value={startDate}
              onChange={(e) => setStartDate(e)}
            />
            <DatePicker
              label="End Date"
              value={endDate}
              onChange={(e) => setEndDate(e)}
              sx={{ minWidth: { xs: '100%', md: 300 } }}
            />
            <Autocomplete
              freeSolo
              filterOptions={(x) => x}
              options={merchantOptions}
              inputValue={merchant}
              onInputChange={(_, value) => setMerchant(value)}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Merchant"
                  placeholder="Search merchant"
                />
              )}
              sx={{ minWidth: { xs: '100%', md: 300 } }}
              value={selectedMerchant}
              onChange={(_, value) => setMerchant(typeof value === "string" ? value : value?.value ?? '')}
            />
          </Stack>
        </Stack>
      </Stack>
      <Divider flexItem sx={{ background: (theme) => theme.palette.divider, backgroundColor: (theme) => theme.palette.primary.main }} />
      {isConnected && <Stack gap={2} height="100%" overflow="auto" sx={{ minHeight: { xs: '300px', md: 'auto' } }}>
        {Object.entries(messages).map(([key, { message, type }]) => (
          type === 'user' ? <UserMessage key={key} message={message} /> : <AssistantMessage key={key} message={message} thinking={false} />
        ))}
        {inProgress && <AssistantMessage key="thinking" message="" thinking={true} />}
      </Stack>}
      {!isConnected && <Loader />}
      <Stack direction="row" gap={2}>
        <TextField
          fullWidth
          value={message}
          disabled={!canMessage || !isConnected}
          placeholder="Write your message..."
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
        />
        <Button disabled={!canMessage || !isConnected} onClick={handleSend}><Send /></Button>
      </Stack>
    </Stack>
  )
}