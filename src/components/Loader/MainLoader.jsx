import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';
import Button from '@mui/material/Button';
import Image from 'next/image';

export default function MainLoader({loader}) {

  return (
    <div>
      <Backdrop
        sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={loader}
        // onClick={handleClose}
      >
        {/* <CircularProgress color='inherit' /> */}
        <Image src="/loadIcon.svg" color='inherit' width={80} height={80} />
      </Backdrop>
    </div>
  );
}
