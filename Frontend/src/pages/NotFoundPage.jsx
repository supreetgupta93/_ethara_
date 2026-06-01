import { Box, Button, Typography } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';

export default function NotFoundPage() {
  return (
    <Box sx={{ textAlign: 'center', mt: 12, px: 2 }}>
      <Typography variant="h3" gutterBottom>
        404
      </Typography>
      <Typography variant="h6" color="text.secondary" gutterBottom>
        Page not found.
      </Typography>
      <Button component={RouterLink} to="/" variant="contained">
        Return to dashboard
      </Button>
    </Box>
  );
}
