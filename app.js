
	const express = require('express')
	const handlebars = require('express-handlebars')
	const bodyParser = require('body-parser')
	const app = express()
	const admin = require('./routes/admin')
	const path = require('path')
	const session = require('express-session')
	const flash = require('connect-flash')
	const mongoose = require('mongoose')
	
	//session
		app.use(session({
			secret: "18082000",
			resave: true,
			saveUninitialized: true
		}))
		app.use(flash())
	//middlewere
		app.use((req,res,next)=> {
			res.locals.success_msg = req.flash("success_msg")
			res.locals.error_msg = req.flash("error_msg")
			res.locals.error = req.flash("error")
			
			next()
		})
	//Body-parser
		app.use(bodyParser.urlencoded({extended: false}))
		app.use(bodyParser.json())
	//Handlebars
		app.engine('handlebars', handlebars({defaultLayout: 'main'}))
		app.set('view engine', 'handlebars')
	//Mongoose
		mongoose.promise = global.promise
			mongoose.connect('mongodb://localhost/academia').then(()=>{
				console.log("conectado ao mongo")
			}).catch((err)=>{
				console.log("erro ao se conectar"+err)
			})
		//Public	
		app.use(express.static(path.join(__dirname, "public")))



	app.use('/admin', admin)


	const PORT = 8081
	app.listen(PORT, () =>{
	console.log("server rodando!")
})