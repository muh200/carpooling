import React, { Component } from 'react';
import 'ol/ol.css';
import {Map} from 'ol';
import './map.css'
import MapContext from './mapContext';

class MapComponent extends Component {

    constructor(props) {
        super(props);
        this.mapRef = React.createRef();
        this.map = new Map(this.props.options);
        this.state = {};
    }

    componentDidMount() {
        this.map.setTarget(this.mapRef.current);
    }

    componentWillUnmount() {
        this.map.unset('target', true);
    }

    render() {
        return (
            <MapContext.Provider value={this.map}>
                <div id="map" ref={this.mapRef}>
                    {this.props.children}
                </div>
            </MapContext.Provider>
        );
    }
}

export default MapComponent;
