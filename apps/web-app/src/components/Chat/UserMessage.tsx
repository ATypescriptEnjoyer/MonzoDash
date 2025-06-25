import { Stack, Typography } from "@mui/material";

export const UserMessage = ({ message }: { message: string }) => {
  return <Stack gap={1} padding={1} borderRadius={1} sx={{ backgroundColor: (theme) => theme.palette.primary.main }} width="75%" alignItems="flex-start">
    <Typography>{message}</Typography>
  </Stack>
}