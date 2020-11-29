import React, { Component } from 'react';
import Modal from 'react-modal';
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
import './homepage.css'

class Homepage extends Component {

    constructor(props) {
        super(props);
        this.state = {
			visible: false,
            nearbyPins: [],
            isDriver: false,
            currentLocation: {
                latitude: 0,
                longitude: 0,
            },
        };
    }
	openModal(){
		this.setState({
			visible: true
		});
	}
	
	closeModal(){
		this.setState({
			visible: false
		});
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
            <div className="home-base-container">
                <div className="button-request">
                    <form method="POST" id="ride-find" onSubmit={this.handleFindRideSubmit.bind(this)}>
                        <input type="submit" value="Find a Ride" className="btn btn-secondary btn-lg"   />
                    </form>
                    <form method="POST" id="passenger-find" onSubmit={this.handleHostRideSubmit.bind(this)}>
                        <input type="submit" value="Host a Ride" className="btn btn-secondary btn-lg"   />
                    </form>
                </div>
                <div className="map">
                    <MapComponent options={mapOptions}>
                    <VectorLayerComponent options={{ source: pinLayerData }} />
                    </MapComponent>
                </div>
                <div className="dashboard">
                    {/* this will display any notif/requests, display ongoing ride, etc. */}
                </div>
                

				<div>
					<input type="button" value="Choose Your Identity" onClick={()=>this.openModal()} />
					<Modal visible={this.state.visible} width="500" height="500" effect="fadeInUp" onClickAway={()=>this.closeModal()} />
						<div>
							<input type="button" value="I am a Rider" />
							<input type="button" value="I am a Driver" />
							<input type="button" value="Close" onClick={()=>this.closeModal()} />
						</div>
				</div>
				
			</div>
            
        );
    }

    handleFindRideSubmit(event) {
        event.preventDefault();
        const data = { longitude:this.state.currentLocation.longitude, latitude:this.state.currentLocation.latitude }
        //use fetch api
        fetch("/riders", { 
        method: "POST",
        body: JSON.stringify(data), // the data we're sending
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        })
        .then(response => {
            
        })
        .catch(error => {
            console.error(error);
        })
  }

  handleHostRideSubmit(event) {
    event.preventDefault();
    const data = { longitude:this.state.currentLocation.longitude, latitude:this.state.currentLocation.latitude }
    fetch("/drivers", { 
        method: "POST",
        body: JSON.stringify(data), // the data we're sending
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        })
        .then(response => {
            
        })
        .catch(error => {
            console.error(error);
        })
  }
}

export default Homepage;
