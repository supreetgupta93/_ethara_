import { Box } from '@mui/material';
import NotificationSnackbar from './components/NotificationSnackbar';
import AppRoutes from './routes/AppRoutes';

function App() {
  return (
    <Box sx={{ minHeight: '100vh', background: '#f4f6fc' }}>
      <AppRoutes />
      <NotificationSnackbar />
    </Box>
  );
}

export default App;
