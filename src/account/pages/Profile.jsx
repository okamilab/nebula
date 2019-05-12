import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';

import Identicon from './../../base/components/Identicon';
import Key from './../../base/components/Key';
import { updateUsername } from './../actions';

const styles = theme => ({
  section: {
    borderRadius: 5,
    marginTop: theme.spacing.unit * 2,
    padding: theme.spacing.unit * 2
  },
  button: {
    marginTop: theme.spacing.unit * 2
  }
});

class Profile extends Component {
  constructor(props) {
    super(props)

    this.state = {};
  }

  render() {
    const { account, classes } = this.props;
    if (!account) {
      return <div>Loading</div>
    }

    const { username, publicKey, overlayAddress } = account;
    if (!publicKey) {
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
          <Typography variant="h6" color="inherit" noWrap>
            Profile
          </Typography>
          <Paper square className={classes.section}>
            <Grid
              container
              spacing={0}
            >
              <Grid item xs={3}>
                {
                  publicKey ?
                    <Identicon publicKey={publicKey} size={78} /> :
                    null
                }
              </Grid>
              <Grid item xs={6}>
                <TextField
                  id="username"
                  label="User name"
                  onChange={(e) => this.setState({ username: e.target.value })}
                  defaultValue={username}
                />
              </Grid>
              <Grid item xs={3}>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={this.save}
                  className={classes.button}
                  disabled={!this.state.username}>
                  Save
                </Button>
              </Grid>
              <Grid item xs={3}>
              </Grid>
              <Grid item xs={9}>
                <Key
                  name="publicKey"
                  value={publicKey}
                  label="Public key" />
              </Grid>
              <Grid item xs={3}>
              </Grid>
              <Grid item xs={9}>
                <Key
                  name="overlayAddress"
                  value={overlayAddress}
                  label="Address" />
              </Grid>
            </Grid>
          </Paper>
        </Grid>
      </Grid>
    );
  }

  save = async () => {
    const { username } =
      Object.assign({}, this.props, this.state);
    await this.props.dispatch(updateUsername(username));
  };
}

Profile.propTypes = {
  dispatch: PropTypes.func.isRequired,
  account: PropTypes.object,
};

export default compose(
  connect((state) => {
    const { account } = state || {
      account: {
        publicKey: '',
        username: ''
      }
    };
    return { account };
  }),
  withStyles(styles)
)(Profile);