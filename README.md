# Northcoders News API

The northcoders news API is a web service that allows users to interact with articles, topics and other users through a series of GET, POST, DELETE and PATCH requests.

[See it in action](https://be-nc-news-47u0.onrender.com/)

## Running locally
### Requirements
Node: ```7.0.1```
<br>
Postgres: ```16.4```

### Guide
1. Clone the project with `git clone https://github.com/jeepies/be-nc-news.git`
2. Move into the directory using `cd be-nc-news`
3. Install dependencies by running `npm i`
4. Create two `.env` files, `.env` and `.env.test`, at the root
    1. These environment files must contain a key called `PGDATABASE`. Refer to the [example env](https://github.com/jeepies/be-nc-news/blob/main/.env-example)
5. Run the script to setup databases `npm run setup-dbs`
6. Seed the databases using `npm run seed`
7. Run the server with `npm start`

--- 
This portfolio project was created as part of a Digital Skills Bootcamp in Software Engineering provided by [Northcoders](https://northcoders.com/)
