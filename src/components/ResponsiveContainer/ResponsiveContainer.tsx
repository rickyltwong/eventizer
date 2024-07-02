import { Container } from '@mantine/core';
import React from 'react';

import styles from './ResponsiveContainer.module.css';

interface ResponsiveContainerProps {
  children: React.ReactNode;
}

const ResponsiveContainer: React.FC<ResponsiveContainerProps> = ({
  children,
}) => {
  return <Container className={styles.root}>{children}</Container>;
};

export default ResponsiveContainer;
