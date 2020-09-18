import React, { Component } from 'react'
import axios from "axios";

class Joke extends Component{
    constructor(props){
        super(props);
        this.state = {
            jokes: []
        }

        this.fetchJokes = this.fetchJokes.bind(this);
    }

    async componentDidMount(){
        await this.fetchJokes();
    }

 
    async fetchJokes(){
        var jokes = [];
        for(var i=0; i<10; i++){
            var response = await axios({
                method: 'get',
                url: 'https://icanhazdadjoke.com/',
                headers: {
                    Accept: "application/json"
                }
              });
            var data = response.data;
            var joke = {id: data.id, joke: data.joke};
            jokes.push(joke);
        }
        this.setState(function(currState){
            return {jokes: [...currState.jokes, ...jokes]}
        });
        console.log(this.state.jokes)
    }

    render(){
        return(
                   <div>
                      <h1>Dad Jokes: </h1>
                      {this.state.jokes.map(function(joke){
                       return <h3>{joke.joke}</h3>;
                      })}
                      <button onClick={this.fetchJokes}>Fetch Jokes!</button>
                    </div>
        )
    }
}


export default Joke;