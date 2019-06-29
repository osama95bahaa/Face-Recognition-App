import React, { Component } from 'react';
import './App.css';
import Navigation from './components/Navigation/Navigation';
import Logo from './components/Logo/Logo';
import ImageLinkForm from './components/ImageLinkForm/ImageLinkForm';
import Rank from './components/Rank/Rank';
import Register from './components/Register/Register';
import Signin from './components/Signin/Signin';
import FaceRecognition from './components/FaceRecognition/FaceRecognition';
import Particles from 'react-particles-js';
import Clarifai from 'clarifai';


const particlesOptions = {
                  particles: {
                    line_linked: {
                      shadow: {
                        enable: true,
                        color: "#3CA9D1",
                        blur: 5
                      }
                    }
                  }
                }



const app = new Clarifai.App({
 apiKey: 'c7eb8b33b2c246099b621043af50f44a'
});


const initialState = {
        input: '',
        imageUrl: '',
        box: {},
        route: 'signin',
        isSignedin: false,
        user: {
            id: '',
            name: '',
            email: '',
            entries: 0,
            joined: ''
        }
}

class App extends Component {

  constructor () {
    super();
    this.state = initialState
  }


  loadUser = (data) => {
    this.setState({user: {
      id: data.id,
      name: data.name,
      email: data.email,
      entries: data.entries,
      joined: data.joined
    }})
  }

  calculateFaceLocation = (data) => {

    const clarifaiFace = data.outputs[0].data.regions[0].region_info.bounding_box;
    const image = document.getElementById('inputImage');
    const width = Number(image.width);
    const height = Number(image.height);
    console.log(width, height);

    return {
      leftCol: clarifaiFace.left_col * width,
      topRow: clarifaiFace.top_row * height,
      rightCol: width - (clarifaiFace.right_col * width),
      bottomRow: height - (clarifaiFace.bottom_row * height)
    }
  }


  displayFaceBox = (box) => {
    console.log(box);
    this.setState({box: box});
  }

  onInputChange = (event) => {
    console.log(event.target.value);
    this.setState({input: event.target.value});
  }


  onButtonSubmit = () => {
    this.setState({imageUrl: this.state.input})

    app.models.predict(Clarifai.FACE_DETECT_MODEL, this.state.input)
    .then(response => {
      fetch('http://localhost:3000/image/', {
          method: 'put',
          headers: {'Content-type': 'application/json'},
          body: JSON.stringify({
            id: this.state.user.id
          })
      })
      .then(res => res.json())
      .then(count => {
        this.setState(Object.assign(this.state.user, {entries: count}))
      })
       this.displayFaceBox(this.calculateFaceLocation(response)) 
    })
    .catch(err => console.log(err))

    console.log('click');
  }


  onRouteChange = (route) => {  
    if (route === 'signout') {
      this.setState(initialState);
    }
    else if (route ==='home') {
      this.setState({isSignedin:  true});
    } 
      
    this.setState({route: route});
  }


  render() {
    return (
      <div className="App">

         <Particles className="particles" 
              params={particlesOptions}
            />
            
        <Navigation isSignedin={this.state.isSignedin} onRouteChange = {this.onRouteChange} />

        { this.state.route === 'home'  // fast if 
          ? <div>
              <Logo />
              <Rank name={this.state.user.name} entries={this.state.user.entries}/>
              <ImageLinkForm onInputChange={this.onInputChange} onButtonSubmit={this.onButtonSubmit}/>
              <FaceRecognition box={this.state.box} imageUrl={this.state.imageUrl}/>
            </div> 

          : (
              this.state.route === 'signin'
              ? <Signin loadUser={this.loadUser} onRouteChange={this.onRouteChange}/>
              : <Register loadUser={this.loadUser} onRouteChange={this.onRouteChange}/>
            )
        }

      </div>
    );
  }
}

export default App;
