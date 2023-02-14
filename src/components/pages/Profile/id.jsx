import { Typography, IconButton, Divider } from '@mui/material';
import { Box } from '@mui/system';
import axios from 'axios';
import { useEffect, useState } from 'react';
import Cover from '../../Cover';
import Navbar from '../../Navbar';
import ContentCard from './id';
import EditIcon from '@mui/icons-material/Edit';
import Link from 'next/link';
import Chip from '@mui/material/Chip';
import MainLoader from '../../Loader/MainLoader';

export default function Contribute() {
  const [user, setUser] = useState({});
  const [loading, setLoading] = useState(true);

  const fetchContent = async () => {
    const userId = window.location.pathname.slice(9);

    try {
      const user = await axios.get(
        `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/users/${userId}`
      );

      setUser(user.data);
      setLoading(false);
    } catch (err) {
      setLoading(false);
      console.log(err);
    }
  };

  useEffect(() => {
    fetchContent();
  }, []);

  if (loading) {
    return <MainLoader loading={true} />;
  }

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
            Username - <Chip sx={{fontWeight: 600}} color='primary' label={user.username} />{' '}
          </Typography>
          <Typography>
            Email - <Chip sx={{fontWeight: 600}} color='primary' label={user.email} />
          </Typography>
          <Typography>
            Approved resource -{' '}
            <Chip sx={{fontWeight: 600}}
              color='primary'
              onClick={() => console.log('cliecked')}
              label={user.qapproved}
            />
          </Typography>
          <Typography>
            Pending resource - <Chip sx={{fontWeight: 600}} color='primary' label={user.qpending} />
          </Typography>
          <Typography>
            Role -{' '}
            <Chip sx={{fontWeight: 600}}
              color='primary'
              onClick={() => console.log('cliecked')}
              label={user.role}
            />
          </Typography>
        </Box>
      </Box>
    </Cover>
  );
}

/*


*/
