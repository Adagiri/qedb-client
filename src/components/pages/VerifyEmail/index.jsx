import * as React from 'react';
import axios from 'axios';
import Avatar from '@mui/material/Avatar';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';

import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';

import { Link as MuiLink } from '@mui/material';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useSnackbar } from 'notistack';


const theme = createTheme();

export default function VerifyEmail() {
  // On page load,
  // Run a request and display the response with links to signup, login and home
  const [loading, setLoading] = React.useState(false);
  const [success, setSuccess] = React.useState('');
  const [error, setError] = React.useState('');
  const { enqueueSnackbar } = useSnackbar();
  const router = useRouter();

  React.useEffect(() => {
    verifyEmail();
  }, []);

  const verifyEmail = async () => {
    const token = window.location.pathname.slice(14);

    try {
      setLoading(true);

      const verifyEmail = await axios({
        method: 'post',
        url: `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/users/verify-email/${token}`,
      });

      setLoading(false);
      if (verifyEmail.status === 200) {
        setSuccess('Email successfully verified');
        router.push('/');
      }
    } catch (error) {
      setLoading(false);

      const errorMessage =
        error.response?.data?.error || 'Something went wrong';
      setError(errorMessage);

      enqueueSnackbar(errorMessage, {variant: "error"});
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
          {loading ? (
            <Typography component='h1' variant='h5'>
              Verifying...
            </Typography>
          ) : (
            <Typography component='h1' variant='h5'>
              {error ? error : success ? ' Email verified' : ''}
            </Typography>
          )}

          <Grid container mt={4}>
            <Grid item xs>
              <Link passHref href='/signin'>
                <MuiLink sx={{ cursor: 'pointer' }} variant='body2'>
                  Sign In
                </MuiLink>
              </Link>
            </Grid>
            <Grid item xs>
              <Link passHref href='/signup'>
                <MuiLink sx={{ cursor: 'pointer' }} variant='body2'>
                  Sign Up
                </MuiLink>
              </Link>
            </Grid>
            <Grid item>
              <Link passHref href='/'>
                <MuiLink sx={{ cursor: 'pointer' }} variant='body2'>
                  Home
                </MuiLink>
              </Link>
            </Grid>
          </Grid>
        </Box>
      </Container>
    </ThemeProvider>
  );
}
