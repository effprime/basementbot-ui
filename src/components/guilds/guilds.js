import axios from 'axios';
import { Component } from 'react';
import * as Icon from 'react-bootstrap-icons';
import { ErrorDisplay } from '../error/error';
import { JsonEditor as Editor } from 'jsoneditor-react';
import 'jsoneditor-react/es/editor.min.css';

import './guilds.css';

import React from 'react';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import { Input } from 'reactstrap';

export class GuildDisplay extends Component {
    constructor(props) {
        super(props);
        this.state = {
            guild_data: [],
            error_message: "",
            focused_guild: null,
            config_input: null
        }
    }

    async componentDidMount() {
       await this.setup()
    }

    async setup() {
        const guilds = await this.getGuilds();
        if (guilds === null) {
            this.setState({
                error_message: "Could not retrieve guild data"
            })
            return
        }

        this.setState({
            guild_data: guilds
        })
    }

    async getGuilds() {
        const res = await axios.get(
            `http://${process.env.REACT_APP_API_HOST}:${process.env.REACT_APP_API_PORT}/bot/guild/all`,
            { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
        );

        if (res.status !== 200) {
            return null
        }

        return res.data.payload?.guilds
    }

    async getGuildConfig(guildID) {
        const res = await axios.get(
            `http://${process.env.REACT_APP_API_HOST}:${process.env.REACT_APP_API_PORT}/bot/config/guild/${guildID}`,
            { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
        );

        if (res.status !== 200) {
            return null
        }

        return res.data.payload
    }

    putGuildConfig(guildID, guildConfig) {
        axios.put(
            `http://${process.env.REACT_APP_API_HOST}:${process.env.REACT_APP_API_PORT}/bot/config/guild/${guildID}`,
            guildConfig,
            { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
        ).then(response => {
            alert("Successfully saved config")
        }).catch(error => {
            if (error.response?.status === 401) {
                this.props.setState({ loggedIn: false })
            } else {
                alert("Could not save config")
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
            this.setup();
        }).catch(error => {
            if (error.response?.status === 401) {
                this.props.setState({ loggedIn: false })
            } else {
                alert("Could not leave guild")
            }
        });
    }

    async openModal(guildData) {
        const guildConfig = await this.getGuildConfig(guildData.id)

        if (guildConfig === null) {
            alert("Could not retrieve config for guild")
            return
        }

        this.setState({
            focused_guild: {
                guildData,
                guildConfig
            }
        })

        this.setState({
            config_input: JSON.stringify(guildConfig, null, 2)
        })
    }

    async closeModal() {
        this.setState({
            focused_guild: {}
        })
    }

    async toggleModal() {
        if (this.state.focused_guild !== {}) {
            this.setState({focused_guild: null})
        }
    }

    async submitConfig() {
        const confirm = window.confirm("Confirm saving config (this may break the bot)")
        if (!confirm) {
            return
        }

        let guildConfig = {}
        try {
            guildConfig = JSON.parse(this.state.config_input)
        } catch {
            alert("Data is not valid JSON")
            return
        }

        const guildID = guildConfig.guild_id;
        this.putGuildConfig(guildID, guildConfig)
    }

    render() {
        let guilds = [];
        for (const guild of this.state.guild_data) {
            guilds.push(
                <GuildInfo key={guild.id} data={guild} leave={this.leaveGuild.bind(this)} handleModalOpen={this.openModal.bind(this)}></GuildInfo>
            )
        }

        return (
            <div className="displayDiv">
                <Modal className="configModal" size="lg" isOpen={(this.state.focused_guild !== null)} toggle={this.toggleModal.bind(this)}>
                    <ModalHeader toggle={this.toggleModal.bind(this)}><b>Config for {this.state.focused_guild?.guildData?.name} ({this.state.focused_guild?.guildData?.region})</b></ModalHeader>
                    <ModalBody>
                        <Input className="configTextArea" onChange={e => this.setState({config_input: e.target.value})} value={this.state.config_input} type="textarea" name="text" id="exampleText" />
                    </ModalBody>
                    <ModalFooter>
                        <Button className="modalButton" onClick={() => this.submitConfig()}>Save</Button>
                        <Button className="modalButton" onClick={() => this.openModal(this.state.focused_guild?.guildData)}>Refresh</Button>
                    </ModalFooter>
                </Modal>
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
                <div className="guildOwner">Owned by {props.data.owner}</div>
            </div>

            <div className="guildButtons">
                <Icon.DoorClosedFill color="brown" className="guildButton leaveButton" onClick={() => props.leave(props.data.id)}></Icon.DoorClosedFill>
                <Icon.CloudFill color="pink" className="guildButton configButton" onClick={() => props.handleModalOpen(props.data)}></Icon.CloudFill>
            </div>
        </div>
    )
}