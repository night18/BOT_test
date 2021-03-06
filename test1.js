var restify = require('restify');
var builder = require('botbuilder');

//=========================================================
// Bot Setup
//=========================================================

// Setup Restify Server
var server = restify.createServer();
server.listen(process.env.port || process.env.PORT || 3978, function () {
   console.log('%s listening to %s', server.name, server.url); 
});
  
// Create chat bot
var connector = new builder.ChatConnector({
    appId: process.env.MICROSOFT_APP_ID,
    appPassword: process.env.MICROSOFT_APP_PASSWORD
});
var bot = new builder.UniversalBot(connector);
server.post('/api/messages', connector.listen());
var intents = new builder.IntentDialog();

//=========================================================
// Bots Dialogs
//=========================================================

bot.dialog('/',intents);

intents.matches(/^change name/i,[
	function(session){
		session.beginDialog('/askName');
	},
	function(session, results){
		session.send('OK! Change your name to %s !', session.privateConversationData.name);
	}]);

intents.onDefault( [
	function(session, args, next){
		if(!session.privateConversationData.name){
			session.beginDialog('/askName');
		}else{
			next();
		}
		
	},
	function(session, results){
		session.send('Hello %s !', session.privateConversationData.name);
	}
]);

// bot.dialog('/', [
// 	function(session, args, next){
// 		if(!session.privateConversationData.name){
// 			session.beginDialog('/askName');
// 		}else{
// 			next();
// 		}
		
// 	},
// 	function(session, results){
// 		session.send('Hello %s !', session.privateConversationData.name);
// 	}
// ]);

bot.dialog('/askName',[
	function(session){
		builder.Prompts.text(session, 'Hi, what is your name?');
	},
	function(session, results){
		session.privateConversationData.name = results.response;
		session.endDialog();
	}]
)