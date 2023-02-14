import React, { useEffect, useState } from 'react';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import Divider from '@mui/material/Divider';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import Button from '@mui/material/Button';
import axios from 'axios';
import IconButton from '@mui/material/IconButton';
import LibraryAddIcon from '@mui/icons-material/LibraryAdd';
import CloseIcon from '@mui/icons-material/Close';
import TextField from '@mui/material/TextField';
import LoadingButton from '@mui/lab/LoadingButton';
import SaveIcon from '@mui/icons-material/Save';
import { Stack, Typography } from '@mui/material';
import SubLoader from '../../Loader/SubLoader';
import { useSnackbar } from 'notistack';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  pt: 2,
  px: 4,
  pb: 3,
};

const stylet = {
  width: '100%',
  maxWidth: 360,
  bgcolor: 'primary',
};

function AddLibraryModal(props) {
  const { selected, setAddQuestionModal, setSelected } = props;
  const [open, setOpen] = useState(false);
  const [addLibraryLoading, setAddLibraryLoading] = useState(false);
  const [libraryName, setLibraryName] = useState('');

  const { enqueueSnackbar } = useSnackbar();


  const handleAddLibrary = async (e) => {
    e.preventDefault();
    setAddLibraryLoading(true);
    try {
      const addLibraryResponse = await axios({
        method: 'POST',
        url: `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/libraries`,
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + JSON.parse(localStorage.getItem('token')),
        },
        data: {
          title: libraryName,
          questions: selected.map((question) => question._id),
        },
      });

      setAddLibraryLoading(false);
      setAddQuestionModal(false);
      setOpen(false);
      setSelected([]);

    } catch (error) {
      setAddLibraryLoading(false);
      enqueueSnackbar('Failed', { variant: 'error' });


      console.log(error);
    }
  };

  const handleOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };

  return (
    <React.Fragment>
      <Button
        onClick={handleOpen}
        variant='contained'
        size='small'
        endIcon={<LibraryAddIcon />}
      >
        Create New Library
      </Button>
      <Modal
        hideBackdrop
        open={open}
        onClose={handleClose}
        aria-labelledby='child-modal-title'
        aria-describedby='child-modal-description'
      >
        <Box sx={{ ...style, width: 250, padding: '30px' }}>
          <Box
            component='form'
            sx={{
              '& > :not(style)': { m: 1, width: '150px' },
            }}
            noValidate={false}
            autoComplete='off'
            onSubmit={handleAddLibrary}
          >
            <TextField
              id='standard-basic'
              label='Name'
              variant='standard'
              value={libraryName}
              required={true}
              helperText='Enter library name'
              onChange={(e) => setLibraryName(e.target.value)}
            />

            <LoadingButton
              loading={addLibraryLoading}
              loadingPosition='start'
              startIcon={<SaveIcon />}
              variant='contained'
              size='small'
              type='submit'
            >
              Save
            </LoadingButton>
          </Box>

          <IconButton
            sx={{ position: 'absolute', top: '5px', right: '5px' }}
            onClick={handleClose}
            aria-label='delete'
            type='submit'
          >
            <CloseIcon />
          </IconButton>
        </Box>
      </Modal>
    </React.Fragment>
  );
}

export default function SaveQuestionsModal(props) {
  const { setAddQuestionModal, addQuestionModal, selected , setSelected} = props;

  const [content, setContent] = useState([]);
  const [loading, setLoading] = useState(true);
  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => {
    fetchContent();
  }, []);

  // console.log('selected', selected);

  const fetchContent = async () => {
    // console.log('query', query);



    try {
      const contentData = await axios({
        method: 'GET',
        url: `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/libraries/user-libraries`,
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + JSON.parse(localStorage.getItem('token')),
        },
      });

      console.log('contentData',contentData);
      setContent(contentData.data);
      setLoading(false);
    } catch (error) {
      setLoading(false);
       const errorMessage =  error.response?.data?.error || 'Something went wrong';

         enqueueSnackbar(errorMessage, { variant: 'error' });

      enqueueSnackbar('Failed', { variant: 'error' });

    }
  };

  const [open, setOpen] = useState(false);
  const handleOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setAddQuestionModal(false);
  };

  const handleLibraryEdit = async (library) => {
    console.log('library', library);

    setLoading(true);
    const newQuestions = selected
      .filter((question) => library.questions.indexOf(question._id) === -1)
      .map((question) => question._id);

    console.log(newQuestions);

    try {
      const editLibraryResponse = await axios({
        method: 'PUT',
        url: `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/libraries/${library._id}`,
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + JSON.parse(localStorage.getItem('token')),
        },
        data: {
          questions: [...library.questions, ...newQuestions],
        },
      });

      setLoading(false);

      setAddQuestionModal(false);
      setSelected([])

      console.log(editLibraryResponse);
    } catch (error) {
      setLoading(false);
      console.log(error);
    }
  };

  return (
    <div>
      <Modal
        open={addQuestionModal}
        onClose={handleClose}
        aria-labelledby='parent-modal-title'
        aria-describedby='parent-modal-description'
      >
        <Box sx={{ ...style, width: 400 }}>
          <Typography component='h4' mb={3} variant='p'>
            Save {selected.length}{' '}
            {selected.length > 1 ? 'questions' : 'question'} to library
          </Typography>
          <Box mb={2}>
            <AddLibraryModal
              setAddQuestionModal={setAddQuestionModal}
              selected={selected}
              setSelected={setSelected}
            />
          </Box>

          <Divider />

          {loading ? (
            <SubLoader />
          ) : (
            <Stack mt={1}>
              <p id='parent-modal-description'>
                Or select a recent library below
              </p>
              <List sx={stylet} component='nav' aria-label='mailbox folders'>
                {content.map((library) => (
                  <>
                    <ListItem onClick={() => handleLibraryEdit(library)} button>
                      <ListItemText primary={library.title} />
                    </ListItem>
                    <Divider />
                  </>
                ))}
              </List>
            </Stack>
          )}
        </Box>
      </Modal>
    </div>
  );
}
