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
