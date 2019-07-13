import React, { Component } from 'react';
import PropTypes from 'prop-types';
import withStyles from '@material-ui/core/styles/withStyles';
import Typography from '@material-ui/core/Typography';

const styles = theme => ({
  container: {
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(2),
  }
});

class ContactListGroup extends Component {
  render() {
    const { list, title, renderItem, classes } = this.props;
    if (!list || !list.length) {
      return null;
    }

    const items = list.map(renderItem);
    return (
      <div className={classes.container}>
        <Typography variant="subtitle1" color="inherit">{title}</Typography>
        {items}
      </div>
    );
  }
}

ContactListGroup.defaultProps = {
  renderItem: (c, i) => <Typography key={i} noWrap>{c.key}</Typography>
};

ContactListGroup.propTypes = {
  classes: PropTypes.object.isRequired,
  renderItem: PropTypes.func.isRequired,
  list: PropTypes.array,
  title: PropTypes.string
};

export default withStyles(styles)(ContactListGroup);