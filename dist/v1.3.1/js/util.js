
const EXAMPLE = `// Sample! Declare the participants (optional)
BookService BookRepository Receipt Notification
@Starter(User)
"{id, dueDate, ...}" = BookService.Borrow(id) {
  BookRepository.Update(id, onLoan)

  // Send Event with "Source->Target:Event". "Source->" is optional
  Notification:BOOK_ON_LOAN event with id, due date, etc. 
  new Receipt(id, dueDate)
}
`

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
  return 'https://connect-cdn.atl-paas.net/all.js';
}

function uuidv4() {
  return ([1e7]+-1e3+-4e3+-8e3+-1e11).replace(/[018]/g, c =>
    (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
  );
}
