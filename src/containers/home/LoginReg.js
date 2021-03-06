import React, { Component } from "react";
import { connect } from "react-redux";
import TextField from "@material-ui/core/TextField";
import LinearProgress from "@material-ui/core/LinearProgress";
import Snackbar from "@material-ui/core/Snackbar";
import Alert from "@material-ui/lab/Alert";
import { Redirect } from "react-router-dom";
import FacebookLogin from "react-facebook-login/dist/facebook-login-render-props";
import { GoogleLogin } from "react-google-login";
import cross from "assets/icons/cancel.svg";
import {
  signInStart,
  signUpStart,
  googleSignInStart,
  facebookSignInStart,
  resetErrorMessage,
  resetAll,
} from "../../redux/login_reg/login_reg.actions";
import ForgotPassword from "./ForgotPassword";
import { postData } from "helper/Fetch";

class LoginReg extends Component {
  constructor(props) {
    super(props);

    this.state = {
      currentUser: this.props.currentUser,
      errorMsg: this.props.errorMsg,
      loading: false,
      isLog: true,
      google: true,
      facebook: true,
      error: false,
      suc: false,
      full_name: "",
      email: "",
      password: "",
      com_name: "",
      c_code: "+91",
      reg_email: "",
      reg_pass: "",
      mob_num: "",
      snackbarOpen: false,
      formErrors: "",
      forgot: false,
    };
  }
  handleOnChange = (e) => {
    const {
      target: { value, name },
    } = e;
    this.setState({
      [name]: value,
    });
  };

  //validation code for registration form
  validate = () => {
    let checks = { ...this.state.formErrors };
    const { full_name, reg_email, reg_pass, mob_num, com_name } = this.state;
    checks.full_name = full_name ? "" : "this field is required";
    checks.reg_email = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/i.test(
      reg_email
    )
      ? ""
      : "email is not valid";
    checks.com_name = com_name.length !== 0 ? "" : "this field is required";
    checks.mob_num = mob_num.length > 9 ? "" : "minimum 10 digits required";
    checks.reg_pass = reg_pass.length >= 8 ? "" : "minimum length of 8 characters required";

    this.setState({
      formErrors: { ...checks },
    });
    return Object.values(checks).every((x) => x == "");
  };
  resetFormErrors = () => {
    setTimeout(() => this.setState({ formErrors: {} }), 5000);
  };
  // for login api call
  handleLoginSubmit = async (e) => {
    try {
      e.preventDefault();

      const { email, password } = this.state;
      let data = {
        email,
        password,
      };
      this.setState({ loading: true });

      let res = await postData("/api/login", data);

      if (res.user) {
        this.setState({ loading: false });
        let userDetails = JSON.stringify(res.user);
        localStorage.setItem("currentUser", userDetails);
        window.location.href = "/agency";
      } else {
        if (res.error) {
          this.setState({ loading: false });
          this.setState({ errorMsg: res.error, snackbarOpen: true });
          if (res.error == "Users is Suspended") {
            alert("Users is Suspended , Contact The Admin");
          }
          if (res.error == "username not found") {
            //document.getElementById("email").value = "";
            document.getElementById("password").value = "";
          } else {
            document.getElementById("password").value = "";
          }
        }
      }
    } catch (err) {
      console.log(err);
    }
  };

  // for google signin api call
  responseGoogle = (response) => {
    this.setState({ loading: true });
    this.props.googleSignInStart(response);
  };

  // for facebook signin api call
  responseFacebook = (response) => {
    if (!response.accessToken) {
      this.setState({ facebook: false, loading: false });
    }

    this.setState({ loading: true });
    this.props.facebookSignInStart(response);
  };

  // for registration api call
  handleRegisterSubmit = async (e) => {
    try {
      const { reg_email, reg_pass, full_name, com_name, c_code, mob_num } = this.state;
      let data = {
        user: {
          company_name: com_name,
          email: reg_email,
          password: reg_pass,
          phone_num: mob_num,
          c_code: c_code,
          full_name: full_name,
        },
      };
      if (this.validate()) {
        this.setState({ loading: true });
        let res = await postData("/api/register", data);
        if (res.user) {
          this.setState({ loading: false, isLog: true });
        } else {
          if (res.error) {
            this.setState({ loading: false });
            this.setState({ errorMsg: res.error, snackbarOpen: true });
            if (res.error == "username not found") {
              document.getElementById("email").value = "";
              document.getElementById("password").value = "";
            } else {
              document.getElementById("password").value = "";
            }
          }
        }
      }
    } catch (err) {
      console.log(err);
    }
  };

  // closing the snackbar
  handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    this.setState({ snackbarOpen: false });
  };
  // resetting the states for next attempt
  resetStates = () => {
    setTimeout(() => {
      this.setState({
        ...this.state,
        curentUser: "",
        errorMsg: "",
        successMsg: "",
        full_name: "",
        email: "",
        password: "",
        com_name: "",
        mob_num: "",
        c_code: "+91",
        reg_email: "",
        reg_pass: "",
      });
      this.props.resetErrorMessage();
    }, 3000);
  };
  // shouldComponentUpdate(nextProps, nextState){
  // let shouldUpdate=true;
  // if((nextProps.errorMsg===this.props.errorMsg )){
  //   shouldUpdate=false
  // }
  // return shouldUpdate;
  // }
  //only receive the props when different from previous value
  componentWillReceiveProps(nextProps) {
    if (this.props.currentUser !== nextProps.currentUser) {
      this.setState({
        currentUser: nextProps.currentUser,
        loading: false,
      });
    }
    if (this.props.errorMsg !== nextProps.errorMsg) {
      if (nextProps.errorMsg !== null) {
        if (nextProps.errorMsg.localeCompare("username not found") === 0) {
          console.log("username-password reset", nextProps.errorMsg);
          this.setState(
            { errorMsg: nextProps.errorMsg, loading: false, snackbarOpen: true, email: "", password: "" },
            () => setTimeout(() => this.props.resetErrorMessage(), 1000)
          );
        }
        if (nextProps.errorMsg.localeCompare("Password is incorrect") === 0) {
          console.log("password reset", nextProps.errorMsg);
          this.setState({ errorMsg: nextProps.errorMsg, loading: false, snackbarOpen: true, password: "" });
        }
      } else {
        this.setState(
          {
            errorMsg: nextProps.errorMsg,
            loading: false,
            snackbarOpen: true,
          },
          () => this.resetStates()
        );
      }
    }
    // if (this.props.errorMsg !== nextProps.errorMsg) {
    //      this.setState({
    //         errorMsg: nextProps.errorMsg,
    //         loading:false,
    //         snackbarOpen:true
    //       },()=>this.resetStates());
    // }

    if (this.props.successMsg !== nextProps.successMsg) {
      if (nextProps.successMsg == "signout successful!!") {
        this.setState(
          {
            loading: false,
            isLog: false,
            currentUser: null,
          },
          () => resetAll()
        );
        return;
      }

      this.setState({
        successMsg: nextProps.successMsg,
        loading: false,
        isLog: true,
      });
    }
  }

  handleEnter = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      this.handleLoginSubmit(e);
    }
  };

  render() {
    return (
      <div className="log_reg">
        {this.state.errorMsg ? (
          <Snackbar
            open={this.state.snackbarOpen}
            autoHideDuration={3000}
            onClose={this.handleClose}
            anchorOrigin={{ vertical: "top", horizontal: "center" }}
          >
            <Alert severity="error">{this.state.errorMsg}</Alert>
          </Snackbar>
        ) : null}
        {this.state.successMsg ? (
          <Snackbar
            open={this.state.snackbarOpen}
            autoHideDuration={3000}
            onClose={this.handleClose}
            anchorOrigin={{ vertical: "top", horizontal: "center" }}
          >
            <Alert severity="success">{this.state.successMsg}</Alert>
          </Snackbar>
        ) : null}

        <div className="overlay_home" onClick={this.props.remLogReg} />

        <div className="logReg">
          <div className="login_head">
            <h1>Accute Accountings</h1>
            <img className="gotohomebtn" onClick={this.props.gotohome} src={cross} alt="" />
          </div>
          {
            //on successful login redirect to main
            this.state.currentUser ? <Redirect to="/control-panel" /> : null
          }

          <div className="login_body">
            <div className="or_login">Or</div>

            <div className="login_body_left">
              {this.state.isLog ? (
                this.state.forgot ? (
                  <ForgotPassword forgotReset={() => this.setState({ forgot: false })} />
                ) : (
                  <div className="login_cont" id="log_in_content">
                    <div className="login_cont_head">
                      <h2>Login</h2>
                      <span>
                        New User?{" "}
                        <a id="register_btn_s" onClick={() => this.setState({ email: "", password: "", isLog: false })}>
                          Sign-Up
                        </a>{" "}
                        Instead
                      </span>
                    </div>
                    {this.state.loading ? <LinearProgress color="secondary" /> : null}
                    <form onSubmit={this.handleLoginSubmit} noValidate>
                      <TextField
                        margin="normal"
                        variant="outlined"
                        required
                        fullWidth
                        id="email"
                        label="Enter User Id / E-mail"
                        name="email"
                        value={this.state.email}
                        onChange={this.handleOnChange}
                        autoComplete="new-password"
                        onKeyDown={this.handleEnter}
                        size="small"
                      />

                      <div className="margin"></div>
                      <TextField
                        variant="outlined"
                        margin="normal"
                        required
                        fullWidth
                        name="password"
                        label="Password"
                        type="password"
                        id="password"
                        value={this.state.password}
                        onChange={this.handleOnChange}
                        size="small"
                        onKeyDown={this.handleEnter}
                      />

                      <br />
                      <p className="forget_pass" onClick={() => this.setState({ forgot: true })}>
                        {" "}
                        forgot password?
                      </p>
                      <div className="margin"></div>
                      <button type="submit" className="loginBtn btnbtn">
                        Login
                      </button>
                      <div className="margin"></div>
                    </form>
                  </div>
                )
              ) : (
                <div className="login_cont" id="sign_up_content">
                  <div className="login_cont_head">
                    <h2>Sign Up</h2>
                    <span>
                      Registered User?{" "}
                      <a
                        id="register_btn_s"
                        onClick={() =>
                          this.setState({
                            full_name: "",
                            reg_email: "",
                            reg_pass: "",
                            mob_num: "",
                            com_name: "",
                            isLog: true,
                          })
                        }
                      >
                        Log-In{" "}
                      </a>
                      Instead
                    </span>
                  </div>
                  {this.state.loading ? <LinearProgress color="secondary" /> : null}
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      this.handleRegisterSubmit();
                    }}
                  >
                    <TextField
                      margin="normal"
                      variant="outlined"
                      fullWidth
                      id="full_name"
                      label="Full Name"
                      name="full_name"
                      value={this.state.full_name}
                      onChange={this.handleOnChange}
                      {...(this.state.formErrors.full_name && {
                        error: true,
                        helperText: this.state.formErrors.full_name,
                      })}
                      size="small"
                    />
                    <div className="margin"></div>
                    <TextField
                      margin="normal"
                      variant="outlined"
                      fullWidth
                      id="com_name"
                      label="Company Name"
                      name="com_name"
                      value={this.state.com_name}
                      onChange={this.handleOnChange}
                      {...(this.state.formErrors.com_name && {
                        error: true,
                        helperText: this.state.formErrors.com_name,
                      })}
                      size="small"
                    />
                    <div className="margin"></div>
                    <div id="phone_num_input">
                      <div>
                        <select name="c_code" defaultValue={this.state.c_code} id="c_code" autoComplete="country-code">
                          <option value="+91">+91 </option>
                          <option value="+1">+1</option>
                          <option value="+12">+12 </option>
                          <option value="+55">+55</option>
                        </select>
                      </div>
                      <TextField
                        margin="normal"
                        variant="outlined"
                        fullWidth
                        id="mob_num"
                        label="Mobile No."
                        name="mob_num"
                        value={this.state.mob_num}
                        onChange={this.handleOnChange}
                        {...(this.state.formErrors.mob_num && {
                          error: true,
                          helperText: this.state.formErrors.mob_num,
                        })}
                        size="small"
                      />
                    </div>
                    <div className="margin"></div>
                    <TextField
                      margin="normal"
                      variant="outlined"
                      fullWidth
                      id="email"
                      label="Enter User Id / E-mail"
                      name="reg_email"
                      value={this.state.reg_email}
                      onChange={this.handleOnChange}
                      {...(this.state.formErrors.reg_email && {
                        error: true,
                        helperText: this.state.formErrors.reg_email,
                      })}
                      size="small"
                    />
                    <div className="margin"></div>
                    <TextField
                      margin="normal"
                      variant="outlined"
                      fullWidth
                      name="reg_pass"
                      label="Password"
                      type="password"
                      id="reg_pass"
                      value={this.state.reg_pass}
                      onChange={this.handleOnChange}
                      {...(this.state.formErrors.reg_pass && {
                        error: true,
                        helperText: this.state.formErrors.reg_pass,
                      })}
                      size="small"
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          this.handleRegisterSubmit();
                        }
                      }}
                    />

                    <div>
                      <div className="margin"></div>
                      <a className="forget_pass" href="#">
                        forgot password ?{" "}
                      </a>
                    </div>
                    <div className="margin"></div>
                    <button type="submit" className="loginBtn btnbtn">
                      Register
                    </button>
                    <div className="margin"></div>
                  </form>
                </div>
              )}
            </div>

            <div className="login_body_right">
              <GoogleLogin
                clientId="859167314128-9b2cts4vdhi2m869ar0sqh0i4del5vb4.apps.googleusercontent.com"
                render={(renderProps) => (
                  <button
                    type="button"
                    onClick={renderProps.onClick}
                    disabled={renderProps.disabled}
                    className={this.state.google ? "google_btn socialbtn" : "google_btn socialbtn disabled "}
                  >
                    Continue with Google
                  </button>
                )}
                onSuccess={this.responseGoogle}
                onFailure={() => this.setState({ google: false, loading: false })}
                cookiePolicy={"single_host_origin"}
              />
              <FacebookLogin
                appId="259513308534935"
                autoLoad={false}
                fields="name,email,picture"
                render={(renderProps) => (
                  <button
                    className={this.state.facebook ? "fb_btn socialbtn" : "fb_btn socialbtn disabled "}
                    onClick={renderProps.onClick}
                  >
                    Continue with Facebook
                  </button>
                )}
                callback={this.responseFacebook}
              />
            </div>
          </div>
        </div>
      </div>
    );
  }
}

// loading : state.register.loading,
// islog : state.register.islog,
// errormsg : state.errormsg.errormsg,
// token : state.register.token,
// user : state.login.loggedin,
const mapStateToProps = (state) => ({
  currentUser: state.loginReg.currentUser,
  errorMsg: state.loginReg.errorMsg,
  successMsg: state.loginReg.successMsg,
});

const mapDispatchToProps = (dispatch) => {
  return {
    signInStart: (data) => dispatch(signInStart(data)),
    signUpStart: (data) => dispatch(signUpStart(data)),
    googleSignInStart: (data) => dispatch(googleSignInStart(data)),
    facebookSignInStart: (data) => dispatch(facebookSignInStart(data)),
    resetErrorMessage: () => dispatch(resetErrorMessage()),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(LoginReg);
