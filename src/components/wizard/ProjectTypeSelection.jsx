import { Grid, Card, CardContent, CardActionArea, Typography } from '@mui/material';
import { TextFields, Image } from '@mui/icons-material';

function ProjectTypeSelection({ value, onChange }) {
  const projectTypes = [
    {
      id: 'text-only',
      title: 'Text Only',
      description: 'Simple text engraving without images',
      icon: TextFields,
    },
    {
      id: 'vector',
      title: 'Vector Design',
      description: 'Upload and engrave vector graphics',
      icon: Image,
    },
  ];

  return (
    <Grid container spacing={3}>
      {projectTypes.map((type) => (
        <Grid item xs={12} sm={6} key={type.id}>
          <Card 
            raised={value === type.id}
            sx={{ height: '100%' }}
          >
            <CardActionArea 
              onClick={() => onChange(type.id)}
              sx={{ height: '100%', p: 2 }}
            >
              <CardContent sx={{ textAlign: 'center' }}>
                <type.icon sx={{ fontSize: 48, mb: 2 }} />
                <Typography variant="h6" gutterBottom>
                  {type.title}
                </Typography>
                <Typography color="text.secondary">
                  {type.description}
                </Typography>
              </CardContent>
            </CardActionArea>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
}

export default ProjectTypeSelection; 