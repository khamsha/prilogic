import React, { Component } from "react";
import { connect } from "react-redux";
import { Table, Button } from "reactstrap";
import { fetchStatsIfNeeded} from "../actions";

class Statistics extends Component {
  componentDidMount() {
    const { dispatch } = this.props;
    dispatch(fetchStatsIfNeeded());
  }

  handleRefreshClick = e => {
    e.preventDefault();
    const { dispatch } = this.props;
    dispatch(fetchStatsIfNeeded());
  };

  render() {
    const { stats, lastUpdated } = this.props;
    return (
      <div className="body2">
        <p>
          {<span>
            Last updated at {new Date(lastUpdated).toLocaleTimeString()}.{" "}
          </span>}
          {<Button onClick={this.handleRefreshClick}>Refresh</Button>}
        </p>
        {
          <div>
            <Table>
              <thead>
                <tr>
                  <th>Store</th>
                  <th>Total</th>
                </tr>
              </thead>
              <tbody>
                {stats.map((stat, i) => (
                  <tr key={i}>
                    <th scope="row">{stat.stPivot}</th>
                    <th>{stat.sumPivot}</th>
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>
        }
      </div>
    );
  }
}
const mapStateToProps = state => ({
  lastUpdated: state.stats.lastUpdated,
  stats: state.stats.items
});

export default connect(mapStateToProps)(Statistics);
