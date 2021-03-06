import React,{useState} from 'react'
import Button from '@material-ui/core/Button';
import LinearProgress from '@material-ui/core/LinearProgress';
import Snackbar from '@material-ui/core/Snackbar';
import Alert from '@material-ui/lab/Alert';
import BankDetail from '../../components/BankDetail'
class BankingDetailsEditForm extends React.Component {

    constructor(props){
        super(props);
        this.state={
            Bank_Details:[
                {
                id:Math.random(),
                Bank_Acc_Num:"",
                Bank_Name:"",
                Bank_Branch:"",
                IIFC_Code:"",
                Remarks:"",
            }],
            loading:false,
            errorMsg:"",
            snackbarOpen:false,
        }
    }
    componentDidMount(){    
        if(this.props.account.Bank_Details&& this.props.account.Bank_Details!==" "){
         this.setState({
             Bank_Details:[...JSON.parse(this.props.account.Bank_Details).map(({ Bank_Acc_Num,
             Bank_Name,
             Bank_Branch,
             IIFC_Code,
             Remarks})=>({
                 id:Math.random(),
                 Bank_Acc_Num,
                 Bank_Name,
                 Bank_Branch,
                 IIFC_Code,
                 Remarks
             }))]
         })
        }else{
            console.log("Bank_Details",this.props.account.Bank_Details)
        }
   } 
   
   saveUpdatedData =  updatedData => {
         return fetch(`/api/accounts/edit?id=${this.props.account.id}` , {
           method : "PUT",
           headers: {
               "Content-Type": "application/json"
           },
           body: JSON.stringify(updatedData)
       }).then(res => res.json())
       .then(parJson => {
           return parJson;
       })
       .catch(error => error)

   }

// closing the snackbar
  handleClose = (event, reason) => {
   if (reason === 'clickaway') {
     return;
   }
   this.setState({snackbarOpen:false});
 };
// handle on change of value in textfields
   handleOnChange= e=>{
       const {target: { value, name }} = e;
       this.setState({
           [name]:value
       })
   }

 // adding more mobile numbers
 addBankAccount=()=>{
       this.setState(prevState=>{
        if(prevState.Bank_Details.length<3){
        return {
           Bank_Details:[...prevState.Bank_Details,{id:Math.random(),Bank_Acc_Num:"",
           Bank_Name:"",
           Bank_Branch:"",
           IIFC_Code:"",
           Remarks:""}]
       }
      }
      return;
    })
 }
 removeBankAccount= (account) =>{
       this.setState(prevState=>({
        Bank_Details:prevState.Bank_Details.filter(ele=>ele.id!==account.id)
       }))
 } 
  handleDetailsChange = (account) => {
    console.log(this.state)
    console.log(account);

       this.setState(prevState=>{
           const updatedDetails = prevState.Bank_Details.map(ele=>{
               if(ele.id===account.id){
                   console.log("matching!")
                   ele={...ele,...account}
                   return ele;
               }
               return ele;
           })
           return {Bank_Details:[...updatedDetails]}
       })
   
  }
 //on form submit ie save changes button click
   handleSaveChanges= async (e)=>{
     
     e.preventDefault();
     //if(this.validate())
     const {Bank_Details} = this.state;
     const updatedData={
      Bank_Details: JSON.stringify(Bank_Details)
     }

     try {
         this.setState({loading:true})
         const savedData= await this.saveUpdatedData(updatedData)
         if(savedData){
           this.setState({loading:false},()=>this.props.resetProfileOnUpdate(savedData))}
        } catch (error) {
         this.setState({loading:false,errorMsg:error},()=>setTimeout(()=>this.props.setOpenEditModal('banking',false),2000))
        }
     
   }
   render(){
    
    const {Bank_Details} = this.state;
    return (
        <div style={{display:"flex", flexDirection:"column",padding:"5px"}}>
            { this.state.loading? (
            <LinearProgress color="secondary" />):null} 
            {this.state.errorMsg?(<Snackbar open={this.state.snackbarOpen} autoHideDuration={3000} onClose={this.handleClose} 
            anchorOrigin={{  vertical: 'top',
            horizontal: 'center'}}>
                <Alert  severity="error">
                   {this.state.errorMsg}
                </Alert>
            </Snackbar>):null} 
            <form onSubmit={this.handleSaveChanges}>
              <div style={{display:"flex",flexDirection:"column"}}>
                  {Bank_Details.map((Bank_Detail, i)=>(
                   
                   <BankDetail key={Bank_Detail.id} index={i} bankDetail={Bank_Detail} addBankAccount={this.addBankAccount} removeBankAccount={this.removeBankAccount} handleDetailsChange={this.handleDetailsChange}/>
                   
                   
                  ))} 

 
                 <div className="buttonGroup"style={{margin:"10px 0", display:"flex", justifyContent:"space-between"}}>
                   <Button variant="outlined" type="submit" color="primary">
                    Save Changes
                   </Button>
                   <Button variant="outlined" type="button"   color="secondary" onClick={()=>this.props.setOpenEditModal(false)}>Cancel</Button>
                 </div>
                </div>
            </form>
            
        </div>
    )
    }
}

export default BankingDetailsEditForm;
