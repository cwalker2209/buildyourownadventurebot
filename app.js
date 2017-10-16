var express = require('express');
var path = require('path');
var app = express();
var bodyParser = require('body-parser');
var twilio = require('twilio');

var oConnections = {};

// Define the port to run on
app.set('port', process.env.PORT || parseInt(process.argv.pop()) || 5100);

// Define the Document Root path
var sPath = path.join(__dirname, '.');

app.use(express.static(sPath));
app.use(bodyParser.urlencoded({ extended: true }));

function fBeginning(req, res){
  var sFrom = req.body.From;
  oConnections[sFrom].fCurState = fOutside;
  var twiml = new twilio.twiml.MessagingResponse();
  twiml.message('Welcome to this text based adventure. Actions you can peform are in capitals. Text START to begin.');
  res.writeHead(200, {'Content-Type': 'text/xml'});
  res.end(twiml.toString());
}

function fOutside(req, res){
  var sFrom = req.body.From;
  oConnections[sFrom].fCurState = fEntrance;
  var twiml = new twilio.twiml.MessagingResponse();
  twiml.message('You find yourself in front of an old abandoned mansion. Do you ENTER or do you LEAVE?');
  res.writeHead(200, {'Content-Type': 'text/xml'});
  res.end(twiml.toString());
}

function fEntrance(req, res){
  var sFrom = req.body.From;
  var sAction = req.body.Body;
  var twiml = new twilio.twiml.MessagingResponse();
  if(sAction.toLowerCase().search("enter") != -1){
    twiml.message("You find yourself in a hallway with many doors. Do you enter the FIRST, SECOND, or THIRD?");
    oConnections[sFrom].fCurState = fHall;
  }else if(sAction.toLowerCase().search("leave") != -1){  
    twiml.message("You find yourself unable to leave. You must ENTER");
  }else {
    twiml.message("You can not " + sAction + ". Choose one of the actions above")
  }
  res.writeHead(200, {'Content-Type': 'text/xml'});
  res.end(twiml.toString());
}

function fHall(req, res){
  var sFrom = req.body.From;
  var sAction = req.body.Body;
  var twiml = new twilio.twiml.MessagingResponse();
  if(sAction.toLowerCase().search("first") != -1){
    twiml.message("You find yourself in a dining hall with broken plates and cutlery thrown around. You can only LEAVE.");
    oConnections[sFrom].fCurState = fFirst;
  }else if(sAction.toLowerCase().search("second") != -1){  
    twiml.message("You find thestairs to the second floor. Do you go UP or LEAVE?");
    oConnections[sFrom].fCurState = fSecond;
  }else if(sAction.toLowerCase().search("third") != -1){  
    twiml.message("You find yourself in a sitting room with torn apart furniture. You can only LEAVE.");
    oConnections[sFrom].fCurState = fThird;
  }else {
    twiml.message("You can not " + sAction + ". Choose one of the actions above")
  }
  res.writeHead(200, {'Content-Type': 'text/xml'});
  res.end(twiml.toString());
}

function fFirst(req, res){
  var sFrom = req.body.From;
  var sAction = req.body.Body;
  var twiml = new twilio.twiml.MessagingResponse();
  if(sAction.toLowerCase().search("leave") != -1){
    twiml.message("You find yourself in a hallway with many doors. Do you enter the FIRST, SECOND, or THIRD?");
    oConnections[sFrom].fCurState = fHall;
  }else{
    twiml.message("You can not " + sAction + ". Choose one of the actions above")  
  }
  res.writeHead(200, {'Content-Type': 'text/xml'});
  res.end(twiml.toString());
}

function fSecond(req, res){
  var sFrom = req.body.From;
  var sAction = req.body.Body;
  var twiml = new twilio.twiml.MessagingResponse();
  if(sAction.toLowerCase().search("up") != -1){
    twiml.message("You find two more doors on the second floor. Do you enter the LEFT or RIGHT?");
    oConnections[sFrom].fCurState = fUpStairs;
  }else if(sAction.toLowerCase().search("leave") != -1){
    twiml.message("You find yourself in a hallway with many doors. Do you enter the FIRST, SECOND, or THIRD?");
    oConnections[sFrom].fCurState = fHall;
  }else{
    twiml.message("You can not " + sAction + ". Choose one of the actions above")  
  }
  res.writeHead(200, {'Content-Type': 'text/xml'});
  res.end(twiml.toString());
}

function fThird(req, res){
  var sFrom = req.body.From;
  var sAction = req.body.Body;
  var twiml = new twilio.twiml.MessagingResponse();
  if(sAction.toLowerCase().search("leave") != -1){
    twiml.message("You find yourself in a hallway with many doors. Do you enter the FIRST, SECOND, or THIRD?");
    oConnections[sFrom].fCurState = fHall;
  }else{
    twiml.message("You can not " + sAction + ". Choose one of the actions above")  
  }
  res.writeHead(200, {'Content-Type': 'text/xml'});
  res.end(twiml.toString());
}

function fUpStairs(req, res){
  var sFrom = req.body.From;
  var sAction = req.body.Body;
  var twiml = new twilio.twiml.MessagingResponse();
  if(sAction.toLowerCase().search("left") != -1){
    twiml.message("You find yourself a room filled with mirrors. One of them is unbroken, do you LOOK at it or LEAVE?");
    oConnections[sFrom].fCurState = fLeft;
  }else if(sAction.toLowerCase().search("right") != -1){
    twiml.message("You find yourself a room with a single table. You can see a LOCKET and a GOLD bar, what do you pick up?");
    oConnections[sFrom].fCurState = fRight;
  }else{
    twiml.message("You can not " + sAction + ". Choose one of the actions above")  
  }
  res.writeHead(200, {'Content-Type': 'text/xml'});
  res.end(twiml.toString());
}

function fLeft(req, res){
  var sFrom = req.body.From;
  var sAction = req.body.Body;
  var twiml = new twilio.twiml.MessagingResponse();
  if(sAction.toLowerCase().search("look") != -1){
    twiml.message("You look into the mirror and see a bloody face. You run screaming back into the hallway. You should go RIGHT.");
    oConnections[sFrom].fCurState = fRight;
  }else if(sAction.toLowerCase().search("leave") != -1){
    twiml.message("You see two doors on the second floor. Do you enter the LEFT or RIGHT?");
    oConnections[sFrom].fCurState = fUpStairs;
  }else{
    twiml.message("You can not " + sAction + ". Choose one of the actions above")  
  }
  res.writeHead(200, {'Content-Type': 'text/xml'});
  res.end(twiml.toString());
}

function fRight(req, res){
  var sFrom = req.body.From;
  var sAction = req.body.Body;
  var twiml = new twilio.twiml.MessagingResponse();
  if(sAction.toLowerCase().search("locket") != -1){
    twiml.message("You pick up the locket and hear a horrible laugh. You fall unconcious and are never heard from again. GAME OVER");
    oConnections[sFrom].fCurState = fBeginning;
  }else if(sAction.toLowerCase().search("gold") != -1){
    twiml.message("You pick up the gold and run from the mansion. You come out of this a bit richer. YOU WIN");
    oConnections[sFrom].fCurState = fBeginning;
  }else{
    twiml.message("You can not " + sAction + ". Choose one of the actions above")  
  }
  res.writeHead(200, {'Content-Type': 'text/xml'});
  res.end(twiml.toString());
}

//define a method for the twilio webhook
app.post('/sms', function(req, res) {
  var sFrom = req.body.From;
  if(!oConnections.hasOwnProperty(sFrom)){
    oConnections[sFrom] = {"fCurState":fBeginning};
  }
  oConnections[sFrom].fCurState(req, res);
});

// Listen for requests
var server = app.listen(app.get('port'), () =>{
  var port = server.address().port;
  console.log('Listening on localhost:' + port);
  console.log("Document Root is " + sPath);
});
