import MenuIcon from '@mui/icons-material/Menu';
import { AppBar, Box, IconButton, Toolbar, Typography } from '@mui/material';

export default function Topbar({ onMenuToggle, drawerWidth }) {
  return (
    <AppBar
      position="fixed"
      elevation={1}
      sx={{
        width: { sm: `calc(100% - ${drawerWidth}px)` },
        ml: { sm: `${drawerWidth}px` },
        backgroundColor: '#ffffff',
        color: '#111827',
      }}
    >
      <Toolbar>
        <IconButton
          color="inherit"
          edge="start"
          sx={{ mr: 2, display: { sm: 'none' } }}
          onClick={onMenuToggle}
        >
          <MenuIcon />
        </IconButton>
        <Box sx={{ flexGrow: 1 }}>
          <Typography variant="h6" fontWeight={700}>
            Ethara AI Dashboard
          </Typography>
        </Box>
      </Toolbar>
    </AppBar>
  );
}
