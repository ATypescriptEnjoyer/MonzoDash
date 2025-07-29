import { Button, Divider, Stack, TextField, Typography } from "@mui/material";
import { useWebsockets } from "../../hooks/useWebsockets/useWebsockets";
import { useState } from "react";
import { UserMessage } from "./UserMessage";
import { AssistantMessage } from "./AssistantMessage";
import { Loader } from "../Loader";
import { v4 as uuidv4 } from 'uuid';
import { Send } from '@mui/icons-material';

interface ChatMessage {
  id: string;
  response: string;
}

export const Chat = () => {

  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<Record<string, { message: string, type: 'user' | 'assistant' }>>({});
  const [canMessage, setCanMessage] = useState(true);
  const [inProgress, setInProgress] = useState(false);

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
    emit('chat', message.trim());
    setCanMessage(false);
    setInProgress(true);
    setMessages(messages => ({ ...messages, [uuidv4()]: { message, type: 'user' } }));
    setMessage('');
  }

  if (!enabled) {
    return null;
  }

  return (
    <Stack height="100%" width="100%" gap={2}>
      <Typography variant="h4" fontWeight="bold" sx={{ textAlign: { xs: 'center', md: 'left' } }}>Virtual Accountant</Typography>
      <Divider flexItem sx={{ background: (theme) => theme.palette.divider, backgroundColor: (theme) => theme.palette.primary.main }} />
      {isConnected && <Stack gap={2} height="100%" overflow="auto">
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