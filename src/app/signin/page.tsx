"use client";

import {
  Paper,
  TextInput,
  PasswordInput,
  Checkbox,
  Button,
  Title,
  Text,
  Anchor,
  Space,
} from "@mantine/core";
import classes from "./page.module.css";
import { useMantineTheme } from "@mantine/core";
import { useRouter } from "next/navigation";
import { useContext, useState } from "react";
import axios from "axios";

const Page = (props: any) => {
  const theme = useMantineTheme();

  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState({
    username: "",
    password: "",
  });
  const [error, setError] = useState<string | null>(null);

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    try {
      setLoading(true);
      const response = await axios.post("/api/auth/signin", user);
      if (response.data.status === 200) {
        router.replace("/home");
      } else {
        const data = await response.data;
        console.error("Error:", data);
      }
    } catch (error: any) {
      console.log("Login failed", error.message);
    } finally {
      setLoading(false);
      // Clear fields after attempt
      setUser({
        username: "",
        password: "",
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
        />{" "}
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
          Don&apos;t have an account?{" "}
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
