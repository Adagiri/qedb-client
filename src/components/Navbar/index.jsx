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
import { Alert, Link as MuiLink } from '@mui/material';
import { Zoom } from '@mui/material';
import Link from 'next/link';
import Image from 'next/image';
import LoginIcon from '@mui/icons-material/Login';

import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import Divider from '@mui/material/Divider';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import InboxIcon from '@mui/icons-material/MoveToInbox';
import MailIcon from '@mui/icons-material/Mail';
import DeveloperModeIcon from '@mui/icons-material/DeveloperMode';
import ShareIcon from '@mui/icons-material/Share';
import GamesIcon from '@mui/icons-material/Games';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import DashboardIcon from '@mui/icons-material/Dashboard';
import LogoutIcon from '@mui/icons-material/Logout';

const pages = ['api', 'contribute', 'dashboard'];
const pagesIcon = [
  <DeveloperModeIcon key='1' />,
  <ShareIcon key='2' />,
  <GamesIcon key='3' />,
];
const settings = ['profile', 'logout'];
const settingsIcon = [
  <AccountCircleIcon key='1' />,
  <DashboardIcon key='2' />,
  <LogoutIcon key='3' />,
];

const Navbar = () => {
  const [currentPath, setCurrentPath] = React.useState('');
  const [user, setUser] = React.useState({});
  const [anchorElNav, setAnchorElNav] = React.useState(null);
  const [anchorElUser, setAnchorElUser] = React.useState(null);

  const [navDrawer, setNavDrawer] = React.useState(false);

  const toggleDrawer = (status) => (event) => {
    if (
      event.type === 'keydown' &&
      (event.key === 'Tab' || event.key === 'Shift')
    ) {
      return;
    }

    setNavDrawer(status);
  };

  React.useEffect(() => {
    const path = window.location.pathname.slice(1);
    const userObj = JSON.parse(localStorage.getItem('user'));
    const token = JSON.parse(localStorage.getItem('token'));
    if (userObj && token) {
      setUser(userObj);
    }
    setCurrentPath(path);
  }, []);

  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handleCloseUserMenu = (event) => {
    setAnchorElUser(null);
  };

  return (
    <AppBar position='static' color='primary'>
      <Container maxWidth='xl'>
        <Toolbar disableGutters>
          <Box
            noWrap
            component='div'
            sx={{ ml: 2, display: { xs: 'none', md: 'flex' } }}
          >
            <Link passHref href='/'>
              <Typography
                component='a'
                sx={{
                  color: 'white',
                  textDecoration: 'none',
                  fontWeight: '600',
                }}
              >
                Qedb
              </Typography>
            </Link>
          </Box>

          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              width: '100%',
              alignItems: 'center',
            }}
          >
            <Box sx={{ display: { xs: 'flex', md: 'none' } }}>
              <IconButton
                size='large'
                onClick={toggleDrawer(true)}
                color='inherit'
              >
                <MenuIcon />
              </IconButton>
              <NavDrawer
                toggleDrawer={toggleDrawer}
                setNavDrawer={setNavDrawer}
                navDrawer={navDrawer}
                user={user}
                setUser={setUser}
              />
            </Box>
            <Box
              noWrap
              component='div'
              sx={{ ml: 2, display: { xs: 'flex', md: 'none' } }}
            >
              <Link passHref href='/'>
                <Typography
                  component='a'
                  sx={{
                    color: 'white',
                    textDecoration: 'none',
                    fontWeight: '600',
                  }}
                >
                  Qedb
                </Typography>
              </Link>
            </Box>
            <Box
              sx={{
                flexGrow: 1,
                display: { xs: 'none', md: 'flex' },
                justifyContent: 'flex-end',
                marginRight: '1rem',
              }}
            >
              {pages.map((page) => (
                <Button
                  key={page}
                  onClick={handleCloseNavMenu}
                  sx={{
                    my: 2,
                    mx: 0,
                    px: 1.2,
                    color: 'white',
                    border:
                      currentPath === page.toLowerCase()
                        ? '1.7px solid #fff'
                        : '',
                    '&:hover': {
                      border:
                        currentPath === page.toLowerCase()
                          ? '1.7px solid #fff'
                          : '',
                    },
                    borderRadius: '50px',
                    textTransform: 'capitalize',
                  }}
                  variant='outlined'
                >
                  <Link
                    passHref
                    href={
                      page === 'home'
                        ? '/'
                        : page === 'api'
                        ? '/docs'
                        : `/${page.toLowerCase()}`
                    }
                  >
                    <MuiLink
                      sx={{
                        cursor: 'pointer',
                        textDecorationLine: 'none',
                        color: '#fff',
                        fontSize: '.75rem',
                        fontWeight: '500',
                      }}
                      variant='body2'
                    >
                      {page === 'api' ? page.toUpperCase() : page}
                    </MuiLink>
                  </Link>
                </Button>
              ))}
            </Box>
            <Box sx={{ flexGrow: 0 }}>
              {/* Check if user is logged in. If not render login icon */}
              {Object.keys(user).length ? (
                <>
                  {' '}
                  <Tooltip title='Open settings'>
                    <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                      <Avatar
                        sx={{
                          m: 1,
                          bgcolor: 'secondary.main',
                          color: 'primary.main',
                          width: 24,
                          height: 24,
                          fontSize: '.8rem',
                          fontWeight: '600',
                        }}
                        alt={user.username}
                      >
                        {user.username[0]}
                      </Avatar>
                    </IconButton>
                  </Tooltip>
                  <Menu
                    sx={{ mt: '45px' }}
                    id='menu-appbar'
                    anchorEl={anchorElUser}
                    anchorOrigin={{
                      vertical: 'top',
                      horizontal: 'right',
                    }}
                    keepMounted
                    transformOrigin={{
                      vertical: 'top',
                      horizontal: 'right',
                    }}
                    open={Boolean(anchorElUser)}
                    onClose={handleCloseUserMenu}
                  >
                    {settings.map((setting) => (
                      <Link
                        key={setting}
                        href={setting === 'logout' ? '#' : `/${setting}`}
                      >
                        <MenuItem
                          onClick={() => {
                            if (setting === 'logout') {
                              localStorage.removeItem('user');
                              localStorage.removeItem('token');
                              setUser({});
                            }
                            handleCloseUserMenu();
                          }}
                        >
                          <Typography textAlign='center'>{setting}</Typography>
                        </MenuItem>
                      </Link>
                    ))}
                  </Menu>{' '}
                </>
              ) : (
                <IconButton size='small' color='primary' sx={{ p: 0 }}>
                  <Link href='/signin'>
                    <Avatar
                      sx={{
                        m: 1,
                        bgcolor: 'secondary.main',
                        color: 'primary.main',
                        width: 24,
                        height: 24,
                      }}
                    />
                  </Link>
                </IconButton>
              )}
            </Box>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
};

function NavDrawer({ navDrawer, setNavDrawer, toggleDrawer, user, setUser }) {
  const list = (anchor) => (
    <Box
      sx={{ width: 250 }}
      role='presentation'
      onClick={toggleDrawer(false)}
      onKeyDown={toggleDrawer(false)}
    >
      <List>
        {pages.map((text, index) => (
          <Link
            key={text}
            passHref
            href={
              text === 'home'
                ? '/'
                : text === 'api'
                ? 'docs'
                : `/${text.toLowerCase()}`
            }
          >
            <a style={{ textDecoration: 'none', color: 'inherit' }}>
              <ListItem button key={text}>
                <ListItemIcon>{pagesIcon[index]}</ListItemIcon>
                <ListItemText
                  primary={text === 'api' ? text.toUpperCase() : text}
                />
              </ListItem>
            </a>
          </Link>
        ))}
      </List>
      <Divider />
      <List>
        {Object.keys(user).length === 0 ? (
          <Link passHref href='/signin'>
            <a style={{ textDecoration: 'none', color: 'inherit' }}>
              <ListItem button>
                <ListItemIcon>
                  <LoginIcon />
                </ListItemIcon>
                <ListItemText primary={'Login'} />
              </ListItem>
            </a>
          </Link>
        ) : (
          settings.map((text, index) => (
            <Link
              key={text}
              passHref
              href={text === 'logout' ? '/' : `/${text.toLowerCase()}`}
            >
              <a
                style={{ textDecoration: 'none', color: 'inherit' }}
                onClick={() => {
                  if (text === 'logout') {
                    localStorage.removeItem('user');
                    localStorage.removeItem('token');
                    setUser({});
                  }
                }}
              >
                <ListItem button key={text}>
                  <ListItemIcon>{settingsIcon[index]}</ListItemIcon>
                  <ListItemText primary={text} />
                </ListItem>
              </a>
            </Link>
          ))
        )}
      </List>
    </Box>
  );

  return (
    <div>
      <Drawer anchor='left' open={navDrawer} onClose={toggleDrawer(false)}>
        {list('left')}
      </Drawer>
    </div>
  );
}

export default Navbar;
