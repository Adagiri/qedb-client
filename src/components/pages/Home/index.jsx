import { useState, useEffect } from 'react';

import axios from 'axios';
import { useRouter } from 'next/router';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import Checkbox from '@mui/material/Checkbox';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import ListItemText from '@mui/material/ListItemText';
import OutlinedInput from '@mui/material/OutlinedInput';
import { Box, Button, Chip, Grid, Paper, TextField, Typography } from '@mui/material';

import Cover from '../../Cover';

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

export default function HomeComponent() {
  const router = useRouter();
  const [categories, setCategories] = useState([]);
  const [category, setCategory] = useState([]);
  const [type, setType] = useState([]);
  const [level, setLevel] = useState([]);
  const [questionStats, setQuestionStats] = useState({});
  const [search, setSearch] = useState('');

  useEffect(() => {
    // Get Total number of questions
    getResources();
  }, []);

  const handleSearch = () => {
    // Transform category
    let categoriesCache = JSON.parse(localStorage.getItem('categories'));
    const categoryQuery = category
      .map((catz) => categoriesCache.find((catzs) => catzs.name === catz).key)
      .join(',');

    // Transform type
    const typeQuery = type.join(',').toLowerCase().replace(' ', '_');

    // Transform level
    const levelQuery = level.join(',').toLowerCase().replace(' ', '_');

    const url = `/content?select=text,type,difficulty,category,options,answer,image,author,credits,explanation&status=approved${
      categoryQuery && '&category=' + categoryQuery
    }${typeQuery && '&type=' + typeQuery}${
      levelQuery && '&difficulty=' + levelQuery
    }${search && '&search=' + search}`;

    router.push(url);
  };

  const getResources = async () => {
    const categoriesFromStorage = JSON.parse(
      localStorage.getItem('categories')
    );

    const questionStatsFromStorage = JSON.parse(
      localStorage.getItem('question-stats')
    );
    if (categoriesFromStorage) {
      setCategories(categoriesFromStorage.map((elem) => elem.name));
    }

    if (questionStatsFromStorage) {
      setQuestionStats(questionStatsFromStorage);
    }

    const stats = await axios.get(
      `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/questions/question-stats`
    );

    if (stats.data) {
      localStorage.setItem('question-stats', JSON.stringify(stats.data));
      setQuestionStats(stats.data);
    }

    const categories = await axios.get(
      `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/categories`
    );
    if (categories.data) {
      localStorage.setItem('categories', JSON.stringify(categories.data));
      setCategories(categories.data.map((catz) => catz.name));
    }
  };

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
  return (
    <Cover>
      <Box
        sx={{
          px: { md: '3rem' },
          py: { md: '1.5rem' },
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          height: '100%',
        }}
      >
        <Box
          sx={{
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            minHeight: '100%',
            position: 'relative',
          }}
        >
          <Box
            sx={{
              position: 'absolute',
              width: '100%',
              height: '100%',
              textAlign: 'center',
              borderRadius: { md: '10px' },
              color: '#fff',
              padding: '1rem',
              display: 'flex',
              alignItems: 'center',
            }}
          >
            <Box width='100%'>
              <Box>
                <Typography
                  variant='h4'
                  component='h1'
                  color='primary'
                  mb={1}
                  fontWeight={600}
                >
                  <Typography
                    variant='p'
                    color='primary.dark'
                    component='span'
                    fontSize='18px'
                  >
                    Welcome to{' '}
                  </Typography>
                  QEDB
                </Typography>
                <Typography
                  variant='p'
                  fontSize={'15px'}
                  mb={4}
                  fontWeight={600}
                  color='error.dark'
                  component='P'
                >
                  <Chip color='primary' label={questionStats.approved || 0} />{' '}
                  <Typography variant='p' component='span' color='primary'>
                    approved resources
                  </Typography>{' '}
                  {/* {questionStats.pending || 0}{' '}
                  <Typography variant='p' component='span' color='primary'>
                    pending
                  </Typography>{' '} */}
                </Typography>

                <Typography
                  variant='p'
                  color='primary.dark'
                  component='P'
                  mb={4}
                  fontWeight={600}
                  fontSize='18px'
                >
                  <Typography
                    variant='h5'
                    color='primary'
                    component='span'
                    fontWeight={600}
                  >
                    Fetch{' '}
                  </Typography>
                  enough resources for your project
                </Typography>
              </Box>

              <Box mb={1}>
                <Typography
                  variant='P'
                  component='p'
                  fontWeight={600}
                  color='error'
                  mb={3}
                >
                  Select the resource specification you want using the filter
                  below
                </Typography>
                <Typography
                  variant='p'
                  color='primary'
                  component='h2'
                  mb={1}
                  fontWeight={600}
                >
                  Search By Filter
                </Typography>

                <Grid
                  container
                  spacing={2}
                  justifyContent='center'
                  alignItems='center'
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
                <Button
                  variant='contained'
                  size='medium'
                  sx={{ width: '70%' }}
                  onClick={handleSearch}
                >
                  Search
                </Button>
              </Box>
            </Box>
          </Box>
        </Box>
      </Box>
    </Cover>
  );
}
