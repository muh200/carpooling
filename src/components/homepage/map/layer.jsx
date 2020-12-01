import React, { Component } from 'react';
import VectorLayer from 'ol/layer/Vector';
import MapContext from './mapContext';

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
        map.on('click', event => {
            this.layer.getFeatures(event.pixel).then(features => {
                // If you want to do something when a pin is pressed, you can
                // write your code here.
                for (const f of features) {
                    // print out the username of the user at the pin
                    console.log(f.get('name'));
                }
            });
        });
    }

    componentWillUnmount() {
        this.props.map.removeLayer(this.layer);
    }

    render() {
        this.layer.setProperties(this.props.options);
        return null;
    }
}

export default VectorLayerComponent;
