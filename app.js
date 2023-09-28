const express = require("express");

const { open } = require("sqlite");
const sqlite3 = require("sqlite3");
const path = require("path");
const dbPath = path.join(__dirname, "cricketTeam.db");
let db = null;

const intializeDBAndServer = async () => {
  try {
    db = await open({
      filename: dbPath,
      driver: sqlite3.Database,
    });
    app.listen(3000, () => {
      console.log("Server is running");
    });
  } catch (e) {
    console.log(`DB Error: ${e.message}`);
    process.exit(1);
  }
};

intializeDBAndServer();
app.use(express.json());

convertDBObjectToResponseObject = (dbObject) => {
  return {
    playerId: dbObject.player_id,
    playerName: dbObject.player_name,
    jerseyNumber: dbObject.jersey_number,
    role: dbObject.role,
  };
};
//API-1 GET ALL THE PLAYERS
app.get("/players/", async (request, response) => {
  const getPlayersQuery = `SELECT * FROM cricket_team`;
  const players = await db.all(getPlayersQuery);
  response.send(
    players.map((eachPlayer) => convertDBObjectToResponseObject(eachPlayer))
  );
});

//API-2 POST THE DATA
app.post("/players/", async (request, response) => {
  const playerDetails = request.body;
  const { playerName, jerseyNumber, role } = playerDetails;

  const addPlayerQuery = `INSERT INTO cricket_team(player_name,jersey_number,role)
    VALUES (
        '${playerName}',${jerseyNumber},${role}
    );`;

  const dbResponse = await app.run(addPlayerQuery);
  response.send("Player Added to Team");
});

//API-3 RETURN A PLAYER ID
app.get("/players/:playerId/", async (request, response) => {
  const { playerId } = request.params;
  const getPlayerQuery = `SELECT * FROM cricket_team where player_id = ${player_id}`;
  const player = await db.get(getPlayerQuery);
  response.send(convertDBObjectToResponseObject(player));
});

//API-4 Updates the details of a player in the team (database) based on the player ID
app.put("/players/:playerId/", async (request, response) => {
  const { playerId } = request.params;
  const playerDetails = request.body;
  const { playerName, jerseyNumber, role } = playerDetails;
  const updateQuery = `UPDATE cricket_team where
    player_name = ${playerName},
    jersey_number = ${jerseyNumber},
    role = ${role}
    WHERE 
    player_id = ${playerId}`;
  await db.run(updateQuery);
  response.send("Player Details Updated");
});
//API-5 Deletes a player from the team (database) based on the player ID

app.delete("/players/:playerId/", async (request, response) => {
  const { playerId } = request.params;
  const deleteQuery = `DELETE FROM cricket_team WHERE player_id = ${playerId}`;
  await db.run(deleteQuery);
  response.send("Player Removed");
});

module.exports = app;
