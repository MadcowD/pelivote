// background.js
// by William Guss 2014


//clears the cookies on gorilla :)
function clearCookies(tab, cb){
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
		cb();

	});
}

//registers an account
function register(tab, cb){
	//change the page bro
	chrome.tabs.update(tab.id, {url: 'http://www.gorillamusic.com/register/'},
		function(registerTab){
			console.log("registering");
			//Let's fill in the page now with some cool stuff!
			chrome.tabs.executeScript(registerTab.id, {file: 'register.js'}, function(res){
				//Finally let's vote for the pelicant's
				setTimeout(function(){
				    //after 10 seconds call the vote function
				    cb();
				}, 25000);
			});
	});	
}

function vote(tab, cb){
	//change the page bro
	chrome.tabs.update(tab.id, {url: 'http://www.gorillamusic.com/?contestants=the-pelicants'},
		function(registerTab){
			console.log("voting");
			//Let's fill in the page now with some cool stuff!
			chrome.tabs.executeScript(registerTab.id,
			 {code: 'document.getElementById("vote10057").click();'},
			 function(res){
				console.log("finished");
				
				setTimeout(function(){
						cb();
				}, 5000);

			 });
	});	
}


function vote(n, tab){
	var iterator = 0;
	var voteoperation = 
		//clear cookies
		function(tab, loop){
			clearCookies(tab, function(){
				register(tab, function(){
					vote(tab, function(){
						if(iterator < n){
							iterator++;
							loop(tab, loop);
						}
					})
				})	
			})
		};

	voteoperation(tab, voteoperation);

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
			vote(170, tab);
		}
		else
			chrome.tabs.executeScript({
				code:'alert("not on gorilla music");'
			});
	});
};





chrome.browserAction.onClicked.addListener(click);