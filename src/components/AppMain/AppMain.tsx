import { Box } from '@mantine/core';
import { ReactNode } from 'react';

import classes from './App.module.css';

type AppMainProps = {
  children: ReactNode;
};

const AppMain = ({ children }: AppMainProps) => {
  return <Box className={classes.main}>{children}</Box>;
};

export default AppMain;
