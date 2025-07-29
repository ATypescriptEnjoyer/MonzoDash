import { Stack, Skeleton, Typography, IconButton } from '@mui/material';
import { Menu, MenuItem } from '@szhsin/react-menu';

export const LoadingTransactions = () =>
  Array.from(new Array(5).keys()).map((key) => (
    <Stack
      direction="row"
      justifyContent="space-between"
      alignItems="center"
      key={key}
      sx={{
        background: (theme) => theme.palette.background.default,
        borderRadius: (theme) => theme.shape.borderRadius,
      }}
      padding={2}
    >
      <Stack direction="row" alignItems="center" gap={2} flex={0.5}>
        <Skeleton variant="rounded" width={50} height={50} />
        <Stack>
          <Typography
            variant="body1"
            sx={{ cursor: 'pointer' }}
          >
            <Skeleton variant="text" width={100} />
          </Typography>
          <Typography variant="caption" color="text.secondary">
            <Skeleton variant="text" width={100} />
          </Typography>
        </Stack>
      </Stack>
      <Typography variant="body1" color="text.secondary">
        <Skeleton variant="text" width={100} />
      </Typography>
      <Menu
        theming="dark"
        menuButton={
          <IconButton>
            <Skeleton variant="rectangular" width={40} height={40} />
          </IconButton>
        }
      >
        <MenuItem>Delete</MenuItem>
        <MenuItem>Stop paying from pot</MenuItem>
      </Menu>
    </Stack>
  ));
