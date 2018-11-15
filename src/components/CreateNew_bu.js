import React, { Component } from "react";
import { connect } from "react-redux";
import { Button, Form, FormGroup, Label, Input } from "reactstrap";

import { createShipment} from "../actions";

class CreateNew extends Component {
  submitShipment = (storeNb, qty) => {
    this.props.dispatch(createShipment(storeNb, qty));
  };

  render() {
    const { nodeList, storeNb, qty } = this.props;
      return (
      <div>
        <Form>
          <FormGroup>
            <Label>Create shipment</Label>
            <Input type="select" value={storeNb}>
            {nodeList.slice(1).map((node) =>
            <option key={node}>{node}</option>)}
            </Input>
            <Input type="number" value={qty} placeholder="enter qty of prilogs"/>
          </FormGroup>
          <Button onClick={this.submitShipment(storeNb, qty)}>Submit</Button>
        </Form>
      </div>
    );
  }
}
const mapStateToProps = state => ({
  nodeList: state.nodeList
});

export default connect(mapStateToProps)(CreateNew);
