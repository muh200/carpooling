import React, { Component } from 'react';
import VectorLayer from 'ol/layer/Vector';
import MapContext from './mapContext';
import { ToastContainer, toast, Slide } from 'react-toastify';

class VectorLayerComponent extends Component {

    static contextType = MapContext;

    constructor(props) {
        super(props);
        this.layer = new VectorLayer(this.props.options);
        this.state = {};
    }

    componentDidMount() {
        const map = this.context;
        map.addLayer(this.layer);
        if (!this.props.isDriver) {
            map.on('click', event => {
                this.layer.getFeatures(event.pixel).then(features => {
                    // If you want to do something when a pin is pressed, you can
                    // write your code here.
                    if (features.length > 0) {
                        const username = features[0].get('name');
                        toast("You have just requested a ride!");
                        notify(username, {});
                    }
                });
            });
        }
    }

    componentWillUnmount() {
        this.props.map.removeLayer(this.layer);
    }

    render() {
        this.layer.setProperties(this.props.options);
        return null;
    }
}

async function notify(username, message) {
    await fetch('/notifications', {
        method: 'POST',
        body: JSON.stringify({ username, message }),
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        }
    });
}

export default VectorLayerComponent;
