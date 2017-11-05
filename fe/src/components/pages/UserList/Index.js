import React from 'react';
import { fromJS, List, Set } from 'immutable';

import API from '../../../middleware/API';

import Spinner from '../../common/Spinner/Spinner';
import Btn from '../../common/Btn/Btn';

import PlayerFilter from '../../common/PlayerFilter/PlayerFilter';
import Item from './Item';

import classnames from 'classnames/bind';
import style from './Index.css';
const cx = classnames.bind(style);

class PlayerList extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      users: List(),
    };
  }

  componentDidMount() {
    const query = `
      {
        ListAccount{
           _id
          email
          role
          status
          ban
        }
      }
    `;
	


    this.setState({
      loading: true,
    });

    API.GraphQL(query).then(res => {
		console.log(res)
      const users = fromJS(res.data.ListAccount);
      this.setState({
        loading: false,
        users: users,
      });
    });
  }

  toggleBan = (_id, isBan) =>{
	  console.log(_id, isBan)
	  
	   this.setState({
      loading: true,
    });

    const mutation = `
        mutation{
          BanUser(_id: "${_id}", isBanned: ${isBan} ){
            success
          }
        }
      `;

    API.GraphQL(mutation).then(res => {
      
	  if(res.data.BanUser.success){
		  if(isBan){
				window.alert("You unban the user!");
		  }
		  else{
				window.alert("You ban the user!");
		  }
		  this.setState({
			users: this.state.users.map(d=> {
				if(d.get('_id') === _id){
					return d.updateIn(['ban'], (v)=> !v);
				}
				else {
					return d;
				}
				
			})  
		  });
		 }
	  this.setState({
      loading: false,
    });
    });
	
  }
  render() {
    const { state, props } = this;
    const { loading, users } = state;

    return (
      <div className={cx('root')}>
        <Spinner show={loading} />
			<table>
			{users.map(user => {
			return (
			<tr>
			<td className={cx("item")}>{user.get('email')}</td>
			<td className={cx("item")}>{user.get('role')}</td>
			{
				!user.get('ban')?
				<Btn type="secondary" onClick={()=>this.toggleBan(user.get('_id'),true)}>
					Ban User
				</Btn>
				:
				<Btn onClick={()=>this.toggleBan(user.get('_id'), false)}>
					Unban User
				</Btn>
			}
			</tr>
			
			);
			
			})}
			</table>
      </div>
    );
  }
}

export default PlayerList;
