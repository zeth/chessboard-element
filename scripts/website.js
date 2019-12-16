// -----------------------------------------------------------------------------
// This file builds the contents of the website/ folder.
// -----------------------------------------------------------------------------

import { createRequire } from 'module';
const require = createRequire(import.meta.url);

// libraries
const fs = require('fs-plus')
const kidif = require('kidif')
const mustache = require('mustache')
const docs = require('../data/docs.json')

const encoding = {encoding: 'utf8'}

// toggle development version
const useDevFile = true;
const jsCDNLink = '<script type="module" src="https://unpkg.com/chessboard-element"></script>'

let chessboardJsScript = jsCDNLink
if (useDevFile) {
  chessboardJsScript = '<script type="module" src="../chessboard-element.js"></script>';
}

// grab some mustache templates
const docsTemplate = fs.readFileSync('templates/docs.mustache', encoding)
const downloadTemplate = fs.readFileSync('templates/download.mustache', encoding)
const examplesTemplate = fs.readFileSync('templates/examples.mustache', encoding)
const homepageTemplate = fs.readFileSync('templates/homepage.mustache', encoding)
const singleExampleTemplate = fs.readFileSync('templates/single-example.mustache', encoding)
const licensePageTemplate = fs.readFileSync('templates/license.mustache', encoding)
const headTemplate = fs.readFileSync('templates/_head.mustache', encoding)
const headerTemplate = fs.readFileSync('templates/_header.mustache', encoding)
const footerTemplate = fs.readFileSync('templates/_footer.mustache', encoding)

// grab the examples
const examplesArr = kidif('examples/*.example')
console.assert(examplesArr, 'Could not load the Example files')
console.assert(examplesArr.length > 1, 'Zero examples loaded')

const examplesObj = examplesArr.reduce(function (examplesObj, example, idx) {
  examplesObj[example.id] = example
  return examplesObj
}, {})

const examplesGroups = [
  {
    name: 'Basic Usage',
    examples: [1000, 1001, 1002, 1003, 1004]
  },
  {
    name: 'Config',
    examples: [2000, 2044, 2063, 2001, 2002, 2003, 2082, 2004, 2030, 2005, 2006]
  },
  {
    name: 'Methods',
    examples: [3000, 3001, 3002, 3003, 3004, 3005, 3007]
  },
  {
    name: 'Events',
    examples: [4000, 4001, 4002, 4003, 4004, 4005, 4006, 4011, 4012]
  },
  {
    name: 'Integration',
    examples: [5000, 5001, 5002, 5003, 5004, 5005]
  }
]

const homepageExample2 = `
startBtn.addEventListener('click', () => board3.start());
clearBtn.addEventListener('click', () => board3.clear());`.trim()

function writeHomepage () {
  const headHTML = mustache.render(headTemplate, {pageTitle: 'Homepage'})

  const html = mustache.render(homepageTemplate, {
    chessboardJsScript: chessboardJsScript,
    example2: homepageExample2,
    footer: footerTemplate,
    head: headHTML
  })
  fs.writeFileSync('website/index.html', html, encoding)
}

function writeExamplesPage () {
  const headHTML = mustache.render(headTemplate, {pageTitle: 'Examples'})
  const headerHTML = mustache.render(headerTemplate, {examplesActive: true})

  const html = mustache.render(examplesTemplate, {
    chessboardJsScript: chessboardJsScript,
    // examplesJavaScript: buildExamplesJS(),
    footer: footerTemplate,
    head: headHTML,
    header: headerHTML,
    nav: buildExamplesNavHTML()
  })
  fs.writeFileSync('website/examples.html', html, encoding)
  fs.writeFileSync('website/js/generated-examples.js', buildExamplesJS(), encoding);
}

const configTableRowsHTML = docs.config.reduce(function (html, itm) {
  if (isString(itm)) return html
  return html + buildConfigDocsTableRowHTML('config', itm)
}, '')

const methodTableRowsHTML = docs.methods.reduce(function (html, itm) {
  if (isString(itm)) return html
  return html + buildMethodRowHTML(itm)
}, '')

const eventTableRowsHTML = docs.events.reduce(function (html, itm) {
  if (isString(itm)) return html
  return html + buildEventRowHTML('event', itm);
}, '')

const errorRowsHTML = docs.errors.reduce(function (html, itm) {
  if (isString(itm)) return html
  return html + buildErrorRowHTML(itm)
}, '')

function isIntegrationExample (example) {
  return (example.id + '').startsWith('5')
}

function writeSingleExamplePage (example) {
  if (isIntegrationExample(example)) {
    example.includeChessJS = true
  }
  example.chessboardJsScript = chessboardJsScript
  const html = mustache.render(singleExampleTemplate, example)
  fs.writeFileSync('website/examples/' + example.id + '.html', html, encoding)
}

function writeSingleExamplesPages () {
  examplesArr.forEach(writeSingleExamplePage)
}

function writeDocsPage () {
  const headHTML = mustache.render(headTemplate, {pageTitle: 'Documentation'})
  const headerHTML = mustache.render(headerTemplate, {docsActive: true})

  const html = mustache.render(docsTemplate, {
    configTableRows: configTableRowsHTML,
    errorRows: errorRowsHTML,
    footer: footerTemplate,
    head: headHTML,
    header: headerHTML,
    methodTableRows: methodTableRowsHTML,
    eventTableRows: eventTableRowsHTML,
  })
  fs.writeFileSync('website/docs.html', html, encoding)
}

function writeDownloadPage () {
  const headHTML = mustache.render(headTemplate, {pageTitle: 'Download'})
  const headerHTML = mustache.render(headerTemplate, {downloadActive: true})

  const html = mustache.render(downloadTemplate, {
    footer: footerTemplate,
    head: headHTML,
    header: headerHTML
  })
  fs.writeFileSync('website/download.html', html, encoding)
}

function writeLicensePage () {
  const html = mustache.render(licensePageTemplate)
  fs.writeFileSync('website/license.html', html, encoding)
}

function writeWebsite () {
  writeHomepage()
  writeExamplesPage()
  writeSingleExamplesPages()
  writeDocsPage()
  writeDownloadPage()
  writeLicensePage()
}

writeWebsite()

// -----------------------------------------------------------------------------
// HTML
// -----------------------------------------------------------------------------

function htmlEscape (str) {
  return (str + '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
    .replace(/\//g, '&#x2F;')
    .replace(/`/g, '&#x60;')
}

function buildExampleGroupHTML (idx, groupName, examplesInGroup) {
  const groupNum = idx + 1
  let html = '<h4 id="groupHeader-' + groupNum + '">' + groupName + '</h4>' +
    '<ul id="groupContainer-' + groupNum + '" style="display:none">'

  examplesInGroup.forEach(function (exampleId) {
    const example = examplesObj[exampleId]
    html += '<li id="exampleLink-' + exampleId + '">' + example.name + '</id>'
  })

  html += '</ul>'

  return html
}

function buildExamplesNavHTML () {
  let html = ''
  examplesGroups.forEach(function (group, idx) {
    html += buildExampleGroupHTML(idx, group.name, group.examples)
  })
  return html
}

function buildExamplesJS () {
  let txt = `
import * as chessUtils from '../../lib/chess-utils.js';
export const EXAMPLES = {};
export default EXAMPLES;
  `;

  examplesArr.forEach(function (ex) {
    txt += 'EXAMPLES["' + ex.id + '"] = {\n' +
      '  description: ' + JSON.stringify(ex.description) + ',\n' +
      '  html: ' + JSON.stringify(ex.html) + ',\n' +
      '  name: ' + JSON.stringify(ex.name) + ',\n' +
      '  jsStr: ' + JSON.stringify(ex.js) + ',\n' +
      '  jsFn: function () {\n' + ex.js + '\n  }\n' +
      '};\n\n'
  })

  return txt
}

function buildConfigDocsTableRowHTML (propType, prop) {
  let html = ''

  // table row
  html += '<tr id="' + propType + ':' + prop.name + '">'

  // property and type
  html += '<td>' + buildPropertyAndTypeHTML(propType, prop.name, prop.type) + '</td>'

  // default
  html += '<td class="center"><p>' + buildDefaultHTML(prop.default) + '</p></td>'

  // description
  html += '<td>' + buildDescriptionHTML(prop.desc) + '</td>'

  // examples
  html += '<td>' + buildExamplesCellHTML(prop.examples) + '</td>'

  html += '</tr>'

  return html
}

function buildEventRowHTML (propType, prop) {
  let html = ''

  // table row
  html += '<tr id="' + propType + ':' + prop.name + '">'

  // property and type
  html += '<td>' + buildPropertyAndTypeHTML(propType, prop.name, prop.type) + '</td>'

  // description
  html += '<td>' + buildDescriptionHTML(prop.desc) + '</td>'

  // examples
  html += '<td>' + buildExamplesCellHTML(prop.examples) + '</td>'

  html += '</tr>'

  return html
}

function buildMethodRowHTML (method) {
  const nameNoParens = method.name.replace(/\(.+$/, '')

  let html = ''

  // table row
  if (method.noId) {
    html += '<tr>'
  } else {
    html += '<tr id="methods:' + nameNoParens + '">'
  }

  // name
  html += '<td><p><a href="docs.html#methods:' + nameNoParens + '">' +
    '<code class="js plain">' + method.name + '</code></a></p></td>'

  // args
  if (method.args) {
    html += '<td>'
    method.args.forEach(function (arg) {
      html += '<p>' + arg[1] + '</p>'
    })
    html += '</td>'
  } else {
    html += '<td><small>none</small></td>'
  }

  // description
  html += '<td>' + buildDescriptionHTML(method.desc) + '</td>'

  // examples
  html += '<td>' + buildExamplesCellHTML(method.examples) + '</td>'

  html += '</tr>'

  return html
}

function buildPropertyAndTypeHTML (section, name, type) {
  let html = '<p><a href="docs.html#' + section + ':' + name + '">' +
    '<code class="js plain">' + name + '</code></a></p>' +
    '<p class=property-type-7ae66>' + buildTypeHTML(type) + '</p>'
  return html
}

function buildTypeHTML (type) {
  if (!Array.isArray(type)) {
    type = [type]
  }

  let html = ''
  for (var i = 0; i < type.length; i++) {
    if (i !== 0) {
      html += ' <small>or</small><br />'
    }
    html += type[i]
  }

  return html
}

function buildRequiredHTML (req) {
  if (!req) return 'no'
  if (req === true) return 'yes'
  return req
}

function buildDescriptionHTML (desc) {
  if (!Array.isArray(desc)) {
    desc = [desc]
  }

  let html = ''
  desc.forEach(function (d) {
    html += '<p>' + d + '</p>'
  })

  return html
}

function buildDefaultHTML (defaultValue) {
  if (!defaultValue) {
    return '<small>n/a</small>'
  }
  return defaultValue
}

function buildExamplesCellHTML (examplesIds) {
  if (!Array.isArray(examplesIds)) {
    examplesIds = [examplesIds]
  }

  let html = ''
  examplesIds.forEach(function (exampleId) {
    var example = examplesObj[exampleId]
    if (!example) return
    html += '<p><a href="examples.html#' + exampleId + '">' + example.name + '</a></p>'
  })

  return html
}

function buildErrorRowHTML (error) {
  let html = ''

  // table row
  html += '<tr id="errors:' + error.id + '">'

  // id
  html += '<td class="center">' +
    '<p><a href="docs.html#errors:' + error.id + '">' + error.id + '</a></p></td>'

  // desc
  html += '<td><p>' + error.desc + '</p></td>'

  // more information
  if (error.fix) {
    if (!Array.isArray(error.fix)) {
      error.fix = [error.fix]
    }

    html += '<td>'
    error.fix.forEach(function (p) {
      html += '<p>' + p + '</p>'
    })
    html += '</td>'
  } else {
    html += '<td><small>n/a</small></td>'
  }

  html += '</tr>'

  return html
}

function isString (s) {
  return typeof s === 'string'
}
