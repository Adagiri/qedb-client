import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Menu from '@mui/material/Menu';
import MenuIcon from '@mui/icons-material/Menu';
import Container from '@mui/material/Container';
import useScrollTrigger from '@mui/material/useScrollTrigger';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import MenuItem from '@mui/material/MenuItem';
import { Link as MuiLink, Paper } from '@mui/material';
import { Zoom } from '@mui/material';
import Link from 'next/link';
import Navbar from '../Navbar';

const Cover = ({ children }) => {
  return (
    <Box
      // px="9rem"
      // py="1rem"
      sx={{
        backgroundColor: '#fff',
        display: 'flex',
        justifyContent: 'center',
        height: '100vh',
        overflow: 'hidden',
        width: '100vw',
      }}
    >
      <Box
        height='100vh'
        sx={{
          backgroundImage: `url(${'https://qedb.s3.amazonaws.com/qedb_banner.jpg'})`,
          backgroundSize: 'cover',
          height: '100vh',
          minWidth: '50vw',
          width: '50vw',
          display: { xs: 'none', md: 'flex' },
        }}
      ></Box>
      <Box
        sx={{
          position: 'relative',
          display: 'flex',
          flexDirection: 'column',
          flexGrow: 1,
          height: "100vh",
          minWidth: '50%',
        }}
      >
        <Navbar />
        <Box sx={{overflow: 'auto', flexGrow: 1 }}>{children}</Box>
      </Box>
    </Box>
  );
};
export default Cover;
