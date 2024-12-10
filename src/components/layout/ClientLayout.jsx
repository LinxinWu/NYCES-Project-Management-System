import { Outlet } from 'react-router-dom';
import { Box } from '@mui/material';
import ClientHeader from './ClientHeader';
import Footer from './Footer';

function ClientLayout() {
  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', bgcolor: 'background.default' }}>
      <ClientHeader />
      <Box component="main" sx={{ flex: 1, display: 'flex', flexDirection: 'column', bgcolor: 'background.default' }}>
        <Outlet />
      </Box>
      <Footer />
    </Box>
  );
}

export default ClientLayout; 