import { Snackbar, Alert } from '@mui/material';
import { useSelector, useDispatch } from 'react-redux';
import { hideNotification } from '../../store/slices/notificationSlice';

function Notification() {
  const { open, message, type } = useSelector((state) => state.notification);
  const dispatch = useDispatch();

  const handleClose = () => {
    dispatch(hideNotification());
  };

  return (
    <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
      <Alert onClose={handleClose} severity={type} sx={{ width: '100%' }}>
        {message}
      </Alert>
    </Snackbar>
  );
}

export default Notification; 