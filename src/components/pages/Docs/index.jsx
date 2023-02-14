import {
  Box,
  Button,
  Checkbox,
  FormControl,
  InputLabel,
  ListItemText,
  MenuItem,
  OutlinedInput,
  Select,
  TextField,
  Typography,
} from '@mui/material';
import { useState, useEffect } from 'react';
import Cover from '../../Cover';
import Navbar from '../../Navbar';
import { useSnackbar } from 'notistack';

const ITEM_HEIGHT = 50;
const ITEM_PADDING_TOP = 10;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 10.5 + ITEM_PADDING_TOP,
      // width: 270,
    },
  },
  MenuListProps: {
    style: {
      fontSize: '12px',
    },
  },
};

export default function DocsPage(props) {
  const { enqueueSnackbar } = useSnackbar();

  const [categories, setCategories] = useState([]);
  const [category, setCategory] = useState([]);
  const [catz, setCatz] = useState([]);
  const [type, setType] = useState('');
  const [difficulty, setDifficulty] = useState('');
  const [amount, setAmount] = useState(50);
  const [documentation, setDocumentation] = useState(false);

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleCategoryChange = (event) => {
    const {
      target: { value },
    } = event;

    setCategory(
      // On autofill we get a stringified value.
      typeof value === 'string' ? value.split(',') : value
    );
    console.log(category);
  };

  const fetchCategories = async () => {
    const categoriesFromStorage = JSON.parse(
      localStorage.getItem('categories')
    );
    if (categoriesFromStorage) {
      setCatz(categoriesFromStorage);
      setCategories(categoriesFromStorage.map((elem) => elem.name));
      return;
    }

    const categories = await axios.get(
      `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/categories`
    );

    if (categories.data) {
      localStorage.setItem('categories', JSON.stringify(categories.data));
      setCatz(categories.data);

      setCategories(categories.data.map((catz) => catz.name));
    }
  };

  const handleGenerateLink = () => {
    // let link = 'http://localhost:9000/api/v1/questions/public?';
    let link = 'https://server.qedb.net/api/v1/questions/public?';
    amount && (link += 'amount=' + amount + '&');
    category.length > 0 &&
      (link +=
        'category=' +
        category
          .map((cat) => catz.find((catee) => catee.name === cat).key)
          .join(',') +
        '&');
    type && (link += 'type=' + type + '&');
    difficulty && (link += 'difficulty=' + difficulty + '&');

    navigator.clipboard.writeText(link);

    enqueueSnackbar('Link generated and copied', {
      variant: 'success',
      anchorOrigin: {
        vertical: 'top',
        horizontal: 'center',
      },
    });
  };

  return (
    <Cover>
      <Box
        sx={{
          height: '100%',
          width: '100%',
          padding: 4,
          px: 5,
        }}
      >
        <Typography component='h3' variant='p' fontWeight={600} mb={2}>
          Qedb API
        </Typography>
        <Typography fontSize={15} mb={2}>
          The{' '}
          <Typography component='span' fontWeight={600} mb={2}>
            Question Database
          </Typography>{' '}
          API consists of educational questions which are completely free for
          use. The Apis returns data in form of JSON and it requires no api key.
          Just generate the url below and hit it.
        </Typography>

        {/* <Typography fontSize={13} mb={3}>
          All data provided by the API is available under the Creative Commons
          Attribution-ShareAlike 4.0 International License.
        </Typography> */}

        <Button
          variant='contained'
          color='primary'
          sx={{ fontWeight: 600, px: 5, py: 1.5, mb: 3 }}
          onClick={() => setDocumentation(!documentation)}
        >
          {'API ' + 'Documentation'}
        </Button>

        {documentation && (
          <>
            <Typography component='h4' variant='p' fontWeight={600} my={2}>
              Session Tokens
            </Typography>
            <Typography fontSize={15} mb={2}>
              Session Tokens allows you to fetch questions from our database
              without any question been returned more than once. In other words,
              they make sure that there is no duplication of questions for all
              api calls made with it. It should be noted that after a number of
              api calls using the session token, the questions matching your
              query will eventually be exhausted and will return no questions.
              There is a response code that indicates this.
            </Typography>
            <Typography fontSize={13} fontWeight={600} mb={2}>
              Session tokens will be deleted after 24 hours of inactivity.
            </Typography>

            <Box>
              <Typography
                color='primary'
                fontSize={14}
                fontWeight={600}
                mb={0.5}
              >
                Use a session token
              </Typography>
              <TextField
                // disabled
                size='medium'
                value={
                  'https://server.qedb.net/api/v1/questions/public?amount=10&token=YOUR_TOKEN'
                }
                fullWidth
                sx={{ mb: 2 }}
              />
              <Typography
                color='primary'
                fontSize={14}
                fontWeight={600}
                mb={0.5}
              >
                Create a session token
              </Typography>
              <TextField
                // disabled
                size='medium'
                value={'https://server.qedb.net/api/v1/tokens/public?action=create'}
                fullWidth
                sx={{ mb: 2 }}
              />
              <Typography
                color='primary'
                fontSize={14}
                fontWeight={600}
                mb={0.5}
              >
                Reset a session token
              </Typography>
              <TextField
                // disabled
                size='medium'
                value={
                  'https://server.qedb.net/api/v1/tokens/public?action=reset&token=YOUR_TOKEN'
                }
                fullWidth
                sx={{ mb: 2 }}
              />
              <Typography component='h4' variant='p' fontWeight={600} my={2}>
                Responses
              </Typography>
              <Typography fontSize={15} mb={2}>
                Responses (response_code) helps you understand the situation
                after each call to the API.
              </Typography>
              <Typography component='li' fontSize={15} ml={2} mb={1}>
                <Typography
                  component='span'
                  fontSize={14}
                  fontWeight={600}
                  mb={2}
                >
                  1
                </Typography>{' '}
                Indicates a successful response
              </Typography>
              <Typography component='li' fontSize={15} ml={2} mb={1}>
                <Typography
                  component='span'
                  fontSize={14}
                  fontWeight={600}
                  mb={2}
                >
                  2
                </Typography>{' '}
                Indicates an invalid parameter passed in as a query. Example,
                type=bouulean or amount=TEN or level=hardd
              </Typography>
              <Typography component='li' fontSize={15} ml={2} mb={1}>
                <Typography
                  component='span'
                  fontSize={14}
                  fontWeight={600}
                  mb={2}
                >
                  3
                </Typography>{' '}
                Indicates that the token passed was not found. Either it has
                been deleted or does not exist
              </Typography>
              <Typography component='li' fontSize={15} ml={2} mb={1}>
                <Typography
                  component='span'
                  fontSize={14}
                  fontWeight={600}
                  mb={2}
                >
                  0
                </Typography>{' '}
                Indicates that there are no more results matching a query for a
                certain token in use.
              </Typography>

              <Typography component='h4' variant='p' fontWeight={600} my={2}>
                Helpers
              </Typography>
              <Typography
                color='primary'
                fontSize={14}
                fontWeight={600}
                mb={0.5}
              >
                Category lookup - Returns a list of all categories in the
                database, including their keys
              </Typography>
              <TextField
                // disabled
                size='medium'
                value={'https://server.qedb.net/api/v1/categories/public'}
                fullWidth
                sx={{ mb: 2 }}
              />
              <Typography
                color='primary'
                fontSize={14}
                fontWeight={600}
                mb={0.5}
              >
                Category count - Get the number of questions a category has
              </Typography>
              <TextField
                // disabled
                size='medium'
                value={
                  'https://server.qedb.net/api/v1/categories/public/CATEGORY_KEY'
                }
                fullWidth
                sx={{ mb: 7 }}
              />
            </Box>
          </>
        )}

        <Typography mb={3} fontWeight={600}>
          API Helper
        </Typography>

        <TextField
          select
          label='Number of Questions'
          variant='outlined'
          labelId='contribute-question-type-label'
          id='contribute-question-type-label'
          size='medium'
          fullWidth
          sx={{ mb: 1 }}
          onChange={(e) => setAmount(e.target.value)}
        >
          <MenuItem value='5'>5</MenuItem>
          <MenuItem value='10'>10</MenuItem>
          <MenuItem value='20'>20</MenuItem>
          <MenuItem value='30'>30</MenuItem>
          <MenuItem value='40'>40</MenuItem>
          <MenuItem value='50'>50</MenuItem>
          <MenuItem value='60'>60</MenuItem>
          <MenuItem value='100'>100</MenuItem>
        </TextField>

        <FormControl sx={{ width: '100%', mb: 2 }}>
          <InputLabel sx={{ fontSize: '.9rem' }} id='multiple-category'>
            Category
          </InputLabel>
          <Select
            sx={{ fontSize: '.7rem' }}
            variant='filled'
            labelId='multiple-category'
            id='multiple-category'
            multiple
            value={category}
            onChange={handleCategoryChange}
            input={<OutlinedInput label='Category' />}
            renderValue={(selected) => selected.join(', ')}
            fullWidth
            MenuProps={MenuProps}
            size='medium'
          >
            {categories.map((catz) => (
              <MenuItem key={catz} value={catz}>
                <Checkbox checked={category.indexOf(catz) > -1} />
                <ListItemText primary={catz} />
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <TextField
          select
          label='Type'
          variant='outlined'
          labelId='contribute-question-type-label'
          id='contribute-question-type-label'
          size='medium'
          onChange={(e) => setType(e.target.value)}
          fullWidth
          sx={{ mb: 1 }}
        >
          <MenuItem value='multiple_choice'>Multiple choice</MenuItem>
          <MenuItem value='boolean'>Boolean</MenuItem>
          <MenuItem value=''>Any</MenuItem>
        </TextField>

        <TextField
          select
          label='Difficulty'
          variant='outlined'
          labelId='contribute-question-type-label'
          id='contribute-question-type-label'
          size='medium'
          onChange={(e) => setDifficulty(e.target.value)}
          fullWidth
          sx={{ mb: 1 }}
        >
          <MenuItem value='easy'>Easy</MenuItem>
          <MenuItem value='medium'>Medium</MenuItem>
          <MenuItem value='hard'>Hard</MenuItem>
          <MenuItem value=''>Any</MenuItem>
        </TextField>

        <Button
          variant='contained'
          color='primary'
          sx={{ fontWeight: 600, px: 5, py: 1.5, my: 5, mt: 3 }}
          fullWidth
          onClick={() => handleGenerateLink()}
        >
          Generate & Copy Link
        </Button>
      </Box>
    </Cover>
  );
}

/*


*/
