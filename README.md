# setup

touch app.js

npm init

npm install express dotenv --save

npm install nodemon --save-dev

npm install mongoose

npm install slugify --save

npm install node-geocoder --save

npm install bcryptjs

npm install cookie-parser

# create config/config.env

PORT = 3000

NODE_ENV = development

# package.json in scripts

"start": "node app.js",

"dev": "nodemon app",

"prod": "SET NODE_ENV=production & nodemon app.js"

# run server

npm run dev
