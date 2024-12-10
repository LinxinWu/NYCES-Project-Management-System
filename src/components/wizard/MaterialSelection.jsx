import { Grid, Card, CardContent, CardActionArea, Typography } from '@mui/material';

function MaterialSelection({ value, onChange, projectType }) {
  const materials = [
    {
      id: 'metal',
      title: 'Metal',
      description: 'Stainless steel, aluminum, brass, etc.',
      supportedTypes: ['text-only', 'vector'],
    },
    {
      id: 'wood',
      title: 'Wood',
      description: 'Various wood types and finishes',
      supportedTypes: ['text-only', 'vector'],
    },
    {
      id: 'plastic',
      title: 'Plastic',
      description: 'Acrylic and other plastics',
      supportedTypes: ['text-only'],
    },
    {
      id: 'glass',
      title: 'Glass',
      description: 'Glass and crystal materials',
      supportedTypes: ['text-only', 'vector'],
    },
  ];

  const filteredMaterials = materials.filter(
    material => material.supportedTypes.includes(projectType)
  );

  return (
    <Grid container spacing={3}>
      {filteredMaterials.map((material) => (
        <Grid item xs={12} sm={6} key={material.id}>
          <Card 
            raised={value === material.id}
            sx={{ height: '100%' }}
          >
            <CardActionArea 
              onClick={() => onChange(material.id)}
              sx={{ height: '100%', p: 2 }}
            >
              <CardContent sx={{ textAlign: 'center' }}>
                <Typography variant="h6" gutterBottom>
                  {material.title}
                </Typography>
                <Typography color="text.secondary">
                  {material.description}
                </Typography>
              </CardContent>
            </CardActionArea>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
}

export default MaterialSelection; 