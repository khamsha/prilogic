import React from 'react'
import PropTypes from 'prop-types'
import {connect} from 'react-redux'

import { Button } from 'reactstrap';
import { Table } from 'reactstrap'
import StarRatingComponent from 'react-star-rating-component'

const Posts = ({posts}) => (
  <Table>
    <thead>
          <tr>
            <th>#</th>
            <th>Store id</th>
            <th>Qty</th>
            <th></th>
            <th></th>
          </tr>
        </thead>
    <tbody>
    {posts.slice(1).map((post, i) =>
      <tr key={i}>
      <th scope="row">{post.transaction}</th>
      <th>{post.storeId}</th>
      <th>{post.qty}</th>
      <th><Button key={i}>Edit</Button></th>
      <th><StarRatingComponent 
          name={"name"+i} 
          starCount={5}
          starColor={"blue"}
        /></th>
      </tr>
    )}
    </tbody>
  </Table>
)

Posts.propTypes = {
  posts: PropTypes.array.isRequired
}

const mapStateToProps = state => ({
  posts: state.posts.items,
});

export default connect(mapStateToProps)(Posts)