import { colours } from '../../theme';
import { darken, Stack, Typography } from "@mui/material";
import SyncLoader from 'react-spinners/SyncLoader';

export const AssistantMessage = ({ message, thinking }: { message: string, thinking: boolean }) => {
  return <Stack padding={1} borderRadius={1} sx={{ backgroundColor: (theme) => darken(theme.palette.secondary.main, 0.5) }} gap={1} width={thinking ? 'auto' : "75%"} alignSelf="flex-end">
    {thinking ? <SyncLoader cssOverride={{ display: 'block' }} color={colours.white} size={10} speedMultiplier={0.5} /> : <Typography>
      {message.split('**').map((part, index) =>
        index % 2 === 1 ? <Typography key={index} component="span" sx={{ fontWeight: 'bold' }}>{part}</Typography> : part
      )}
    </Typography>}
  </Stack>
}