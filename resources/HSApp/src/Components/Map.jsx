import React from 'react';
import GoogleMapReact from 'google-map-react';
import Marker from './Marker';

class Map extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            center: [16.7572, -93.119],
            zoom: 18,
            draggable: true,
            lat: 0,
            lng: 0
        };
    }

    onCircleInteraction=(childKey, childProps, mouse) => {
        // function is just a stub to test callbacks
        this.setState({
            draggable: false,
            lat: mouse.lat,
            lng: mouse.lng
        });
        //console.log('onCircleInteraction called with', childKey, childProps, mouse);
        this.props.coordenadasFromMapComponent([mouse.lat, mouse.lng]);
    }

    onCircleInteraction3=(childKey, childProps, mouse) => {
        this.setState({ draggable: true });
        // function is just a stub to test callbacks  
        //console.log('onCircleInteraction called with', childKey, childProps, mouse);
    }

    onChange = ({ center, zoom }) => {
        this.setState({
            center: center,
            zoom: zoom
        });
    }

    render() {
        return (
            <div style={{ height: '100vh', width: '100%' }}>
                <GoogleMapReact
                    bootstrapURLKeys={{ key: 'AIzaSyDuKQFGka9Jr4cFLrzbcUbVQwlfR7T1QvY' }}
                    draggable={this.state.draggable}
                    onChange={this.onChange}
                    zoom={this.state.zoom}
                    center={this.state.center}
                    onChildMouseDown={this.onCircleInteraction}
                    onChildMouseUp={this.onCircleInteraction3}
                    onChildMouseMove={this.onCircleInteraction}
                    //onChildClick={() => console.log('child click')}
                    onClick={() => console.log('mapClick')}
                >
                    <Marker
                        lat={this.state.lat}
                        lng={this.state.lng}
                        name="Ubicación"
                        color="blue"/>
                </GoogleMapReact>
            </div>
        );
    }

}

export default Map;
