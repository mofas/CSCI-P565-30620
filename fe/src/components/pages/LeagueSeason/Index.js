import React from 'react';
import { fromJS, List, Set } from 'immutable';
import { Link } from 'react-router-dom';

import API from '../../../middleware/API';

import Spinner from '../../common/Spinner/Spinner';
import BackBtn from '../../common/Btn/BackBtn';

import classnames from 'classnames/bind';
import style from './Index.css';
const cx = classnames.bind(style);

class LeagueSeason extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            lid: this.props.match.params.l_id
        };
    }

    componentDidMount() {
        const query = `
          {
            QueryScheduleByLeagueId(league_id: "${this.state.lid}" ) {
                week_no
                first_team {
                  email
                }
                second_team {
                  email
                }
              }
          }
        `;
        this.setState({
            loading: true
        });
        API.GraphQL(query).then(res => {
            // console.log(res);
            const QueryScheduleByLeagueId = res.data.QueryScheduleByLeagueId;
            this.setState({
                loading: false,
                QueryScheduleByLeagueId: QueryScheduleByLeagueId
            });
        });
    }

    render() {
        const { state, props } = this;
        const { loading } = state;

        return (
            <div className={cx('root')}>
                <Link
                    to={`/app/league/list`}
                    style={{ display: 'inline-block' }}
                >
                    <BackBtn type="secondary">Back to List</BackBtn>
                </Link>
                <Spinner show={loading} />
                <div>This is League Season Page</div>
                TODO :
                <div>
                    1. Match schedule // Manish This week game, Next week game,
                </div>
                <div>
                    1.5 Run Button // Joel Tyler Calculate the match this week,
                    and store the data into DB, reload the page.
                </div>
                <div>
                    2. Standing // Manish Read GameRecord from database, display
                    on the UI
                </div>
                <div>
                    3. UI for Starters // CY Read arrangement data from server
                    Store data when finishing.
                </div>
            </div>
        );
    }
}

export default LeagueSeason;
