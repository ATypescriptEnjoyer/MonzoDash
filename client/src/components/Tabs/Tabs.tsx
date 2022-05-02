import * as React from 'react';
import { Tabs as MuiTabs, Tab, Typography, Box } from '@mui/material';
import { DarkBox } from './Tabs.styled';

interface TabPanelProps {
  children: React.ReactNode;
  index: number;
  value: number;
}

export interface TabObject {
  title: string;
  component: React.ReactNode;
}

interface TabProps {
  Tabs: TabObject[];
}

export const TabPanel = (props: TabPanelProps): JSX.Element => {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
};

const a11yProps = (index: number): { id: string; 'aria-controls': string } => {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
};

export const Tabs = ({ Tabs }: TabProps): JSX.Element => {
  const [value, setValue] = React.useState(0);

  const handleChange = (_event: unknown, newValue: number): void => {
    setValue(newValue);
  };

  return (
    <DarkBox
      sx={{
        width: '100%',
      }}
    >
      <Box
        sx={{
          borderBottom: 1,
          borderColor: 'divider',
        }}
      >
        <MuiTabs value={value} onChange={handleChange} aria-label="basic tabs example">
          {Tabs.map((tab, index) => (
            <Tab label={tab.title} {...a11yProps(index)} />
          ))}
        </MuiTabs>
      </Box>
      {Tabs.map((tab, index) => (
        <TabPanel value={value} index={index}>
          {tab.component}
        </TabPanel>
      ))}
    </DarkBox>
  );
};
