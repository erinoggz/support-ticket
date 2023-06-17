#!/bin/bash

# MongoDB connection details
HOST="localhost"
PORT="27017"
DATABASE="support-ticket"

# Collection and JSON file details
USER_COLLECTION="users"
TICKET_RESPONSE_COLLECTION="ticketresponses"
TICKET_COLLECTION="tickets"

USER_JSON_FILE_PATH="dump/support.users.json"
TICKET_RESPONSE_JSON_FILE_PATH="dump/support.ticketresponses.json"
TICKET_JSON_FILE_PATH="dump/support.users.json"

# Dump user data to MongoDB
mongoimport --host $HOST --port $PORT --db $DATABASE --collection $USER_COLLECTION --file $USER_JSON_FILE_PATH --jsonArray

# Dump user data to MongoDB
mongoimport --host $HOST --port $PORT --db $DATABASE --collection $TICKET_RESPONSE_COLLECTION --file $TICKET_RESPONSE_JSON_FILE_PATH --jsonArray

# Dump user data to MongoDB
mongoimport --host $HOST --port $PORT --db $DATABASE --collection $TICKET_COLLECTION --file $TICKET_JSON_FILE_PATH --jsonArray
