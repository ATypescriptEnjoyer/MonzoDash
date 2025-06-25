import { Button, Paper, Stack, TextField } from "@mui/material";
import { Typography } from "@mui/material";
import { useWebsockets } from "../../hooks/useWebsockets/useWebsockets";
import { useState } from "react";
import { UserMessage } from "./UserMessage";
import { AssistantMessage } from "./AssistantMessage";
import { Loader } from "../Loader";
import { v4 as uuidv4 } from 'uuid';
import { Send } from '@mui/icons-material';

interface ChatMessage {
  id: string;
  chunk: string;
  done: boolean;
  thinking: boolean;
}

export const Chat = () => {

  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<Record<string, { message: string, type: 'user' | 'assistant' }>>({});
  const [canMessage, setCanMessage] = useState(true);
  const [thinking, setThinking] = useState(false);

  const { isConnected, emit, enabled } = useWebsockets([
    {
      event: 'chat',
      callback: (data: ChatMessage): void => {
        const { id, chunk, done, thinking } = data;
        setThinking(thinking);
        if (thinking) {
          return;
        }
        setMessages(messages => ({ ...messages, [id]: { message: (messages[id]?.message ?? '') + chunk, type: 'assistant' } }));
        if (done) {
          setCanMessage(true);
        }
      },
    },
  ]);

  const handleSend = () => {
    emit('chat', message);
    setCanMessage(false);
    setMessages(messages => ({ ...messages, [uuidv4()]: { message, type: 'user' } }));
    setMessage('');
  }

  if (!enabled) {
    return null;
  }

  return (
    <Paper sx={{ display: { xs: 'none', md: 'block' }, height: '100%', width: { xs: '100%', xl: '30%' }, overflow: 'hidden' }}>
      <Stack gap={2} height="100%" width="100%">
        <Typography variant="h6">Virtual Accountant</Typography>
        {!isConnected ? <Stack height="100%" width="100%" justifyContent="center" alignItems="center">
          <Loader />
        </Stack> :
          <>
            <Stack gap={2} height="100%" overflow="auto">
              {Object.entries(messages).map(([key, { message, type }]) => (
                type === 'user' ? <UserMessage key={key} message={message} /> : <AssistantMessage key={key} message={message} thinking={false} />
              ))}
              {thinking && <AssistantMessage key="thinking" message={"Thinking..."} thinking={true} />}
            </Stack>
            <Stack direction="row" gap={2}>
              <TextField
                fullWidth
                value={message}
                disabled={!canMessage}
                placeholder="Write your message..."
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              />
              <Button disabled={!canMessage} onClick={handleSend}><Send /></Button>
            </Stack>
          </>}
      </Stack>
    </Paper >
  )
}