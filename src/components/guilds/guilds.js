import axios from 'axios';
import { Component } from 'react';
import * as Icon from 'react-bootstrap-icons';
import { ErrorDisplay } from '../error/error';

import './guilds.css';

export class GuildDisplay extends Component {
    constructor(props) {
        super(props);
        this.state = {
            guild_data: [],
            error_message: ""
        }
    }

    componentDidMount() {
        this.getGuilds();
    }

    getGuilds() {
        const token = localStorage.getItem("token");
        axios.get(`http://${process.env.REACT_APP_API_HOST}:${process.env.REACT_APP_API_PORT}/bot/guild/all`, {
            headers: { Authorization: `Bearer ${token}` }
        }).then(response => {
            if (response.status === 200) {
                this.setState({ guild_data: response.data.payload?.guilds });
            } else {
                this.setState({ error_message: "Invalid response from bot" })
            }
        }).catch(error => {
            if (error.response?.status === 401) {
                this.props.setState({ loggedIn: false })
            } else {
                this.setState({ error_message: "Could not retrieve guild data" })
            }

        });
    }

    leaveGuild(guildID) {
        const confirm = window.confirm(`Confirm leaving of guild ${guildID}`)
        if (!confirm) {
            return
        }

        axios.get(`http://${process.env.REACT_APP_API_HOST}:${process.env.REACT_APP_API_PORT}/bot/guild/leave/${guildID}`, {
            headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
        }).then(_ => {
            this.getGuilds();
        }).catch(error => {
            if (error.response?.status === 401) {
                this.props.setState({ loggedIn: false })
            } else {
                alert("Could not leave guild")
            }
        });
    }

    render() {
        console.log(this.state.guild_data)
        let guilds = [];
        for (const guild of this.state.guild_data) {
            console.log(guild)
            guilds.push(
                <GuildInfo data={guild} leave={this.leaveGuild.bind(this)}></GuildInfo>
            )
        }

        return (
            <div className="displayDiv">
                {!this.state.error_message ? guilds : <ErrorDisplay message={this.state.error_message}></ErrorDisplay>}
            </div>
        )
    }
}

function GuildInfo(props) {
    return (
        <div className="guildDiv">
            <div className="guildData">
                <div className="guildName"><b>{props.data.name} ({props.data.region})</b></div>
                <div className="guildId">{props.data.id}</div>
                <div className="guildMemberCount">{props.data.members.length} members</div>
                <div className="guildChannelCounts">{props.data.text_channels.length} text channels, {props.data.voice_channels.length} voice channels</div>
            </div>

            <div className="guildButtons">
                <Icon.DoorClosed color="brown" className="leaveButton" onClick={() => props.leave(props.data.id)}></Icon.DoorClosed>
            </div>
        </div>
    )
}