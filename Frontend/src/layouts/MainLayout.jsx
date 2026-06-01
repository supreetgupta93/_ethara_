import { Box, CssBaseline, Toolbar } from '@mui/material';
import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import Topbar from '../components/Topbar';

const drawerWidth = 280;

export default function MainLayout() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <Topbar onMenuToggle={() => setMobileOpen(!mobileOpen)} drawerWidth={drawerWidth} />
      <Sidebar mobileOpen={mobileOpen} onClose={() => setMobileOpen(false)} drawerWidth={drawerWidth} />
      <Box component="main" sx={{ flexGrow: 1, p: 3, width: { sm: `calc(100% - ${drawerWidth}px)` } }}>
        <Toolbar />
        <Outlet />
      </Box>
    </Box>
  );
}
