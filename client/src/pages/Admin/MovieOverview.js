import React, { useEffect, useState } from 'react';
import { Grid, Typography, ButtonBase, makeStyles, Box, Divider, CircularProgress } from '@material-ui/core';
import { useLocation } from 'react-router-dom';
import axios from 'axios';

const useStyles = makeStyles({
  image: { height: 400, width: 400 },
  img: { margin: 'auto', display: 'block', maxWidth: '100%', maxHeight: '100%' },
  label: { width: 120, height: 20, overflow: 'hidden' }
});

const Stats = ({ stats, classes }) =>
  stats.map((stat, index) => (
    <Box key={`${stat.label}-${index}`} display="flex" alignItems="center">
      <Typography className={classes.label} color="inherit" gutterBottom variant="subtitle1">
        {stat.label}
      </Typography>
      <Typography color="inherit" variant="body2" gutterBottom>
        {stat.value}
      </Typography>
    </Box>
  ));

const MovieOverview = () => {
  const classes = useStyles();
  const location = useLocation();
  const { limit = 5 } = location.state || {}; // get limit from dashboard

  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const res = await axios.get('http://localhost:8080/movies'); // fetch all movies
        setMovies(res.data.slice(0, limit)); // limit the movies displayed
      } catch (err) {
        console.error(err);
        setError('Failed to fetch movies from the server.');
      } finally {
        setLoading(false);
      }
    };
    fetchMovies();
  }, [limit]);

  if (loading) return <CircularProgress style={{ margin: '50px auto', display: 'block' }} />;
  if (error) return <Typography color="error">{error}</Typography>;
  if (movies.length === 0) return <Typography>No movies to display.</Typography>;

  return (
    <div>
      {movies.map(movie => (
        <Grid key={movie._id} container spacing={5}>
          <Grid item>
            <ButtonBase className={classes.image}>
              <img className={classes.img} alt={movie.title} src={movie.image || 'https://via.placeholder.com/400'} />
            </ButtonBase>
          </Grid>
          <Grid item xs={8} container direction="column" spacing={2}>
            <Grid item>
              <Typography color="inherit" gutterBottom variant="h2">
                {movie.title}
              </Typography>
              <Typography color="inherit" variant="body1" gutterBottom>
                {movie.description}
              </Typography>
            </Grid>
            <Grid item xs>
              <Stats
                classes={classes}
                stats={[
                  { label: 'Released', value: new Date(movie.releaseDate).toDateString() },
                  { label: 'Runtime', value: `${movie.duration} mins` },
                  { label: 'Director', value: movie.director },
                  { label: 'Genre', value: movie.genre },
                  { label: 'Status', value: 'Released' },
                  { label: 'Language', value: movie.language }
                ]}
              />
            </Grid>
          </Grid>
          <Divider style={{ margin: '20px 0' }} />
        </Grid>
      ))}
    </div>
  );
};

export default MovieOverview;