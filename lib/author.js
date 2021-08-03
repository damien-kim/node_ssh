let db = require('./db');
var template = require('./template.js');
var url = require('url');
var qs = require('querystring');
var sanitizeHtml = require('sanitize-html');
var alert = require('alert'); //Node 에서 OS를 통한 alert을 사용할 수 있게끔 하기 위한 library

exports.list = function(request, response) {
    db.query('SELECT * FROM topic', function (error, topics) {
        db.query('SELECT * FROM author', function(error2, authors){
        var title = 'Author List';
        var list = template.list(topics);
        var html = template.HTML(sanitizeHtml(title), list,
          `
          <h2>${title}</h2>
            ${template.authorList(authors)}
            <style>
                table, th, td{
                    border:1px solid black;
                }
            </style>
            <form action="/author_create" method="post">
            <p><input type="text" name="title" placeholder="title"></p>
            <p><textarea name="profile" placeholder="profile"></textarea></p>
            <input type="submit", value="create">
            </form>
          `,''
        );
        response.writeHead(200);
        response.end(html);
        })
    });
}
exports.update = function(request, response) {
    var _url = request.url;
    var queryData = url.parse(_url, true).query;
    db.query('SELECT * FROM topic', function (error, topics) {
        db.query('SELECT * FROM author WHERE id=?', [queryData.id], function(error3, selected){
            db.query('SELECT * FROM author', function(error2, authors){
            var title = 'Author List';
            var list = template.list(topics);
            var html = template.HTML(title, list,
            `
            <h2>${title}</h2>
                ${template.authorList(authors)}
            <style>
            table, th, td{
                border:1px solid black;
            }
            </style>
            <form action="/author_update_proc" method="post">
                <p><input type="text" name="name" placeholder="${sanitizeHtml(selected[0].name)}" value="${sanitizeHtml(selected[0].name)}"></p>
                <input type="hidden" name="id" value="${selected[0].id}">
                <p><textarea name="profile" placeholder="${sanitizeHtml(selected[0].profile)}">${sanitizeHtml(selected[0].profile)}</textarea></p>
                <input type="submit", value="update">
            </form>
            `,''
            );
            response.writeHead(200);
            response.end(html);
            })
        })
    });
}
exports.create = function(request, response) {
    var body = '';
    request.on('data', function (data) {
      body = body + data;
    });
    request.on('end', function () {
      var post = qs.parse(body);
      if (post.title === ''|| post.profile === '') { // title혹은 profile이 null일 경우 database 생성하지 않음
        alert('Wrong data input!!')
        response.writeHead(302, {Location: `/author`});
        response.end();
      } else {
        db.query(`
        INSERT INTO author (name, profile) 
          VALUES (?, ?)`, 
          [sanitizeHtml(post.title), sanitizeHtml(post.profile)], 
          function(error, result) {
            if(error) {throw error;}
        
        response.writeHead(302, {Location: `/author`});
        response.end();
        })  
      }
    });
}

exports.author_update_proc = function(request, response){
    var body = '';
    request.on('data', function (data) {
      body = body + data;
    });
    request.on('end', function () {
      var post = qs.parse(body);
      db.query('UPDATE author SET name=?, profile=? WHERE id=?', [sanitizeHtml(post.name), sanitizeHtml(post.profile), post.id], function(error,reseult){
        if(error){
          throw error;
        }
        response.writeHead(302, { Location: `/author` });
        response.end();
      })
    });
}

exports.author_delete = function(request, response) { //삭제는 반드시 post로 처리해야함
    var body = '';
    request.on('data', function (data) {
      body = body + data;
    });
    request.on('end', function () {
      var post = qs.parse(body);
      db.query('DELETE FROM author WHERE id = ?', [post.id], function(error, result){
        if(error) {
          throw error;
        }
      })
        response.writeHead(302, { Location: `/author` });
        response.end();
    });
}