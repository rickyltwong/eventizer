'use client';

import {
  Anchor,
  Button,
  Paper,
  PasswordInput,
  Space,
  Text,
  TextInput,
  Title,
} from '@mantine/core';
import { useMantineTheme } from '@mantine/core';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

import classes from './page.module.css';

const Page = () => {
  const theme = useMantineTheme();

  const router = useRouter();

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [loading, setLoading] = useState(false); // FIXME: loading is not used
  const [user, setUser] = useState({
    username: '',
    password: '',
  });
  const [error, setError] = useState<string | null>(null);

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    try {
      setLoading(true);
      const response = await axios.post('/api/auth/signin', user);
      if (response.data.status === 200) {
        router.replace('/home');
      } else {
        const data = await response.data;
        console.error('Error:', data);
      }
    } catch (error) {
      if (error instanceof Error) {
        console.log('Login failed', error.message);
      }
    } finally {
      setLoading(false);
      // Clear fields after attempt
      setUser({
        username: '',
        password: '',
      });
    }
  };

  return (
    <div className={classes.wrapper}>
      <Paper className={classes.form} radius={0} p={30}>
        <Title order={2} className={classes.title} ta="center" mt="lg" mb={20}>
          Eventizer Login
        </Title>
        <Title order={4} ta="center">
          Sign in to your account
        </Title>
        <TextInput
          label="Username"
          placeholder=""
          size="md"
          value={user.username}
          onChange={(e) =>
            setUser({ ...user, username: e.currentTarget.value })
          }
        />
        <PasswordInput
          label="Password"
          placeholder="Your password"
          mt="md"
          size="md"
          value={user.password}
          onChange={(e) =>
            setUser({ ...user, password: e.currentTarget.value })
          }
        />{' '}
        <Anchor
          href="/auth/forgot-password"
          size="xs"
          styles={{
            root: {
              color: theme.colors.myColor[9],
            },
          }}
        >
          Forgot password?
        </Anchor>
        <Space mt="md" />
        <Button
          size="xs"
          bg="#1A2970"
          fullWidth
          mt="15"
          type="submit"
          onClick={handleSignIn}
        >
          Login
        </Button>
        {error && (
          <Text ta="center" mt="md" color="red">
            {error}
          </Text>
        )}
        <Text ta="center" mt="md">
          Don&apos;t have an account?{' '}
          <Anchor
            href="../signup"
            fw={700}
            style={{
              color: theme.colors.myColor[9],
            }}
          >
            Register
          </Anchor>
        </Text>
      </Paper>
    </div>
  );
};

export default Page;
