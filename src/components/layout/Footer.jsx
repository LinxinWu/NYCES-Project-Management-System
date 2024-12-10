import { Box, Container, Typography, Link } from '@mui/material';

function Footer() {
  return (
    <Box
      component="footer"
      sx={{
        py: 3,
        px: 2,
        mt: 'auto',
        backgroundColor: (theme) =>
          theme.palette.mode === 'light'
            ? '#333'
            : theme.palette.background.paper,
        color: (theme) =>
          theme.palette.mode === 'light'
            ? '#ffffff'
            : theme.palette.text.primary,
      }}
    >
      <Container maxWidth="xl">
        <Typography variant="body2" color="inherit" align="center">
          {'© '}
          <Link color="inherit" href="/" sx={{ textDecoration: 'none', '&:hover': { textDecoration: 'underline' } }}>
            NYC Engraving Service
          </Link>{' '}
          {new Date().getFullYear()}
        </Typography>
      </Container>
    </Box>
  );
}

export default Footer; 