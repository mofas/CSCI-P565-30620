import React from 'react';
import classnames from 'classnames';
import './Btn.css';

export default class Btn extends React.PureComponent {
  static defaultProps = {
    type: 'primary',
    disabled: false,
  };

  render() {
    const { props } = this;
    const { children, type, disabled, className, ...rest } = props;

    return (
      <div
        {...rest}
        className={classnames('component-btn', className, type, { disabled })}
      >
        {children}
      </div>
    );
  }
}
