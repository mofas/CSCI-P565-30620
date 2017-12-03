import React from 'react';
import { fromJS, List, Map } from 'immutable';

import ChatRoom from '../../common/ChatRoom/ChatRoom';

import classnames from 'classnames/bind';
import style from './Index.css';
const cx = classnames.bind(style);

class MainChatRoom extends React.PureComponent {
  render() {
    const { props } = this;
    return (
      <div className={cx('root')}>
        <ChatRoom roomId={this.props.match.params.room_id} />
      </div>
    );
  }
}

export default MainChatRoom;
