import React from 'react'
import TaskManager from 'containers/main/TaskManager'
import AgencyPage from 'containers/main/AgencyPage';
import Inventory from 'containers/main/Inventory'

export default class Agency extends React.Component{

    handleMode = (mode) => {
        this.setState(() => {
            return{
                mode : mode
            }
        })
    }

    constructor(props){
        super(props)

        this.state = {
            mode : 'invoice'
        }
    }
    render(){
    return(
        <div className = "agency">
            <button className="initial-buttons" onClick = {() => {
                this.handleMode('invoice')
            }}>Invoice</button>
            <button className="initial-buttons" onClick = {() => {
                this.handleMode('task')
            }}>Task Mangaer</button>

            {this.state.mode == 'invoice' && (
                <AgencyPage />
            )}
            {this.state.mode == 'task' && (
                <div className = "tk_invt">
                    <Inventory />
                    <br />
                    <br />
                    <TaskManager />
                </div>
            )}
            
        </div>
    )
    }
}