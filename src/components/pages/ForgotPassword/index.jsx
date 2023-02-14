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
  const { enqueueSnackbar} = useSnackbar();
  const router = useRouter();

  const handleSubmit = async (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);

    try {
      setLoading(true);

      const login = await axios({
        method: 'post',
        url: `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/users/forgot-password`,
        data: {
          email: data.get('email'),
        },
        headers: {
          'Content-Type': 'application/json',
        },
      });

      setLoading(false);

      if (login.status === 200) {
        router.push('/');
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
         Forgot password
          </Typography>
          <Typography mt={3} component='p'>
            Enter your email and hit send, we will send you a reset password
            link
          </Typography>
          <Box component='form' onSubmit={handleSubmit} sx={{ mt: 1 }}>
            <TextField
              margin='normal'
              required
              fullWidth
              type={'email'}
              id='email'
              label='Email Address'
              name='email'
              autoComplete='email'
              autoFocus
            />

            <LoadingButton
              type='submit'
              fullWidth
              variant='contained'
              sx={{ mt: 3, mb: 2 }}
              disabled={loading}
              loading={loading}
            >
              Send Mail
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
