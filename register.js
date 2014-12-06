///william guss register

//generate a random name and email.
'var card = faker.helpers.createCard();
var password = faker.internet.password();
document.getElementById("user_login").value= card.username;
document.getElementById("user_email").value= card.email;
document.getElementById("pass1").value= password;
document.getElementById("pass2").value= password;
document.getElementById("wp-submit").click();'; 