import React, { Component } from 'react'
import axios from "axios";
import "./JokeList.css";
import Joke from "./Joke";
import {v4 as uuid} from "uuid";

class JokeList extends Component{
    static defaultProps = {
        numJokes: 10
    }
    constructor(props){
        super(props);
        this.state = {
            jokes: JSON.parse(window.localStorage.getItem("jokes")) || [],
            loading: false
        }
        this.seenJokes = new Set(this.state.jokes.map(joke => joke.text));
        this.handleVote = this.handleVote.bind(this);
        this.handleClick = this.handleClick.bind(this);
        this.fetchJokes = this.fetchJokes.bind(this);
    }

    componentDidMount(){
        if(this.state.jokes.length === 0){
           this.fetchJokes()
        }
    }

    async fetchJokes(){
        this.setState({loading: true});
        try
       {
        var jokes = [];
        while(jokes.length < this.props.numJokes){
            var response = await axios({
                method: 'get',
                url: 'https://icanhazdadjoke.com/',
                headers: {
                    Accept: "application/json"
                }
              });
            var data = response.data;
            if(!this.seenJokes.has(data.joke)){
                var joke = {id: uuid(), text: data.joke, votes: 0};
                jokes.push(joke);
            }else{
                console.log("duplicate found")
                console.log(data.joke);
            }
        }
        this.setState(function(currState){
            return {jokes: [...currState.jokes, ...jokes], loading: false}
        }, () => {
            window.localStorage.setItem("jokes", JSON.stringify(this.state.jokes));
        });
       }catch(err){
          alert(err);
          this.setState({loading: false});
       }
    }

    handleVote(id, delta){
        console.log(id, delta)
       var updatedJokes = this.state.jokes.map(function(joke){
          if(joke.id === id){
              return {...joke, votes: joke.votes + delta}
          }
          return joke;
       })
       this.setState({jokes: updatedJokes}, () => {
        window.localStorage.setItem("jokes", JSON.stringify(this.state.jokes));
       });
    }

    handleClick(){
        this.fetchJokes();
    }


    render(){
        if(this.state.loading){
            return(
                 <div className="JokeList-spinner">
                   <i className="far fa-8x fa-laugh fa-spin"></i>
                   <h1 className="JokeList-title JokeList-loading">Loading...</h1>
                 </div>
            )      
        }
        return(
            <div className="JokeList">
                <div className="JokeList-sidebar">
                <h1 className="JokeList-title"><span>Dad</span> Jokes</h1>
                <img src='https://assets.dryicons.com/uploads/icon/svg/8927/0eb14c71-38f2-433a-bfc8-23d9c99b3647.svg' alt="Laughing-Emoji"/>
                <button className="JokeList-fetchJokes" onClick={this.handleClick}>Fetch Jokes</button>
                </div>
               <div className="JokeList-jokes">
                   {this.state.jokes.map((joke) => {
                       return <Joke text={joke.text} votes={joke.votes} id={joke.id} handleVote={this.handleVote} key={joke.id}/>
                   })}
               </div>
            </div>
        )
    }
}

export default JokeList;