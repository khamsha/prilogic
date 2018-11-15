import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { Button } from "reactstrap";

import { selectStore, fetchPostsIfNeeded, resetStore, createShipment} from "../actions";
import Picker from "../components/Picker";
import Posts from "../components/Posts";

class App extends Component {
  static propTypes = {
    selectedStore: PropTypes.string.isRequired,
    nodeList: PropTypes.array.isRequired,
    posts: PropTypes.array.isRequired,
    isFetching: PropTypes.bool.isRequired,
    lastUpdated: PropTypes.number,
    dispatch: PropTypes.func.isRequired
  };

  componentDidMount() {
    const { dispatch, selectedStore } = this.props;
    dispatch(fetchPostsIfNeeded(selectedStore));
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.selectedStore !== this.props.selectedStore) {
      const { dispatch, selectedStore } = nextProps;
      dispatch(fetchPostsIfNeeded(selectedStore));
    }
  }

  handleChange = nextStore => {
    this.props.dispatch(selectStore(nextStore));
  };

  handleRefreshClick = e => {
    e.preventDefault();

    const { dispatch, selectedStore } = this.props;
    dispatch(resetStore(selectedStore));
    dispatch(fetchPostsIfNeeded(selectedStore));
  };
  submitShipment = () => {
    this.props.dispatch(createShipment());
  };

  render() {
    const { selectedStore, posts, isFetching, lastUpdated, nodeList } = this.props;
    const isEmpty = posts.length === 0;
    return (
      <div className="body">
        <Picker
          value={selectedStore}
          onChange={this.handleChange}
          options={nodeList}
        />
        
        <p>
          {lastUpdated && (
            <span>
              Last updated at {new Date(lastUpdated).toLocaleTimeString()}.{" "}
            </span>
          )}
          {!isFetching && (
            <Button onClick={this.handleRefreshClick}>Refresh</Button>
          )}
        </p>
        {isEmpty ? (
          isFetching ? (
            <h2>Loading...</h2>
          ) : (
            <h2>Empty.</h2>
          )
        ) : (
          <div style={{ opacity: isFetching ? 0.5 : 1 }}>
            <Posts posts={posts} />
          </div>
        )}
      </div>
    );
  }
}

const mapStateToProps = state => {
  const { selectedStore, postsByStoreId, nodeList } = state;
  const { isFetching, lastUpdated, items: posts } = postsByStoreId[
    selectedStore
  ] || {
    isFetching: true,
    items: []
  };

  return {
    nodeList,
    selectedStore,
    posts,
    isFetching,
    lastUpdated
  };
};

export default connect(mapStateToProps)(App);
