import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';

const styles = theme => ({
  divider: {
    textAlign: 'center',
    borderBottom: '1px solid #ddd',
    lineHeight: '0.3em',
    margin: '10px 0 20px'
  },
  title: {
    background: theme.palette.background.default,
    padding: '0 6px',
    color: '#bbb',
    fontSize: '12px'
  }
});

const ChatDayDivider = ({ classes, date }) => {
  return (
    <div className={classes.divider}>
      <span className={classes.title}>
        {date.toLocaleDateString()}
        </span>
    </div>
  );
}

ChatDayDivider.propTypes = {
  classes: PropTypes.object.isRequired,
  date: PropTypes.instanceOf(Date).isRequired,
}

export default withStyles(styles)(ChatDayDivider);