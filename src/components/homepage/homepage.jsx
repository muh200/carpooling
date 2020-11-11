import React, { Component } from 'react';
import MapComponent from './map/map'
import {View} from 'ol';
import TileLayer from 'ol/layer/Tile';
import OSM from 'ol/source/OSM';

class Homepage extends Component {

    constructor(props) {
        super(props);
        this.state = {};
    }

    render() {
        const mapOptions = {
            layers: [
                new TileLayer({
                    source: new OSM()
                })
            ],
            view: new View({
                center: [0, 0],
                zoom: 0
            })
        };
        return (
            <MapComponent options={mapOptions}/>
        );
    }
}

export default Homepage;
