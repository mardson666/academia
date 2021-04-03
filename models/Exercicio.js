const mongoose = require('mongoose')
const Schema = mongoose.Schema

	const Exercicio = new Schema({
		nome:{
			type: String,
			required: true
		},
		slug:{
			type: String,
			required: true
		},
		descricao:{
			type: String,
			required:true
		},
		categoria:{
			type: Schema.Types.ObjectId,
			ref: "categoria",
			required: true
		},
		date:{
		type: Date,
		default: Date.now()
		}  
	})






mongoose.model('exercicio', Exercicio)