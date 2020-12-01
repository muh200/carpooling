import React, { Component } from 'react';
import { ToastContainer, toast, Slide } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Modal from 'react-awesome-modal';
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
			visible2: false,
			visible3: false,
			visible4: false,
			findRide: false,
			hostRide: false,
            nearbyPins: [],
            isDriver: false,
            currentLocation: {
                latitude: 0,
                longitude: 0,
            },
        };
    }
	
	//when the button "Find a Ride" is clicked
	openModal=()=>{
		this.setState({
			findRide: true,
			visible: true
		});
    }
	
	closeModal=()=>{
		this.setState({
			visible: false
		});
	}
	
	//when the button "Host a Ride" is clicked
	openModal2=()=>{
		this.setState({
			hostRide: true,
			visible2: true
        });
	}
	
	closeModal2=()=>{
		this.setState({
			visible2: false
		});
	}
	
	openModal3=()=>{
		this.setState({
			visible3: true
		});
	}
	
	closeModal3=()=>{
		this.setState({
			visible3: false
		});
	}
	
	openModal4=()=>{
		this.setState({
			visible4: true
		});
	}
	
	closeModal4=()=>{
		this.setState({
			visible4: false
		});
    }

    // Accept ride --> Close Prompt Notifications --> Notify Ride Starts
    // This should be after rider engages with driver.
    // (NOT IMPLEMENTED) Should update after accepting
    accepted() {
        toast.dismiss()
        toast.info("Accepted Ride", {
            position: toast.POSITION.BOTTOM_CENTER,
            autoClose: 1000,
            hideProgressBar: true
        });
        toast('You have now started your pool ride.', {position:
             toast.POSITION.TOP_LEFT});
    }

    // Decline ride --> Close Prompt Notifications --> Notify Ride Declined
    // This should be after rider engages with driver.
    // (NOT IMPLEMENTED) Should update after accepting
    declined() {
        toast.dismiss()
        toast.info("Declined Ride", {
            position: toast.POSITION.BOTTOM_CENTER,
            autoClose: 1000,
            hideProgressBar: true
        });
        toast('You have declined the ride.', {position:
             toast.POSITION.TOP_LEFT});
    }
    
    // Three toast notifications to notify driver to accept/decline offer
    notify = () => {
        toast("A ride has been requested", {
            toastId: "prompt",
            position: toast.POSITION.BOTTOM_CENTER,
            autoClose: false,
            closeOnClick: false
        });
        toast.success("Accept", {
            toastId: "accept",
            position: toast.POSITION.BOTTOM_CENTER,
            onClick: () => this.accepted(), 
            autoClose: false
        });
        toast.error("Decline", {
            toastId: "decline",
            position: toast.POSITION.BOTTOM_CENTER,
            onClick: () => this.declined(),
            autoClose: false
        });

    };
    

	
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
                    name: pin.username,
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
                center: fromLonLat([
                    this.state.currentLocation.longitude,
                    this.state.currentLocation.latitude,
                ]),
                zoom: 15,
            })
        };
        return (
            <div className="home-base-container">
                <div className="button-request">
                    <form method="POST" id="ride-find" onSubmit={this.handleFindRideSubmit.bind(this)}>
                        <input type="submit" value="Find a Ride" onClick={this.openModal} className="btn btn-secondary btn-lg"   />
                    </form>
                    <form method="POST" id="passenger-find" onSubmit={this.handleHostRideSubmit.bind(this)}>
                        <input type="submit" value="Host a Ride" onClick={this.openModal2} className="btn btn-secondary btn-lg"   />
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
            
                {/* Will use later for rendering notifications. Should be after interacting
                with pins */}
               <div>
                    {<button onClick={this.notify}>Notification</button>}
                    <ToastContainer />
                </div>
                
                <button value="Dashboard" onClick={this.openModal3}>Display my ride information</button>
				
				<br /><br />
				<button value="rate" onClick={this.openModal4}>Rate my ride</button>
				
				
                <Modal visible={this.state.visible} width="200" height="150" effect="fadeInUp">
                    <div>
                        <p>You have requested a ride as a rider. Please wait for the responses from drivers.</p>
                        
                    </div>
				<button value='Close' onClick={this.closeModal}>Close</button>
                </Modal>
				
				<Modal visible={this.state.visible2} width="200" height="150" effect="fadeInUp">
                    <div>
                       <p>You have hosted a ride as a driver. Please wait for the responses from riders.</p>  
                    </div>
				<button value='Close' onClick={this.closeModal2}>Close</button>
                </Modal>
				
				<Modal visible={this.state.visible3} width="500" height="500" effect="fadeInDown">
                    <div>
                       <p>Your riding information will be displayed here.</p>
					   <p>Choose your driver/rider: </p>
                    </div>
				<button value='Close' onClick={this.closeModal3}>Close</button>
                </Modal>
				
				<Modal visible={this.state.visible4} width="300" height="150" effect="fadeInDown">
                    <div>
                    <input type="radio" name="rate" value="satisfied" checked />Satisfied <br />					
					<input type="radio" name="rate" value="unsatisfied" />Unsatisfied <br />
					<input type="text" name="report" value="Type in your suggestions." /> <br /><br />
                    </div>
				<input type='submit' value="Submit" onClick={this.closeModal4} />
                </Modal>
				
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
