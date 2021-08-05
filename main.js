
let topic = require('./lib/topic');
let author = require('./lib/author');
const express = require('express')
const app = express()
const port = 3000;
let bodyParser = require('body-parser')
let compression = require('compression')

app.post('*', bodyParser.urlencoded({ extended: false })) //request.body property를 생성함, 모든 Post에 대해 실행됨
// app.use(bodyParser.urlencoded({ extended: false })) // app.use => 모든 request에 해당
app.use(compression());

app.get('/', function(req, res) {topic.home(req, res);})
app.get('/page/:pageId', function(req, res){topic.page(req, res);})
app.get('/create', function(req, res) {topic.create(req, res);})
app.post('/create_process', function(req, res) {topic.create_process(req, res, req.body);})
app.get('/update/:pageId', function(req, res) {topic.update(req, res); })
app.post('/update_process', function(req, res) {topic.update_process(req, res, req.body);})
app.post('/delete_process', function(req, res) {topic.delete_process(req, res, req.body);})
app.get('/author', function(req, res) { author.list(req, res);})
app.post('/author_create', function(req, res) {author.create(req, res, req.body);})
app.get('/author_update/:authorId', function(req, res) {author.update(req, res); })
app.post('/author_update_proc', function(req, res) {author.author_update_proc(req, res, req.body);})
app.post('/author_delete', function(req, res) {author.author_delete(req, res, req.body);})

app.use(function(req, res, next){
  res.status(404).send("Page can't be found!!")
});
app.use(function(err, req, res, next){
  res.status(500).send('Something is broken!!')
});
app.listen(port, () => {
  console.log(`Express() app listening at http://localhost:${port}`)
})
