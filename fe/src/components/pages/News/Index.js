import React from "react";

import classnames from "classnames/bind";
import style from "./Index.css";
const cx = classnames.bind(style);

class News extends React.PureComponent {
  render() {
    const { props } = this;
    return (
      <div className={cx("root")}>
        <div className={cx("main-title")}>Recent News:</div>
        <div className={cx("item")}>
          <span className={cx("date")}>10/20</span>
          <span className={cx("text")}>Add League List</span>
        </div>
        <div className={cx("item")}>
          <span className={cx("date")}>10/18</span>
          <span className={cx("text")}>Add Google OAuth Login</span>
        </div>
        <div className={cx("item")}>
          <span className={cx("date")}>10/14</span>
          <span className={cx("text")}>
            Player List Page Add Search/Filter Function
          </span>
        </div>
        <div className={cx("item")}>
          <span className={cx("date")}>10/4</span>
          <span className={cx("text")}>Add Player List Page</span>
        </div>
        <div className={cx("item")}>
          <span className={cx("date")}>9/24</span>
          <span className={cx("text")}>Add Login Functionality</span>
        </div>
        <div className={cx("item")}>
          <span className={cx("date")}>9/30</span>
          <span className={cx("text")}>Add News Page</span>
        </div>
      </div>
    );
  }
}

export default News;
