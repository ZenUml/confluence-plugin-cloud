
const EXAMPLE = '//Here is an example\n' +
'//Replace it with your own sequence\n' +
'BookController.getBook(id) {\n' +
'  bookDto = BookService.getBook(id) {\n' +
'    bookEntity = BookRepository.findOne(id)\n' +
'    bookDto = BookConverter.convert(bootEntity)\n' +
'  }\n' +
'}';

function propertyKey(uuid) {
  const macroKey = 'zenuml-sequence-macro';
  return `${macroKey}-${uuid}-body`;
}

function getUrlParam (param) {
  var codedParam = (new RegExp(param + '=([^&]*)')).exec(window.location.search)[1];
  return decodeURIComponent(codedParam);
};

//https://gist.github.com/hagenburger/500716
var JavaScript = {
  load: function(src, callback) {
	  var loaded;
	  var script = document.createElement('script');
	  script.setAttribute('src', src);

	  if (callback) {
	    script.onreadystatechange = script.onload = function() {
	      if (!loaded) {
		callback();
	      }
	      loaded = true;
	    };
	  }
	  document.getElementsByTagName('head')[0].appendChild(script);
	  return script;
	}
};

function loadMacroBody(callback) {
  AP.require("request", function(request) {
    let pageId = getUrlParam("pageId");
    var pageVersion = getUrlParam("pageVersion");
    var macroId = getUrlParam("macroId");
    request({
      url: "/rest/api/content/" + pageId +
      "/history/" + pageVersion +
      "/macro/id/" + macroId,
      success: function(response) {
	var macro = JSON.parse(response);
	callback(macro.body);
      }
    });
  });
}

function getConnectUrl() {
  var baseUrl = getUrlParam('xdm_e') + getUrlParam('cp');
  var url = baseUrl + '/atlassian-connect/all.js';
  return url;
}

function uuidv4() {
  return ([1e7]+-1e3+-4e3+-8e3+-1e11).replace(/[018]/g, c =>
    (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
  );
}
