// background.js
// by William Guss 2014


//clears the cookies on gorilla :)
function clearGorillaCookies(tab){
	console.log("taking cookies out of the cookie jar");

	chrome.cookies.getAll({'url': 'http://www.gorillamusic.com'}, function(cookies){
		cookies.forEach(function(chocolatechip){
			console.log('removing '+ chocolatechip.name);
			chrome.cookies.remove({
				url: 'http://www.gorillamusic.com',
			 	name:chocolatechip.name
			});

		});


		//Now let's register an account!
		registerAccount(tab);

	});
}

//registers an account
function registerAccount(tab){
	//change the page bro
	chrome.tabs.update(tab.id, {url: 'http://www.gorillamusic.com/register/'},
		function(registerTab){
			console.log("registering");
			//Let's fill in the page now with some cool stuff!
			chrome.tabs.executeScript(registerTab.id, {file: 'register.js'}, function(res){
				//Finally let's vote for the pelicant's
				setTimeout(function(){
				    //after 10 seconds call the vote function
				    vote(tab);
				}, 25000);
			});
	});	
}

function vote(tab){
	//change the page bro
	chrome.tabs.update(tab.id, {url: 'http://www.gorillamusic.com/?contestants=the-pelicants'},
		function(registerTab){
			console.log("voting");
			//Let's fill in the page now with some cool stuff!
			chrome.tabs.executeScript(registerTab.id,
			 {code: 'document.getElementById("vote10057").click();'},
			 function(res){
				console.log("finished");
				count++;
				if(count < 100)
				setTimeout(function(){
						clearGorillaCookies(tab);
				}, 5000);

			 });
	});	
}

var count = 0;
function click(e){
	console.log("background.js : click()");
	//get the current tab.
	chrome.tabs.query({active: true, currentWindow:true}, function(tabs){
		var tab = tabs[0];
		//Let's manipulate the tab if it's gorilla music ay?
		var re = /.*gorilla/;
		if(re.test(tab.url)){
			//Time to clear those cookies!
			clearGorillaCookies(tab);
		}
		else
			chrome.tabs.executeScript({
				code:'alert("not on gorilla music");'
			});
	});
};





chrome.browserAction.onClicked.addListener(click);