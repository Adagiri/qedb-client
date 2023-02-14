import { Box } from '@mui/system';
import axios from 'axios';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import Cover from '../../Cover';
import Navbar from '../../Navbar';
import ContentCard from './ContentCard';
import Fab from '@mui/material/Fab';
import LibraryAddIcon from '@mui/icons-material/LibraryAdd';
import DownloadForOfflineIcon from '@mui/icons-material/DownloadForOffline';

import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
import SaveQuestionsModal from './SaveQuestionsModal';
import MainLoader from '../../Loader/MainLoader';
import { useSnackbar } from 'notistack';
import Image from 'next/image';
import { useRouter } from 'next/router';
import ChangeCircleIcon from '@mui/icons-material/ChangeCircle';
import {
  Button,
  Checkbox,
  FormControl,
  Grid,
  IconButton,
  InputLabel,
  ListItemText,
  MenuItem,
  OutlinedInput,
  Select,
  TextField,
} from '@mui/material';
import {
  Dialog,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Link,
} from '@mui/material';
import ScrollToTop from 'react-scroll-to-top';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';

pdfMake.vfs = pdfFonts.pdfMake.vfs;

const optionTexts = ['a', 'b', 'c', 'd', 'e', 'f'];

const ITEM_HEIGHT = 50;
const ITEM_PADDING_TOP = 10;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 270,
    },
  },
  MenuListProps: {
    style: {
      fontSize: '12px',
    },
  },
};

const TYPES = ['Multiple choice', 'Boolean'];
const LEVELS = ['Easy', 'Medium', 'Hard'];

export default function Content(props) {
  const [user, setUser] = useState({});
  const [content, setContent] = useState([]);
  const [refresh, setRefresh] = useState(false);
  const [hasMoreData, setHasMoreResult] = useState(false);
  const [loader, setLoader] = useState(true);
  const [fetching, setFetching] = useState(false);
  const [selected, setSelected] = useState([]);
  const [addQuestionModal, setAddQuestionModal] = useState(false);
  const [start, setStart] = useState(0);
  const [end, setEnd] = useState(15);
  const [filterOpen, setFilterOpen] = useState(false);
  const [categories, setCategories] = useState([]);
  const [category, setCategory] = useState([]);
  const [type, setType] = useState([]);
  const [level, setLevel] = useState([]);
  const [search, setSearch] = useState('');
  const [query, setQuery] = useState('');

  const { enqueueSnackbar } = useSnackbar();

  const LIMIT = 10;
  const router = useRouter();

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

  selected.forEach((question, index) => {
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

  const handleCategoryChange = (event) => {
    const {
      target: { value },
    } = event;

    console.log(value);
    setCategory(
      // On autofill we get a stringified value.
      typeof value === 'string' ? value.split(',') : value
    );
  };

  const handleTypeChange = (event) => {
    const {
      target: { value },
    } = event;

    setType(
      // On autofill we get a stringified value.
      typeof value === 'string' ? value.split(',') : value
    );
  };

  const handleLevelChange = (event) => {
    const {
      target: { value },
    } = event;

    console.log(value);
    setLevel(
      // On autofill we get a stringified value.
      typeof value === 'string' ? value.split(',') : value
    );
  };

  useEffect(() => {
    const token = JSON.parse(localStorage.getItem('token'));
    const user = JSON.parse(localStorage.getItem('user'));

    if (token && user) {
      setUser(user);
    }

    getResource();
    fetchContent(0, 15);
  }, []);

  const getResource = async () => {
    const categoriesFromStorage = JSON.parse(
      localStorage.getItem('categories')
    );
    if (categoriesFromStorage) {
      setCategories(categoriesFromStorage.map((elem) => elem.name));
    }
  };

  const handleRefetchContent = () => {
    // Transform category
    let categoriesCache = JSON.parse(localStorage.getItem('categories'));
    const categoryQuery = category
      .map((catz) => categoriesCache.find((catzs) => catzs.name === catz).key)
      .join(',');

    // Transform type
    const typeQuery = type.join(',').toLowerCase().replace(' ', '_');

    // Transform level
    const levelQuery = level.join(',').toLowerCase().replace(' ', '_');

    const url = `?select=text,type,difficulty,category,options,answer,image,author,credits,explanation&status=approved${
      categoryQuery && '&category=' + categoryQuery
    }${typeQuery && '&type=' + typeQuery}${
      levelQuery && '&difficulty=' + levelQuery
    }${search && '&search=' + search}`;
    console.log(url);
    setQuery(url);

    return url;
  };

  const fetchContent = async (_start, _end, query, newQuery) => {
    try {
      setFetching(true);
      const contentData = await axios.get(
        `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/questions${
          query || window.location.search
        }&_start=${_start}&_end=${_end}&limit=${LIMIT}`
      );
      console.log(contentData);
      setContent(
        newQuery ? [...contentData.data] : [...content, ...contentData.data]
      );
      setHasMoreResult(
        contentData.headers['has-more-result'] === 'true' ? true : false
      );
            setStart(_end);
            setEnd(_end + LIMIT);
      setLoader(false);
      setFetching(false);
    } catch (error) {
      console.log(error);
      setFetching(false);
      setLoader(false);
    }
  };

  // Fetch more on scroll logic
  const fetchMore = async () => {
    if (hasMoreData && !fetching) {
      await fetchContent(start, end, query);

    }
  };

  if (loader) {
    return <MainLoader loader={loader} />;
  }

  return (
    <Box sx={{ overflowY: 'auto', height: 'max-content' }}>
      <Navbar />

      <Box width='100%' sx={{ position: 'relative' }} p={2}>
        <Fab
          color='primary'
          size='medium'
          aria-label='download'
          sx={{ position: 'fixed', bottom: '37px', left: '66.5px', zIndex: 10 }}
          onClick={() => setFilterOpen(true)}
        >
          <ChangeCircleIcon />
        </Fab>

        {content.map((cont) => (
          <ContentCard
            selected={selected}
            setSelected={setSelected}
            key={cont.id}
            content={cont}
          />
        ))}
        {fetching ? (
          <Box
            width='100%'
            textAlign='center'
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
            mb={5}
          >
            <Image
              style={{ display: 'block' }}
              src={'/loadIcon_colored.svg'}
              height='50px'
              width='50px'
            />
          </Box>
        ) : (
          <Box width='100%' textAlign={'center'}>
            {hasMoreData && (
              <Button
                onClick={fetchMore}
                mb={2}
                size='small'
                color='shader'
                variant='contained'
              >
                Fetch more
              </Button>
            )}
          </Box>
        )}
      </Box>

      {selected.length > 0 && (
        <Box
          sx={{
            '& > :not(style)': { m: 1 },
            display: 'flex',
            flexDirection: 'column',
            position: 'fixed',
            bottom: '90px',
            left: '60px',
            width: '20px',
            zIndex: '5',
            height: 'auto',
          }}
        >
          <Fab
            color='primary'
            onClick={() => {
              if (Object.keys(user).length === 0) {
                router.push('/signin');

                enqueueSnackbar('Please login to add library', {
                  variant: 'error',
                });
              } else {
                setAddQuestionModal(true);
              }
            }}
            size='medium'
            aria-label='add'
          >
            <LibraryAddIcon />
          </Fab>
          <Fab
            onClick={() => pdfMake.createPdf(docDefinition).download()}
            color='primary'
            size='medium'
            aria-label='download'
          >
            <DownloadForOfflineIcon />
          </Fab>
        </Box>
      )}

      {addQuestionModal && (
        <SaveQuestionsModal
          addQuestionModal={addQuestionModal}
          setAddQuestionModal={setAddQuestionModal}
          setSelected={setSelected}
          selected={selected}
        />
      )}

      {filterOpen && (
        <Dialog
          open={filterOpen}
          onClose={() => {
            setFilterOpen(!filterOpen);
          }}
          aria-labelledby='alert-dialog-title'
          aria-describedby='alert-dialog-description'
        >
          <DialogTitle id='alert-dialog-title'>Reset Queries</DialogTitle>
          <DialogContent>
            <DialogContentText id='alert-dialog-description'>
              <Grid
                container
                spacing={2}
                justifyContent='center'
                alignItems='center'
                mt={1}
                mb={1}
              >
                <Grid item xs='auto'>
                  {/* category */}
                  <FormControl sx={{ width: 110 }} size='small'>
                    <InputLabel
                      sx={{ fontSize: '.9rem' }}
                      id='multiple-category'
                    >
                      Category
                    </InputLabel>
                    <Select
                      sx={{ fontSize: '.7rem' }}
                      labelId='multiple-category'
                      id='multiple-category'
                      multiple
                      value={category}
                      onChange={handleCategoryChange}
                      input={<OutlinedInput label='Category' />}
                      renderValue={(selected) => selected.join(', ')}
                      autoWidth
                      MenuProps={MenuProps}
                    >
                      {categories.map((catz) => (
                        <MenuItem key={catz} value={catz}>
                          <Checkbox checked={category.indexOf(catz) > -1} />
                          <ListItemText primary={catz} />
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs='auto'>
                  {/* type */}

                  <FormControl sx={{ width: 110 }} size='small'>
                    <InputLabel
                      sx={{ fontSize: '.9rem' }}
                      id='multiple-type-label'
                    >
                      Type
                    </InputLabel>
                    <Select
                      sx={{ fontSize: '.7rem' }}
                      labelId='multiple-type-label'
                      id='multiple-type'
                      label='Type'
                      multiple
                      value={type}
                      onChange={handleTypeChange}
                      renderValue={(selected) => selected.join(', ')}
                      autoWidth
                      MenuProps={MenuProps}
                    >
                      {TYPES.map((typ) => (
                        <MenuItem key={typ} value={typ}>
                          <Checkbox checked={type.indexOf(typ) > -1} />
                          <ListItemText primary={typ} />
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs='auto'>
                  {/* level */}

                  <FormControl sx={{ width: 110 }} size='small'>
                    <InputLabel
                      sx={{ fontSize: '.9rem' }}
                      id='demo-multiple-checkbox-label'
                    >
                      Level
                    </InputLabel>
                    <Select
                      sx={{ fontSize: '.7rem' }}
                      labelId='multiple-level'
                      id='multiple-level'
                      multiple
                      value={level}
                      onChange={handleLevelChange}
                      input={<OutlinedInput label='Type' />}
                      renderValue={(selected) => selected.join(', ')}
                      autoWidth
                      MenuProps={MenuProps}
                    >
                      {LEVELS.map((lvl) => (
                        <MenuItem key={lvl} value={lvl}>
                          <Checkbox checked={level.indexOf(lvl) > -1} />
                          <ListItemText primary={lvl} />
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
              </Grid>

              <TextField
                placeholder='Search - Ridwan bin Ibrahim'
                size='small'
                variant='standard'
                autoFocus={true}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                focused
                sx={{ mb: 4, mt: 2 }}
              />
              <Box mt={2}>
                <Button
                  onClick={async () => {
                    setFilterOpen(false);
                    setRefresh(false);
                    setLoader(true);

                    await fetchContent(0, 15, handleRefetchContent(), 'new');
                  }}
                  color='primary'
                  variant='contained'
                  fullWidth
                  size='medium'
                >
                  Reset
                </Button>
              </Box>
            </DialogContentText>
          </DialogContent>
        </Dialog>
      )}
    </Box>
  );
}

/*
Strategy


*/
