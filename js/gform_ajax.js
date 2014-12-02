function disable_form_submit(gfid) {
	try{ document.getElementById('ss-submit-' + gfid).disabled = true; } catch(e){}
	try{ document.getElementById('ss-back-button-' + gfid).disabled = true; } catch(e){}
	try{ document.getElementById('ss-submit-spinner-' + gfid).style.visibility = "visible"; } catch(e){}
}

function enable_form_submit(gfid) {
	try{ document.getElementById('ss-submit-' + gfid).disabled = false; } catch(e){}
	try{ document.getElementById('ss-back-button-' + gfid).disabled = false; } catch(e){}
	try{ document.getElementById('ss-submit-spinner-' + gfid).style.visibility = "hidden"; } catch(e){}
}

var Post = new Object();
Post.Send = function(form){
	var gfid = form.id.replace('ss-form-', '');
	disable_form_submit(gfid);
	var query = Post.buildQuery(form);
	Ajax.Request(form.method, form.action, query, Post.OnResponse, gfid);
}

Post.OnResponse = function(httpReqObj, gfid){
	switch(httpReqObj.status){
		case 200:
			var html_obj = document.createElement('div');
			html_obj.innerHTML = httpReqObj.responseText;
			var parent_element = document.getElementById('scrapped-form-' + gfid);
			while (parent_element.firstChild) {
				parent_element.removeChild(parent_element.firstChild);
			}
			if (html_obj.hasChildNodes()) {
				var elements = html_obj.childNodes;
				for(var i=0; i<elements.length; i++) {
					var element = elements[i];
					var tagname = '';
					try { tagname = element.tagName.toLowerCase() } catch(e) {}
					if (tagname == 'script'){
						try {
							if (element.src){
								var scr = document.createElement("script");
								scr.type = 'text/javascript';
								scr.src = element.src;
								parent_element.appendChild(scr);
							} else {
								var scr = element.innerHTML;
								parent_element.appendChild(element);
								eval(scr);
							}
						} catch(e) {}
					} else {
						parent_element.appendChild(element);
					}
				}
			}
			break;
		case 400:
			document.getElementById('scrapped-form-' + gfid).innerHTML = '<p class="error"><b>Oops!</b><br>HTTP Error: 400 Bad Request<br>Requested form submission not supported.</p>';
			break;
		case 403:
			document.getElementById('scrapped-form-' + gfid).innerHTML = '<p class="error"><b>Oops!</b><br>HTTP Error: 403 Forbidden<br> Requested form submission forbidden.</p>';
			break;
		case 404:
			document.getElementById('scrapped-form-' + gfid).innerHTML = '<p class="error"><b>Oops!</b><br>HTTP Error: 404 Not Found<br>Requested form not found.</p>';
			break;
		case 405:
			document.getElementById('scrapped-form-' + gfid).innerHTML = '<p class="error"><b>Oops!</b><br>HTTP Error: 405 Method Not Allowed<br>Requested form submission method not allowed..</p>';
			break;
		case 408:
			alert('Oops!\nHTTP Error: 408 Request Timeout\nRequested form submission timed out!\nPlease retry...');
			break;
		case 500:
			document.getElementById('scrapped-form-' + gfid).innerHTML = '<p class="error"><b>Oops!</b><br>HTTP Error: 500 Internal Server Error<br>Internal server error occured.</p>';
			break;
		default:
			alert("Server error occurred in submitting the form.\nPlease retry...");
	}
	enable_form_submit(gfid);
}

Post.buildQuery = function(form){
	var query = "";
	for(var i=0; i<form.elements.length; i++)
	{
		var type = Post.getElementType(form.elements[i]);
		if (type != "submit"){
			var key = form.elements[i].name;
			var value = Post.getElementValue(form.elements[i]);
			if(key && (value || !(type == "radio" || type == "checkbox")))
				query += key + "=" + encodeURIComponent(value) + "&";
		}
	}
	bn = form.getAttribute("bn");
	bv = form.getAttribute("bv");
	if (bn && bv && bn != "submit"){
		query += bn + "=" + encodeURIComponent(bv) + "&";
	}
	if(query)
		query = query.substring(0, query.length - 1);
	return query;
}

Post.getElementType = function(formElement){
	if(formElement.length != null) var type = formElement[0].type;
	if((typeof(type) == 'undefined') || (type == 0)) var type = formElement.type;
	return type;
}

Post.getElementValue = function(formElement){
	var type = Post.getElementType(formElement);
	switch(type)
	{
		case 'undefined': return;

		case 'radio':
			if(formElement.checked)
				return formElement.value;
			else
				return;

		case 'select-multiple':
			var myArray = new Array();
			for(var x=0; x < formElement.length; x++) 
				if(formElement[x].selected == true)
					myArray[myArray.length] = formElement[x].value;
			return myArray;

		case 'checkbox':
			if (formElement.checked)
				return formElement.value;
			else
				return;
	
		default: return formElement.value;
	}
}

var Ajax = new Object();
Ajax.isUpdating = true;
Ajax.Request = function(method, url, query, callback, gfid)
{
	this.isUpdating = true;
	this.gfid = gfid;
	this.callbackMethod = callback;
	this.request = (window.XMLHttpRequest)? new XMLHttpRequest(): new ActiveXObject("MSXML2.XMLHTTP");
	this.request.onreadystatechange = function() { Ajax.checkReadyState(); };
	if(method.toLowerCase() == 'get'){
		if(url.indexOf("?") == -1){
			url += "?" + query;
		} else {
			url += "&" + query;
		}
	}
	this.request.open(method, url, true);
	this.request.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
	this.request.setRequestHeader("X-Requested-With", "XMLHttpRequest");
	try{
		this.request.send(query);
	} catch(e) {
		request.abort();
		alert("Error occurred in submitting the form.\nPlease re-try.");
		enable_form_submit(this.gfid);
	}
}
	
Ajax.checkReadyState = function(_id)
{
	switch(this.request.readyState)
	{
		case 1: break;
		case 2: break;
		case 3: break;
		case 4:
			this.isUpdating = false;
			this.callbackMethod(this.request, this.gfid);
	}
}