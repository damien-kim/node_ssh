// Updated from if .. else to Express
let topic = require('./lib/topic');
let author = require('./lib/author');
const express = require('express')
const app = express()
const port = 3000;

app.get('/', function(req, res) { topic.home(req, res); })
app.get('/page/:pageId', function(req, res){ topic.page(req, res);})
app.get('/create', function(req, res) { topic.create(req, res); })
app.post('/create_process', function(req, res) { topic.create_process(req, res); })
app.get('/update/:pageId', function(req, res) { topic.update(req, res); })
app.post('/update_process', function(req, res) { topic.update_process(req, res); })
app.post('/delete_process', function(req, res) { topic.delete_process(req, res); })
app.get('/author', function(req, res) { author.list(req, res); })
app.post('/author_create', function(req, res) { author.create(req, res); })
app.get('/author_update/:authorId', function(req, res) { author.update(req, res); })
app.post('/author_update_proc', function(req, res) { author.author_update_proc(req, res); })
app.post('/author_delete', function(req, res) { author.author_delete(req, res);})

app.listen(port, () => {
  console.log(`Express() app listening at http://localhost:${port}`)
})
