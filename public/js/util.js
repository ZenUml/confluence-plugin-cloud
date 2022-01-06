const HELP_DESK_URL = 'https://zenuml.atlassian.net/servicedesk/customer/portals';

function getUrlParam (param) {
  let codeParams = (new RegExp(param + '=([^&]*)')).exec(window.location.search);
  if(codeParams && codeParams.length >= 1) {
    const codedParam = codeParams[1];
    return decodeURIComponent(codedParam);
  }
  return null;
}

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

function getConnectUrl() {
  return 'https://connect-cdn.atl-paas.net/all.js';
}

function loadConnect(callback) {
	return JavaScript.load(getConnectUrl(), callback);
}

function uuidv4() {
  return ([1e7]+-1e3+-4e3+-8e3+-1e11).replace(/[018]/g, c =>
    (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
  );
}

function reportError(error, context) {
  console.error(`Error in ${context}. Please report to our helpdesk: ${HELP_DESK_URL}`, error);
}

function getOneYearLater() {
	const date = new Date();
	const nextYear = date.getFullYear() + 1;
	if(nextYear > new Date(8640000000000000).getFullYear()) {
		throw 'Date value out of range';
	}
	date.setFullYear(nextYear);
	return date;
}

function clone(o) {
	return JSON.parse(JSON.stringify(o));
}

function getAtlassianDomain() {
	const pattern = /\/\/(\w+)\.atlassian\.net/i;
	const xdme = getUrlParam('xdm_e');
	const url = xdme && decodeURIComponent(xdme);
	const result = pattern.exec(url);
	if(result && result.length > 1) {
		return result[1];
	}
return '';
}