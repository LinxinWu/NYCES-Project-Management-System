import { useSelector, useDispatch } from 'react-redux';
import { Snackbar, Alert } from '@mui/material';
import { hideNotification } from '../../store/slices/notificationSlice';

function NotificationSystem() {
  const notifications = useSelector((state) => state.notification.notifications);
  const dispatch = useDispatch();

  const handleClose = (id) => {
    dispatch(hideNotification(id));
  };

  return (
    <>
      {notifications?.map((notification) => (
        <Snackbar
          key={notification.id}
          open={notification.open}
          autoHideDuration={6000}
          onClose={() => handleClose(notification.id)}
          anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        >
          <Alert
            onClose={() => handleClose(notification.id)}
            severity={notification.type}
            sx={{ width: '100%' }}
          >
            {notification.message}
          </Alert>
        </Snackbar>
      ))}
    </>
  );
}

export default NotificationSystem; 