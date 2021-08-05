
module.exports = {
  HTML: function (title, list, body, control) {
    return `
    <!doctype html>
    <html>
    <head>
      <title>Node.js - ${title}</title>
      <meta charset="utf-8">
    </head>
    <body>
      <h1><a href="/">Node.js with MariaDB</a></h1>
      <p><a href="/author">Author</a></p>
      ${list}
      ${control}
      ${body}
    </body>
    </html>
    `;
  }, list: function (topics) {
    var list = '<ul>';
    var i = 0;
    while (i < topics.length) {
      list = list + `<li><a href="/page/${topics[i].id}">${topics[i].title}</a></li>`;
      i = i + 1;
    }
    list = list + '</ul>';
    return list;
  }, authorSelect: function (authors, author_id) {
    var tag = '';
    var i = 0;
    while (i < authors.length) {
      var selected = '';
      if (authors[i].id === author_id) {
        selected = ' selected';
      }
      tag += `<option value="${authors[i].id}"${selected}>${authors[i].name}</option>`;
      i++;
    }
    return `
      <select name="author">
        ${tag}
      </select>
    `
  }, authorList: function (authors) {
    let authorList = '<table>'; 
    authorList += `
        <tr>
            <th>Name</th>
            <th>Profile</th>
            <th>update</th>
            <th>delete</th>
        </tr>
        `;
    let i = 0;
    while (i < authors.length) {
      authorList += `
        <tr>
            <td>${authors[i].name}</td>
            <td>${authors[i].profile}</td>
            <td><a href="/author_update/${authors[i].id}">update</a></td>
            <td>
              <form action="/author_delete" method="post">
              <input type="hidden" name="id" value="${authors[i].id}">
              <input type="submit" value="delete"></form>
            </td>
        </tr>`;
      i++;
    }
    authorList += '</table>';
    return authorList;
  }
}
  
