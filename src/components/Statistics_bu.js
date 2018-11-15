import React, { Component } from "react";
import { connect } from "react-redux";
import { Table } from "reactstrap";
import { receiveStats } from "../actions";

class Statistics extends Component {
  componentDidMount() {
    const { dispatch } = this.props;
    dispatch(receiveStats());
  }

  render() {
    const { stats } = this.props;
    return (
      <Table>
        <thead>
          <tr>
            <th>Store</th>
            <th>Total</th>
          </tr>
        </thead>
        <tbody>
          {stats.map((stat, i) =>
            <tr key={i}>
              <th scope="row">{stat.stPivot}</th>
              <th>{stat.stSum}</th>
            </tr>
          )}
        </tbody>
      </Table>
    );
  }
}
const mapStateToProps = state => ({
  stats: state.stats
});

export default connect(mapStateToProps)(Statistics);
