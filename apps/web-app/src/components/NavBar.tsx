import {
  CreditCardRounded,
  LogoutRounded,
  Menu,
  SignalCellularAltRounded,
} from '@mui/icons-material';
import {
  Divider,
  Drawer,
  IconButton,
  Paper,
  Stack,
  styled,
  Typography,
  useMediaQuery,
  useTheme,
  AppBar as MuiAppBar,
  Toolbar,
  Button,
} from '@mui/material';
import { useMemo, useState } from 'react';
import { CurrentFinances } from '@monzodash/api/finances/finances.interfaces';
import { useMutation, useQuery } from '../api';

const FinanceText = styled(Typography)(({ theme }) => ({
  fontWeight: 'bold',
  textAlign: 'center',
  color: theme.palette.text.primary,
}));

const NavLinkButton = styled(Button)(({ theme }) => ({
  padding: theme.spacing(1, 2),
  alignItems: 'center',
  justifyContent: 'flex-start',
  gap: theme.spacing(1),
  textTransform: 'none',
  transition: 'background 0.2s',
  '&.Mui-selected, &.active': {
    background: theme.palette.action.selected,
    color: theme.palette.primary.main,
    fontWeight: 600,
  },
  '&:hover': {
    background: theme.palette.action.hover,
    color: theme.palette.primary.main,
  },
}));

interface Props {
  onShowSalary: () => void;
  onShowDedicatedSpending: () => void;
}

interface NavLinkProps {
  icon: React.ReactNode;
  text: string;
  onClick?: () => void;
}

const NavLink = ({ icon, text, onClick }: NavLinkProps) => (
  <NavLinkButton
    onClick={onClick}
  >
    {icon}
    <Typography variant="subtitle1">{text}</Typography>
  </NavLinkButton>
);

export const NavBar = (props: Props) => {
  const { onShowDedicatedSpending, onShowSalary } = props;
  const finances = useQuery<CurrentFinances>('finances/current');
  const logoutMutation = useMutation('auth/signout', { method: 'POST' });
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [drawerOpen, setDrawerOpen] = useState(false);

  const moneyLeft = useMemo(
    () =>
      finances.data ? (
        <Stack>
          <FinanceText>
            £{(finances.data.balancePence / 100).toFixed(2)} / {finances.data.daysTilPay} days
          </FinanceText>
          <Divider sx={{ background: theme.palette.primary.main, my: 1 }} />
          <FinanceText>
            £{(finances.data.perDayPence / 100).toFixed(2)} / day
          </FinanceText>
        </Stack>
      ) : (
        <Stack>
          <FinanceText>Loading</FinanceText>
          <Divider sx={{ my: 1 }} />
          <FinanceText>Finance Data</FinanceText>
        </Stack>
      ),
    [finances, theme],
  );

  const handleLogout = () => {
    logoutMutation.mutate({}, { onSuccess: () => (window.location.href = '/') });
  };

  const navLinks = [
    {
      icon: <CreditCardRounded color="primary" />,
      text: 'Salary Details',
      onClick: onShowSalary,
    },
    {
      icon: <CreditCardRounded color="primary" />,
      text: 'Dedicated Spending',
      onClick: onShowDedicatedSpending,
    }
  ];

  const logoutLink = {
    icon: <LogoutRounded color="primary" />,
    text: 'Logout',
    onClick: handleLogout,
  };

  // Sidebar content for both desktop and mobile
  const sidebarContent = (
    <Stack
      gap={4}
      height="100%"
      padding={isMobile ? 2 : 3}
      sx={{
        background: theme.palette.background.paper,
        minWidth: isMobile ? 220 : 280,
        width: isMobile ? '70vw' : 300,
      }}
    >
      <Stack alignItems="center" gap={1}>
        <SignalCellularAltRounded
          sx={{
            color: theme.palette.primary.main,
            width: 56,
            height: 56,
            mb: 1,
            filter: 'drop-shadow(0 2px 8px rgba(0,0,0,0.08))',
          }}
        />
        {moneyLeft}
      </Stack>
      <Stack gap={1} flex={1}>
        {navLinks.map((link) => (
          <NavLink key={link.text} {...link} onClick={link.onClick} />
        ))}
      </Stack>
      <Stack gap={1}>
        <Divider sx={{ background: theme.palette.divider }} />
        <NavLink {...logoutLink} />
      </Stack>
    </Stack>
  );

  // Mobile AppBar
  if (isMobile) {
    return (
      <>
        <MuiAppBar
          elevation={0}
          position="fixed"
          sx={{
            background: theme.palette.background.default,
            "&&": { border: 'none' },
            width: '100vw',
            left: 0,
            borderBottom: `1px solid ${theme.palette.divider}`,
          }}
        >
          <Toolbar sx={{ display: 'flex', justifyContent: 'space-between', px: 1 }}>
            <IconButton
              edge="start"
              color="primary"
              aria-label="open drawer"
              onClick={() => setDrawerOpen(true)}
              size="large"
            >
              <Menu />
            </IconButton>
          </Toolbar>
        </MuiAppBar >
        <Drawer
          anchor="left"
          open={drawerOpen}
          onClose={() => setDrawerOpen(false)}
          PaperProps={{
            sx: {
              background: theme.palette.background.paper,
              borderRight: `1px solid ${theme.palette.divider}`,
            },
          }}
        >
          {sidebarContent}
        </Drawer>
      </>
    );
  }

  // Desktop sidebar
  return (
    <Paper
      sx={{
        padding: 0,
        background: 'red',
        width: 300,
        height: '100vh',
        borderRadius: 0,
        borderRight: `1px solid ${theme.palette.divider}`,
        display: { xs: 'none', md: 'block' },
      }}
    >
      {sidebarContent}
    </Paper>
  );
};
