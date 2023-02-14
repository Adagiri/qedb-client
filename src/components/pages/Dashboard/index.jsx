import {
  Typography,
  IconButton,
  Divider,
  DialogTitle,
  Dialog,
  DialogContent,
  DialogContentText,
  TextField,
  Button,
  Card,
  CardContent,
  Fab,
} from '@mui/material';
import { Box } from '@mui/system';
import axios from 'axios';
import { useEffect, useState } from 'react';
import Cover from '../../Cover';
import EditIcon from '@mui/icons-material/Edit';
import { useSnackbar } from 'notistack';
import AddIcon from '@mui/icons-material/Add';
import Chip from '@mui/material/Chip';
import LoadingButton from '@mui/lab/LoadingButton';
import Navbar from '../../Navbar';
import { makeStyles } from '@mui/styles';
import { useRouter } from 'next/router';
import DownloadForOfflineIcon from '@mui/icons-material/DownloadForOffline';
import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
import MainLoader from '../../Loader/MainLoader';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import { confirmLogin } from '../../../utils/auth';

pdfMake.vfs = pdfFonts.pdfMake.vfs;

const optionTexts = ['a', 'b', 'c', 'd', 'e', 'f'];

const label = { inputProps: { 'aria-label': 'Checkbox demo' } };

const styles = (theme) => ({
  root: {
    display: 'flex',
    marginBottom: '1rem',
    justifyContent: 'space-between',
    cursor: 'pointer',
    width: '100%',
  },

  imageBox: {
    position: 'relative',
    width: '100px',
    [theme.breakpoints.down('md')]: {
      display: 'none',
    },
  },

  contentBox: {
    display: 'flex',
    flexDirection: 'column',
    [theme.breakpoints.down('md')]: {
      width: '100%',
    },
    flex: '1 0 auto',
    flexGrow: '1',
    width: '100%',
  },
});

export default function DashboardPage(props) {
  const router = useRouter();

  const useStyles = makeStyles(styles);
  const classes = useStyles(props);
  const [libraries, setLibraries] = useState([]);
  const [loading, setLoading] = useState(true);

  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => {
    if (!confirmLogin()) {
      router.push('/signin');
    } else {
      fetchLibraries();
    }
  }, []);

  const handleDelete = async (library) => {
    const id = library.id;
    setLoading(true);
    try {
      const contentData = await axios({
        method: 'DELETE',
        url: `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/libraries/${id}`,
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + JSON.parse(localStorage.getItem('token')),
        },
      });

      console.log('deleteData', contentData);
      if (contentData?.data?.success === true) {
        const newLibraries = libraries.filter((library) => library._id !== id);

        setLibraries(newLibraries);
      }
      // setLibraries(contentData.data);
      setLoading(false);
      enqueueSnackbar(library.title + ' deleted', { variant: 'success' });
    } catch (error) {
      setLoading(false);
    }
  };

  const handleDownload = (toDownload, title) => {
    // Fetch the questions
    console.log(toDownload);
    const docDefinition = {
      pageMargins: [15, 40, 15, 40],
      content: [],
      styles: {
        text: { fontSize: 12, margin: [0, 20, 0, 10], characterSpacing: 0.08 },
        options: {
          margin: [17, 0, 0, 10],
        },
      },
    };

    toDownload.forEach((question, index) => {
      const toAdd = [];

      toAdd.push(
        // { text: `${index + 1}.  `, margin: 3 },
        { text: `${index + 1}.  ${question.text}`, style: 'text' }
        // { text: `${question.text}`, margin: 3 }
      );

      question.options.forEach((opt, index) => {
        toAdd.push({
          text: `   ${optionTexts[index]}. ${opt}`,
          style: 'options',
        });
      });

      docDefinition.content.push(...toAdd);
    });
    pdfMake.createPdf(docDefinition).download(title + '.pdf');
    window.location.reload();
  };

  const CONTENT_PAGE_URL =
    '/content?select=text,type,difficulty,category,options,answer,image,author,credits,explanation&status=approved';

  const fetchLibraries = async () => {
    try {
      const contentData = await axios({
        method: 'GET',
        url: `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/libraries/user-libraries`,
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + JSON.parse(localStorage.getItem('token')),
        },
      });

      console.log('contentData', contentData);
      setLibraries(contentData.data);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      const errorMessage =
        error.response?.data?.error || 'Something went wrong';

      enqueueSnackbar(errorMessage, { variant: 'error' });

      enqueueSnackbar('Failed', { variant: 'error' });
    }
  };

  // if (loading) {
  //   return <MainLoader loader={true} />;
  // }

  return (
    <Box>
      <Navbar />
      <Box
        sx={{
          height: '100%',
          width: '100%',
          padding: 2,
        }}
      >
        <Typography
          fontWeight={600}
          sx={{ width: '100%', textAlign: 'left' }}
          mb={1.5}
        >
          Libraries
          <IconButton
            sx={{ color: '#fff', mb: 0.3, ml: 1, background: '#449788' }}
            size='medium'
          >
            <AddIcon
              fontSize='10px'
              onClick={() => router.push(CONTENT_PAGE_URL)}
            />
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
            mt: 4,
          }}
        >
          {libraries.length > 0 ? (
            libraries.map((library) => {
              return (
                <Card
                  variant='outlined'
                  key={library._id}
                  className={classes.root}
                >
                  <Box
                    sx={{
                      display: 'flex',
                      justifyContent: 'flex-start',
                      width: '100%',
                    }}
                  >
                    <Box
                      onClick={() => console.log('clicked library')}
                      className={classes.contentBox}
                    >
                      <CardContent sx={{ width: '100%', display: 'flex' }}>
                        <Typography
                          noWrap
                          component='p'
                          variant='p'
                          width={'90%'}
                          fontWeight={600}
                        >
                          <Chip color='primary' label={library.title} />
                        </Typography>
                        <Box sx={{ display: 'flex' }}>
                          <Fab
                            onClick={() => handleDelete(library)}
                            color='error'
                            size='small'
                            sx={{ zIndex: 50, marginRight: '10px' }}
                          >
                            <DeleteOutlineIcon />
                          </Fab>{' '}
                          <Fab
                            onClick={() =>
                              handleDownload(library.questions, library.title)
                            }
                            color='primary'
                            size='small'
                            sx={{ zIndex: 50 }}
                          >
                            <DownloadForOfflineIcon />
                          </Fab>
                        </Box>
                      </CardContent>
                    </Box>
                  </Box>
                </Card>
              );
            })
          ) : (
            <Typography mt={4}>No Libraries Yet</Typography>
          )}
        </Box>
      </Box>
    </Box>
  );
}

/*


*/
