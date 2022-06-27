# How to run this project

-Install node.js and postgresql (do not forget the password you choose)
-Download or "git pull" the code (unzip the directory)
-Create the postgresql database using the scripts on the "database directory"
-Create a .env file (in the base directory) with the connection string for the database you created, it should be similar to this:
`DATABASE_URL=postgres://username:password@localhost:5432/databasename`
Where:
`username` is the username you have for the database (the default username is postgres)
`password` is the password you chose for that user (the default is the password you chose when you installed postgresql)
`localhost` is the name of the server, in this case is the computer you are on
`5432` is the port, usually its this value
`databasename` is the name you gave to the database
- Open a terminal inside the project directory and run:
```bash
npm install
npm start
```
- Open the game on the browse by writing `localhost:3000`

# How to play the game

To Do ... 

# License
Distributed under the MIT License. See `LICENSE.txt` for more information.