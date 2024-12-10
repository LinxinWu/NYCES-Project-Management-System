import {
  Box,
  Grid,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Typography,
} from '@mui/material';

function SizeSelection({ value, options, onChange, material }) {
  const handleSizeChange = (field, newValue) => {
    onChange(value, { ...options, [field]: newValue });
  };

  const standardSizes = {
    metal: ['2x4', '4x6', '6x8', '8x10'],
    wood: ['4x4', '6x6', '8x8', '10x10'],
    plastic: ['3x5', '5x7', '7x9'],
    glass: ['4x4', '6x6', '8x8'],
  };

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Size & Options
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12} sm={6}>
          <FormControl fullWidth>
            <InputLabel>Standard Size</InputLabel>
            <Select
              value={value || ''}
              onChange={(e) => onChange(e.target.value, options)}
              label="Standard Size"
            >
              {standardSizes[material]?.map((size) => (
                <MenuItem key={size} value={size}>
                  {size} inches
                </MenuItem>
              ))}
              <MenuItem value="custom">Custom Size</MenuItem>
            </Select>
          </FormControl>
        </Grid>

        {value === 'custom' && (
          <>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Width (inches)"
                type="number"
                value={options.width || ''}
                onChange={(e) => handleSizeChange('width', e.target.value)}
                inputProps={{ min: 1, max: 24, step: 0.5 }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Height (inches)"
                type="number"
                value={options.height || ''}
                onChange={(e) => handleSizeChange('height', e.target.value)}
                inputProps={{ min: 1, max: 24, step: 0.5 }}
              />
            </Grid>
          </>
        )}

        <Grid item xs={12}>
          <TextField
            fullWidth
            multiline
            rows={3}
            label="Special Instructions"
            value={options.instructions || ''}
            onChange={(e) => handleSizeChange('instructions', e.target.value)}
            helperText="Add any special instructions or requirements"
          />
        </Grid>
      </Grid>
    </Box>
  );
}

export default SizeSelection; 