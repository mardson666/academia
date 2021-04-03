const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
require('../models/Categoria')
const Categoria = mongoose.model('categoria')
require('../models/Exercicio')
const Exercicio = mongoose.model('exercicio')

router.get('/', (req, res) => {
		res.render('admin/index')
		
	})
//criando rota exercicio 
router.get('/exercicio', (req, res)=>{
	Exercicio.find().populate('categoria').lean().sort({date:"DESC"}).then((exercicio)=>{
		res.render('admin/exercicio',{exercicio:exercicio})
	}).catch((err)=>{
		req.flash("error_msg", "Error ao listar Exercicio")
		res.redirect("/admin")
	})
	
})


router.get('/exercicio/add',(req,res)=>{
	Categoria.find().lean().sort({date:"DESC"}).then((categoria)=>{
		res.render("admin/addexercicio",{categoria:categoria})
	}).catch((err)=>{
		req.flash("error_msg", "Error ao listar categoria")
		res.redirect("/admin")
	})
	
})
router.post('/exercicio/novo', (req,res)=>{
	var erros = []
	if (req.body.categoria == "0") {
			erros.push({texto: "Categoria invalida, registre uma categoria"})
		}
	if (!req.body.nome || typeof req.body.nome == undefined || req.body.nome == null) {
		erros.push({texto: "Nome Invalido"})
	}
	if (!req.body.slug || typeof req.body.slug == undefined || req.body.slug == null) {
				erros.push({texto: "Slug invalido"})
	}
	if (!req.body.descricao || typeof req.body.descricao == undefined || req.body.descricao == null) {
				erros.push({texto: "Descrição invalido"})
	}
	if (req.body.nome.length < 4) {
		erros.push({texto: "Nome do exercicio muito pequeno"})
	}
	if(req.body.descricao.length < 10){
		erros.push({texto: "Descrição do exercicio muito pequeno"})
	}
	if (erros.length > 0) {
		res.render("admin/addcategoria", {erros: erros})
	}else{
		const novoExercicio= {
			nome: req.body.nome,
			slug: req.body.slug,
			descricao: req.body.descricao,
			categoria: req.body.categoria
		}
		new Exercicio(novoExercicio).save().then(()=>{
			req.flash("success_msg", "Exercicio criado com sucesso")
			res.redirect("/admin/exercicio")
		}).catch((err)=>{
			req.flash("error_msg", "Erro ao criar Exercicio")
			res.redirect("/admin/exercicio")
		})
	}
})

router.get('/exercicio/edit/:id', (req, res)=>{
	Exercicio.findOne({_id: req.params.id}).lean().then((exercicio) =>{
			Categoria.find().lean().then((categoria)=>{
				res.render("admin/editexercicio", {categoria:categoria , exercicio:exercicio})

			}).catch((err)=>{
				req.flash("error_msg", "Erro ao listar as categorias")
				res.redirect("/admin/postagens")
			})

		}).catch((err)=>{
			req.flash("error_msg", "Erro ao editar postagem")
			res.redirect("/admin/postagens")
		})
})
router.post("/exercicio/edit", (req,res)=>{

		Exercicio.findOne({_id:req.body.id}).then((exercicio) =>{

			exercicio.nome = req.body.nome
			exercicio.slug = req.body.slug
			exercicio.descricao = req.body.descricao
			exercicio.categoria = req.body.categoria

			exercicio.save().then(()=>{
				req.flash("success_msg", "Editada com sucesso")
				res.redirect("/admin/exercicio")
			}).catch((err)=>{
				req.flash("error_msg","Erro interno")
				res.redirect("/admin/exercicio")
			})

		}).catch((err) =>{

			req.flash("error_msg", "Houve um erro ao salvar a edição")
			res.redirect("/admin/exercicio")
		})


	})
router.post('/exercicio/deletar', (req,res)=>{
	Exercicio.remove({_id: req.body.id}).then(()=>{
			req.flash("success_msg", "Exercicio foi excluida com sucesso")
			res.redirect("/admin/exercicio")
		}).catch((err) =>{
			req.flash("error_msg","houve um erro ao excluir")
			res.redirect("/admin/exercicio")
		})
})
//criando rota categoria
router.get('/categoria',(req, res)=>{
	
	Categoria.find().lean().sort({date: "DESC"}).then((categoria)=>{
		res.render("admin/categoria",{categoria:categoria})
	}).catch((err)=>{
		req.flash("error_msg", "Error ao listar categoria")
		res.redirect("/admin")
	})
})
router.get('/categoria/add', (req,res)=>{
	res.render("admin/addcategoria")
})

router.post('/categoria/nova',(req,res) =>{
		var erros = []
			if (!req.body.nome || typeof req.body.nome == undefined || req.body.nome == null) {
				erros.push({texto: "Nome invalido"})
			}
			if (!req.body.slug || typeof req.body.slug == undefined || req.body.slug == null) {
				erros.push({texto: "Slug invalido"})
			}
			if (req.body.nome.length < 2 ) {
				erros.push({texto: "Nome da categoria é muito pequeno"})
			}
			if (erros.length > 0) {
				res.render("admin/addcategoria", {erros: erros})
			}else{
				const novaCategoria = {
			nome: req.body.nome,
			slug: req.body.slug
		}
		new Categoria(novaCategoria).save().then(() => {
			req.flash("success_msg", "Categoria criada com sucesso")
			res.redirect('/admin/categoria')
		}).catch((err) => {
			req.flash("error_msg", "Houve um erro ao salvar a categoria, tente novamente!")
			res.redirect('/admin/categoria')
		
		})
			}
		
	})
	router.post('/categoria/deletar', (req,res)=>{
		Categoria.remove({_id: req.body.id}).lean().then(()=>{
			req.flash("success_msg", "Deletada com sucesso")
			res.redirect("/admin/categoria")
		})
	})
	router.get('/categoria/edit/:id',(req,res)=>{
		Categoria.findOne({_id: req.params.id}).lean().then((categoria)=>{
			res.render("admin/editcategoria", {categoria:categoria})
		}).catch((err) => {
			res.flash("error_msg", "Essa categoria não existe")
			res.redirect("/admin/categoria")
		})
	})
	router.post('/categoria/edit', (req,res)=>{
		Categoria.findOne({_id: req.body.id}).then((categoria) =>{
		 	categoria.nome = req.body.nome
		 	categoria.slug = req.body.slug

		 	categoria.save().then(() =>{
		 		req.flash("success_msg", "categoria editada com sucesso")
		 		res.redirect("/admin/categoria")
		 	}).catch((err) =>{
		 		req.flash("error_msg", "houve um erro interno ao salvar a edição da categoria")
		 		res.redirect("/admin/categoria")
		 	})
		 }).catch((err) =>{
		 	req.flash("error_msg", "houve um erro ao editar a categoria")
		 	res.redirect("/admin/categoria")
		 })
	})


module.exports = router