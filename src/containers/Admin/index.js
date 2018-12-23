import React, { Component } from "react";
import { Switch, Route, Redirect } from "react-router-dom";
import { connect } from "react-redux";
import _ from "lodash";

import api from "../../helpers/api";
import { saveUserDetails } from "../../actions/user";

import Header from "../../components/layout/AdminHeader";
import Products from "./Products";
import Categories from "./Categories";
import Users from "./Users";
import Orders from "./Orders";

class Admin extends Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: true
    };
  }

  componentDidMount() {
    const { saveUserDetails, history } = this.props;

    api()
      .get(`/user`)
      .then((response) => {
        if (response.status === 200) {
          this.setState({ loading: false });
          saveUserDetails(response.data)
          if (response.data.role !== "admin") {
            history.push("/login");
          }
          return;
        }
        history.push("/login");
      })
      .catch((error) => history.push("/login"))
  }

  render() {

    if (this.state.loading) return (<h2>Loading...</h2>)

    return (
      <div className="admin">
        <Header />
        <Switch>
          <Route path="/admin/categories" component={Categories} />
          <Route path="/admin/products" component={Products} />
          <Route path="/admin/orders" component={Orders} />
          <Route path="/admin/users" component={Users} />
          <Redirect to="/admin/categories" />
        </Switch>
      </div>
    )
  }
}

const mapStateToProps = (state) => ({
  token: _.get(state, "auth.data.token")
})

const mapDispatchToProps = (dispatch) => ({
  saveUserDetails: (payload) => dispatch(saveUserDetails(payload))
})

export default connect(mapStateToProps, mapDispatchToProps)(Admin);