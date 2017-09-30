# kwis
Single server Kahoot clone. To be used in an offline application. Very alpha stage. 
Just to learn a bit about meteor and how to use git...

How to use/install:

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

TODO list (in dutch):
- Bij antwoord scherm top 3 / laatste 3 scores
- Uitslag scherm: wie heeft er gewonnen? wie was het snelste? wie het langzaamste?
- Uitslag scherm: wie heeft er het vaakst niet geantwoord?

Notes about using meteor/mongodb:
* backup database using 'mongodump -o <backup name>
* restore database using 'mongorestore --port 3001 <backup name>
