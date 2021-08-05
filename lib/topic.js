
let db = require('./db');
var template = require('./template.js');
var url = require('url');
var qs = require('querystring');
var sanitizeHtml = require('sanitize-html');

exports.home = function(request, response) {
    db.query('SELECT * FROM topic', function (error, topics) {
        var title = 'Welcome';
        var description = 'Hello, Node.js Programming!!';
        var list = template.list(topics);
        var html = template.HTML(title, list,
          `<h2>${title}</h2>${description}`,
          `<a href="/create">create</a>`
        );
        response.writeHead(200);
        response.end(html);
    });
}

exports.page = function(request, response){
    var _url = request.url;
    var queryData = url.parse(_url, true).query;
    db.query('SELECT * FROM topic', function (error, topics) { 
        if (error) { throw error; }
        db.query(`SELECT * FROM topic LEFT JOIN author on topic.author_id = author.id WHERE topic.id=?`,[queryData.id], function (error2, topic) { //id=? [배열]물음표 값을 다음 배열에 담아서 넘김. 공격을 세탁해 주는 역할!!
          if (error2) { throw error2;}
          var title = topic[0].title;
          var description = topic[0].description;
          var list = template.list(topics);
          var html = template.HTML(title, list,
          `<h2>${sanitizeHtml(title)}</h2>${sanitizeHtml(description)} <p>by ${sanitizeHtml(topic[0].name)}</p>`,
          `<a href="/create">create</a>
          <a href="/update?id=${queryData.id}">update</a>
          <form action="delete_process" method="post">
            <input type="hidden" name="id" value="${queryData.id}">
            <p><input type="submit" value="delete"></p>
          </form>`);
        response.writeHead(200);
        response.end(html);
        });
      });
}

exports.create = function(request, response) {
    db.query('SELECT * FROM topic', function (error, topics) {
        db.query('SELECT * FROM author', function(error2, authors) {
          var title = 'Welcome';
          var list = template.list(topics);
          var html = template.HTML(sanitizeHtml(title), list,
            `
            <form action="/create_process" method="post">
              <p><input type="text" name="title" placeholder="title"></p>
              <p><textarea name="description" placeholder="description"></textarea></p>
              <p>${template.authorSelect(authors)}</p>
              <p>
              <input type="submit">
            </p>
          </form>`,
          `<a href="/create">create</a>`);
        response.writeHead(200);
        response.end(html);
        });
      });
}

exports.create_process = function(request, response) {
    var body = '';
    request.on('data', function (data) {
      body = body + data;
    });
    request.on('end', function () {
      var post = qs.parse(body);
      db.query(`INSERT INTO topic (title, description, created, author_id) 
          VALUES (?, ?, NOW(), ?)`, 
          [sanitizeHtml(post.title), sanitizeHtml(post.description), sanitizeHtml(post.author)], 
          function(error, result) {
            if(error) {throw error;}
        
        response.writeHead(302, {Location: `/?id=${result.insertId}`});
        response.end();
      })  
    });
}

exports.update = function (request, response) {
    var _url = request.url;
    var queryData = url.parse(_url, true).query;
    db.query('SELECT * FROM topic', function(error, topics){
        if(error) {
          throw error;
        }
        db.query('SELECT * FROM topic where id=?',[queryData.id], function(error2, topic){
          if(error2) {
            throw error2;
          }
          db.query('SELECT * FROM author', function(error2, authors) {
            var list = template.list(topics);
            var html = template.HTML(topic[0].title, list,
              `
                <form action="/update_process" method="post">
                  <input type="hidden" name="id" value="${topic[0].id}">
                  <p><input type="text" name="title" placeholder="title" value="${sanitizeHtml(topic[0].title)}"></p>
                  <p>
                    <textarea name="description" placeholder="description">${sanitizeHtml(topic[0].description)}</textarea>
                  </p>
                  <p>${template.authorSelect(authors, topic[0].author_id)}</p>
                  <p><input type="submit"></p>
                </form>
                `,
              `<a href="/create">create</a> <a href="/update?id=${topic[0].id}">update</a>`
            );
            response.writeHead(200);
            response.end(html);
          });
        });
      });
}

exports.update_process = function(request, response) {
    var body = '';
    request.on('data', function (data) {
      body = body + data;
    });
    request.on('end', function () {
      var post = qs.parse(body);
      db.query('UPDATE topic SET title=?, description=?, author_id=? WHERE id=?', [post.title, post.description, post.author, post.id], function(error,reseult){
        if(error){
          throw error;
        }
        response.writeHead(302, { Location: `/?id=${post.id}` });
        response.end();
      })
    });
}
exports.delete_process = function(request, response) {
    var body = '';
    request.on('data', function (data) {
      body = body + data;
    });
    request.on('end', function () {
      var post = qs.parse(body);
      db.query('DELETE FROM topic WHERE id = ?', [post.id], function(error, result){
        if(error) {
          throw error;
        }
      })
        response.writeHead(302, { Location: `/` });
        response.end();
    });
}