1. Basic Project Setup
Initialize project : npm init -y -> creates package.json.
Add "type": "module" in package.json -> Reason: enables ES modules (import/export) instead of require().

Install core backend packages
express → server
dotenv → environment variables
mongoose → MongoDB ODM

2. Environment Setup (.env file)
In backend/config/config.env define:
`PORT=5000
MONGO_URI=your_connection_string`

Load environment variables in server.js:
`dotenv.config({ path: "backend/config/config.env" });`

3. Server Setup (server.js)
Responsibilities:
Load env vars
Connect database
Start Express server
`import app from "./app.js";
import dotenv from "dotenv";
import { connectMongoDatabase } from "./config/db.js";

dotenv.config({ path: "backend/config/config.env" });
connectMongoDatabase();

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`server is running on ${port}`);
});`


