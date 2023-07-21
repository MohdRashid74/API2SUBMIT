const express = require("express");
const app = express();
const { open } = require("sqlite");
const sqlite3 = require("sqlite3");
app.use(express.json());
let db = null;
const path = require("path");
const dbpath = path.join(__dirname, "moviesData.db");

const initializationdbanserver = async () => {
  try {
    db = await open({
      filename: dbpath,
      driver: sqlite3.Database,
    });

    app.listen(3000, () => {
      console.log("Server start at http://localhost:3000/");
    });
  } catch (e) {
    console.log(`error:${e.message}`);
    process.exit(1);
  }
};
initializationdbanserver();

//API 1
listofobjectreturn = (object) => {
  return {
    movieName: object.movie_name,
  };
};
app.get("/movies/", async (request, response) => {
  const getquery = `
    SELECT *
    FROM movie`;
  const resultget = await db.all(getquery);
  response.send(resultget.map((each) => listofobjectreturn(each)));
});

//API 2
app.post("/movies/", async (request, response) => {
  const postdetails = request.body;
  const { directorId, movieName, leadActor } = postdetails;
  const postvalue = `
  INSERT INTO 
  movie (director_id,movie_name,lead_actor)
  VALUES (${directorId},"${movieName}","${leadActor}")`;
  const result1 = await db.run(postvalue);
  response.send("Movie Successfully Added");
});

//API3
listofobjectreturn2 = (objects) => {
  return {
    movieId: objects.movie_id,
    directorId: objects.director_id,
    movieName: objects.movie_name,
    leadActor: objects.lead_actor,
  };
};

app.get("/movies/:movieId/", async (request, response) => {
  const { movieId } = request.params;
  const getquery = `
    SELECT *
    FROM movie
    WHERE moviE_id=${movieId}`;
  const getvalue = await db.get(getquery);
  response.send(listofobjectreturn2(getvalue));
});
module.exports = app;

//API 5
app.delete("/movies/:movieId/", async (request, response) => {
  const { movieId } = request.params;
  const deletequery = `
    DELETE FROM 
    movie 
    WHERE movie_id=${movieId}`;
  const deletevalue = await db.run(deletequery);
  response.send("Movie Removed");
});

//API 6
objectnameofdirector = (object) => {
  return {
    directorId: object.director_id,
    directorName: object.director_name,
  };
};
app.get("/directors/", async (request, response) => {
  const getquery2 = `
    SELECT * 
    FROM director`;
  const getdirector = await db.all(getquery2);
  response.send(getdirector.map((eachname) => objectnameofdirector(eachname)));
});
//API 7

objectname = (object) => {
  return {
    movieName: object.movie_name,
  };
};
app.get("/directors/:directorId/movies/", async (request, response) => {
  const { directorId } = request.params;
  const directornamevalue = `
    SELECT *
    FROM movie
    WHERE director_id=${directorId}`;
  const directorresult = await db.get(directornamevalue);
  response.send(objectname(directorresult));
});

//API 4
app.put("/movies/:movieId/", async (request, response) => {
  const { directorId, movieName, leadActor } = request.body;
  const { movieId } = request.params;
  const putvalue = `
  UPDATE 
   movie
   SET 
   director_id=${directorId},
   movie_name="${movieName}",
   lead_actor="${leadActor}"
   WHERE 
   movie_id=${movieId}`;
  const final = await db.run(putvalue);
  response.send("Movie Details Updated");
});
