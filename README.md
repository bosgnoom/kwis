# kwis
Single server Kahoot clone. To be used in an offline situation: no internet access is available. A Linksys WRT54GL is used to facilitate a wifi network.
Just to learn a bit about meteor and how to use git...

# how to use/install:

- Install meteor
- Create meteor app (meteor create kwis)
- Remove the 'client' and 'server' directory

- Clone this repo into the same directory (still have to figure out how ;-)
- Run app (meteor run)

- Remove autopublish: meteor remove autopublish

- Add meteor packages: meteor add <package>
  Meteor packages needed:
  - session
  - reactive-var
  - random
  - msavin:mongol (for testing)

# Notes about using meteor/mongodb:
* backup database using 'mongodump -o <backup name>'
* restore database using 'mongorestore --port 3001 <backup name>'
