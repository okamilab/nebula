import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import TextField from '@material-ui/core/TextField';
import Divider from '@material-ui/core/Divider';
import MenuItem from '@material-ui/core/MenuItem';
import Button from '@material-ui/core/Button';
import SnackbarContent from '@material-ui/core/SnackbarContent';
import amber from '@material-ui/core/colors/amber';
import pretty from 'prettysize';

import packageJson from '../../../package.json';
import { DEFAULT_SETTINGS } from '../../base/default';
import { updateSettings, resetSettings } from './../../settings/actions';

const styles = theme => ({
  sectionTitle: {
    marginTop: theme.spacing(2),
  },
  section: {
    borderRadius: 5,
    padding: theme.spacing(2)
  },
  divider: {
    paddingTop: theme.spacing(2),
    paddingBottom: theme.spacing(2)
  },
  actionBar: {
    paddingTop: theme.spacing(2)
  },
  button: {
    marginRight: theme.spacing(2),
  },
  info: {
    backgroundColor: amber[300],
    color: '#000',
    maxWidth: '100%'
  }
});

class Settings extends Component {
  constructor(props) {
    super(props)

    this.state = {};
  }

  render() {
    const { classes, settings, app } = this.props;
    if (!settings.pss) {
      return <div>No data</div>
    }

    return (
      <Grid
        container
        spacing={0}
        justify='center'
        style={{ paddingTop: 10 }}
      >
        <Grid item md={6} sm={8} xs={11}>
          {!app.isConnected && <SnackbarContent
            className={classes.info}
            message={
              <div>There is no connection. Make sure you did everything right in order
                to <a href='https://github.com/okamilab/nebula#running-nebula' target='_block'>run nebula</a></div>
            } />}
          <Typography variant='h5' color='inherit' noWrap className={classes.sectionTitle}>
            Settings
          </Typography>
          <Typography variant='subtitle1' color='inherit' noWrap className={classes.sectionTitle}>
            General
          </Typography>
          <Paper square className={classes.section}>
            <Grid container spacing={0}>
              <Grid item xs={6}>
                <Typography variant='subtitle1' color='inherit' noWrap>
                  PSS endpoint (WebSocket)
                </Typography>
              </Grid>
              <Grid item xs={6}>
                <TextField
                  id='pss'
                  onChange={(e) => this.setState({ pss: e.target.value })}
                  defaultValue={settings.pss}
                  disabled={settings.isPssLocked}
                />
              </Grid>
              <Grid item xs={12}>
                <Typography variant='caption'>
                  After updating the field you need to restart the app (refresh page)
                </Typography>
              </Grid>
              <Grid item xs={12} className={classes.divider}>
                <Divider />
              </Grid>
              <Grid item xs={6}>
                <Typography variant='subtitle1' color='inherit' noWrap>
                  BZZ endpoint
                </Typography>
              </Grid>
              <Grid item xs={6}>
                <TextField
                  id='bzz'
                  onChange={(e) => this.setState({ bzz: e.target.value })}
                  defaultValue={settings.bzz}
                />
              </Grid>
              <Grid item xs={12}>
                <Typography variant='caption'>
                  After updating the field you need to restart the app (refresh page)
                </Typography>
              </Grid>
              <Grid item xs={12} className={classes.divider}>
                <Divider />
              </Grid>
              <Grid item xs={6}>
                <Typography variant='subtitle1' color='inherit' noWrap>
                  Local storage
                </Typography>
              </Grid>
              <Grid item xs={6}>
                {pretty(settings.size)}
              </Grid>
            </Grid>
          </Paper>
          <Typography variant='subtitle1' color='inherit' noWrap className={classes.sectionTitle}>
            Security
          </Typography>
          <Paper square className={classes.section}>
            <Grid container spacing={0}>
              <Grid item xs={6}>
                <Typography variant='subtitle1' color='inherit' noWrap>
                  Reveal address partially
                </Typography>
              </Grid>
              <Grid item xs={6}>
                <TextField
                  id='revealAddress'
                  select
                  onChange={(e) => this.setState({ revealAddress: +e.target.value })}
                  value={this.state.revealAddress === undefined ? settings.revealAddress : this.state.revealAddress}
                >
                  <MenuItem value={0}>Broadcast</MenuItem>
                  <MenuItem value={4}>4</MenuItem>
                  <MenuItem value={8}>8</MenuItem>
                  <MenuItem value={16}>16</MenuItem>
                  <MenuItem value={32}>Full</MenuItem>
                </TextField>
              </Grid>
            </Grid>
          </Paper>
          <Typography variant='subtitle1' color='inherit' noWrap className={classes.sectionTitle}>
            About
          </Typography>
          <Paper square className={classes.section}>
            <Grid container spacing={0}>
              <Grid item xs={6}>
                <Typography variant='subtitle1' color='inherit' noWrap>
                  Version
                </Typography>
              </Grid>
              <Grid item xs={6}>
                <a href={`https://github.com/okamilab/nebula/releases/tag/v${packageJson.version}`} target='_block'>
                  {packageJson.version}
                </a>
              </Grid>
            </Grid>
          </Paper>
          <div className={classes.actionBar}>
            <Button
              variant='contained'
              onClick={this.reset}
              className={classes.button}>
              Reset
            </Button>
            <Button
              variant='contained'
              color='primary'
              onClick={this.save}
              className={classes.button}>
              Save
            </Button>
          </div>
        </Grid>
      </Grid>
    )
  }

  reset = () => {
    this.props.dispatch(resetSettings());
  };

  save = () => {
    const { pss, bzz, revealAddress } =
      Object.assign({}, this.props.settings, this.state);
    this.props.dispatch(updateSettings({ pss, bzz, revealAddress }));
  };
}

Settings.propTypes = {
  classes: PropTypes.object.isRequired,
  dispatch: PropTypes.func.isRequired,
  settings: PropTypes.object.isRequired,
  app: PropTypes.object.isRequired
};

export default compose(
  connect((state) => {
    const { settings, app } = state || {
      settings: {
        pss: DEFAULT_SETTINGS.pss,
        bzz: DEFAULT_SETTINGS.bzz,
        isPssLocked: false,
        revealAddress: DEFAULT_SETTINGS.revealAddress,
        size: 0
      },
      app: {
        isConnected: false,
      }
    };
    return { settings, app };
  }),
  withStyles(styles)
)(Settings);