import React from "react";
import { connect } from "react-redux";
import { Redirect } from "react-router-dom";
import { signOutStart, resetErrorMessage, resetAll } from "../../redux/login_reg/login_reg.actions";
import MenuBtn from "assets/icons/menu.svg";
// import help from './../img/info.svg'
// import settings from './../img/settings.svg'
import arrow from "assets/icons/multimedia.svg";
import { Link } from "react-router-dom";

class TopBar extends React.Component {
  logout() {
    fetch("/api/login", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
    })
      .then(() => {
        this.props.resetAll();
        window.location.href = "/home";
      })
      .catch((error) => {
        alert(error);
      });
  }
  getName() {
    fetch("/api/profile/name", {
      method: "get",
      headers: { "Content-Type": "application/json" },
    })
      .then((r) => r.json())
      .then((data) => {
        if (data.error) {
          if (data.error === "not loged in") {
            window.location.href = "/home";
          }
        }
        if (data.name) {
          this.setState(() => {
            return {
              name: data.name,
            };
          });
        }
      })
      .catch((error) => {
        alert(error);
      });
  }

  componentDidMount() {
    // let ison = false;
    // let pro_btn = document.getElementsByClassName("profile_btn")[0];
    // let pro_drop = document.getElementsByClassName("profile_drop_down")[0];
    // let ar = document.getElementById("arrow");
    // pro_btn.addEventListener("click", () => {
    //   if (ison) {
    //     pro_drop.style.display = "none";
    //     ar.style.transform = "rotateZ(0deg)";
    //     ison = false;
    //   } else {
    //     pro_drop.style.display = "block";
    //     ar.style.transform = "rotateZ(180deg)";
    //     ison = true;
    //   }
    // });
    console.log(this.props);
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.errorMsg !== nextProps.errorMsg) {
      this.setState(
        {
          errorMsg: nextProps.errorMsg,
        },
        () => {
          alert(this.state.errorMsg);
        }
      );
    }
    // if (this.props.successMsg !== nextProps.successMsg ) {
    //   if(nextProps.successMsg=="signout successful!!"){
    //     this.setState({successMsg:nextProps.successMsg});
    //   }
    // this.setState({
    //   name:"",
    //   errorMsg:""
    // },()=>{
    //   this.resetPage()

    // });
  }

  // }
  // componentWillUnmount(){
  //   this.props.resetAll();
  // }

  constructor(props) {
    super(props);
    this.state = {
      name: "",
      errorMsg: "",
      successMsg: "",
    };
    this.getName();
  }
  render() {
    console.log(this.props);
    let margin = {
      marginBottom: "50px",
    };

    return (
      <>
        {this.state.successMsg ? (
          <Redirect to="/home" />
        ) : (
          <div className="top_bar" style={margin}>
            <img className="menu_btn" src={MenuBtn} alt="" />

            <li className="top_btns profile_btn">
              Hello, {this.state.name}{" "}
              <span>
                <img id="arrow" src={arrow} alt="?" />
              </span>{" "}
              <div className="profile_drop_down">
                <div>
                  <Link to="/agency/my-profile">
                    <li>User Profile</li>
                  </Link>
                  <li>Company Profile</li>
                  <li>Subscriptions & Billings</li>
                  <li>Manage Users</li>
                </div>
                <div id="pro_drop_lower">
                  <li>Support</li>
                  <li>Settings</li>
                  <li>Privacy Policy</li>
                  <li onClick={() => this.logout()}>Sign Out</li>
                </div>
              </div>
            </li>

            {/* <li className="top_btns help_btn" onClick={this.logout}><span><img src={help} alt="?" /></span> Help</li>
                <li className="top_btns settings_btn"> <span><img src={settings} alt="" /></span> Settings</li> */}
          </div>
        )}
      </>
    );
  }
}

TopBar.defaultProps = {
  margin: "5px",
};

const mapStateToProps = (state) => ({
  errorMsg: state.loginReg.errorMsg,
  successMsg: state.loginReg.successMsg,
  currentUser: state.loginReg.currentUser,
});
const mapDispatchToProps = (dispatch) => {
  return {
    signOutStart: () => dispatch(signOutStart()),
    resetErrorMessage: () => dispatch(resetErrorMessage()),
    resetAll: () => dispatch(resetAll()),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(TopBar);
