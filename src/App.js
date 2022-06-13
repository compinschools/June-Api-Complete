import React, { useState, useEffect } from "react";
import axios from "axios";
import {ApiClient} from './ApiClient';

function App() {
  const [quotes, changeQuotes] = useState({
    content: "",
    author: "",
    tags: [],
  });
  const [fetching,changeFetching] = useState(false);
  const [authors,changeAuthors] = useState([]);
const [lastIndex,changeLastIndex] = useState(20);
const [pageSize,changePageSize] = useState(20);
const [authorId,changeAuthorId] = useState(undefined);

const apiClient = new ApiClient();


  const updateQuote = (response) => {
    changeQuotes({
      content: response.content,
      author: response.author,
      tags: response.tags
    })
  }

  const updateAuthors = (response) => {
    const authorList = response.results.map((author) => ({
      id: author._id,
      name: author.name,
      count:author.quoteCount
    }));
  changeAuthors(authorList)
  }

  const listAuthors = (skip = 0 ) => {
    apiClient.getAuthors(skip,pageSize)
    .then( (res) => {
      console.log(res)
      updateAuthors(res.data)
    })

  }

  const refreshAuthors = (next) => {
    if(next) {
      listAuthors(lastIndex);
      changeLastIndex(lastIndex + pageSize);
    } else {
      listAuthors(lastIndex - (pageSize * 2));
      changeLastIndex(lastIndex < pageSize ? pageSize : lastIndex - pageSize )
    }
  }

  const refreshPagination = (event) => {
    changePageSize(parseInt(event.target.value));
  }

  const makeAuthorTable = () => {
    return authors.map((author,index) => {
      
      return (
        <tr key={index}>
          <td>
            <a href="#" onClick={ () =>{ changeAuthorId(author.id);console.log(author.id)}}>{author.name}</a>
            
          </td>
          <td>
            {author.count}
          </td>
        </tr>
      )
    })
  }

  const refreshQuote= () => {
    changeQuotes({
      content: "a quote we made up",
      author: "anon",
      tags: ["quote", "stuff", "blah"],
    });
    changeFetching(true)

    if(authorId) {
      apiClient.getQuoteByAuthor(authorId)
      .then((response) => {
        const val = Math.floor(Math.random() * response.data.count);
        console.log(val)

        updateQuote(
          response.data.results[val]
        );
      })
      .finally( (state) => changeFetching(false));
    } else {
    apiClient.getQuote()
    .then( (response) => {
      console.log("response",response)
      updateQuote(response.data);
      
    })
    .finally( (state) => changeFetching(false));
  }
  }


  useEffect(() => {
    refreshQuote()
    listAuthors()

  }, []);

  useEffect(() => {
    listAuthors();

  },[pageSize])

  useEffect(() => {
    refreshQuote()

  },[authorId])

  return (
    <>
      <h1>Quote of the day</h1>
      <p>
        <b>Content:</b> {quotes.content}{" "}
      </p>
      <p>
        <b>Author:</b> {quotes.author}{" "}
      </p>
      <p>
        <b>Tags:</b> {quotes.tags.join(", ")}
      </p>
      <button disabled={fetching} onClick={(e) => refreshQuote()}>New Quote</button>

      
      <hr />
      <button onClick={(e) => refreshAuthors(false)}>Previous</button>
      <button onClick={(e) => refreshAuthors(true)}>Next</button>
      <br />
      Page pageSize
      <select onChange={ (event) => refreshPagination(event)} value={pageSize}>
        <option value="10">10</option>
        <option value="20">20</option>
        <option value="30">30</option>
      </select>
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <td>No Of Quotes</td>
          </tr>
        </thead>
        {makeAuthorTable()}
      </table>
    </>
  );
}

export default App;
