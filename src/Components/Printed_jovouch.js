import React from 'react'

export default class Printed_joVouch extends React.Component{

    constructor(props){
        super(props)

        fetch(`/api/jovouch/printedBill/${this.props.jobill_num}`)
        .then((res) => res.json())
        .then((data) => {
            if(data){
                this.setState(() => {
                    return{
                        id : data.jovouch.id,
                        billArr : data.jovouch.billArr,
                        credit_acc : data.jovouch.credit_acc,
                        debit_acc : data.jovouch.debit_acc,
                        amount : data.jovouch.amount,
                        bill_date : data.jovouch.bill_date,
                        provouch : data.provouch
                    }
                })
            }
        })

        this.state = {
            id : null,
            billArr : null,
            credit_acc : null,
            debit_acc : null,
            amount : null,
            bill_date : null,
            provouch : []
        }
    }
    render(){

        return(

        <div className = "print">
        <div className = "for_print_jovouch">
          <div className = "print_upper_jo">
                <div className = "upper_lefter">
                  <div className = "upper_num">
                    <span className = "jovouch_left_q">Original</span>
                  </div>
                  <div>
                    <span className = "jovouch_left_q">Rs.</span>
                    <span className = "jovouch_upper_right">31500</span>
                  </div>
              </div>
              <div className = "upper_lefter">
                  <div className = "upper_num">
                    <span className = "jovouch_left_q">No.</span>
                    <span className = "jovouch_upper_right">{this.state.id}</span>
                  </div>
                  <div>
                    <span className = "jovouch_left_q">Dated</span>
                    <span className = "jovouch_upper_right">2020/04/06</span>
                </div>
              </div>
          </div>
              <div className = "upper_entry_print">
                <span className = "jovouch_left_q">Received with thanks from M/s.</span>
                <span className = "jovouch_right_q">{this.state.debit_acc}</span>
              </div>
              <div className = "upper_entry_print">
                <span className = "jovouch_left_q">The sum of Rs.</span>
                <span className = "jovouch_right_q">{this.state.amount} </span>
              </div>
              <div className = "upper_entry_print">
                <span className = "jovouch_left_q">By Check/Draft No.</span>
                <span className = "jovouch_right_pay">45454</span>
                <span className = "jovouch_left_q">Date</span>
                <span className = "jovouch_right_pay">{this.state.bill_date}</span>
                <span className = "jovouch_left_q">of</span>
                <span className = "jovouch_right_pay"></span>
                <span className = "jovouch_left_q">on</span>
                <span className = "jovouch_right_pay"></span>
              </div>
              <div className = "upper_entry_print">
                <span className = "jovouch_left_q">part/full on A/c of M/s</span>
                <span className = "jovouch_right_q">{this.state.credit_acc} </span>
              </div>
              <div className = "print_table_jo" >
                <table >
                  <thead>
                    <tr>
                      <th>S.No.</th>
                      <th>Date</th>
                     
                      <th>Bill No.</th>
                      <th>Total</th>
                      <th>Draft</th>
                      <th className = "last_col"></th>
                     
                    </tr>
                  </thead>
                  <tbody>
                  {this.state.provouch ?( 
                      this.state.provouch.map((e,i) => {
                        <tr>
                            <td> i + 1</td>
                            <td >{this.state.bill_date} </td>
                            <td>{e.bill_num} </td>
                            <td> {this.state.amount} </td>
                            <td > </td> 
                            <td className = "last_col"> </td>
                         </tr>
                      })
                 ) : (
                      <tr>
                    <td> 1</td>
                    <td >{this.state.bill_date} </td>
                    <td>{ this.state.billArr && this.state.billArr.join(" , ")} </td>
                    <td> {this.state.amount} </td>
                    <td > </td> 
                    <td className = "last_col"> </td>
                  </tr>)}
                 

                <tr>
                <td> </td>
                <td > </td>
                <td> </td>
                <td > </td>
                <td> </td>
                <td className = "last_col"> </td>
                
              </tr>

              <tr>
              <td> </td>
              <td > </td>
              <td> </td>
              <td > </td>
              <td> </td>
              <td className = "last_col"> </td>
             
            </tr>

            <tr>
            <td> </td>
            <td > </td>
            <td> </td>
            <td > </td>
            <td> </td>
            <td className = "last_col"> </td>
           
          </tr>




            </tbody>
          </table>
        </div>
        </div>


        <div className = "for_print_jovouch">
             <div className = "print_upper_jo">
                <div className = "upper_lefter">
                     <div className = "upper_num">
                        <span className = "jovouch_left_q">Duplicate</span>
                    </div>
                <div>
                  <span className = "jovouch_left_q">Rs.</span>
                  <span className = "jovouch_upper_right">31500</span>
                </div>
            </div>
                <div className = "upper_lefter">
                    <div className = "upper_num">
                    <span className = "jovouch_left_q">No.</span>
                    <span className = "jovouch_upper_right">{this.state.id}</span>
                    </div>
                <div>
                  <span className = "jovouch_left_q">Dated</span>
                  <span className = "jovouch_upper_right">2020/04/06</span>
              </div>
            </div>
            </div>
                <div className = "upper_entry_print">
                <span className = "jovouch_left_q">Received with thanks from M/s.</span>
                <span className = "jovouch_right_q">{this.state.debit_acc}</span>
                </div>
                <div className = "upper_entry_print">
                <span className = "jovouch_left_q">The sum of Rs.</span>
                <span className = "jovouch_right_q">{this.state.amount} </span>
                </div>
                <div className = "upper_entry_print">
                <span className = "jovouch_left_q">By Check/Draft No.</span>
                <span className = "jovouch_right_pay">45454</span>
                <span className = "jovouch_left_q">Date</span>
                <span className = "jovouch_right_pay">{this.state.bill_date}</span>
                <span className = "jovouch_left_q">of</span>
                <span className = "jovouch_right_pay"></span>
                <span className = "jovouch_left_q">on</span>
                <span className = "jovouch_right_pay"></span>
                </div>
                <div className = "upper_entry_print">
                <span className = "jovouch_left_q">part/full on A/c of M/s</span>
                <span className = "jovouch_right_q">{this.state.credit_acc} </span>
                </div>
                <div className = "print_table_jo" >
                <table >
                    <thead>
                    <tr>
                        <th>S.No.</th>
                        <th>Date</th>
                    
                        <th>Bill No.</th>
                        <th>Total</th>
                        <th>Draft</th>
                        <th className = "last_col"></th>
                    
                    </tr>
                    </thead>
                    <tbody>
                    <tr>
                    <td> 1</td>
                    <td >{this.state.bill_date} </td>
                    <td>{ this.state.billArr && this.state.billArr.join(" , ")} </td>
                    <td> {this.state.amount} </td>
                    <td > </td> 
                    <td className = "last_col"> </td>
                </tr>

                <tr>
                <td> </td>
                <td > </td>
                <td> </td>
                <td > </td>
                <td> </td>
                <td className = "last_col"> </td>
                
                </tr>

                <tr>
                <td> </td>
                <td > </td>
                <td> </td>
                <td > </td>
                <td> </td>
                <td className = "last_col"> </td>
            
            </tr>

            <tr>
            <td> </td>
            <td > </td>
            <td> </td>
            <td > </td>
            <td> </td>
            <td className = "last_col"> </td>
            
            </tr>




            </tbody>
            </table>
        </div>
        </div>
        </div>
      
        )
    }
}