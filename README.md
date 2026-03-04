# EventFlow
EVENTFLOW est une plateforme de gestion d’événements  (conférences, séminaires, meetups). L'application permet la création  d’événements par des organisateurs, l’inscription sécurisée de participants, et une  gestion administrative globale.
.
1. Stack Technique
    Couche+Technologie+Version
        Frontend : Vue.js 3 + Vite + Pinia + Vue Router	(Vue 3.x)
        Backend	: Node.js + Express.js	(Node 20.x)
        Bd : MongoDB + Mongoose	(Mongo 7.x)
        Authentification : JWT + Bcrypt	
        Notifications : Vue Toastification	(Next)
        Styles : Bootstrap + Bootstrap Vue Next	 (5.x)
        DevOps	Docker + Docker Compose	'Latest'

2. Packages Frontend 
    Package+Commande_d'installation+Rôle
        vue-router@4	
            npm install vue-router@4
        pinia	
            npm install pinia 
        axios	
            npm install axios 
        bootstrap	
            npm install bootstrap 
        bootstrap-vue-next	
            npm install bootstrap-vue-next 
        @popperjs/core	
            npm install @popperjs/core 
        @vueuse/core	
            npm install @vueuse/core 
        vue-toastification	
            npm install vue-toastification@next	

3. Packages Backend 
    express	npm install express	
    mongoose	npm install mongoose	
    dotenv	npm install dotenv	
    bcryptjs	npm install bcryptjs	
    jsonwebtoken	npm install jsonwebtoken	
    cors	npm install cors	
    joi	npm install joi	
    nodemon	npm install --save-dev nodemon	

4. Variables d'Environnement
    client/.env
    server/.env

5. Commandes de Lancement
    npm run dev back + front
    docker-compose up --build

6. Architecture du Projet