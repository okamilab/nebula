import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { withStyles } from '@material-ui/core/styles';
import FormControl from '@material-ui/core/FormControl';
import IconButton from '@material-ui/core/IconButton';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import InputAdornment from '@material-ui/core/InputAdornment';
import Tooltip from '@material-ui/core/Tooltip';
import { FileCopy } from '@material-ui/icons';

const styles = {
  input: {
    '&:before': {
      borderBottomStyle: 'none!important'
    }
  }
};

class Key extends Component {
  constructor(props) {
    super(props);

    this.state = {
      tooltipOpen: false,
      copied: false
    };

    this.toggle = this.toggle.bind(this);
  }

  toggle() {
    this.setState({
      tooltipOpen: !this.state.tooltipOpen,
      copied: this.state.tooltipOpen
    });
  }

  render() {
    const { name, value, label, classes } = this.props;

    if (!value || !value.length) {
      return null;
    }

    const display = value.length > 22 ?
      value.substr(0, 16) + '...' + value.substr(value.length - 4) :
      value;
    return (
      <FormControl margin="normal">
        <InputLabel htmlFor={name + '_key'}>{label}</InputLabel>
        <Input
          id={name + '_key'}
          type="text"
          value={display}
          disabled
          className={classes.input}
          endAdornment={
            <InputAdornment position="end">
              <CopyToClipboard
                id={name + '_key'}
                text={value}
                onCopy={() => this.setState({ copied: true })}>
                <Tooltip
                  title={this.state.copied ? 'Copied' : 'Copy to clipboard'}
                  placement="right"
                  onClose={() => {
                    setTimeout(() => this.setState({ copied: false }), 200);
                  }}>
                  <IconButton>
                    <FileCopy fontSize='small' />
                  </IconButton>
                </Tooltip>
              </CopyToClipboard>
            </InputAdornment>
          }
        />
      </FormControl>
    )
  }
}

Key.propTypes = {
  name: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
  label: PropTypes.string
};

export default withStyles(styles)(Key);