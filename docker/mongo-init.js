db = db.getSiblingDB('eventflow')

db.createCollection('users')
db.createCollection('events')

print('Base de données EventFlow initialisée !')
```

---

**client/.dockerignore**
```
node_modules
dist
.env
```

**server/.dockerignore**
```
node_modules
.env