import { useEffect, useState } from 'react';
import Backdrop from '@mui/material/Backdrop';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import Fade from '@mui/material/Fade';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import {
  ButtonGroup,
  Dialog,
  DialogContent,
  DialogContentText,
  DialogTitle,
  IconButton,
  Link,
} from '@mui/material';
import Image from 'next/image';
import { useSnackbar } from 'notistack';
import CancelIcon from '@mui/icons-material/Cancel';
import parse from 'html-react-parser';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  // boxShadow: 24,
  p: 4,
  height: '100vh',
  display: 'flex',
  alignItems: 'center',
  justifyContent: "center",
  position: 'relative',
  // px: 2
};

const anchorOrigin = {
  vertical: 'top',
  horizontal: 'center',
};

export default function ContentModal(props) {
  const { question, setQuestion } = props;
  const [showExp, setShowExp] = useState(false);
  const { enqueueSnackbar } = useSnackbar();

  const open = Object.keys(question).length > 0 ? true : false;

  const handleClose = () => setQuestion({});

  return (
    <div>
      <Modal
        aria-labelledby='transition-modal-title'
        aria-describedby='transition-modal-description'
        open={open}
        onClose={handleClose}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
        }}
        onBackdropClick={handleClose}
        sx={{ zIndex: 10 }}
        disableScrollLock={true}
      >
        <Fade in={open}>
          <Box sx={style}>
            <IconButton
              sx={{ position: 'absolute', top: '20px', right: '30px' }}
              onClick={() => setQuestion({})}
            >
              <CancelIcon />
            </IconButton>
            <Box sx={{ textAlign: 'center' }}>
              <Typography
                id='transition-modal-title'
                variant='p'
                component='h4'
                color='primary'
                mt={3}
              >
                {question.category &&
                  question.category.map((catz) => catz + ', ')}
              </Typography>
              <Typography
                id='transition-modal-description'
                sx={{ mt: 2, mb: 2 }}
                component='p'
              >
                {question.text}
              </Typography>

              {question.image && (
                <a target='_blank' rel='noreferrer' href={question.image}>
                  <Image
                    src={question.image}
                    // src={'/test.png'}
                    height='200px'
                    width='200px'
                    className='modal-image'
                    objectFit='cover'
                  />
                </a>
              )}
              <Box
                variant='contained'
                aria-label='outlined primary button group'
                sx={{
                  mt: 2,
                  display: 'flex',
                  justifyContent: 'center',
                  flexWrap: 'wrap',
                }}
              >
                {question.options &&
                  question.options.map((option) => (
                    <Button
                      variant='contained'
                      color={question.answer === option ? 'shader' : 'shader'}
                      key={option}
                      size='small'
                      onClick={() => {
                        if (option === question.answer) {
                          enqueueSnackbar('Correct', {
                            variant: 'success',
                            autoHideDuration: 800,
                            anchorOrigin,
                          });
                          return;
                        }
                        enqueueSnackbar('Wrong', {
                          variant: 'error',
                          autoHideDuration: 800,
                          anchorOrigin,
                        });
                      }}
                      sx={{
                        m: 0.8,
                        ml: 0,
                        display: 'inline-block',
                        px: 1,
                        fontSize: '10px',
                        fontWeight: 500,
                      }}
                      // disabled
                    >
                      {option}
                    </Button>
                  ))}
              </Box>

              {question.credits && (
                <Box
                  mt={3}
                  sx={{
                    display: 'flex',
                    width: '100%',
                    justifyContent: 'space-around',
                  }}
                >
                  {question.credits.map((credit) => (
                    <Link
                      key={credit.link}
                      target='_blank'
                      passHref
                      href={credit.link}
                    >
                      {credit.title}
                    </Link>
                  ))}
                </Box>
              )}

              {question.explanation && (
                <Box my={3} mb={1}>
                  <Button
                    variant='contained'
                    onClick={() => setShowExp(!showExp)}
                    size='small'
                    color='primary'
                  >
                    Show Explanation
                  </Button>

                  {showExp && (
                    <Dialog
                      open={showExp}
                      onClose={() => {
                        setShowExp(!showExp);
                      }}
                      aria-labelledby='alert-dialog-title'
                      aria-describedby='alert-dialog-description'
                    >
                      {/* <DialogTitle id='alert-dialog-title'>
                        Explanation
                      </DialogTitle> */}
                      <DialogContent>
                        <DialogContentText id='alert-dialog-description'>
                          <Typography
                            width={'100%'}
                            textAlign='center'
                            sx={{
                              wordBreak: 'break-all',
                              mb: 3,
                              // padding: '5px',
                            }}
                            component='html'
                            noWrap={false}
                            color='#000'
                          >
                            {parse(question.explanation)}
                          </Typography>
                        </DialogContentText>
                      </DialogContent>
                    </Dialog>
                  )}
                </Box>
              )}
            </Box>
          </Box>
        </Fade>
      </Modal>
    </div>
  );
}
