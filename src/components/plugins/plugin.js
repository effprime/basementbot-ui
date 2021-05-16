import axios from 'axios';
import { Component } from 'react';
import * as Icon from 'react-bootstrap-icons';
import { ErrorDisplay } from '../error/error';

import './plugin.css';

export class PluginDisplay extends Component {
    constructor(props) {
        super(props);
        this.state = {
            plugin_data: {},
            error_message: ""
        }
        this.loadPlugin = this.loadPlugin.bind(this)
        this.unloadPlugin = this.unloadPlugin.bind(this)
    }

    componentDidMount() {
        this.getPluginStatus();
    }

    loadPlugin(plugin_name) {
        const confirm = window.confirm(`Confirm loading of plugin: ${plugin_name.toUpperCase()}`)
        if (!confirm) {
            return
        }

        axios.get(`http://${process.env.REACT_APP_API_HOST}:${process.env.REACT_APP_API_PORT}/bot/plugin/load/${plugin_name}`, {
            headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
        }).then(_ => {
            this.getPluginStatus();
        }).catch(error => {
            if (error.response?.status === 401) {
                this.props.setState({ loggedIn: false })
            } else {
                alert("Could not load plugin")
            }
        });
    }

    unloadPlugin(plugin_name) {
        const confirm = window.confirm(`Confirm unloading of plugin: ${plugin_name.toUpperCase()}`)
        if (!confirm) {
            return
        }

        axios.get(`http://${process.env.REACT_APP_API_HOST}:${process.env.REACT_APP_API_PORT}/bot/plugin/unload/${plugin_name}`, {
            headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
        }).then(_ => {
            this.getPluginStatus();
        }).catch(error => {
            if (error.response?.status === 401) {
                this.props.setState({ loggedIn: false })
            } else {
                alert("Could not unload plugin")
            }
        });
    }

    getPluginStatus() {
        const token = localStorage.getItem("token");
        axios.get(`http://${process.env.REACT_APP_API_HOST}:${process.env.REACT_APP_API_PORT}/bot/plugin/status`, {
            headers: { Authorization: `Bearer ${token}` }
        }).then(response => {
            if (response.status === 200) {
                this.setState({ plugin_data: response.data.payload });
            } else {
                this.setState({ error_message: "Invalid response from bot" })
            }
        }).catch(error => {
            if (error.response?.status === 401) {
                this.props.setState({ loggedIn: false })
            } else {
                this.setState({ error_message: "Could not retrieve plugin data" })
            }

        });
    }

    render() {
        let plugins = [];
        for (const [plugin_name, status] of Object.entries(this.state.plugin_data)) {
            plugins.push(<PluginInfo key={plugin_name} name={plugin_name} status={status} load={this.loadPlugin.bind(this)} unload={this.unloadPlugin.bind(this)}></PluginInfo>)
        }

        return (
            <div className="displayDiv">
                {!this.state.error_message ? plugins : <ErrorDisplay message={this.state.error_message}></ErrorDisplay>}
            </div>
        )
    }
}

function PluginInfo(props) {
    const icon = props.status === "loaded" ?
    <Icon.CircleFill className="statusIcon" color="green" onClick={() => {props.unload(props.name)}}></Icon.CircleFill> :
    <Icon.CircleFill className="statusIcon" color="red" onClick={() => {props.load(props.name)}}></Icon.CircleFill>

    return (
        <div className="pluginDiv">
            <div className="pluginName">{props.name}</div>
            <div className="loadedIcon">{icon}</div>
        </div>
    )
}