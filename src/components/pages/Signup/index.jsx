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
import {  useSnackbar } from 'notistack';
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

    try {
      setLoading(true);

      const signup = await axios({
        method: 'post',
        url: `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/users`,
        data: {
          username: data.get('username'),
          email: data.get('email'),
          password: data.get('password'),
        },
        headers: {
          'Content-Type': 'application/json',
        },
      });

      setLoading(false);
      if (signup.status === 201) {
        router.push('/');
        enqueueSnackbar('Verification link has been sent to your email', {variant: 'success'});
      }
    } catch (error) {
      setLoading(false);
      console.log(error);
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
          {/* <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
            <LockOutlinedIcon />
          </Avatar> */}

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
            Sign up
          </Typography>
          <Box component='form' onSubmit={handleSubmit} sx={{ mt: 1 }}>
            <TextField
              margin='normal'
              required
              fullWidth
              type='text'
              id='username'
              label='Username'
              name='username'
              autoComplete='username'
              autoFocus
            />
            <TextField
              margin='normal'
              required
              fullWidth
              type='email'
              id='email'
              label='Email Address'
              name='email'
              autoComplete='email'
            />
            <TextField
              margin='normal'
              required
              fullWidth
              name='password'
              label='Password'
              type='password'
              id='password'
              autoComplete='current-password'
            />
            <LoadingButton
              type='submit'
              fullWidth
              variant='contained'
              sx={{ mt: 3, mb: 2, backgroundColor: '#449788' }}
              disabled={loading}
              loading={loading}
              color='primary'
            >
              Sign Up
            </LoadingButton>
            <Grid container justifyContent='flex-end'>
              <Grid item>
                <Link passHref href='/signin'>
                  <MuiLink sx={{ cursor: 'pointer' }} variant='body2'>
                    Already have an account? Sign in
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
