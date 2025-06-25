import { darken, Stack, Typography } from "@mui/material";

export const UserMessage = ({ message }: { message: string }) => {
  return <Stack gap={1} padding={1} borderRadius={1} sx={{ backgroundColor: (theme) => darken(theme.palette.primary.main, 0.5) }} width="75%" alignItems="flex-start">
    <Typography>{message}</Typography>
  </Stack>
}