import { useEffect, useState } from 'react';
import { useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import SkipPreviousIcon from '@mui/icons-material/SkipPrevious';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import SkipNextIcon from '@mui/icons-material/SkipNext';
import Checkbox from '@mui/material/Checkbox';
import Image from 'next/image';
import { makeStyles } from '@mui/styles';
import { Link as MuiLink } from '@mui/material';
import Link from 'next/link';
import PersonIcon from '@mui/icons-material/Person';
import ContentModal from './ContentModal';

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

export default function ContentCard(props) {
  const { selected, content, setSelected } = props;
  const { image, text, author, category, id } = content;

  const [question, setQuestion] = useState({});
  // console.log(content);

  const useStyles = makeStyles(styles);
  const classes = useStyles(props);

  useEffect(() => {
    // console.log('re rendered');
  }, [question]);

  const handleClick = () => {
    setQuestion(content);
  };

  const handleCheck = () => {
    if (selected.find((quest) => quest.id === id)) {
      setSelected(selected.filter((ques) => ques.id !== id));
    } else {
      setSelected([...selected, content]);
    }
  };
  /*
onchecking, remove the id from the list, oncheck, at the id again

  */

  return (
    <>
      <Card className={classes.root} variant='outlined'>
        <Box
          sx={{ display: 'flex', justifyContent: 'flex-start', width: '100%' }}
        >
          <Checkbox
            disableRipple
            disableTouchRipple
            disableFocusRipple
            onClick={handleCheck}
            size='small'
            checked={
              !!selected.find((question) => question._id === content._id)
            }
            // sx={{fle }}
            {...label}
          />
          <Box onClick={handleClick} className={classes.contentBox}>
            <CardContent sx={{ flex: '1 0 auto', width: '100%' }}>
              <Typography noWrap component='p' variant='p' width={'90%'}>
                {text}
              </Typography>

              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'flex-end',
                  mt: '10px',
                  fontSize: '12px',
                  verticalAlign: '',
                }}
              >
                <PersonIcon
                  color='primary'
                  fontSize='10px'
                  sx={{ marginBottom: '2px' }}
                />
                <Link passHref href={`/profile/${author.id}`}>
                  <MuiLink
                    sx={{ cursor: 'pointer', ml: '5px' }}
                    variant='body2'
                  >
                    <span style={{ fontSize: '12px' }}>{author?.username}</span>
                  </MuiLink>
                </Link>
              </Box>
            </CardContent>
          </Box>
        </Box>

        {image && (
          <Box className={classes.imageBox}>
            <Image
              // src={'/test.png'}
              src={image}
              alt={category[0]}
              layout='fill'
              objectFit='cover'
              objectPosition={'50% 50%'}
              // width={"80px"}
              // height={'20px'}
            />
          </Box>
        )}
      </Card>
      {<ContentModal question={question} setQuestion={setQuestion} />}
    </>
  );
}

/*
__Tasks
proper text limit in typography
resizing images
link to users profile when username is clicked
*/
