import {
  Typography,
  IconButton,
  Divider,
  DialogTitle,
  Dialog,
  DialogContent,
  DialogContentText,
  TextField,
} from '@mui/material';
import { Box } from '@mui/system';
import axios from 'axios';
import { useEffect, useState } from 'react';
import Cover from '../../Cover';
import EditIcon from '@mui/icons-material/Edit';
import { useSnackbar } from 'notistack';

import Chip from '@mui/material/Chip';
import LoadingButton from '@mui/lab/LoadingButton';
import { useRouter } from 'next/router';
import { confirmLogin } from '../../../utils/auth';


export default function Contribute() {
  const router = useRouter();

  const [user, setUser] = useState({});
  const [edit, setEdit] = useState(false);
  const [username, setUsername] = useState('');
  const [loading, setLoading] = useState(false);
  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => {
    if (confirmLogin()) {
      const savedUser = JSON.parse(localStorage.getItem('user'));

      if (savedUser) {
        setUser(savedUser);
      }
    } else {
      router.push('/signin');
    }
  }, []);

  const editProfile = async () => {
    if (!username) {
      setEdit(false);
      return;
    }
    setLoading(true);
    try {
      const contentData = await axios({
        method: 'PUT',
        url: `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/users`,
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + JSON.parse(localStorage.getItem('token')),
        },
        data: {
          username,
        },
      });

      setUser(contentData.data);
      localStorage.setItem('user', JSON.stringify(contentData.data));

      setLoading(false);
      setEdit(false);
    } catch (error) {
      setLoading(false);
      enqueueSnackbar('Profile update failed', { variant: 'error' });
    }
  };

  return (
    <Cover>
      <Box
        sx={{
          // backgroundColor: '#485461',
          // backgroundImage: 'linear-gradient(315deg, #485461 0%, #28313b 74%)',
          // color: '#fff',
          height: '100%',
          // minHeight: "100vh",
          width: '100%',
          padding: 3,
        }}
      >
        <Typography sx={{ width: '100%', textAlign: 'center' }} mb={1}>
          {' '}
          Your Profile{' '}
          <IconButton
            sx={{ color: '#fff', mb: 0.3, ml: 0.5, background: '#449788' }}
            size='small'
          >
            <EditIcon fontSize='10px' onClick={() => setEdit(true)} />
          </IconButton>{' '}
        </Typography>
        <Divider />
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            height: '95%',
            justifyContent: 'space-around',
            width: '100%',
            alignItems: 'center',
          }}
        >
          <Typography>
            Username -{' '}
            <Chip
              sx={{ fontWeight: 600 }}
              color='primary'
              label={user.username}
            />{' '}
          </Typography>
          <Typography>
            Email -{' '}
            <Chip sx={{ fontWeight: 600 }} color='primary' label={user.email} />
          </Typography>
          <Typography>
            Approved resource -{' '}
            <Chip
              sx={{ fontWeight: 600 }}
              color='primary'
              onClick={() => console.log('cliecked')}
              label={user.qapproved}
            />
          </Typography>
          <Typography>
            Pending resource -{' '}
            <Chip
              sx={{ fontWeight: 600 }}
              color='primary'
              label={user.qpending}
            />
          </Typography>
          <Typography>
            Role -{' '}
            <Chip
              sx={{ fontWeight: 600 }}
              color='primary'
              onClick={() => console.log('cliecked')}
              label={user.role}
            />
          </Typography>
        </Box>
      </Box>

      <Dialog
        open={edit}
        onClose={() => {
          setEdit(!edit);
        }}
        aria-labelledby='alert-dialog-title'
        aria-describedby='alert-dialog-description'
      >
        <DialogTitle id='alert-dialog-title'>Edit Profile</DialogTitle>
        <DialogContent>
          <DialogContentText id='alert-dialog-description'>
            <TextField
              placeholder='Change Username'
              size='small'
              variant='standard'
              autoFocus={true}
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              focused
              sx={{ mb: 4, mt: 2 }}
            />
            <Box mt={1}>
              <LoadingButton
                onClick={async () => {
                  editProfile();
                }}
                color='primary'
                variant='contained'
                fullWidth
                loading={loading}
                disabled={loading}
                size='medium'
              >
                Edit
              </LoadingButton>
            </Box>
          </DialogContentText>
        </DialogContent>
      </Dialog>
    </Cover>
  );
}

/*


*/
