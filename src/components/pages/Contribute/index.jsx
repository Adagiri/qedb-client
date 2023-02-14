import {
  Box,
  Button,
  ButtonGroup,
  FormControl,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
} from '@mui/material';
import axios from 'axios';
import { useEffect, useState } from 'react';
import Cover from '../../Cover';
import MainLoader from '../../Loader/MainLoader';
import { useSnackbar } from 'notistack';

import AddCircleIcon from '@mui/icons-material/AddCircle';
import RemoveCircleIcon from '@mui/icons-material/RemoveCircle';
import { confirmLogin } from '../../../utils/auth';
import { useRouter } from 'next/router';
import LoadingButton from '@mui/lab/LoadingButton';

export default function Contribute() {
  const { enqueueSnackbar } = useSnackbar();
  const router = useRouter();

  const [categories, setCategories] = useState([]);
  const [category, setCategory] = useState([]);
  const [catz, setCatz] = useState([]);
  const [type, setType] = useState('');
  const [level, setLevel] = useState('');
  const [options, setOptions] = useState(['', '']);
  const [credit, setCredit] = useState([{}]);
  const [explanation, setExplanation] = useState('');
  const [loading, setLoading] = useState(false);
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [error, setError] = useState('');
  const [additional, setAdditional] = useState({
    explanation: false,
    credit: false,
  });
  useEffect(() => {
    if (confirmLogin()) {
      fetchCategories();
    } else {
      router.push('/signin');
    }
  }, []);

  // const checkLogin = () => {
  //   confirmLogin();
  // };
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (question.length < 3) {
      setLoading(false);
      setError('question');
      enqueueSnackbar(`Question must exceed ${question.length} characters`, {
        variant: 'error',
      });

      return;
    }

    if (question.length > 150) {
      setLoading(false);
      setError('question');
      enqueueSnackbar(
        `Question must not exceed ${question.length} characters`,
        {
          variant: 'error',
        }
      );
      return;
    }

    if (explanation.length > 800) {
      setLoading(false);
      setError('explanation');
      enqueueSnackbar('Explanation must not exceed 800 characters', {
        variant: 'error',
      });
      return;
    }

    if (options.indexOf(answer) === -1) {
      setLoading(false);
      setError('answer');
      enqueueSnackbar('Please set a valid answer', {
        variant: 'error',
      });
      return;
    }

    try {
      const addQuestion = await axios({
        method: 'POST',
        url: `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/questions/public-add`,
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + JSON.parse(localStorage.getItem('token')),
        },
        data: {
          type,
          text: question,
          category,
          difficulty: level,
          options,
          answer,
          explanation: explanation ? explanation : undefined,
          status: 'pending',
          credits: credit[0].title ? credit : undefined,
        },
      });

      setLoading(false);
      setCategory([]);
      setLevel('');
      setType('');
      setOptions(['', '']);
      setCredit([{}]);
      setExplanation('');
      setAdditional('');
      setAnswer('');
      setQuestion('');
      setError('');
      setAdditional({ explanation: false, credit: false });
      enqueueSnackbar('Question submitted', {
        variant: 'success',
      });
      window.location.reload();
    } catch (error) {
      setLoading(false);
      enqueueSnackbar('Error, try again', {
        variant: 'error',
      });
    }
  };

  if (categories.length === 0) {
    return <MainLoader loader={true} />;
  }

  return (
    <Cover>
      <Box
        component='form'
        onSubmit={handleSubmit}
        sx={{
          '& .MuiTextField-root': { m: 1, width: '250px' },
          fontSize: '15px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          padding: 2,
        }}
        // noValidate
        // autoComplete='off'
      >
        {/* Type  */}
        <FormControl variant='standard' sx={{ m: 1, minWidth: '250px' }}>
          <TextField
            select
            label='Type'
            required
            variant='standard'
            labelId='contribute-question-type-label'
            id='contribute-question-type-label'
            size='small'
            fullWidth
            error={error === 'type'}
            onChange={(e) => {
              const value = e.target.value;
              if (value === 'boolean') {
                setOptions(['True', 'False']);
              }
              setType(value);
            }}
          >
            <MenuItem value='multiple_choice'>Multiple choice</MenuItem>
            <MenuItem value='boolean'>Boolean</MenuItem>
          </TextField>
        </FormControl>
        {/* Question text */}
        <TextField
          required
          id='text'
          label='Question'
          size='small'
          placeholder='Did Adagiri fight in WW2 ?'
          variant='standard'
          fullWidth
          type={'text'}
          minLength={40}
          value={question}
          error={error === 'question'}
          onChange={(e) => {
            setQuestion(e.target.value);
          }}
        />
        {/* Category  */}
        <FormControl variant='standard' sx={{ m: 1, minWidth: '250px' }}>
          <TextField
            select
            label='Category'
            required
            variant='standard'
            labelId='contribute-question-category-label'
            id='demo-simple-select-standard'
            size='small'
            fullWidth
            error={error === 'category'}
            onChange={(e) => {
              setCategory([
                catz.find((cat) => cat.name === e.target.value).key,
              ]);
            }}
          >
            {categories.map((category, index) => (
              <MenuItem key={index} value={category}>
                {category}
              </MenuItem>
            ))}
          </TextField>
        </FormControl>
        {/* Level  */}
        <FormControl variant='standard' sx={{ m: 1, minWidth: '250px' }}>
          <TextField
            select
            label='Level'
            required
            variant='standard'
            labelId='contribute-question-level-label'
            id='contribute-question-level-label'
            size='small'
            fullWidth
            error={error === 'level'}
            onChange={(e) => {
              setLevel(e.target.value);
            }}
          >
            <MenuItem value='easy'>Easy</MenuItem>
            <MenuItem value='medium'>Medium</MenuItem>
            <MenuItem value='hard'>Hard</MenuItem>
          </TextField>
        </FormControl>
        {/* Options  */}
        {type !== 'boolean' && type !== '' && (
          <>
            {' '}
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                // width: '100%',
                m: 1,
                minWidth: '250px',
              }}
            >
              <Typography>Options</Typography>
              <ButtonGroup variant='contained'>
                <IconButton
                  onClick={() => {
                    const newOptions = options;
                    newOptions.pop();
                    console.log(newOptions);
                    setOptions([...newOptions]);
                  }}
                  disabled={type === 'boolean' || options.length <= 2}
                >
                  <RemoveCircleIcon />
                </IconButton>
                <IconButton
                  onClick={() => {
                    if (options.length < 4) setOptions([...options, '']);
                  }}
                  disabled={type === 'boolean' || options.length >= 4}
                >
                  <AddCircleIcon />
                </IconButton>
              </ButtonGroup>
            </Box>
            {/* Options text */}
            {type &&
              options.map((option, index) => (
                <TextField
                  key={index}
                  required
                  id='text'
                  size='small'
                  variant='outlined'
                  value={option}
                  sx={{ width: '100px' }}
                  error={error === `option.${index}`}
                  onChange={(e) => {
                    const newOptions = [...options];
                    newOptions[index] = e.target.value;
                    setOptions(newOptions);
                  }}
                />
              ))}
          </>
        )}
        {/* Answer  */}
        {(!!options.find((option) => !!option) || type === 'boolean') && (
          <FormControl variant='standard' sx={{ m: 1, minWidth: '250px' }}>
            <TextField
              select
              label='Answer'
              required
              variant='standard'
              // labelId='contribute-question-answer-label'
              id='contribute-question-answer-label'
              size='small'
              fullWidth
              error={error === 'answer'}
              onChange={(e) => {
                setAnswer(e.target.value);
              }}
            >
              {(type === 'boolean'
                ? ['True', 'False']
                : options.filter((option) => !!option)
              ).map((option, index) => (
                <MenuItem value={option} key={index}>
                  {option}
                </MenuItem>
              ))}
            </TextField>
          </FormControl>
        )}
        {/* Show or hide explanation and credit  */}
        <ButtonGroup sx={{ mt: 2 }} size='small' variant='contained'>
          <Button
            color={!additional.explanation ? 'primary' : 'error'}
            onClick={() => {
              setExplanation('');
              setAdditional({
                ...additional,
                explanation: !additional.explanation,
              });
            }}
          >
            {!additional.explanation ? 'Add' : 'Remove'} Explanation
          </Button>
          <Button
            color={!additional.credit ? 'primary' : 'error'}
            onClick={() => {
              setExplanation('');
              setAdditional({
                ...additional,
                credit: !additional.credit,
              });
            }}
          >
            {!additional.credit ? 'Add' : 'Remove'} Attribution
          </Button>
        </ButtonGroup>
        {/* Explanation  */}
        {additional.explanation && (
          <>
            <Typography textAlign={'left'} mt={2} minWidth='250px'>
              Explanation
            </Typography>

            <TextField
              id='outlined-multiline-static'
              multiline
              rows={4}
              placeholder='It is optional to add an explanation'
              value={explanation}
              onChange={(e) => setExplanation(e.target.value)}
            />
          </>
        )}
        {/* Credits  */}
        {additional.credit && (
          <>
            <Typography textAlign={'left'} mt={2} minWidth='250px'>
              Credit
            </Typography>
            <TextField
              id='text'
              label='credit title'
              size='small'
              variant='filled'
              sx={{ width: '100px' }}
              placeholder='E.g Wikipedia'
              value={credit.title}
              required
              error={error === 'credit.title'}
              onChange={(e) => setCredit({ ...credit, title: e.target.value })}
            />
            <TextField
              id='text'
              label='credit link'
              placeholder='E.g https://wikipedia.com/abcdefghij'
              size='small'
              variant='filled'
              sx={{ width: '100px' }}
              required
              value={credit.link}
              error={error === 'credit.link'}
              onChange={(e) => setCredit({ ...credit, link: e.target.value })}
            />
          </>
        )}

        <LoadingButton
          loading={loading}
          disabled={loading}
          type='submit'
          variant='contained'
          color='primary'
          sx={{ mt: 4, width: '200px' }}
        >
          Submit
        </LoadingButton>
      </Box>
    </Cover>
  );
}
