import React from 'react';

import classnames from 'classnames/bind';
import style from './Spinner.css';
const cx = classnames.bind(style);

class Spinner extends React.PureComponent {
  static defaultProps = {
    show: false,
  };

  render() {
    var loaderClasses = cx(this.props.className, {
      'sk-fading-circle-wrap': true,
      show: this.props.show,
    });

    return (
      <div className={loaderClasses}>
        <div className={cx('sk-fading-circle')}>
          <div className={cx('sk-circle1', 'sk-circle')} />
          <div className={cx('sk-circle2', 'sk-circle')} />
          <div className={cx('sk-circle3', 'sk-circle')} />
          <div className={cx('sk-circle4', 'sk-circle')} />
          <div className={cx('sk-circle5', 'sk-circle')} />
          <div className={cx('sk-circle6', 'sk-circle')} />
          <div className={cx('sk-circle7', 'sk-circle')} />
          <div className={cx('sk-circle8', 'sk-circle')} />
          <div className={cx('sk-circle9', 'sk-circle')} />
          <div className={cx('sk-circle10', 'sk-circle')} />
          <div className={cx('sk-circle11', 'sk-circle')} />
          <div className={cx('sk-circle12', 'sk-circle')} />
        </div>
      </div>
    );
  }
}

export default Spinner;
