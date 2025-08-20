import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { NavLink } from 'react-router-dom';
import { logout } from '../../../../store/actions';
import { withStyles } from '@material-ui/core/styles';
import {
  Badge,
  Toolbar,
  IconButton,
  Popover,
  List,
  ListItem,
  ListItemText
} from '@material-ui/core';
import MenuIcon from '@material-ui/icons/Menu';
import CloseIcon from '@material-ui/icons/Close';
import NotificationsIcon from '@material-ui/icons/NotificationsOutlined';
import InputIcon from '@material-ui/icons/Input';

import styles from './styles';

class Topbar extends Component {
  state = { anchorEl: null };

  handleSignOut = () => {
    this.props.logout();
  };

  handleNotificationClick = event => {
    this.setState({ anchorEl: event.currentTarget });
  };

  handleClose = () => {
    this.setState({ anchorEl: null });
  };

  render() {
    const {
      classes,
      ToolbarClasses,
      children,
      isSidebarOpen,
      onToggleSidebar
    } = this.props;
    const { anchorEl } = this.state;

    const open = Boolean(anchorEl);

    return (
      <div className={`${classes.root} , ${ToolbarClasses}`}>
        <Toolbar className={classes.toolbar}>
          <div className={classes.brandWrapper}>
            <div className={classes.logo}>Movie Store</div>
            <IconButton
              className={classes.menuButton}
              aria-label="Menu"
              onClick={onToggleSidebar}>
              {isSidebarOpen ? <CloseIcon /> : <MenuIcon />}
            </IconButton>
          </div>

          <NavLink className={classes.title} to="/">
            Movie Store -
          </NavLink>

          <IconButton
            className={classes.notificationsButton}
            onClick={this.handleNotificationClick}>
            <Badge badgeContent={4} color="primary" variant="dot">
              <NotificationsIcon />
            </Badge>
          </IconButton>
          <Popover
            open={open}
            anchorEl={anchorEl}
            onClose={this.handleClose}
            anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
            transformOrigin={{ vertical: 'top', horizontal: 'center' }}>
            <List>
              <ListItem>
                <ListItemText primary="New movie added!" />
              </ListItem>
              <ListItem>
                <ListItemText primary="3 new reservations today" />
              </ListItem>
              <ListItem>
                <ListItemText primary="Server update scheduled" />
              </ListItem>
            </List>
          </Popover>

          <IconButton
            className={classes.signOutButton}
            onClick={this.handleSignOut}>
            <InputIcon />
          </IconButton>
        </Toolbar>
        {children}
      </div>
    );
  }
}

Topbar.propTypes = {
  classes: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  auth: state.authState
});
export default connect(mapStateToProps, { logout })(withStyles(styles)(Topbar));