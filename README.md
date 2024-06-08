# URLSHORTENER

Design a URL shortener service that takes in a valid URL and returns a shortened URL, redirecting the user to the previously provided URL.

## Routes  

- POST /URL - Generates a new short URL and returns the shortened URL in the format example.com/random-id

- GET /:id - Redirects the user to the orginal URL

- GET /URL/analytics/:id - Returns the clicks for the provided short id.