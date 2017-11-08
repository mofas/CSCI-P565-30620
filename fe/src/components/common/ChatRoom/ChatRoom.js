import React from 'react';
import { fromJS, List, Map } from 'immutable';
import { connect } from 'react-redux';

import API from '../../../middleware/API';

import { WS_ENDPOINT } from '../../../config';
import Spinner from '../Spinner/Spinner';
import Btn from '../Btn/Btn';
import Input from '../Input/Input';
import MessageWrap from './MessageWrap';

import classnames from 'classnames/bind';
import style from './Index.css';
const cx = classnames.bind(style);

class ChatRoom extends React.PureComponent {
  static defaultProps = {
    roomId: null,
  };

  constructor(props) {
    super(props);
    this.state = {
      ws: null,
      loading: true,
      loadData: false,
      input: '',
      messages: List(),
    };
  }

  componentDidMount() {
    const { accountStore } = this.props;

    if (this.props.roomId && !this.state.loadData) {
      this.loadData(this.props.roomId);
    }

    if (!this.state.ws) {
      this.createWS();
    }
  }

  componentWillReceiveProps(nextProps) {
    const { accountStore } = nextProps;

    if (this.props.roomId && !this.state.loadData) {
      this.loadData(nextProps.roomId);
    }

    if (!this.state.ws) {
      this.createWS();
    }
  }

  loadData = roomId => {
    const query = `
      {
        GetMessages(room_id:"${roomId}", limit: 5) {
          sender
          message
          date_time
        }
      }
    `;

    API.GraphQL(query).then(res => {
      const messages = fromJS(res.data.GetMessages);
      this.setState({
        messages,
      });
      this.scrollToBottom();
    });
  };

  createWS = () => {
    const ws = new WebSocket(WS_ENDPOINT);

    this.setState({
      ws,
    });

    ws.onopen = () => {
      this.setState({
        loading: false,
      });
      ws.send(JSON.stringify({ type: 'initial' }));
    };

    ws.onmessage = event => {
      // console.log('get message', event);
      try {
        const data = JSON.parse(event.data);
        const { type, room_id, sender, message, date_time } = data;
        if (type === 'newMessage' && room_id === this.props.roomId) {
          this.setState({
            messages: this.state.messages.push(
              Map({
                sender,
                message,
                date_time,
              })
            ),
          });
        }
      } catch (e) {}

      this.scrollToBottom();
    };
  };

  changeInput = e => {
    this.setState({
      input: e.target.value,
    });
  };

  handleKeyUp = e => {
    const { keyCode } = e;
    if (keyCode === 13) {
      this.sendMessage();
    }
  };

  sendMessage = () => {
    if (this.state.input.length > 0) {
      const mutation = `
        mutation{
          SendMessage(
            room_id: "${this.props.roomId}",
            sender: "${this.props.accountStore.getIn(['userInfo', 'email'])}",
            message: "${this.state.input}"
          ) {
            success
            error
          }
        }
    `;

      API.GraphQL(mutation).then(res => {
        this.setState({
          input: '',
        });
      });
    }
  };

  scrollToBottom = () => {
    setTimeout(() => {
      if (this.tracker) {
        this.tracker.scrollTop = this.tracker.scrollHeight;
      }
    }, 0);
  };

  render() {
    const { state, props } = this;
    const { input, loading, messages } = state;
    return (
      <div className={cx('root')}>
        <Spinner show={loading} />
        <div className={cx('message-list')} ref={el => (this.tracker = el)}>
          {messages.map(d => {
            return <MessageWrap data={d} key={d.get('date_time')} />;
          })}
        </div>
        <div className={cx('input-wrap')}>
          <Input
            className={cx('input')}
            value={input}
            onChange={this.changeInput}
            onKeyUp={this.handleKeyUp}
            placeholder="Hit 'RETURN' to send message"
          />
          <Btn
            type="secondary"
            disabled={input.length === 0}
            onClick={this.sendMessage}
          >
            Send
          </Btn>
        </div>
      </div>
    );
  }
}

export default connect(stores => {
  return {
    accountStore: stores.account,
  };
})(ChatRoom);
