import React, { Component } from "react";
import { Switch, Route, Link } from "react-router-dom";
import { connect } from "react-redux";
import _ from "lodash";

import api from "../../helpers/api";
import { saveUserDetails } from "../../actions/user";

import Header from "../../components/layout/Header";
import Products from "./Products";
import Cart from "./Cart";

class User extends Component {
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
        saveUserDetails(response.data);

        this.setState({ loading: false });

        if (response.data.role !== "user") {
          history.push("/login");
        }
      })
      .catch(() => history.push("/login"))
  }

  render() {

    if (this.state.loading) return (<h2>Loading...</h2>)

    return (
      <div className="user">
        <Header />
        <Switch>
          <Route path="/" component={Products} exact />
          <Route path="/cart" component={Cart} />
          <Route
            render={() => (
              <div>
                <h3>
                  Sorry, page not found (404)
                </h3>
                <br />
                Go to <Link to="/">Home</Link>
              </div>
            )}
          />
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

export default connect(mapStateToProps, mapDispatchToProps)(User);