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
import pretty from 'prettysize';

import packageJson from '../../../package.json';
import { DEFAULT_SETTINGS } from '../../base/default';
import { updateSettings, resetSettings } from './../../settings/actions';

const styles = theme => ({
  sectionTitle: {
    marginTop: theme.spacing.unit * 2,
  },
  section: {
    borderRadius: 5,
    padding: theme.spacing.unit * 2
  },
  divider: {
    paddingTop: theme.spacing.unit * 2,
    paddingBottom: theme.spacing.unit * 2
  },
  actionBar: {
    paddingTop: theme.spacing.unit * 2
  },
  button: {
    marginRight: theme.spacing.unit * 2,
  },
});

class Settings extends Component {
  constructor(props) {
    super(props)

    this.state = {};
  }

  render() {
    const { classes, pss, bzz, revealAddress, size } = this.props;
    if (!pss) {
      return <div>No data</div>
    }

    return (
      <Grid
        container
        spacing={0}
        justify="center"
        style={{ paddingTop: 10 }}
      >
        <Grid item xs={6}>
          <Typography variant="h5" color="inherit" noWrap>
            Settings
          </Typography>
          <Typography variant="subtitle1" color="inherit" noWrap className={classes.sectionTitle}>
            General
          </Typography>
          <Paper square className={classes.section}>
            <Grid container spacing={0}>
              <Grid item xs={6}>
                <Typography variant="subtitle1" color="inherit" noWrap>
                  PSS endpoint (WebSocket)
                </Typography>
              </Grid>
              <Grid item xs={6}>
                <TextField
                  id="pss"
                  onChange={(e) => this.setState({ pss: e.target.value })}
                  defaultValue={pss}
                />
              </Grid>
              <Grid item xs={12}>
                <Typography variant="caption">
                  After updating the field you need to restart the app (refresh page)
                </Typography>
              </Grid>
              <Grid item xs={12} className={classes.divider}>
                <Divider />
              </Grid>
              <Grid item xs={6}>
                <Typography variant="subtitle1" color="inherit" noWrap>
                  BZZ endpoint
                </Typography>
              </Grid>
              <Grid item xs={6}>
                <TextField
                  id="bzz"
                  onChange={(e) => this.setState({ bzz: e.target.value })}
                  defaultValue={bzz}
                />
              </Grid>
              <Grid item xs={12}>
                <Typography variant="caption">
                  After updating the field you need to restart the app (refresh page)
                </Typography>
              </Grid>
              <Grid item xs={12} className={classes.divider}>
                <Divider />
              </Grid>
              <Grid item xs={6}>
                <Typography variant="subtitle1" color="inherit" noWrap>
                  Local storage
                </Typography>
              </Grid>
              <Grid item xs={6}>
                {pretty(size)}
              </Grid>
            </Grid>
          </Paper>
          <Typography variant="subtitle1" color="inherit" noWrap className={classes.sectionTitle}>
            Security
          </Typography>
          <Paper square className={classes.section}>
            <Grid container spacing={0}>
              <Grid item xs={6}>
                <Typography variant="subtitle1" color="inherit" noWrap>
                  Reveal address partially
                </Typography>
              </Grid>
              <Grid item xs={6}>
                <TextField
                  id="revealAddress"
                  select
                  onChange={(e) => this.setState({ revealAddress: +e.target.value })}
                  value={this.state.revealAddress === undefined ? revealAddress : this.state.revealAddress}
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
          <Typography variant="subtitle1" color="inherit" noWrap className={classes.sectionTitle}>
            About
          </Typography>
          <Paper square className={classes.section}>
            <Grid container spacing={0}>
              <Grid item xs={6}>
                <Typography variant="subtitle1" color="inherit" noWrap>
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
              variant="contained"
              onClick={this.reset}
              className={classes.button}>
              Reset
            </Button>
            <Button
              variant="contained"
              color="primary"
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
      Object.assign({}, this.props, this.state);
    this.props.dispatch(updateSettings({ pss, bzz, revealAddress }));
  };
}

Settings.propTypes = {
  classes: PropTypes.object.isRequired,
  dispatch: PropTypes.func.isRequired,
  pss: PropTypes.string,
  bzz: PropTypes.string,
  revealAddress: PropTypes.number,
  size: PropTypes.number
};

export default compose(
  connect((state) => {
    const { settings } = state || {
      settings: {
        pss: DEFAULT_SETTINGS.pss,
        bzz: DEFAULT_SETTINGS.bzz,
        revealAddress: DEFAULT_SETTINGS.revealAddress,
        size: 0
      }
    };
    return settings;
  }),
  withStyles(styles)
)(Settings);