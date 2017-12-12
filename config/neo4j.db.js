var neo4j = require('neo4j-driver').v1;
require('dotenv').config();

var driver = neo4j.driver(
            process.env.NEO_DB, 
            neo4j.auth.basic(process.env.NEO_USER, process.env.NEO_PASS));

module.exports = driver;