// background.js
// by William Guss 2014


//clears the cookies on gorilla :)
function clearGorillaCookies(){
	console.log("taking cookies out of the cookie jar");

	chrome.cookies.getAll({'url': '\thttp://www.gorillamusic.com'}, function(cookies){
		cookies.forEach(function(chocolatechip){
			console.log('removing '+ chocolatechip.name);
			chrome.cookies.remove({
				url: 'http://www.gorillamusic.com',
			 	name:chocolatechip.name
			});
		})
	});
}

//registers an account
function registerAccount(tab){
	//change the page bro
	chrome.tabs.update(tab.id, {url: 'http://www.gorillamusic.com/register/'},
		function(registerTab){
			//Let's fill in the page now with some cool stuff!
			chrome.tabs.executeScript(registerTab.id, {file: ''})
	});	
}


function click(e){
	console.log("background.js : click()");
	//get the current tab.
	chrome.tabs.query({active: true, currentWindow:true}, function(tabs){
		var tab = tabs[0];
		//Let's manipulate the tab if it's gorilla music ay?
		var re = /.*gorilla/;
		if(re.test(tab.url)){
			//Time to clear those cookies!
			//clearGorillaCookies();

			//Now let's register an account!
			registerAccount(tab);

			//Finally let's vote for the pelicant's
		}
		else
			chrome.tabs.executeScript({
				code:'alert("not on gorilla music");'
			});
	});
};





chrome.browserAction.onClicked.addListener(click);