import React from "react";
import { fromJS, List, Set } from "immutable";
import { connect } from "react-redux";

import API from "../../../middleware/API";

import Btn from "../../common/Btn/Btn";
import LabelInput from "../../common/Input/LabelInput";
import Spinner from "../../common/Spinner/Spinner";

import classnames from "classnames/bind";
import style from "./Index.css";
const cx = classnames.bind(style);

class CreateLeague extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      name: "My League",
      limit: "2"
    };
  }

  updateLeagueTime = () => {};
  createLeague = ({ name, limit }) => {
    this.setState({
      loading: true
    });

    var d1 = Math.round(new Date().getTime() / 1000.0); // pass date from draft page
    const mutation = `
        mutation{
          CreateLeague(data: {name: "${name}", limit: ${limit}, epoc_date: ${d1}, formula: {tdpass : 4, 
                                                                                            passyds: 25,
                                                                                            tdrush: 6,
                                                                                            rushyds: 10,
                                                                                            recyds: 10,
                                                                                            tdrec: 6,
                                                                                            passyds: 5,
                                                                                            fgmade: 3,
                                                                                            fgmissed: -1,
                                                                                            xpmade: 1,
                                                                                            intthrow: -2,
                                                                                            int: 2,
                                                                                            fumlost: -2,
                                                                                            sack: 1,
                                                                                            forcedfum: 2,
                                                                                            kickblock: 2,
                                                                                            puntblock: 2,
                                                                                            tdkickret: 6,
                                                                                            saf: 2,
                                                                                            tdpuntret: 6,
                                                                                            tddef: 6,
                                                                                            i20punt: 1,
                                                                                            puntyds: 50,}}){
            _id
          }
        }
      `;

    API.GraphQL(mutation).then(res => {
      if (res.data.CreateLeague._id) {
        window.location.href = "#/app/league/list";
      } else {
        window.alert(res);
        this.setState({
          loading: false
        });
      }
    });
  };

  changeName = e => {
    this.setState({ name: e.target.value });
  };

  changeLimit = e => {
    this.setState({ limit: e.target.value });
  };

  handleCreateLeague = () => {
    const { name, limit } = this.state;

    if (!name || name === "") {
      window.alert("Please give a league name");
      return;
    }

    const limitNum = parseInt(limit, 10);
    if (isNaN(limitNum) || limitNum < 2 || limitNum > 10) {
      window.alert("Max Players must be a number between 2 and 10");
      return;
    }
    this.createLeague({ name, limit: limitNum });
  };

  render() {
    const { state, props } = this;
    const { name, limit } = state;
    return (
      <div className={cx("root")}>
        <div className={cx("name")}>Create New League</div>
        <div className={cx("input-wrap")}>
          <LabelInput
            label="League Name"
            value={name}
            onChange={this.changeName}
          />
        </div>
        <div className={cx("input-wrap")}>
          <LabelInput
            label="League Max Players"
            value={limit}
            onChange={this.changeLimit}
          />
        </div>
        <div className={cx("input-wrap")}>
          <LabelInput label="Formula Param 1" disabled />
        </div>
        <div className={cx("function-bar")} onClick={this.handleCreateLeague}>
          <Btn>Create</Btn>
        </div>
      </div>
    );
  }
}

export default connect(stores => {
  return {
    accountStore: stores.account
  };
})(CreateLeague);
