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
import { push } from 'connected-react-router';
import sum from 'hash-sum';

import Layout from './../../components/Layout';
import Identicon from './../../../base/components/Identicon';
import Key from './../../../base/components/Key';

const styles = theme => ({
  sectionTitle: {
    marginTop: theme.spacing(2),
  },
  section: {
    borderRadius: 5,
    marginTop: theme.spacing(2),
    padding: theme.spacing(2)
  },
  actionBar: {
    paddingTop: theme.spacing(2)
  },
  button: {
    marginRight: theme.spacing(2),
  },
});

class Contact extends Component {
  render() {
    const { classes, isNarrow, contact, dispatch } = this.props;
    if (!contact) {
      return <div>Contact not found</div>
    }

    const { username, key, address } = contact;
    if (!key) {
      return <div>No data</div>
    }

    return (
      <Layout isNarrow={isNarrow}>
        <Grid
          container
          spacing={0}
          justify='center'
          style={{ paddingTop: 10 }}
        >
          <Grid item md={6} sm={8} xs={11}>
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
                    id='username'
                    label='User name'
                    disabled
                    defaultValue={username}
                  />
                </Grid>
                <Grid item xs={3}></Grid>
                <Grid item xs={9}>
                  <Key
                    name='publicKey'
                    value={key}
                    label='Public key' />
                </Grid>
                <Grid item xs={3}></Grid>
                <Grid item xs={9}>
                  <Key
                    name='address'
                    value={address}
                    label='Address' />
                </Grid>
              </Grid>
            </Paper>
            <div className={classes.actionBar}>
              <Button
                variant='contained'
                color='primary'
                className={classes.button}
                onClick={() => { dispatch(push(`/messenger/chat/${sum(key)}`)) }}>
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
  isNarrow: PropTypes.bool,
  contact: PropTypes.object
};

export default compose(
  connect((state, props) => {
    const { contacts } = state || {};
    return { contact: contacts[props.match.params.key] };
  }),
  withStyles(styles)
)(Contact);