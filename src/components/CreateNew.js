import React, { Component } from "react";
import { connect } from "react-redux";
import { Button, Form, FormGroup, Label, Input } from "reactstrap";

import { createShipment} from "../actions";

class CreateNew extends Component {

  render() {
    const { nodeList } = this.props;
    return (
      <div>
        <Form onSubmit={this.props.submitShipment}>
          <FormGroup>
            <Label>Create shipment</Label>
            <Input id="storeNb" type="select" value={this.props.storeNb}>
            {nodeList.slice(1).map((node) =>
            <option key={node}>{node}</option>)}
            </Input>
            <Input id="qty" type="number" placeholder="enter qty of prilogs" value ={this.props.qty}/>
          </FormGroup>
          <Button type="submit">Submit</Button>
        </Form>
      </div>
    );
  }
}
const mapStateToProps = state => ({
  nodeList: state.nodeList,
});

export function mapDispatchToProps(dispatch) {
  return {
    submitShipment: (event) => {
      dispatch(createShipment(event.target.storeNb.value, event.target.qty.value));
    },
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(CreateNew);
