
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
