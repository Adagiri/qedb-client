import * as React from 'react';
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';
import Button from '@mui/material/Button';
import Image from 'next/image';
import { Box } from '@mui/material';

export default function SubLoader({ loader, setLoader }) {
  const handleClose = () => {
    setLoader(false);
  };
  const handleToggle = () => {
    setOpen(!open);
  };

  return (
    <div>
      <Box
        sx={{
          color: '#fff',
          zIndex: (theme) => theme.zIndex.drawer + 1,
          width: '100%',
          display: "flex",
          justifyContent: "center"
        }}
      >
        <Image
          src='/loadIcon_colored.svg'
          color='inherit'
          width={60}
          height={60}
        />
      </Box>
    </div>
  );
}
