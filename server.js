const fetch = require('node-fetch');
const express = require('express');
const fs = require('fs');
const Handlebars = require('handlebars');
const app = express();
const port = 3000;
let head = null;
let footer = null;

fs.readFile('components/head.html', 'utf8', function(err, file) {
  Handlebars.registerPartial('head', file);
  head = file
});

fs.readFile('components/footer.html', 'utf8', function(err, file) {
  Handlebars.registerPartial('foot', file);
  footer = file
});

function rgbToHex(r, g, b) {
  // times 255 to convert to convert from decimal place
  return 'rgba(' +  r * 255 + ',' + g * 255 + ',' +  b * 255 + ')'
}

function buildHeader(header) {
  console.log(header)
  const bg = rgbToHex(header.backgroundColor.r , header.backgroundColor.g, header.backgroundColor.b)
  const text = header.children.filter(child => child.type == 'TEXT')[0].characters
  fs.readFile('components/header.html', 'utf8', function(err, source) {
    var template = Handlebars.compile(head + source + footer);
    var context = {bg, text};
    var html = template(context);
    var fs = require('fs');
    fs.writeFile('tmp/email.html', html, function(err) {
      if(err) {return console.log(err);}
      console.log('The file was saved!');
    });
  });
  // console.log(html)
  // email.filter(child => child.name.toLowerCase() == 'header')[0].children
  // .map(frame => {
  //   console.log(frame)
  //   return {
  //   name: frame.name,
  //   id: frame.id
  //   }
  // })
}

function convert(doc) {
  let content = doc.children[0].children.filter(child => child.type == 'FRAME')[0].children
  content.forEach(component => {
    // build component in to file
    // match component with HTML file
    if (component.name === 'header') {
      buildHeader(component)
    }
  });
}

const getFigmaFile = async (url) => {
  try {
    const response = await fetch(url,{
      method: 'GET',
      headers: { "x-figma-token": '4378-ec89dc8d-6301-4ee7-ae8f-8fa7341a0f43'}
    });
    const json = await response.json();
    convert(json.document)
    // console.log(json.results[0]);
  } catch (error) {
    console.log(error);
  }
};

app.get('/convert', (req, response) => {
  // response.send('Hello from Express!')
  // fetch('https://api.figma.com/v1' + 'files', {
  //     method: 'GET',
  //     headers: { "x-figma-token": PERSONAL_ACCESS_TOKEN }
  // }).then(function(response) {
  //     return response.json();
  // }).catch(function (error) {
  //     return { err: error };
  // });
  const url = 'https://api.figma.com/v1/files/' + req.query.key + '?id=' + req.query.id;
  getFigmaFile(url)
})

app.use('/', express.static(__dirname + '/'));

app.listen(port, (err) => {
  if (err) {
    return console.log('something bad happened', err)
  }

  console.log(`server is listening on ${port}`)
})
