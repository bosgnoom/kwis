#!/bin/sh

datum=$(date +%Y.%m.%d-%H.%M.%S)

#echo backup-$datum.mongodb

mongodump --port=3001 -o databases_backup/backup-$datum.mongodb

# Note to self: to restore, use:
#mongorestore --port=3001 <dump folder name>
