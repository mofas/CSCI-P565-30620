import React from 'react';

import BackIcon from '../Icon/Back';
import Btn from './Btn';

import classnames from 'classnames';
import './Btn.css';

export default ({ children }) => {
  return (
    <Btn type="secondary">
      <BackIcon className={classnames('icon')} />
      {children}
    </Btn>
  );
};
