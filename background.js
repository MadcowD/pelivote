// background.js
// by William Guss 2014

//CONFIG
var state = function(timeInit){
	this.votesToAcquire = 10000;
	this.daysToRun = 7,
	this.initialTime = timeInit.getTime();
	this.initialHour = timeInit.getHours() + timeInit.getMinutes()/60 + timeInit.getSeconds()/(60*60);
	this.currentVotes = 0;
	this.voteFunc= function(){
		var maxVotes = this.votesToAcquire/this.daysToRun;
		var t = ((new Date).getTime() - this.initialTime)/(60*60*1000) + initialHour;
		var votesAssumed = maxVotes*(Math.PI*initialHour + 12*Math.cos(1/12*Math.PI*(initialHour+3)) - 6*Math.sqrt(2))/(24*Math.PI);
		var targetVoteCount = maxVotes*(Math.PI*t + 12*Math.cos(1/12*Math.PI*(t+3)) - 6*Math.sqrt(2))/(24*Math.PI)  - votesAssumed;

		if(currentVotes > votesToAcquire)
			return -1;
		else
			return targetVoteCount;
	}
	return this;
}((new Date));



//clears the cookies on gorilla :)
function clearCookies(tab, cb){
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
		console.log(data);

		var finished = 						
			function(res){
				//Finally let's vote for the pelicant's
				setTimeout(function(){
				    cb();
				}, 14000);
			};

		//registration.
		if(data.isNew == true)
			chrome.tabs.update(tab.id, {url: 'http://www.gorillamusic.com/register/'},
				function(registerTab){

					var update = 'document.getElementById("user_login").value="'+data.account.username.toString()+'";';
					update+= 'document.getElementById("user_email").value="'+data.account.email.toString()+'";';
					update+= 'document.getElementById("pass1").value="'+data.account.password.toString()+'";';
					update+= 'document.getElementById("pass2").value="'+data.account.password.toString()+'";';
					update+= 'document.getElementById("wp-submit").click();';
					chrome.tabs.executeScript(registerTab.id, {code:update},finished)});	
		else
			chrome.tabs.update(tab.id, {url: 'http://www.gorillamusic.com/login/'},
				function(registerTab){
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
			//Let's fill in the page now with some cool stuff!
			chrome.tabs.executeScript(registerTab.id,
			 {code: 'document.getElementById("vote10057").click();'},
			 function(res){
				
				setTimeout(function(){
						cb();
				}, 6000);

			 });
	});	
}


function vote(tab){

	var voteoperation = 
		//clear cookies
		function(tab, loop){
			console.log("Attempting to vote!");
			clearCookies(tab, function(){
				register(tab, function(){
					castVote(tab, function(){
							state.currentVotes++;
							console.log("Voting successful! At " + state.currentVotes + "/" + state.votesToAcquire + " votes. V(t) = " + state.voteFunc());
							while(state.currentVotes > state.voteFunc());
							loop(tab,loop);
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
			console.log("Pelivote: T@" + state.votesToAcquire);
			vote(tab);
		}
		else
			chrome.tabs.executeScript({
				code:'alert("not on gorilla music");'
			});
	});
};



chrome.browserAction.onClicked.addListener(click);