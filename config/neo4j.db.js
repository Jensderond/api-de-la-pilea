var neo4j = require('neo4j-driver').v1;
require('dotenv').config();

var driver = neo4j.driver(
            'bolt://localhost:7687', 
            neo4j.auth.basic('neo4j', process.env.LOCAL_NEO_PASS));

module.exports = driver;