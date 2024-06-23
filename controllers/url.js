const generateShortId = require('ssid');
const URL = require('../models/url')

// generating a new short url
async function handlegenerateNewShortURL(req,res) {
    const body = req.body ;
    if ( !body.url ) return res.status(400).json({error: "URL is required"})

    const shortId = generateShortId() ;
    
    console.log("shortid is generated :" + shortId)

    await URL.create({
        shortID : shortId,
        redirectURL : body.url,
        visitHistory: [],
    })

    return res.status(201).json({id: shortID})
}

async function handleGetAnalytics( req,res) {
    const shortId = req.params.shortid ;
    const result = await URL.findOne({shortId}) ;

    if ( !result ) {
        return res.json({"mssg": "Not in database,"})
    }

    return res.json({
        TotalClicks : result.visitHistory.length, analytics: result.visitHistory
    });
}

module.exports ={
    handlegenerateNewShortURL,
    handleGetAnalytics,
}