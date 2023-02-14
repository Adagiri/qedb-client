import * as React from 'react';
import axios from 'axios';
import Avatar from '@mui/material/Avatar';
import LoadingButton from '@mui/lab/LoadingButton';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';

import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';

import { Link as MuiLink } from '@mui/material';
import Link from 'next/link';
import { useSnackbar } from 'notistack';

import { useRouter } from 'next/router';
import Image from 'next/image';

function Copyright(props) {
  return (
    <Typography
      variant='body2'
      color='text.secondary'
      align='center'
      {...props}
    >
      {'Copyright © '}
      <Link color='inherit' href='https://qedb.net'>
        Qedb
      </Link>{' '}
      {new Date().getFullYear()}
      {'.'}
    </Typography>
  );
}

const theme = createTheme();

export default function SignIn() {
  const [loading, setLoading] = React.useState(false);
  const { enqueueSnackbar } = useSnackbar();
  const router = useRouter();

  const handleSubmit = async (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const token = window.location.pathname.slice(16);

    if (data.get('password') !== data.get('confirm-password')) {
     enqueueSnackbar('Password does not match', {variant: 'error'});
      return;
    }

    try {
      setLoading(true);

      const resetPassword = await axios({
        method: 'post',
        url: `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/users/reset-password/${token}`,
        data: {
          password: data.get('password'),
        },
        headers: {
          'Content-Type': 'application/json',
        },
      });

      setLoading(false);

      if (resetPassword.status === 200) {
        router.push('/signin');
      }
    } catch (error) {
      setLoading(false);
      const errorMessage =
        error.response?.data?.error || 'Something went wrong';

      enqueueSnackbar(errorMessage, {variant: 'error'});
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <Container component='main' maxWidth='xs'>
        <CssBaseline />
        <Box
          sx={{
            marginTop: 8,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Image
            src='https://qedb.s3.amazonaws.com/qedb-colored.svg'
            width='70px'
            height='50px'
          />
          <Typography
            component='p'
            fontWeight={'600'}
            fontSize={'.9rem'}
            variant='h5'
          >
          Reset password
          </Typography>
          <Typography mt={1} component='p'>
            Enter a secure password and hit Reset
          </Typography>
          <Box component='form' onSubmit={handleSubmit} sx={{ mt: 1 }}>
            <TextField
              margin='normal'
              required
              fullWidth
              name='password'
              label='Password'
              type='password'
              id='password'
              autoComplete='new-password'
              autoFocus
            />

            <TextField
              margin='normal'
              required
              fullWidth
              name='confirm-password'
              label='Confirm Password'
              type='password'
              id='confirm-password'
              autoComplete='confirm-password'
            />

            <LoadingButton
              type='submit'
              fullWidth
              variant='contained'
              sx={{ mt: 3, mb: 2 }}
              disabled={loading}
              loading={loading}
            >
              Reset Password
            </LoadingButton>
            <Grid container>
              <Grid item xs>
                <Link passHref href='/signin'>
                  <MuiLink sx={{ cursor: 'pointer' }} variant='body2'>
                    Sign In
                  </MuiLink>
                </Link>
              </Grid>
              <Grid item>
                <Link passHref href='/signup'>
                  <MuiLink sx={{ cursor: 'pointer' }} variant='body2'>
                    Sign Up
                  </MuiLink>
                </Link>
              </Grid>
            </Grid>
          </Box>
        </Box>
        <Copyright sx={{ mt: 8, mb: 4 }} />
      </Container>
    </ThemeProvider>
  );
}
