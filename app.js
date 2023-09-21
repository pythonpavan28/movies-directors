const express = require("express");
const app = express();
const { open } = require("sqlite");
const sqlite3 = require("sqlite3");
const path = require("path");
const dbPath = path.join(__dirname, "moviesData.db");

let db = null;
const result = async () => {
  try {
    db = await open({
      filename: dbPath,
      driver: sqlite3.Database,
    });
    app.listen(3000, () => {
      console.log("Server running at https://localhost:3000/");
    });
  } catch (e) {
    console.log(`Error at ${e.message}`);
  }
};

result();

//API 1 GET

app.get("/movies/", async (request, response) => {
  const getData = `SELECT movie_name FROM movie`;
  const movieNameData = await db.all(getData);
  response.send(movieNameData);
});

//API 2 POST

app.post("/movies/", async (request, response) => {
  const movieDetails = request.body;
  const { directorId, movieName, leadActor } = movieDetails;
  const addingData = `INSERT INTO movie (director_id,movie_name,lead_actor)
    VALUES (${directorId},'${movieName}','${leadActor}')`;
  const result = await db.run(addingData);
  response.send("Movie Successfully Added");
});

//API 3 GET movie

app.get("/movies/:movieId/", async (request, response) => {
  const { movieId } = request.params;
  const gettingMovie = `SELECT * FROM movie WHERE movie_id = ${movieId}`;
  const movieData = await db.get(gettingMovie);
  response.send(movieData);
});

//API 4 PUT

app.put("/movies/:movieId/", async (request, response) => {
  const { movieId } = request.params;
  const movieDetails = request.body;
  const { directorId, movieName, leadActor } = movieDetails;
  const updatingMovie = `UPDATE movie 
  SET director_id = ${directorId},
  movie_name = '${movieName}',
  lead_actor = '${leadActor}'
  WHERE movie_id = ${movieId}
  `;
  const updating = await db.run(updatingMovie);
  response.send("Movie Details Updated");
});

//DELETE API 5
app.delete("/movies/:movieId/", async (request, response) => {
  const { movieId } = request.params;
  const deletingMovie = `DELETE FROM movie WHERE movie_id = ${movieId}`;
  await db.run(deletingMovie);
  response.send("Movie Removed");
});

//GET API 6 FOR directors table
app.get("/directors/", async (request, response) => {
  const gettingDirectors = `SELECT * FROM director`;
  const directorsData = await db.all(gettingDirectors);
  response.send(directorsData);
});

//GET API 7
app.get("/directors/:directorId/movies/", async (request, response) => {
  const { directorId } = request.params;
  const gettingMovies = `SELECT movie_name FROM movie WHERE director_id = ${directorId} `;
  const listOfMovies = await db.run(gettingMovies);
  response.send(listOfMovies);
});

module.exports = app;
