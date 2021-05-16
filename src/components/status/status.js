import { Component } from 'react';
import { ErrorDisplay } from '../error/error';
import axios from 'axios';
import { Col } from 'reactstrap';
import * as Icon from 'react-bootstrap-icons';
import './status.css'

export class StatusDisplay extends Component {

    constructor(props) {
        super(props);
        this.state = {
            bot_data: {},
            error_message: ""
        }
    }

    componentDidMount() {
        this.getBotStatus();
    }

    getBotStatus() {
        const token = localStorage.getItem("token");
        axios.get(`http://${process.env.REACT_APP_API_HOST}:${process.env.REACT_APP_API_PORT}/bot/describe`, {
            headers: { Authorization: `Bearer ${token}` }
        }).then(response => {
            if (response.status === 200) {
                this.setState({ bot_data: response.data.payload });
            } else {
                this.setState({ error_message: "Invalid response from bot" })
            }
        }).catch(error => {
            if (error.response?.status === 401) {
                this.props.setState({ loggedIn: false })
            } else {
                this.setState({ error_message: "Could not retrieve status data" })
            }
        });
    }

    render() {
        console.log(this.state.bot_data)

        let display = (
            <div>
                <StatusInfo name="Startup Time" value={this.state.bot_data.startup_time + " UTC"}></StatusInfo>
                <StatusInfo name="Latency" value={this.state.bot_data.latency*1000 + " ms"}></StatusInfo>
                <StatusInfo name="Logged in as" value={this.state.bot_data.user}></StatusInfo>
                <StatusInfo name="Owner" value={this.state.bot_data.owner}></StatusInfo>
                <StatusInfo name="Guild Cache" value={this.state.bot_data.guilds?.length + " guilds"}></StatusInfo>
                <StatusInfo name="User Cache" value={this.state.bot_data.users?.length + " members"}></StatusInfo>
            </div>
        )

        return (
            <div className="displayDiv">
                {!this.state.error_message ? display : <ErrorDisplay message={this.state.error_message}></ErrorDisplay>}
            </div>
        )
    }
}

function StatusInfo(props) {
    return (
        <div className="statusDiv">
            <div className="infoKeyHeader">
                {props.name}
            </div>
            <div className="infoValue">
                {props.value}
            </div>
        </div>
    )
}