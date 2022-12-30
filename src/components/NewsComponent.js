import React, { Component } from 'react'
import NewsItem from './NewsItem'
import Spinner from './Spinner';
import PropTypes from 'prop-types'


export class News extends Component {
    static defaultProps = {
        country: 'in',
        pageSize: 8, 
        category: 'general',
      }

      static propTypes = {
        country: PropTypes.string,
        pageSize: PropTypes.number, 
        category: PropTypes.string,
      }

    constructor(){
        super();
        this.state = {
            articles: [],
            loading: false,
            page:1
        }
    }

    async componentDidMount(){ 
        // this.props.setProgress(0);
        let url = `https://newsapi.org/v2/top-headlines?country=${this.props.country}&category=${this.props.category}&apiKey=20010ee794744de98170f947270486fe&page=1&pageSize=${this.props.pageSize}`;
        this.setState({loading: true});
        // this.props.setProgress(30);
        let data = await fetch(url);
        let parsedData = await data.json()
        // this.props.setProgress(70);
        console.log(parsedData); 
        this.setState({articles: parsedData.articles,
            totalResults: parsedData.totalResults,
            loading: false})
        // this.props.setProgress(100);
    }

     handlePrevClick = async ()=>{
        // this.props.setProgress(30);
        console.log("Previous");
        let url = `https://newsapi.org/v2/top-headlines?country=${this.props.country}&category=${this.props.category}&apiKey=20010ee794744de98170f947270486fe&page=${this.state.page - 1}&pageSize=${this.props.pageSize}`;
        this.setState({loading: true});
        // this.props.setProgress(50);
        let data = await fetch(url);
        let parsedData = await data.json()
        // this.props.setProgress(70);
        console.log(parsedData);  
        this.setState({
            page: this.state.page - 1,
            articles: parsedData.articles,
            loading: false
        })
        // this.props.setProgress(100);

    }
    
     handleNextClick = async ()=>{
        console.log("Next"); 
        if (!(this.state.page + 1 > Math.ceil(this.state.totalResults/this.props.pageSize))){
            // this.props.setProgress(30);
            let url = `https://newsapi.org/v2/top-headlines?country=${this.props.country}&category=${this.props.category}&apiKey=20010ee794744de98170f947270486fe&page=${this.state.page + 1}&pageSize=${this.props.pageSize}`;
            this.setState({loading: true});
            // this.props.setProgress(50);
            let data = await fetch(url);
            let parsedData = await data.json() 
            // this.props.setProgress(70);
            this.setState({
                page: this.state.page + 1,
                articles: parsedData.articles,
                loading: false
            })
            // this.props.setProgress(100);
    }
        }

    render() { 
        return (
            <div className="container my-3">
                <h1 className="text-center" style={{margin: '35px 0px'}}>Daily News - Headlines</h1>
                {this.state.loading && <Spinner/>}
                <div className="row"> 
                {!this.state.loading && this.state.articles.map((element)=>{
                    return <div className="col-md-4" key={element.url}>
                        <NewsItem title={element.title?element.title:""} source={element.source.name}description={element.description?element.description:""} imageUrl={element.urlToImage} newsUrl={element.url} author={element.author?element.author:"unknown"} date={element.publishedAt}/>
                    </div> 
                })} 
                </div> 
                <div className="container d-flex justify-content-between">
                <button disabled={this.state.page<=1} type="button" className="btn btn-dark" onClick={this.handlePrevClick}> &larr; Previous</button>
                <button disabled={this.state.page + 1 > Math.ceil(this.state.totalResults/this.props.pageSize)} type="button" className="btn btn-dark" onClick={this.handleNextClick}>Next &rarr;</button>
                </div>
            </div>
        )
    }
}

export default News
