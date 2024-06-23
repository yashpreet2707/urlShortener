const express = require('express')
const URL = require('./models/url')

const { connectToMongoDB } = require('./connect')
const urlRoute = require('./routes/url')

const app = express() ;
const PORT = 8001

connectToMongoDB("mongodb://127.0.0.1:27017/short-url")
.then( () => console.log('MongoDB connected.'))

app.use(express.json({})) ;

app.get('/test', async (req,res) => {
  const allURLs = await URL.find() ;
  console.log(allURLs[0].shortID)
  console.log(allURLs[0].redirectURL)
  console.log(allURLs[0].visitHistory.length)

  return res.end(`
    <html>
    <head></head>
    <body>
      <ol>
        ${allURLs.map( (url) => `<li>${url.shortID} -> ${url.redirectURL} : ${url.visitHistory.length}</li>` ).join(' | ')}
      </ol>
    </body>
    </html>
    `)
})

app.use('/url', urlRoute) ;

app.get("/url/:shortId", async (req, res) => {
    const shortId = req.params.shortId;
    const entry = await URL.findOneAndUpdate(
      { shortID: shortId },
            {
                $push: {
                    visitHistory: {
                        timestamp: Date.now()
                    }
                }
            },
            
        );
    try {
      if ( entry.redirectURL ) {
        res.redirect(entry.redirectURL) ;
      }
      else {
        res.json({"msg": "url not found."})
      }
    }
    catch(err) {
      console.error("error: " + err) 
    }

  });


app.listen(PORT, () =>{
    console.log(`Server is running at http://localhost:${PORT}`)
})
