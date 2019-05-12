import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import withStyles from '@material-ui/core/styles/withStyles';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';

import Identicon from './../../../base/components/Identicon';

const styles = theme => ({
  container: {
    paddingLeft: theme.spacing.unit * 2,
    paddingRight: theme.spacing.unit * 2,
  },
  chat: {
    display: 'flex',
    color: 'inherit'
  },
  chatTitle: {
    paddingLeft: theme.spacing.unit,
    lineHeight: '32px'
  }
});

class ChatList extends Component {
  render() {
    const { chats, classes } = this.props;

    return (
      <>
        <Toolbar>
          <Typography variant="h6" color="inherit" noWrap>
            Chats
          </Typography>
        </Toolbar>
        <div className={classes.container}>
          {
            chats.map((c, i) =>
              <Link key={i}
                to={'/messenger/chat/' + c.key}
                className={classes.chat}
                style={{ textDecoration: 'none' }}>
                <div>
                  <Identicon publicKey={c.key} size={32} />
                </div>
                <Typography key={i} color="inherit" className={classes.chatTitle} noWrap>
                  {c.key}
                </Typography>
              </Link>
            )
          }
        </div>
      </>
    );
  }
}

ChatList.propTypes = {
  dispatch: PropTypes.func.isRequired,
  chats: PropTypes.array,
};

export default compose(
  connect((state) => {
    const { chats } = state || [];
    return { chats };
  }),
  withStyles(styles)
)(ChatList);