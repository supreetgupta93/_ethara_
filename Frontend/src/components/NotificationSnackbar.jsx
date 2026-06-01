import { Alert, Snackbar } from '@mui/material';
import { useContext } from 'react';
import { NotificationContext } from '../context/NotificationContext';

export default function NotificationSnackbar() {
  const { notification, closeNotification } = useContext(NotificationContext);

  return (
    <Snackbar
      open={notification.open}
      autoHideDuration={4000}
      onClose={closeNotification}
      anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
    >
      <Alert onClose={closeNotification} severity={notification.severity} sx={{ width: '100%' }}>
        {notification.message}
      </Alert>
    </Snackbar>
  );
}
