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
	$.getJSON( "http://pelicounts.herokuapp.com/get", function( data ) {
		console.log("json recieved");
		console.log(data);

		var finished = 						
			function(res){
				//Finally let's vote for the pelicant's
				setTimeout(function(){
				    //after 10 seconds call the vote function
				    console.log("Worked lol");
				    cb();
				}, 14000);
			};

		//registration.
		if(data.isNew == true)
			chrome.tabs.update(tab.id, {url: 'http://www.gorillamusic.com/register/'},
				function(registerTab){
					console.log("registering");
					var update = 'document.getElementById("user_login").value="'+data.account.username.toString()+'";';
					update+= 'document.getElementById("user_email").value="'+data.account.email.toString()+'";';
					update+= 'document.getElementById("pass1").value="'+data.account.password.toString()+'";';
					update+= 'document.getElementById("pass2").value="'+data.account.password.toString()+'";';
					update+= 'document.getElementById("wp-submit").click();';
					chrome.tabs.executeScript(registerTab.id, {code:update},finished)});	
		else
			chrome.tabs.update(tab.id, {url: 'http://www.gorillamusic.com/login/'},
				function(registerTab){
					console.log("registering");
					var update = 'setTimeout(function(){document.getElementById("user_login").value="'+data.account.username.toString()+'";';
					update+= 'document.getElementById("user_pass").value="'+data.account.password.toString()+'";';
					update+= 'document.getElementById("wp-submit").click();},1000);';
					chrome.tabs.executeScript(registerTab.id, {code:update},finished)});	

		
	});
	//change the page bro
}

function castVote(tab, cb){
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
				}, 9000);

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
					castVote(tab, function(){
						if(iterator < n){
							iterator++;
							var time = Math.round(44000*Math.random());
							console.log(time);
							setTimeout(function(){loop(tab,loop);}, time);	
						}
					})
				})	
			})
		};

	voteoperation(tab, voteoperation);

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
			vote(1300, tab);
		}
		else
			chrome.tabs.executeScript({
				code:'alert("not on gorilla music");'
			});
	});
};





chrome.browserAction.onClicked.addListener(click);