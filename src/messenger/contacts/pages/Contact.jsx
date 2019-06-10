import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { withRouter, Link } from 'react-router-dom';
import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';

import Layout from './../../components/Layout';
import Identicon from './../../../base/components/Identicon';
import Key from './../../../base/components/Key';

const styles = theme => ({
  sectionTitle: {
    marginTop: theme.spacing.unit * 2,
  },
  section: {
    borderRadius: 5,
    marginTop: theme.spacing.unit * 2,
    padding: theme.spacing.unit * 2
  },
  actionBar: {
    paddingTop: theme.spacing.unit * 2
  },
  button: {
    marginRight: theme.spacing.unit * 2,
  },
});

class Contact extends Component {
  render() {
    const { contact, classes } = this.props;
    if (!contact) {
      return <div>Contact not found</div>
    }

    const { username, key, address } = contact;
    if (!key) {
      return <div>No data</div>
    }

    return (
      <Layout>
        <Grid
          container
          spacing={0}
          justify="center"
          style={{ paddingTop: 10 }}
        >
          <Grid item xs={6}>
            <Typography variant='h5' color='inherit' noWrap className={classes.sectionTitle}>
              Contact
            </Typography>
            <Paper square className={classes.section}>
              <Grid container spacing={0}>
                <Grid item xs={3}>
                  {key ? <Identicon publicKey={key} size={78} /> : null}
                </Grid>
                <Grid item xs={9}>
                  <TextField
                    id="username"
                    label="User name"
                    disabled
                    defaultValue={username}
                  />
                </Grid>
                <Grid item xs={3}></Grid>
                <Grid item xs={9}>
                  <Key
                    name="publicKey"
                    value={key}
                    label="Public key" />
                </Grid>
                <Grid item xs={3}></Grid>
                <Grid item xs={9}>
                  <Key
                    name="address"
                    value={address}
                    label="Address" />
                </Grid>
              </Grid>
            </Paper>
            <div className={classes.actionBar}>
              <Button
                variant="contained"
                color="primary"
                component={Link}
                to={`/messenger/chat/${key}`}
                className={classes.button}>
                Chat
              </Button>
            </div>
          </Grid>
        </Grid>
      </Layout>
    );
  }
}

Contact.propTypes = {
  classes: PropTypes.object.isRequired,
  dispatch: PropTypes.func.isRequired,
  contact: PropTypes.object,
};

export default compose(
  connect((state, props) => {
    const { contacts } = state || {};
    return { contact: contacts[props.match.params.key] };
  }),
  withStyles(styles)
)(withRouter(Contact));