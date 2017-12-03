import React from 'react';
import classnames from 'classnames/bind';
import style from './Index.css';
const cx = classnames.bind(style);

export class Table extends React.PureComponent {
  render() {
    return (
      <div className={cx('table', [this.props.className])}>
        {this.props.children}
      </div>
    );
  }
}

export class Thead extends React.PureComponent {
  render() {
    return (
      <div className={cx('thead', [this.props.className])}>
        {this.props.children}
      </div>
    );
  }
}

export class Tbody extends React.PureComponent {
  render() {
    return (
      <div className={cx('tbody', [this.props.className])}>
        {this.props.children}
      </div>
    );
  }
}

export class Row extends React.PureComponent {
  render() {
    return (
      <div className={cx('row', [this.props.className])}>
        {this.props.children}
      </div>
    );
  }
}

export class Col extends React.PureComponent {
  render() {
    return (
      <div className={cx('col', [this.props.className])}>
        {this.props.children}
      </div>
    );
  }
}
