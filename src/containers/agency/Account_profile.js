import React from "react";
import user from "assets/icons/user.svg";
import pencil from "assets/icons/pencil.svg";
import back from "assets/icons/camera-back.svg";
import Ledger from "containers/agency/Ledger_Account";
import Report_pro from "containers/agency/Report_Acc_pro";
import {Link} from 'react-router-dom'

export default class Account_pro extends React.Component {
  totalDebit = () => {
    let t = 0;

    this.state.bal.map(e => {
      if (e.supplier === this.state.account.acc_name) {
        t = parseInt(t) + parseInt(e.totalAmt);
      } else if (e.debit_acc === this.state.account.acc_name) {
        t = parseInt(t) + parseInt(e.amount) - parseInt(e.balance);
      }
    });

    return t;
  };

  totalCredit = () => {
    let t = 0;

    this.state.bal.map(e => {
      if (e.customer === this.state.account.acc_name) {
        t = parseInt(t) + parseInt(e.totalAmt);
      } else if (e.credit_acc === this.state.account.acc_name) {
        t = parseInt(t) + parseInt(e.amount) - parseInt(e.balance);
      }
    });

    return t;
  };

  getDet = async () => {
    let start_date = await document.getElementById("ledger_date_start").value;
    let end_date = await document.getElementById("ledger_date_end").value;
    let mode = await document.getElementById("filter_op");

    if (!start_date && !end_date && mode.value) {
      let sdate = "2020-03-01";
      let edate = "2021-04-01";
      await fetch(`/api/vouch/specific/${this.state.account.acc_name}?sdate=${sdate}&edate=${edate}&mode=${mode.value}`)
        .then(res => res.json())
        .then(data => {
          if (data) {
            this.setState(() => {
              return {
                temp_det2: data,
                details: data,
                bal: data
              };
            });
          }
        });
    }

    if (start_date && end_date) {
      await fetch(
        `/api/vouch/specific/${this.state.account.acc_name}?sdate=${start_date}&edate=${end_date}&mode=${mode.value}`
      )
        .then(res => res.json())
        .then(data => {
          if (data) {
            this.setState(() => {
              return {
                details: data,
                bal: data
              };
            });
          }
        });
    }
  };

  acc_pro_val = (ans) => {
    this.setState(() => {
      return {
        val : ans
      }
    })
  }

  clearall = () => {
    document.getElementById("ledger_date_start").value = null;
    document.getElementById("ledger_date_end").value = null;
    document.getElementById("search_filters").value = null;
    let date = new Date();
    let year = date.getFullYear();

    let sdate = year + "-03-01";
    let edate = parseInt(year) + 1 + "-04-01";
    fetch(`/api/vouch/specific/${this.state.account.acc_name}?sdate=${sdate}&edate=${edate}`)
      .then(res => res.json())
      .then(data => {
        if (data) {
          this.setState(() => {
            return {
              temp_det2: data,
              details: data,
              bal: data
            };
          });
        }
      });
  };

  handleradio = val => {
    this.setState(() => {
      return {
        filter: val
      };
    });
  };

  filter_al = () => {
    let data = document.getElementById("search_filters").value;

    data = data.toLowerCase();

    let fPro = this.state.temp_det2.filter(e => {
      if (data === "") {
        return true;
      } else if (
        e.customer != null &&
        e.customer.toLowerCase().indexOf(data) === -1 &&
        e.supplier.toLowerCase().indexOf(data) === -1 &&
        e.bill_num.indexOf(data) === -1
      ) {
        return false;
      } else if (
        e.credit_acc &&
        e.credit_acc.toLowerCase().indexOf(data) === -1 &&
        e.debit_acc.toLowerCase().indexOf(data) === -1 &&
        e.billArr.join("").indexOf(data) === -1
      ) {
        return false;
      } else {
        return true;
      }
    });

    this.setState(() => {
      return {
        details: fPro
      };
    });
  };

  recent_entry = () => {
    
    let date = new Date();
    let year = date.getFullYear();

    let sdate = year + "-03-01";
    let edate = parseInt(year) + 1 + "-04-01";
    
    fetch(`/api/vouch/specific/${this.state.account.acc_name}?sdate=${sdate}&edate=${edate}`)
      .then(res => res.json())
      .then(data => {
        if (data) {
          this.setState(() => {
            return {
              temp_det2: data,
              details: data,
              bal: data
            };
          });
        }
      });
  }

  constructor(props) {
    super(props);

    this.state = {
      details: [],
      filter: null,
      bal: [],
      temp_det2: [],
      account : null,
      val : "acc_det"
    };
  }

   componentDidMount(){

    const { id } = this.props.match.params;
    
    fetch(`/api/accounts/specific?id=${id}`)
    .then(res => res.json())
    .then((data) => {
      this.setState(() => {
        return{ 
          account : data
        }
      })
      this.recent_entry()
    })
  
   }

  render() {
    return (
      <div>
        <div className="acc_highest">
          <div className="acc_pro_location">
            <Link to = "/agency/accountings">
              <img src={back}/>
            </Link>
            accounting / accounts / account profile
          </div>
        </div>
        {this.state.account && 
        <div className="acc_pro_body">
          <div className="acc_pro_sbar">
            <div className="acc_pro_img">
              <img alt=" " src={user} id="acc_pro_img_id" />
            </div>
            <div className="acc_pro_name">{this.state.account.acc_real_name}</div> 
            <div className="sbar_list" id="sbar_list">
              <div
                className={this.props.acc_pro_val === "acc_det" ? "acc_det" : "sbar_list_value"}
                onClick={() => {
                  this.acc_pro_val("acc_det");
                }}
              >
                Account Details
              </div>
              <div
                className={this.props.acc_pro_val === "ledger" ? "acc_det" : "sbar_list_value"}
                onClick={() => {
                  this.acc_pro_val("ledger");
                }}
                id="ledger"
              >
                Ledger
              </div>
              <div
                className={this.props.acc_pro_val === "reports" ? "acc_det" : "sbar_list_value"}
                onClick={() => this.acc_pro_val("reports")}
                id="reports"
              >
                Reports
              </div>
            </div>
          </div>

          {this.state.val === "acc_det" && (
            <div className="acc_pro_right">
              <div className="acc_pro_right_upper">
                <div className="acc_pro_right_name">
                  {this.state.account.acc_real_name}
                  <span className="acc_pro_right_pname">({this.state.account.print_name})</span>
                </div>
                <div className="acc_pro_right_add">{this.state.account.address_line1}</div>
              </div>
              <div className="acc_pro_right_lower">
                <div className="acc_pro_right_heading">
                  <div>BASIC DETAILS</div>
                  <div className="acc_pro_right_edit">
                    <img src={pencil} />
                  </div>
                </div>
                <div className="acc_pro_right_details">
                  <div className="acc_pro_detail_heading">
                    <span>Phone</span>
                    <br />
                    <span className="acc_pro_details_value">
                      {this.state.account.mob_num}

                      <span className="acc_pro_details_bvalue">(Mobile)</span>
                    </span>
                    <span className="acc_pro_details_value">
                      {this.state.account.phone_num}

                      <span className="acc_pro_details_bvalue">(Office)</span>
                    </span>
                  </div>
                  <div className="acc_pro_detail_heading">
                    <span>Email</span>
                    <br />
                    <span className="acc_pro_details_value">{this.state.account.emailId}</span>
                  </div>
                  <div className="acc_pro_detail_last">
                    <div className="acc_pro_detail_heading">
                      Pan No.
                      <br />
                      <span className="acc_pro_details_value">{this.state.account.pan_num}</span>
                    </div>
                    <div className="acc_pro_detail_heading">
                      GST No.
                      <br />
                      <span className="acc_pro_details_value">{this.state.account.gst_num}</span>
                    </div>
                    <div className="acc_pro_detail_heading">
                      Adhaar No.
                      <br />
                      <span className="acc_pro_details_value">{this.state.account.aadhar_num}</span>
                    </div>
                  </div>
                </div>
                <div>
                  <div className="right_lower_heading">BANKING DETAILS</div>
                  <div className="acc_pro_detail_last_lowr">
                    <div className="acc_pro_detail_heading">
                      Account No.
                      <br />
                      <span className="acc_pro_details_value" />
                    </div>
                    <div className="acc_pro_detail_heading">
                      Bank Name , Branch
                      <br />
                      <span className="acc_pro_details_value">State Bnak of India , karnal haryana</span>
                    </div>
                    <div className="acc_pro_detail_heading">
                      IIFC Code
                      <br />
                      <span className="acc_pro_details_value">BTVPN9211R</span>
                    </div>
                    <div className="acc_pro_detail_heading">
                      Remarks
                      <br />
                      <span className="acc_pro_details_value">BTVPN9211R</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {this.state.val === "ledger" && (
            <Ledger
              account={this.state.account}
              getDet={this.getDet}
              clearall={this.clearall}
              details={this.state.details}
              det2={this.state.det2}
              handleradio={this.handleradio}
              handleSearch={this.handleSearch}
              det3={this.state.det3}
              totalDebit={this.totalDebit}
              totalCredit={this.totalCredit}
              filter_al={this.filter_al}
            />
          )}

          {this.state.val === "reports" && <Report_pro acc_name={this.state.account.acc_name} />}
        </div>
  }
      </div>
    );
  }
}
