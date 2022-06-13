import axios from "axios";
export class ApiClient {
    responseStatusCheck (response)  {
        if(response.status >= 200 && response.status < 300) {
          return Promise.resolve(response);
        } else {
          return Promise.reject(new Error (response.statusText));
        }
    
      }

      getItems (url) {
        return axios.get(url)
        .then(this.responseStatusCheck)
        .catch( (error) => {
            console.log(error);
          })   
      }

      getAuthors(skip=0,limit=20){
        return this.getItems(`https://api.quotable.io/authors?skip=${skip}&limit=${limit}`)
      }

      getQuoteByAuthor(authorId) {
          return this.getItems(`https://api.quotable.io/quotes?authorId=${authorId}`);
      }


      getQuote() {
        return this.getItems('https://api.quotable.io/random')
        
      }
}