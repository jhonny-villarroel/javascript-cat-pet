//import * as myModule from '/js/voiceCommand.js'
//this game will have only 1 state
var voiceCmd = null;

var cursors;
var lookAtMe = false;
var voiceCMDEval = null;
var GameState = {
  //load the game assets before the game starts
  preload: function() {
    // Load assets
    this.game.load.image('backyard', 'assets/images/backyard.png');  
    this.game.load.image('box', 'assets/images/box.png'); 
    this.game.load.image('candy', 'assets/images/candy.png');    
    this.game.load.image('rotate', 'assets/images/rotate.png');    
    this.game.load.image('toy', 'assets/images/rubber_duck.png');    
    this.game.load.image('arrow', 'assets/images/arrow.png');   

    this.load.spritesheet('pet', 'assets/images/pet.png', 97, 83, 5, 1, 1); 

    // voice command
     voiceCmd = new VoiceCMD();
     /* Binding Concepts*/
     var bindEventVoiceCDM = voiceCMDEval.bind(this);
     voiceCmd.subscribeVoiceEvent(bindEventVoiceCDM);

     /** Events Concepts and Scope of this*/
     var self = this;
     subscribeHeadTrackEvent(function(event){
         if(lookAtMe === false)
            return;
         console.log("the Head location is--->" + event.direction);
         if(event.direction === "LEFT"){
            self.pet.angle = 45;
         }else if(event.direction === "RIGHT"){
           self.pet.angle = -45;
         }else if(event.direction === "CENTER"){
           self.pet.angle = 0;
         }
       });
  },

  //executed after everything is loaded
  create: function() {
    this.background = this.game.add.sprite(0,0, 'backyard');
    this.background.inputEnabled = true;
    this.background.events.onInputDown.add(this.placeItem, this);

    this.pet = this.game.add.sprite(100, 400, 'pet',1);
    this.pet.animations.add('funnyfaces', [1, 2, 3, 2, 1], 7, false);
    this.pet.anchor.setTo(0.5);

    //custom properties of the pet
    this.pet.customParams = {health: 100, fun: 100};

    // Using cursors
    // capture handler for keyboard events
    cursors = game.input.keyboard.createCursorKeys();
    // physic
    game.physics.arcade.enable(this.pet);
    // Set world limit
    this.pet.body.collideWorldBounds = true;

    //draggable pet
    this.pet.inputEnabled = true;
    this.pet.input.enableDrag();

    this.box = this.game.add.sprite(72, 570, 'box');
    this.box.anchor.setTo(0.5);
    this.box.customParams = {health: 20};
    this.box.inputEnabled = true;
    this.box.events.onInputDown.add(this.pickItem, this);

    this.candy = this.game.add.sprite(144, 570, 'candy');
    this.candy.anchor.setTo(0.5);
    this.candy.customParams = {health: -10, fun: 10};
    this.candy.inputEnabled = true;
    this.candy.events.onInputDown.add(this.pickItem, this);

    this.toy = this.game.add.sprite(216, 570, 'toy');
    this.toy.anchor.setTo(0.5);
    this.toy.customParams = {fun: 30};
    this.toy.inputEnabled = true;
    this.toy.events.onInputDown.add(this.pickItem, this);

    this.rotate = this.game.add.sprite(288, 570, 'rotate');
    this.rotate.anchor.setTo(0.5);
    this.rotate.inputEnabled = true;
    this.rotate.events.onInputDown.add(this.rotatePet, this);

    this.buttons = [this.box, this.candy, this.toy, this.rotate];

    //nothing selected
    this.selectedItem = null;

    //stats
    var style = { font: "20px Arial", fill: "#fff"};
    this.game.add.text(10, 20, "Health:", style);
    this.game.add.text(140, 20, "Fun:", style);

    this.healthText = this.game.add.text(80, 20, "", style);
    this.funText = this.game.add.text(185, 20, "", style);
    this.refreshStats();

    //decrease health and fun every 10 seconds
    this.statsDecreaser = this.game.time.events.loop(Phaser.Timer.SECOND * 5, this.reduceProperties, this);
    this.statsDecreaser.timer.start();
    
    this.uiBlocked = false;
    var self = this;
  },

  //rotate the pet
  rotatePet: function(sprite, event) {
    if(!this.uiBlocked) {
      this.uiBlocked = true;

      //alpha to indicate selection
      this.clearSelection();
      sprite.alpha = 0.4;

      var petRotation = game.add.tween(this.pet);
      petRotation.to({ angle: '+60' }, 500);
      petRotation.to({ angle: '-60' }, 500);
      petRotation.to({ angle: '-60' }, 500);
      petRotation.to({ angle: '+60' }, 500);
      
      petRotation.onComplete.add(function(){
        this.uiBlocked = false;
        sprite.alpha = 1;
        this.pet.customParams.fun += 10;
        //show updated stats
        this.refreshStats();
      }, this);
      petRotation.start();
    }
  },

  //pick an item so that you can place it on the level
  pickItem: function(sprite, event) {
    if(!this.uiBlocked) {
      //clear other buttons
      this.clearSelection();

      //alpha to indicate selection
      sprite.alpha = 0.4;

      //save selection so we can place an item
      this.selectedItem = sprite;
    }
  },

  //place selected item on the background
  placeItem: function(sprite, event) {
    if(this.selectedItem && !this.uiBlocked) {
      //position of the user input
      var x = event.position.x;
      var y = event.position.y;
      console.log("the pos of Appel is x:"+ x + " y-->"+ y)

      //create element in this place
      var newItem = this.game.add.sprite(x, y, this.selectedItem.key);

      newItem.anchor.setTo(0.5);
      newItem.customParams = this.selectedItem.customParams;

      //the pet will move to grab the item
      this.uiBlocked = true;
      var petMovement = game.add.tween(this.pet);
      // move pet to new positon
      
      petMovement.to({x: x, y: y}, 700);
      
      petMovement.onComplete.add(function(){
        this.uiBlocked = false;

        //destroy item
        newItem.destroy();

        //animate pet
        this.pet.animations.play('funnyfaces');

        //update pet stats
        var stat;
        for(stat in newItem.customParams) {
          //make sure the property belongs to the object and not the prototype
          if(newItem.customParams.hasOwnProperty(stat)) {
            this.pet.customParams[stat] += newItem.customParams[stat];
          }
        }

        //show updated stats
        this.refreshStats();
        //clear selection
        this.clearSelection();
      }, this);
      petMovement.start();      
    }
  },
  //clear all buttons from selection
  clearSelection: function() {
    //set alpha to 1
    this.buttons.forEach(function(element){element.alpha = 1});

    //clear selection
    this.selectedItem = null;
  },
  //show updated stats values
  refreshStats: function() {
    this.healthText.text = this.pet.customParams.health;
    this.funText.text = this.pet.customParams.fun;
  },

  reduceProperties: function() {
    this.refreshStats();
  },

  //constant check
  update: function() {
    if(this.pet.customParams.health <= 0 || this.pet.customParams.fun <= 0) {
      this.pet.frame = 4;
      this.uiBlocked = true;

      this.game.time.events.add(1200, this.gameOver, this);
    }
  },
  gameOver: function() {    
    this.game.state.restart();
  },
};

//initiate the Phaser framework
var game = new Phaser.Game(360, 640, Phaser.AUTO);
game.state.add('GameState', GameState);
game.state.start('GameState');

/* Helper functions*/

function movePet (gameRef, petMovement){
  var promise = new Promise(function(resolve, reject) {
  var tween = petMovement.to({x: 325, y: 436} , 700);
              petMovement.start();
              tween.onComplete.add(function(){
                 resolve("END move");
              }, this );  
  });

  return promise;
}

 /**** binding Concept ***/
voiceCMDEval = function(cmd){
        console.log("[DEBUG]the value of voice command: ",  cmd);
        if(cmd.voiceCmd === "hello"){
          responsiveVoice.speak("Hellooo Jhonny.");
          this.pet.animations.play('funnyfaces');
        } else if(cmd.voiceCmd === "look at me"){
          console.log("look at me");
          responsiveVoice.speak("OK");
          this.pet.animations.play('funnyfaces');
          lookAtMe = true;
        } else if (cmd.voiceCmd === "go to the rock"){
          responsiveVoice.speak("OK");
          /****** Promise Concepts*****/          
          var petMovement = game.add.tween(this.pet);
          movePet(game, petMovement).then(function(res){
             responsiveVoice.speak("I am in the Rock!");
          });
        }
    };