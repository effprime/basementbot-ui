import {Component} from 'react';
import axios from 'axios';
import { ErrorDisplay } from '../error/error';
import { Button } from 'reactstrap';
import './echo.css';

export class EchoDisplay extends Component {
    constructor(props) {
        super(props);
        this.state = {
            type: "channel",
            id: null,
            message: "",
            error_message: ""
        }
    }

    echo() {
        if (this.state.type === "channel") {
            this.echoChannel(this.state.id, this.state.message)
        } else {
            this.echoUser(this.state.id, this.state.message)
        }
    }

    echoUser(userID, message) {
        axios.post(
            `http://${process.env.REACT_APP_API_HOST}:${process.env.REACT_APP_API_PORT}/bot/echo/user`,
            { "user_id": userID, message },
            { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
        ).then(response => {
            if (response.status === 200) {
                alert("Message sent to user")
            }
        }).catch(error => {
            if (error.response?.status === 401) {
                this.props.setState({ loggedIn: false })
            } else {
                alert("Could not send message")
            }
        })
    }

    echoChannel(channelID, message) {
        axios.post(
            `http://${process.env.REACT_APP_API_HOST}:${process.env.REACT_APP_API_PORT}/bot/echo/channel`,
            { "channel_id": channelID, message },
            { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
        ).then(response => {
            if (response.status === 200) {
                alert("Message sent to channel")
            }
        }).catch(error => {
            if (error.response?.status === 401) {
                this.props.setState({ loggedIn: false })
            } else {
                alert("Could not send message")
            }
        })
    }

    handleTypeChange(event) {
        this.setState({
            type: event.target.value
        })
    }

    handleIDChange(event) {
        this.setState({
            id: event.target.value
        })
    }

    handleMessageChange(event) {
        this.setState({
            message: event.target.value
        })
    }

    render() {
        return (
            <div className="displayDiv">
                {this.state.error_message ? <ErrorDisplay message={this.state.error_message}></ErrorDisplay> :
            
                <div className="tool">
                    <div className="toolHeader">Send Message</div>
                    <div className="echoTypeDropdownWrapper">
                        <select className="echoTypeDropdown" value={this.state.type} onChange={this.handleTypeChange.bind(this)}>
                            <option value="channel">Channel</option>
                            <option value="user">User</option>
                        </select>
                    </div>

                    <div className="idInputWrapper">
                        <input type="text" className="idInput" placeholder={`Enter ${this.state.type} ID`} onChange={this.handleIDChange.bind(this)}></input>
                    </div>
                    <div className="messageInputWrapper">
                        <textarea className="messageInput" placeholder="Enter message" onChange={this.handleMessageChange.bind(this)}></textarea>
                    </div>

                    <Button className="sendButton" onClick={() => this.echo()}>Send</Button>
                </div>
                }

            </div>
        )
    }
}