'use client';
import {
  Button,
  Group,
  NumberInput,
  Paper,
  PasswordInput,
  Stack,
  // Select,
  Text,
  TextInput,
  Title,
} from '@mantine/core';
import { useForm } from '@mantine/form';
import { IconBrandGoogleFilled } from '@tabler/icons-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

// import { signIn } from 'next-auth/react';
import classes from './signup.module.css';

const Page = () => {
  const router = useRouter();
  const form = useForm({
    mode: 'uncontrolled',
    validateInputOnChange: ['password', 'confirmPassword'],
    validateInputOnBlur: ['email', 'phoneNumber'],
    initialValues: {
      username: '',
      firstName: '',
      lastName: '',
      email: '',
      phoneNumber: '',
      password: '',
      confirmPassword: '',
      // role: '',
    },

    validate: {
      email: (value) =>
        /^\S+@\S+$/.test(value) ? null : 'Invalid email address',
      phoneNumber: (value) =>
        value.length < 10 ? 'invalid phone number' : null,
      password: (value) =>
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(
          value,
        )
          ? null
          : 'Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one number, and one special character',
      confirmPassword: (value, values) =>
        value === values.password ? null : 'Passwords do not match',
    },
  });

  const handleSubmit = form.onSubmit(async (values) => {
    const submitBody = {
      ...values,
      role: 'attendee',
      accountSource: 'credentials',
    };
    try {
      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(submitBody),
      });

      if (response.status === 200) {
        // Redirect to the new page
        await router.replace('/events');
      } else {
        const data = await response.json();
        console.error('Error:', data.message);
      }
    } catch (e) {
      console.error('An error occurred while submitting the form:', e);
    }
  });

  return (
    <div className={classes.wrapper}>
      <Paper className={classes.form} radius={0} p={30} pt={100}>
        <Title ta="center" order={1}>
          Eventizer
        </Title>
        <Text c="dimmed" size="sm" ta="center" mt="md">
          Register to get access to all events, discounts and promotions
        </Text>

        <form onSubmit={handleSubmit}>
          <TextInput
            label="Username"
            size="sm"
            placeholder=""
            mt="md"
            key={form.key('username')}
            {...form.getInputProps('username')}
            required
          />

          <Group justify="space-between" gap="xs" grow mt="md">
            <TextInput
              size="sm"
              label="First name"
              required
              key={form.key('firstName')}
              {...form.getInputProps('firstName')}
            />
            <TextInput
              size="sm"
              label="Last name"
              key={form.key('lastName')}
              {...form.getInputProps('lastName')}
              required
            />
          </Group>
          <Group justify="space-between" gap="xs" grow mt="md">
            <TextInput
              size="sm"
              label="Email"
              placeholder=""
              key={form.key('email')}
              {...form.getInputProps('email')}
              required
            />
            <NumberInput
              size="sm"
              label="Phone number"
              key={form.key('phoneNumber')}
              {...form.getInputProps('phoneNumber')}
              required
            />
          </Group>
          <Group justify="space-between" gap="xs" grow>
            <PasswordInput
              size="sm"
              label="Password"
              placeholder=""
              required
              key={form.key('password')}
              {...form.getInputProps('password')}
              mt="md"
            />
            <PasswordInput
              size="sm"
              label="Confirm Password"
              placeholder="Your password"
              required
              key={form.key('confirmPassword')}
              {...form.getInputProps('confirmPassword')}
              mt="md"
            />
          </Group>
          <Text c="red" ta="center" size="sm" mt={8}>
            By clicking ‘Create account’, I fully acknowledge Eventizer Terms of
            Service and Privacy Policy
          </Text>
          <Button
            size="sm"
            bg="#1A2970"
            fullWidth
            mt="15"
            type="submit"
            disabled={!form.isValid()}
          >
            Create Account
          </Button>
          <Group justify="center" gap="xs" mt={18}>
            <Text ta="center" size="sm">
              Already have an account?
            </Text>
            <Text c="blue" ta="center" size="sm">
              <Link href="/auth/signin">Log in</Link>
            </Text>
          </Group>
        </form>
        <Stack mt={20}>
          <Group gap={0} grow>
            <hr />
            <Text ta="center" size="md">
              OR
            </Text>
            <hr />
          </Group>

          <Button
            leftSection={<IconBrandGoogleFilled size={14} />}
            variant="default"
            onClick={() =>
              router.push(
                '/api/auth/signin?callbackUrl=' + encodeURIComponent('/events'),
              )
            }
          >
            Continue with Google
          </Button>
        </Stack>
      </Paper>
    </div>
  );
};

export default Page;
