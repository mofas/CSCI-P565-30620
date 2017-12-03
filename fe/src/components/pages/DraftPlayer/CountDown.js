import React from 'react';

import { format } from 'date-fns';

import classnames from 'classnames/bind';
import style from './Index.css';
const cx = classnames.bind(style);

class CountDown extends React.PureComponent {
  static defaultProps = {
    timeout: 120,
    lastPickTime: null,
    reload: () => {},
  };

  constructor(props) {
    super(props);
    this.state = {
      currentTime: Math.round(new Date().getTime() / 1000),
    };
  }

  componentDidMount() {
    this.timer = setInterval(() => {
      const { state, props } = this;
      const { lastPickTime, timeout, reload } = props;
      const { currentTime } = state;
      this.setState({
        currentTime: Math.round(new Date().getTime() / 1000),
      });
      if (timeout - (currentTime - lastPickTime) < 1) {
        reload();
      }
    }, 1000);
  }

  componentWillUnmount() {
    clearTimeout(this.timer);
  }

  render() {
    const { state, props } = this;
    const { lastPickTime, timeout } = props;
    const { currentTime } = state;

    const remainingTime = lastPickTime
      ? timeout - (currentTime - lastPickTime)
      : 'N/A';

    return (
      <div className={cx('count-down')}>
        Pick remaining time: {remainingTime}
      </div>
    );
  }
}

export default CountDown;
