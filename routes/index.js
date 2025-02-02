var express = require('express');
var router = express.Router();
var nodemailer = require("nodemailer");
var novedadesModel = require('../models/novedadesModel');
var cloudinary= require('cloudinary').v2;

/* GET home page. */
router.get('/', async function(req, res, next) {
 
  var novedades = await novedadesModel.getNovedades();

  novedades= novedades.splice(0,5);

  novedades= novedades.map(novedad => {
   if(novedad.img_id) {
     const imagen=cloudinary.url(novedad.img_id, {
       width:460,
       crop: 'fill'
     });
     return{
       ...novedad,
       imagen
     }
  } else {
   return{
     ...novedad,
     imagen: '/img/pelota.jpg'
   }
 }
 }); 
  res.render('index', {
    novedades
  });
});


router.post('/', async (req, res, next) => {

  var nombre = req.body.nombre;
  var apellido = req.body.apellido;
  var email = req.body.email;
  var telefono = req.body.telefono;
  var mensaje = req.body.mensaje;

  console.log(req.body)

  var obj = {
    to: 'alejoalvarez876@gmail.com',
    subject: 'Contacto desde la web',
    html: nombre + " se contacto a traves de la web y quiere mas informacion a este correo : " + email + ", <br> Ademas, hizo este comentario : " + mensaje + ". <br> Su tel es: " + telefono
  }


var transport = nodemailer.createTransport({
  host: process.env.SKIP_HOST,
  port: process.env.SKIP_PORT,
  auth: {
    user: process.env.SKIP_USER,
    pass: process.env.SKIP_PASS
  }
});

var info = await transport.sendMail(obj);

res.render('index', {
  message: '  mensaje enviado correctamente'
});

});

module.exports = router;
