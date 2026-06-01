import { Box, Typography } from '@mui/material';

export default function EmptyState({ title, description }) {
  return (
    <Box sx={{ textAlign: 'center', py: 12, color: 'text.secondary' }}>
      <Typography variant="h6" gutterBottom>
        {title}
      </Typography>
      <Typography>{description}</Typography>
    </Box>
  );
}
