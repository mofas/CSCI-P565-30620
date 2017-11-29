import React from "react";

import classnames from "classnames/bind";
import style from "./Index.css";
const cx = classnames.bind(style);

class News extends React.PureComponent {
  render() {
    const { props } = this;
    return (
      <div className={cx("root")}>
        <h1 className={cx("title")}>Team News</h1>
        <div className={cx("wrap")}>
          <a href="http://www.azcardinals.com/" target="_blank">
            <img src="https://static.nfl.com/static/site/img/logos/svg/teams/ARI.svg" />
          </a>
          <a href="http://www.atlantafalcons.com/" target="_blank">
            <img src="https://static.nfl.com/static/site/img/logos/svg/teams/ATL.svg" />
          </a>
          <a href="http://www.baltimoreravens.com/" target="_blank">
            <img src="https://static.nfl.com/static/site/img/logos/svg/teams/BAL.svg" />
          </a>
          <a href="http://www.buffalobills.com/" target="_blank">
            <img src="https://static.nfl.com/static/site/img/logos/svg/teams/BUF.svg" />
          </a>
          <a href="http://www.panthers.com/" target="_blank">
            <img src="https://static.nfl.com/static/site/img/logos/svg/teams/CAR.svg" />
          </a>
          <a href="http://www.chicagobears.com/" target="_blank">
            <img src="https://static.nfl.com/static/site/img/logos/svg/teams/CHI.svg" />
          </a>
          <a href="http://www.bengals.com/" target="_blank">
            <img src="https://static.nfl.com/static/site/img/logos/svg/teams/CIN.svg" />
          </a>
          <a href="http://www.clevelandbrowns.com/" target="_blank">
            <img src="https://static.nfl.com/static/site/img/logos/svg/teams/CLE.svg" />
          </a>
          <a href="http://www.dallascowboys.com/" target="_blank">
            <img src="https://static.nfl.com/static/site/img/logos/svg/teams/DAL.svg" />
          </a>
          <a href="http://www.denverbroncos.com/" target="_blank">
            <img src="https://static.nfl.com/static/site/img/logos/svg/teams/DEN.svg" />
          </a>
          <a href="http://www.detroitlions.com/" target="_blank">
            <img
              src="https://static.nfl.com/static/site/img/logos/svg/teams/DET.svg"
              height="204"
            />
          </a>
          <a href="http://www.packers.com/" target="_blank">
            <img src="https://static.nfl.com/static/site/img/logos/svg/teams/GB.svg" />
          </a>
          <a href="http://www.houstontexans.com/" target="_blank">
            <img src="https://static.nfl.com/static/site/img/logos/svg/teams/HOU.svg" />
          </a>
          <a href="http://www.colts.com/" target="_blank">
            <img src="https://static.nfl.com/static/site/img/logos/svg/teams/IND.svg" />
          </a>
          <a href="http://www.jaguars.com/" target="_blank">
            <img src="https://static.nfl.com/static/site/img/logos/svg/teams/JAX.svg" />
          </a>
          <a href="http://www.chiefs.com/" target="_blank">
            <img src="https://static.nfl.com/static/site/img/logos/svg/teams/KC.svg" />
          </a>
          <a href="http://www.chargers.com/" target="_blank">
            <img src="https://static.nfl.com/static/site/img/logos/svg/teams/LAC.svg" />
          </a>
          <a href="http://www.therams.com/" target="_blank">
            <img
              src="https://static.nfl.com/static/site/img/logos/svg/teams/LA.svg"
              height="204"
            />
          </a>
          <a href="http://www.miamidolphins.com/" target="_blank">
            <img src="https://static.nfl.com/static/site/img/logos/svg/teams/MIA.svg" />
          </a>
          <a href="http://www.vikings.com/" target="_blank">
            <img src="https://static.nfl.com/static/site/img/logos/svg/teams/MIN.svg" />
          </a>
          <a href="http://www.patriots.com/" target="_blank">
            <img src="https://static.nfl.com/static/site/img/logos/svg/teams/NE.svg" />
          </a>
          <a href="http://www.neworleanssaints.com/" target="_blank">
            <img src="https://static.nfl.com/static/site/img/logos/svg/teams/NO.svg" />
          </a>
          <a href="http://www.giants.com/" target="_blank">
            <img src="https://static.nfl.com/static/site/img/logos/svg/teams/NYG.svg" />
          </a>
          <a href="http://www.newyorkjets.com/" target="_blank">
            <img src="https://static.nfl.com/static/site/img/logos/svg/teams/NYJ.svg" />
          </a>
          <a href="http://www.raiders.com/" target="_blank">
            <img src="https://static.nfl.com/static/site/img/logos/svg/teams/OAK.svg" />
          </a>
          <a href="http://www.philadelphiaeagles.com/" target="_blank">
            <img src="https://static.nfl.com/static/site/img/logos/svg/teams/PHI.svg" />
          </a>
          <a href="http://www.steelers.com/" target="_blank">
            <img src="https://static.nfl.com/static/site/img/logos/svg/teams/PIT.svg" />
          </a>
          <a href="http://www.49ers.com/" target="_blank">
            <img src="https://static.nfl.com/static/site/img/logos/svg/teams/SF.svg" />
          </a>
          <a href="http://www.seahawks.com/" target="_blank">
            <img src="https://static.nfl.com/static/site/img/logos/svg/teams/SEA.svg" />
          </a>
          <a href="http://www.buccaneers.com/" target="_blank">
            <img src="https://static.nfl.com/static/site/img/logos/svg/teams/TB.svg" />
          </a>
          <a href="http://www.titansonline.com/" target="_blank">
            <img src="https://static.nfl.com/static/site/img/logos/svg/teams/TEN.svg" />
          </a>
          <a href="http://www.redskins.com/" target="_blank">
            <img src="https://static.nfl.com/static/site/img/logos/svg/teams/WAS.svg" />
          </a>
        </div>
      </div>
    );
  }
}

export default News;
