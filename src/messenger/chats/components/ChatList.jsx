import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { compose } from 'redux';
import { connect } from 'react-redux';
import withStyles from '@material-ui/core/styles/withStyles';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import ButtonBase from '@material-ui/core/ButtonBase';
import { push } from 'connected-react-router';

import Identicon from './../../../base/components/Identicon';

const styles = theme => ({
  container: {
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(2),
    overflow: 'hidden'
  },
  chat: {
    display: 'flex',
    color: 'inherit',
  },
  chatTitle: {
    paddingLeft: theme.spacing(1),
    lineHeight: '32px'
  }
});

class ChatList extends Component {
  render() {
    const { chats, classes, dispatch } = this.props;

    return (
      <>
        <Toolbar>
          <Typography variant='h6' color='inherit' noWrap>
            Chats
          </Typography>
        </Toolbar>
        <div className={classes.container}>
          {
            chats.map((c, i) =>
              <ButtonBase key={i}
                className={classes.chat}
                style={{ textDecoration: 'none' }}
                onClick={() => { dispatch(push(`/messenger/chat/${c.key}`)) }}>
                <div>
                  <Identicon publicKey={c.key} size={32} />
                </div>
                <Typography key={i} color='inherit' className={classes.chatTitle} noWrap>
                  {c.key}
                </Typography>
              </ButtonBase>
            )
          }
        </div>
      </>
    );
  }
}

ChatList.propTypes = {
  classes: PropTypes.object.isRequired,
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