import React, { Component } from 'react';
import PropTypes from 'prop-types';
import withStyles from '@material-ui/core/styles/withStyles';
import Typography from '@material-ui/core/Typography';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListSubheader from '@material-ui/core/ListSubheader';

const styles = _ => ({
});

class ContactListGroup extends Component {
  render() {
    const { list, title, renderItem } = this.props;
    if (!list || !list.length) {
      return null;
    }

    const items = list.map(renderItem);
    return (
      <List subheader={<ListSubheader>{title}</ListSubheader>}>
        {items}
      </List>
    );
  }
}

ContactListGroup.defaultProps = {
  renderItem: (c, i) =>
    <ListItem key={i} button>
      <ListItemText
        disableTypography
        primary={
          <Typography color='inherit' noWrap>
            {c.key}
          </Typography>
        } />
    </ListItem>
};


ContactListGroup.propTypes = {
  classes: PropTypes.object.isRequired,
  renderItem: PropTypes.func.isRequired,
  list: PropTypes.array,
  title: PropTypes.string
};

export default withStyles(styles)(ContactListGroup);