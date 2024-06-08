const express = require('express')
const URL = require('./models/url')

const { connectToMongoDB } = require('./connect')
const urlRoute = require('./routes/url')

const app = express() ;
const PORT = 8001

connectToMongoDB("mongodb://127.0.0.1:27017/short-url")
.then( () => console.log('MongoDB connected.'))

app.use(express.json({})) ;

app.use('/url', urlRoute) ;

app.get("/:shortId", async (req, res) => {
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
