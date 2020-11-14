import React, { Component } from 'react';
import MapComponent from './map/map'
import {View} from 'ol';
import TileLayer from 'ol/layer/Tile';
import VectorLayer from 'ol/layer/Vector';
import OSM from 'ol/source/OSM';
import Feature from 'ol/Feature';
import {fromLonLat} from 'ol/proj';
import Point from 'ol/geom/Point';
import VectorLayerComponent from './map/layer';
import VectorSource from 'ol/source/Vector';

class Homepage extends Component {

    constructor(props) {
        super(props);
        this.state = {
            nearbyPins: [],
            isDriver: false,
            currentLocation: {
                latitude: 0,
                longitude: 0,
            },
        };
    }

    componentDidMount() {
        // Look for nearby drivers on an interval.
        this.queryIntervalID = window.setInterval(route => {
            fetch(route + '?' + new URLSearchParams(this.state.currentLocation).toString(), {
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
            })
            .then(response => {
                if (!response.ok) {
                    return response.json().then(data => {
                        throw new Error(data.error);
                    });
                }
                return response;
            })
            .then(response => response.json())
            .then(data => this.setState({ nearbyPins: data }))
            .catch(console.error)
        }, 5000, '/drivers');

        // Update your current location.
        this.locationWatchID = navigator.geolocation.watchPosition(position => {
            this.setState({
                currentLocation: {
                    latitude: position.coords.latitude,
                    longitude: position.coords.longitude,
                }
            });
            fetch('/riders', {
                method: "POST",
                body: JSON.stringify({
                    latitude: position.coords.latitude,
                    longitude: position.coords.longitude,
                }),
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                }
            })
            .then(response => {
                if (!response.ok) {
                    return response.json().then(data => {
                        throw new Error(data.error);
                    });
                }
                return response;
            })
            .catch(console.error);
        }, console.error, { maximumAge: 5000 });
    }

    componentWillUnmount() {
        navigator.geolocation.clearWatch(this.locationWatchID);
        // unregister yourself as a rider
        fetch('/riders', {
            method: "DELETE",
            body: JSON.stringify({}),
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        })
        .then(response => {
            if (!response.ok) {
                return response.json().then(data => {
                    throw new Error(data.error);
                });
            }
            return response;
        })
        .catch(console.error);
        window.clearInterval(this.queryIntervalID);

        window.clearInterval(this.intervalID);
    }

    render() {
        const pinLayerData = new VectorSource({
            features: this.state.nearbyPins.map(pin => {
                return new Feature({
                    geometry: new Point(fromLonLat([
                        pin.location.longitude,
                        pin.location.latitude,
                    ])),
                });
            })
        });

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
            <MapComponent options={mapOptions}>
                <VectorLayerComponent options={{ source: pinLayerData }} />
            </MapComponent>
        );
    }
}

export default Homepage;
