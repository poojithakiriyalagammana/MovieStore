import React, { useState } from 'react';
import classnames from 'classnames';
import PropTypes from 'prop-types';
import { Bar } from 'react-chartjs-2';
import { makeStyles } from '@material-ui/core/styles';
import { Card, CardHeader, CardContent, CardActions, Divider, Button, Menu, MenuItem } from '@material-ui/core';
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown';
import ArrowRightIcon from '@material-ui/icons/ArrowRight';
import { useHistory } from 'react-router-dom';
import palette from '../../../../../theme/palette';
import { options } from './chart';

const useStyles = makeStyles(() => ({
  root: {},
  chartContainer: {
    height: 400,
    position: 'relative'
  },
  actions: {
    justifyContent: 'flex-end'
  }
}));

const BestMovies = ({ className, bestMovies }) => {
  const classes = useStyles();
  const history = useHistory();
  const [anchorEl, setAnchorEl] = useState(null);
  const [limit, setLimit] = useState(5);

  const handleMenuClick = event => setAnchorEl(event.currentTarget);
  const handleMenuClose = value => {
    if (value) setLimit(value);
    setAnchorEl(null);
  };

  const limitedMovies = bestMovies.slice(0, limit);

  const data = {
    labels: limitedMovies.map(movie => movie.movie.title.toUpperCase()),
    datasets: [
      {
        label: 'This year',
        backgroundColor: palette.primary.main,
        data: limitedMovies.map(movie => movie.count)
      },
      {
        label: 'Last year',
        backgroundColor: palette.neutral,
        data: [11, 20, 12, 29, 30].slice(0, limitedMovies.length)
      }
    ]
  };

  const handleOverview = () => {
    history.push({
      pathname: '/admin/movies/overview',
      state: { limit }
    });
  };

  return (
    <Card className={classnames(classes.root, className)}>
      <CardHeader
        action={
          <>
            <Button size="small" variant="text" onClick={handleMenuClick}>
              Best {limit} <ArrowDropDownIcon />
            </Button>
            <Menu
              anchorEl={anchorEl}
              keepMounted
              open={Boolean(anchorEl)}
              onClose={() => handleMenuClose(null)}
            >
              <MenuItem onClick={() => handleMenuClose(5)}>Best 5</MenuItem>
              <MenuItem onClick={() => handleMenuClose(10)}>Best 10</MenuItem>
            </Menu>
          </>
        }
        title="Best Movies"
      />
      <Divider />
      <CardContent>
        <div className={classes.chartContainer}>
          <Bar data={data} options={options} />
        </div>
      </CardContent>
      <Divider />
      <CardActions className={classes.actions}>
        <Button color="primary" size="small" variant="text" onClick={handleOverview}>
          Overview <ArrowRightIcon />
        </Button>
      </CardActions>
    </Card>
  );
};

BestMovies.propTypes = {
  className: PropTypes.string,
  bestMovies: PropTypes.array.isRequired
};

export default BestMovies;