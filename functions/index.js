process.env.DEBUG = 'actions-on-google:*';
const { DialogflowApp } = require('actions-on-google');
const functions = require('firebase-functions');
const firebase = require('firebase-admin');

const introText = "Welcome to Read Stephen King. In this experience, you'll be guided through a series of questions. Follow your intrigue and let your imagination be your guide. Your answers will allow us to recommend a personalized reading list of Stephen King books best suited for you. Don't worry about picking your next great read, we'll recommend an entire list for you. If you're ready to begin, say yes.";
const genreQOne = "Imagine an apocalyptic world. You have to belong to one of three groups to survive. Your options are, the Magicians who are masters of illusion. The Mentalists who spin a web of gripping mind games. Or the Scientists who are engrossed in the latest technology. Do you create ties with the Magicians, the Mentalists or the Scientists?";
const genreQTwo = "Wise choice. Next question. Your friend invites you over for his annual campfire. Every year he starts the night with a story. You know that he has three terrific tales in his arsenal. One is about his grandmother's ghost. The second, an alien invasion. And the third is the story of a small town serial killer. Do you hope he tells the one about grandma's ghost, aliens, or the serial killer?";
const genreQThree = "Good to know, let's keep going. You just checked into an old hotel and decide to explore. You reach the end of a hallway and there are three marked doors ahead of you. Door One is a portal to an alternate world. Door Two leads to a labyrinth. And Door Three leads to a time travel machine. Which do you choose? The door that leads to the alternate world, the labyrinth, or the time travel machine?";
const psyQuestionOne = "Next question. You're on a long bus ride. It's been smooth so far and you're starting to doze off. Then, all of a sudden, the driver starts speeding and veering from one lane to another. You could, walk to the front of the bus and tell the driver to slow down. Sit in your seat terrified hoping the driver regains control. Or laugh and encourage the driver to go faster. Do you: tell the driver to slow down, sit in your seat, or tell the driver go faster";
const psyQuestionTwo = "I'd probably do the same. You wake with a headache and have a vague memory of the night before. You look around and see chairs knocked over. Books are scattered all over the floor. You walk out of your bedroom and notice the hallway mirror is cracked. Did someone break in? Was there an earthquake? Did you have a fight with someone? Or is it possible you did this in a blind act of rage? You have to make a choice. You can either call the police to get help right away, or keep exploring, looking for clues because you, yourself, may be the culprit. Do you call the police, or keep exploring?";
const psyQuestionThree = "Interesting choice. Let's keep moving. You accidentally scratched your neighbor's car this morning. You hear a knock at the door. You're sure the neighbors are here to question you. You could completely deny it and make up a cover story or tell the truth and hope they will understand. Do you make up a cover-story or tell the truth?";
const psyQuestionFour = "I had a feeling you were going to say that. Last Question. You're traveling with friends in a historic town. Tomorrow night, it's your turn to plan the group activity. You have the options whittled down to two, take everyone on a guided ghost tour of downtown. Or design your own murder mystery dinner. Do you take the ghost tour or make dinner?";
const sciQuestionOne = "I thought you'd say that. There's been unrest in your town for the past few months. There's three rallies tackling local issues this Saturday. One rally is about the integrity of the mayor, another is about crime rates, and the last is about Doomsday preparedness. Which rally do you attend: the one about the mayor, crime or doomsday prep?";
const sciQuestionTwo = "I support your cause. Onwards!<break time='.5s'/> You open your medicine cabinet and notice two little blue viles. One is labeled full immunity, and the other is absolve guilt. Do you feel the most compelled to take a sip of the vile for immunity, or memory";
const sciQuestionThree = "Cheers to that. On to the next. You have a bumper sticker on your car. Does it say my other car is a spaceship, or seize the day?";
const sciQuestionFour = "Let's continue. You're having lunch with a friend. She's getting married in a month and just told you she's having cold feet. Honestly, you don't know much about her partner but your friend is putting you on the spot for advice. You could reduce her anxiousness by telling her everyone experiences uncertainty or you could tell her to take a solo-trip and think it through. What’s your advice; go through with it or explore the unknown?";
const supQuestionOne = "I thought you'd say that. You’re going to an amusement park. Woah, there’s so much to choose from. You could start with the haunted house where everyone leaves screaming, a game where you battle dragons, or you could sink a stranger in the dunk tank. Do you head towards the haunted house, battling dragons or the dunk tank?";
const supQuestionTwo = "Let's keep moving. It's friday night, you know what that means; movies and take-out. You have three movie options, a thrilling murder mystery, cops and robbers, or phantoms haunting a small-town. Do you watch the murder mystery, cops and robbers, or the one about phantoms?";
const supQuestionThree = "I would've chosen the same movie. You’re stranded on a desert island. You can only bring one thing. Your choices are a telescope to look at the stars, a journal to unleash your deepest thoughts, or a slingshot to keep you entertained. Do you pack the telescope, journal or slingshot?";
const supQuestionFour = "You’re in a museum. There's a couple exhibits you're choosing between. On the first floor the exhibit explores the downfall of great societies, the second floor is dedicated to the world's best explorers or the third floor showcases unsolved mysteries? Do you choose to see the exhibit on of great societies, explorers or unsolved mysteries?";
const outroPartOne = "Congratulations, you've completed all the questions! Lots of bold choices. Your carefully selected answers reveal that you are someone who would get the biggest thrill out of the "; 
const outroPartTwo = " reading list. We recommend starting with  and here's a short preview sound bite. The rest of the books on the list are insert remaining books. By the way if you're interested in Stephen King's life, his book On Writing is a part memoir, part masterclass that takes the reader on a compelling journey through King's craft. Now with your burning desire to read, go forth and explore the rich and irresistable world of Stephen King.";

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
let calculateWinner = function(catChoice, answerOne, answerTwo, answerThree, answerFour){

	let P1 = "";
	let P2 = "";
	let P3 = "";
	let P4 = "";
	let P5 = "";

	let winner = "";
	console.log("you're in winner calc. The stats are: "+catChoice+", "+answerOne+", "+answerTwo+", "+answerThree+", "+answerFour);

	if(catChoice == 3){
		if(answerOne == "T"){

			P1+=20;
			P2+=10;
			P3+=50;
			P4+=0;
			P5+=40;

		}else if(answerOne == "GvE"){

			P1+=0;
			P2+=10;
			P3+=30;
			P4+=30;
			P5+=10;

		}else if(answerOne == "HoD"){
			P1+=10;
			P2+=0;
			P3+=0;
			P4+=30;
			P5+=10;
		}

		if(answerTwo == "Mur"){

			P1+=10;
			P2+=0;
			P3+=10;
			P4+=0;
			P5+=0;

		}else if(answerTwo == "C"){

			P1+=30;
			P2+=0;
			P3+=10;
			P4+=0;
			P5+=0;
		}else if(answerTwo == "Mys"){

			P1+=10;
			P2+=10;
			P3+=0;
			P4+=10;
			P5+=0;

		}

		if(answerThree == "Alt"){

			P1+=10;
			P2+=20;
			P3+=0;
			P4+=0;
			P5+=0;
		}else if(answerThree=="ID"){
			P1+=10;
			P2+=0;
			P3+=0;
			P4+=20;
			P5+=30;
		}else if(answerThree == "PoC"){
			P1+=0;
			P2+=10;
			P3+=0;
			P4+=0;
			P5+=10;
		}

		if(answerFour == "Dys"){
			P1+=0;
			P2+=10;
			P3+=0;
			P4+=0;
			P5+=0;
		}else if(answerFour == "CoA"){
			P1+=0;
			P2+=0;
			P3+=0;
			P4+=10;
			P5+=0;
		}else if(answerFour == "GH"){

			P1+=0;
			P2+=20;
			P3+=0;
			P4+=0;
			P5+=0;
		}

		console.log(P1+", "+P2+", "+P3+", "+P4+", "+P5);
		console.log(Math.max(P1, P2, P3, P4, P5));

		if(P1 == Math.max(P1, P2, P3, P4, P5) && P1==P2 && P1 == P3 && P1==P4 && P1 == P5){
			winner = "P5";
		}else if(P1 == Math.max(P1, P2, P3, P4, P5) && P1 == P2 && P1==P3 && P1 == P4){
			winner = "P1";
		}else if(P1 == Math.max(P1, P2, P3, P4, P5) && P1 == P2 && P1==P3 && P1 == P5){
			winner = "P1";
		}else if(P1 == Math.max(P1, P2, P3, P4, P5) && P1 == P3 && P1==P4 && P1 == P5){
			winner = "P1";
		}else if(P2 == Math.max(P1, P2, P3, P4, P5) && P2 == P3 && P2==P4 && P2 == P5){
			winner = "P5";
		}else if(P1 == Math.max(P1, P2, P3, P4, P5) && P1==P2 && P1 ==P3){
			winner = "P1";
		}else if(P1 == Math.max(P1, P2, P3, P4, P5) && P1 == P2 && P1==P4){
			winner = "P1";
		}else if(P1 == Math.max(P1, P2, P3, P4, P5) && P1 == P2 && P1==P5){
			winner = "P5";
		}else if(P1 == Math.max(P1, P2, P3, P4, P5) && P1 == P3 && P1==P4){
			winner = "P1";
		}else if(P1 == Math.max(P1, P2, P3, P4, P5) && P1 == P3 && P1==P5){
			winner = "P5";
		}else if(P1 == Math.max(P1, P2, P3, P4, P5) && P1 == P4 && P1==P5){
			winner = "P5";
		}else if(P2 == Math.max(P1, P2, P3, P4, P5) && P2 == P3 && P2==P4){
			winner = "P2";
		}else if(P2 == Math.max(P1, P2, P3, P4, P5) && P2 == P3 && P2==P5){
			winner = "P5";
		}else if(P2 == Math.max(P1, P2, P3, P4, P5) && P2 == P4 && P2==P5){
			winner = "P5";
		}else if(P3 == Math.max(P1, P2, P3, P4, P5) && P3 == P4 && P3==P5){
			winner = "P5";
		}else if(P1 == Math.max(P1, P2, P3, P4, P5) && P1==P2){
			winner = "P1";
		}else if(P1 == Math.max(P1, P2, P3, P4, P5) && P1==P3){
			winner = "P1";
		}else if(P1 == Math.max(P1, P2, P3, P4, P5) && P1==P4){
			winner = "P1";
		}else if(P1 == Math.max(P1, P2, P3, P4, P5) && P1==P5){
			winner = "P5";
		}else if(P2 == Math.max(P1, P2, P3, P4, P5) && P2==P3){
			winner = "P2";
		}else if(P2 == Math.max(P1, P2, P3, P4, P5) && P2==P4){
			winner = "P2";
		}else if(P2 == Math.max(P1, P2, P3, P4, P5) && P2==P5){
			winner = "P5";
		}else if(P3 == Math.max(P1, P2, P3, P4, P5) && P3==P4){
			winner = "P3";
		}else if(P3 == Math.max(P1, P2, P3, P4, P5) && P3==P5){
			winner = "P5";
		}else if(P4 == Math.max(P1, P2, P3, P4, P5) && P4==P5){
			winner = "P5";
		}else if(P1 == Math.max(P1, P2, P3, P4, P5)){
			winner = "P1";
		}else if(P2 == Math.max(P1, P2, P3, P4, P5)){
			winner = "P2";
		}else if(P3 == Math.max(P1, P2, P3, P4, P5)){
			winner = "P3";
		}else if(P4 == Math.max(P1, P2, P3, P4, P5)){
			winner = "P4";
		}else if(P5 == Math.max(P1, P2, P3, P4, P5)){
			winner = "P5";
		}
	}else if(catChoice == 2){

		if(answerOne == "T"){

			P1+=42;
			P2+=0;
			P3+=10;


		}else if(answerOne == "GvE"){

			P1+=17;
			P2+=50;
			P3+=20;


		}else if(answerOne == "Dys"){
			P1+=17;
			P2+=30;
			P3+=30;

		}

		if(answerTwo == "S"){

			P1+=17;
			P2+=0;
			P3+=10;


		}else if(answerTwo == "SotP"){

			P1+=0;
			P2+=10;
			P3+=0;

		}

		if(answerThree == "Alt"){

			P1+=0;
			P2+=10;
			P3+=10;

		}else if(answerThree=="CoA"){
			P1+=0;
			P2+=0;
			P3+=10;

		}

		if(answerFour == "Mar"){
			P1+=8;
			P2+=0;
			P3+=0;

		}else if(answerFour == "Mys"){
			P1+=0;
			P2+=0;
			P3+=10;

		}


		if(P1 == Math.max(P1, P2, P3) && P1==P2 && P1 ==P3){
			winner = "P2";
		}else if(P1 == Math.max(P1, P2, P3) && P1==P2){
			winner = "P2";
		}else if(P1 == Math.max(P1, P2, P3) && P1==P3){
			winner = "P1";
		}else if(P2 == Math.max(P1, P2, P3) && P2==P3){
			winner = "P2";
		}else if(P1 == Math.max(P1, P2, P3)){
			winner = "P1";
		}else if(P2 == Math.max(P1, P2, P3)){
			winner = "P2";
		}else if(P3 == Math.max(P1, P2, P3)){
			winner = "P3";
		}

	}else if(catChoice == 1){


		if(answerOne == "HoD"){

			P1+=10;
			P2+=10;
			P3+=30;


		}else if(answerOne == "S"){

			P1+=30;
			P2+=10;
			P3+=10;


		}else if(answerOne == "T"){
			P1+=30;
			P2+=30;
			P3+=0;

		}

		if(answerTwo == "ID"){

			P1+=10;
			P2+=20;
			P3+=20;


		}else if(answerTwo == "C"){

			P1+=10;
			P2+=10;
			P3+=0;

		}

		if(answerThree == "SotP"){

			P1+=0;
			P2+=10;
			P3+=10;

		}else if(answerThree=="CoA"){
			P1+=0;
			P2+=10;
			P3+=20;

		}

		if(answerFour == "PoC"){
			P1+=10;
			P2+=0;
			P3+=0;

		}else if(answerFour == "GH"){
			P1+=0;
			P2+=0;
			P3+=10;

		}


		if(P1 == Math.max(P1, P2, P3) && P1==P2 && P1 ==P3){
			winner = "P2";
		}else if(P1 == Math.max(P1, P2, P3) && P1==P2){
			winner = "P2";
		}else if(P1 == Math.max(P1, P2, P3) && P1==P3){
			winner = "P1";
		}else if(P2 == Math.max(P1, P2, P3) && P2==P3){
			winner = "P2";
		}else if(P1 == Math.max(P1, P2, P3)){
			winner = "P1";
		}else if(P2 == Math.max(P1, P2, P3)){
			winner = "P2";
		}else if(P3 == Math.max(P1, P2, P3)){
			winner = "P3";
		}

	}


	

	return winner;




};




let calculateGenre = function(catOne, catTwo, catThree){
	console.log("you're in the genre calculator");
	let catPsy = 0;
	let catSci = 0;
	let catSup = 0;

	let catChoice = 0;

	if(catOne == 1){
		catPsy += 1;
	}else if(catOne == 2){
		catSci += 1;
	}else if(catOne == 3){
		catSup += 1;
	}

	if(catTwo == 1){
		catPsy += 1;
	}else if(catTwo == 2){
		catSci += 1;
	}else if(catTwo == 3){
		catSup += 1;
	}

	if(catThree == 1){
		catPsy += 1;
	}else if(catThree == 2){
		catSci += 1;
	}else if(catThree == 3){
		catSup += 1;
	}

	if(catPsy == catSci && catSci == catSup){

		if(catTwo == 1){
			catPsy += 1;
		}else if(catTwo == 2){
			catSci += 1;
		}else if(catTwo == 3){
			catSup += 1;
		}

		if(catPsy == Math.max(catPsy, catSci, catSup)){
			catChoice = 1;
		}else if(catSci == Math.max(catPsy, catSci, catSup)){
			catChoice = 2;
		}else if(catSup == Math.max(catPsy, catSci, catSup)){
			catChoice = 3;
		}

	}else{

		if(catPsy == Math.max(catPsy, catSci, catSup)){
			catChoice = 1;
		}else if(catSci == Math.max(catPsy, catSci, catSup)){
			catChoice = 2;
		}else if(catSup == Math.max(catPsy, catSci, catSup)){
			catChoice = 3;
		}

	}

	return catChoice;

};
exports.stephenKing = functions.https.onRequest((request, response) => {

	  const app = new DialogflowApp({request, response});
	  console.log('Request headers: ' + JSON.stringify(request.headers));
	  console.log('Request body: ' + JSON.stringify(request.body));

	 
	  function supFourC(app){
	  		let answerOne = app.data.answerOne;
	  		let answerTwo = app.data.answerTwo;
	  		let answerThree = app.data.answerThree;
	  		let answerFour = "Dys";
	  		let winner = calculateWinner(3, answerOne, answerTwo, answerThree, answerFour);

	  		app.ask(outroPartOne + winner + outroPartTwo);
	  		app.setContext('supfour', 0, {});

	  }

	  function supFourB(app){
	  		let answerOne = app.data.answerOne;
	  		let answerTwo = app.data.answerTwo;
	  		let answerThree = app.data.answerThree;
	  		let answerFour = "CoA";
	  		let winner = calculateWinner(3, answerOne, answerTwo, answerThree, answerFour);

	  		app.ask(outroPartOne + winner + outroPartTwo);
	  		app.setContext('supfour', 0, {});

	  }

	  function supFourA(app){
	  		let answerOne = app.data.answerOne;
	  		let answerTwo = app.data.answerTwo;
	  		let answerThree = app.data.answerThree;
	  		let answerFour = "GH";
	  		let winner = calculateWinner(3, answerOne, answerTwo, answerThree, answerFour);

	  		app.ask(outroPartOne + winner + outroPartTwo);
	  		app.setContext('supfour', 0, {});

	  }

	  function supThreeC(app){
	  		app.data.answerThree = "ID";
	  		app.ask(supQuestionFour);
	  		app.setContext('supfour', 1, {});
	  		app.setContext('supthree', 0, {});

	  }

	  function supThreeB(app){
	  		app.data.answerThree = "PoC";
	  		app.ask(supQuestionFour);
	  		app.setContext('supfour', 1, {});
	  		app.setContext('supthree', 0, {});

	  }

	  function supThreeA(app){
	  		app.data.answerThree = "Alt";
	  		app.ask(supQuestionFour);
	  		app.setContext('supfour', 1, {});
	  		app.setContext('supthree', 0, {});

	  }

	  function supTwoC(app){
	  		app.data.answerTwo = "Mys";
	  		app.ask(supQuestionThree);
	  		app.setContext('supthree', 1, {});
	  		app.setContext('suptwo', 0, {});
	  }

	  function supTwoB(app){
	  		app.data.answerTwo = "C";
	  		app.ask(supQuestionThree);
	  		app.setContext('supthree', 1, {});
	  		app.setContext('suptwo', 0, {});
	  }

	  function supTwoA(app){
	  		app.data.answerTwo = "Mur";
	  		app.ask(supQuestionThree);
	  		app.setContext('supthree', 1, {});
	  		app.setContext('suptwo', 0, {});
	  }

	  function supOneC(app){
	  		app.data.answerOne = "HoD";
	  		app.ask(supQuestionTwo);
	  		app.setContext('suptwo', 1, {});
	  		app.setContext('supone', 0, {});

	  }
	  
	  function supOneB(app){
	  		app.data.answerOne = "GvE";
	  		app.ask(supQuestionTwo);
	  		app.setContext('suptwo', 1, {});
	  		app.setContext('supone', 0, {});

	  }

	  function supOneA(app){
	  		app.data.answerOne = "T";
	  		app.ask(supQuestionTwo);
	  		app.setContext('suptwo', 1, {});
	  		app.setContext('supone', 0, {});

	  }

	  
	  function sciFourB(app){
	  		let answerOne = app.data.answerOne;
	  		let answerTwo = app.data.answerTwo;
	  		let answerThree = app.data.answerThree;
	  		let answerFour = "Mys";
	  		let winner = calculateWinner(2, answerOne, answerTwo, answerThree, answerFour);

	  		app.ask(outroPartOne + winner + outroPartTwo);
	  		app.setContext('scifour', 0, {});
	  }

	  function sciFourA(app){
	  		let answerOne = app.data.answerOne;
	  		let answerTwo = app.data.answerTwo;
	  		let answerThree = app.data.answerThree;
	  		let answerFour = "Mar";
	  		let winner = calculateWinner(2, answerOne, answerTwo, answerThree, answerFour);

	  		app.ask(outroPartOne + winner + outroPartTwo);
	  		app.setContext('scifour', 0, {});
	  }

	  function sciThreeB(app){
	  		app.data.answerThree = "Alt";
	  		app.ask(sciQuestionFour);
	  		app.setContext('scifour', 1, {});
	  		app.setContext('scithree', 0, {});
	  }

	  function sciThreeA(app){
	  		app.data.answerThree = "CoA";
	  		app.ask(sciQuestionFour);
	  		app.setContext('scifour', 1, {});
	  		app.setContext('scithree', 0, {});
	  }

	  function sciTwoB(app){
	  		app.data.answerTwo = "SotP";
	  		app.ask(sciQuestionThree);
	  		app.setContext('scithree', 1, {});
	  		app.setContext('scitwo', 0, {});
	  }

	  function sciTwoA(app){
	  		app.data.answerTwo = "S";
	  		app.ask(sciQuestionThree);
	  		app.setContext('scithree', 1, {});
	  		app.setContext('scitwo', 0, {});
	  }

	  function sciOneC(app){
	  		app.data.answerOne = "Dys";
	  		app.ask(sciQuestionTwo);
	  		app.setContext('scitwo', 1, {});
	  		app.setContext('scione', 0, {});
	  }

	  function sciOneB(app){
	  		app.data.answerOne = "T";
	  		app.ask(sciQuestionTwo);
	  		app.setContext('scitwo', 1, {});
	  		app.setContext('scione', 0, {});
	  }


	  function sciOneA(app){

	  		app.data.answerOne = "GvE";
	  		app.ask(sciQuestionTwo);
	  		app.setContext('scitwo', 1, {});
	  		app.setContext('scione', 0, {});
	  }

	  function psyFourB(app){

	  		let answerOne = app.data.answerOne;
	  		let answerTwo = app.data.answerTwo;
	  		let answerThree = app.data.answerThree;
	  		let answerFour = "PoC";
	  		let winner = calculateWinner(1, answerOne, answerTwo, answerThree, answerFour);

	  		app.ask(outroPartOne + winner + outroPartTwo);
	  		app.setContext('psyfour', 0, {});
	  }


	  function psyFourA(app){
	  		let answerOne = app.data.answerOne;
	  		let answerTwo = app.data.answerTwo;
	  		let answerThree = app.data.answerThree;
	  		let answerFour = "GH";
	  		let winner = calculateWinner(1, answerOne, answerTwo, answerThree, answerFour);

	  		app.ask(outroPartOne + winner + outroPartTwo);
	  		app.setContext('psyfour', 0, {});


	  }

	  function psyThreeB(app){
	  		app.data.answerThree = "CoA";
	  		app.ask(psyQuestionFour);
	  		app.setContext('psyfour', 1, {});
	  		app.setContext('psythree', 0, {});
	  }

	  function psyThreeA(app){
	  		app.data.answerThree = "SotP";
	  		app.ask(psyQuestionFour);
	  		app.setContext('psyfour', 1, {});
	  		app.setContext('psythree', 0, {});

	  }

	  function psyTwoB(app){
	  		app.data.answerTwo = "ID";
	  		app.ask(psyQuestionThree);
	  		app.setContext('psythree', 1, {});
	  		app.setContext('psytwo', 0, {});

	  }

	  function psyTwoA(app){
	  		app.data.answerTwo = "C";
	  		app.ask(psyQuestionThree);
	  		app.setContext('psythree', 1, {});
	  		app.setContext('psytwo', 0, {});

	  }


	  function psyOneC(app){
	  		app.data.answerOne = "HoD";
	  		app.ask(psyQuestionTwo);
	  		app.setContext('psytwo', 1, {});
	  		app.setContext('psyone', 0, {});
	  }

	  function psyOneB(app){
	  		app.data.answerOne = "T";
	  		app.ask(psyQuestionTwo);
	  		app.setContext('psytwo', 1, {});
	  		app.setContext('psyone', 0, {});

	  }

	  function psyOneA(app){

	  		app.data.answerOne = "S";
	  		app.ask(psyQuestionTwo);
	  		app.setContext('psytwo', 1, {});
	  		app.setContext('psyone', 0, {});

	  }


	  function genreThirdC(app){

	  		let genreOne = app.data.genreFirst;
	  		let genreTwo = app.data.genreSecond;
	  		let genreThree = 3;

	  		let catChoice = calculateGenre(genreOne, genreTwo, genreThree);
	  		
	  		if(catChoice == 1){

	  			app.ask(psyQuestionOne);
	  			app.setContext('psyone', 1, {});
	  			app.setContext('thirdgenre', 0, {});

	  		}else if(catChoice == 2){

	  			app.ask(sciQuestionOne);
	  			app.setContext('scione', 1, {});
	  			app.setContext('thirdgenre', 0, {});

	  		}else{

	  			app.ask(supQuestionOne);
	  			app.setContext('supone', 1, {});
	  			app.setContext('thirdgenre', 0, {});

	  		}

	  }

	  function genreThirdB(app){

	  		let genreOne = app.data.genreFirst;
	  		let genreTwo = app.data.genreSecond;
	  		let genreThree = 2;

	  		let catChoice = calculateGenre(genreOne, genreTwo, genreThree);
	  		
	  		if(catChoice == 1){

	  			app.ask(psyQuestionOne);
	  			app.setContext('psyone', 1, {});
	  			app.setContext('thirdgenre', 0, {});

	  		}else if(catChoice == 2){

	  			app.ask(sciQuestionOne);
	  			app.setContext('scione', 1, {});
	  			app.setContext('thirdgenre', 0, {});

	  		}else{

	  			app.ask(supQuestionOne);
	  			app.setContext('supone', 1, {});
	  			app.setContext('thirdgenre', 0, {});

	  		}

	  }


	  function genreThirdA(app){
	  		let genreOne = app.data.genreFirst;
	  		let genreTwo = app.data.genreSecond;
	  		let genreThree = 1;

	  		let catChoice = calculateGenre(genreOne, genreTwo, genreThree);
	  		
	  		if(catChoice == 1){

	  			app.ask(psyQuestionOne);
	  			app.setContext('psyone', 1, {});
	  			app.setContext('thirdgenre', 0, {});

	  		}else if(catChoice == 2){

	  			app.ask(sciQuestionOne);
	  			app.setContext('scione', 1, {});
	  			app.setContext('thirdgenre', 0, {});

	  		}else{

	  			app.ask(supQuestionOne);
	  			app.setContext('supone', 1, {});
	  			app.setContext('thirdgenre', 0, {});

	  		}

	  }


	  function genreSecondC(app){
	  		app.data.genreSecond = 2;
	  		app.ask(genreQThree);

	  		app.setContext('thirdgenre', 1, {});
	  		app.setContext('secondgenre', 0, {});

	  }

	  function genreSecondB(app){
	  		app.data.genreSecond = 1;
	  		app.ask(genreQThree);

	  		app.setContext('thirdgenre', 1, {});
	  		app.setContext('secondgenre', 0, {});

	  }


	  function genreSecondA(app){
	  		app.data.genreSecond = 3;
	  		app.ask(genreQThree);

	  		app.setContext('thirdgenre', 1, {});
	  		app.setContext('secondgenre', 0, {});

	  }


	  function genreFirstC(app){

	  		app.data.genreFirst = 2;
	  		app.ask(genreQTwo);

	  		app.setContext('secondgenre', 1, {});
	  		app.setContext('firstgenre', 0, {});	  		

	  }

	  function genreFirstB(app){

	  		app.data.genreFirst = 1;
	  		app.ask(genreQTwo);

	  		app.setContext('secondgenre', 1, {});
	  		app.setContext('firstgenre', 0, {});

	  }

	  function genreFirstA(app){
	  		app.data.genreFirst = 3;
	  		app.ask(genreQTwo);

	  		app.setContext('secondgenre', 1, {});
	  		app.setContext('firstgenre', 0, {});

	  }

	  function yes(app){

	  		app.ask(genreQOne);
	  		app.setContext('firstgenre', 1, {});
	  		app.setContext('intro', 0, {});


	  }


	  function welcomeIntent(app){


	  		
	  		app.ask(introText);
	  		app.setContext('intro', 1, {});


	  }



	  let actionmap = new Map();
	  actionMap.set('input.welcome', welcomeIntent);
	  actionMap.set('yes', yes);
	  actionMap.set('genrefirsta', genreFirstA);
	  actionMap.set('genrefirstb', genreFirstB);
	  actionMap.set('genrefirstc', genreFirstC);
	  actionMap.set('genreseconda', genreSecondA);
	  actionMap.set('genresecondb', genreSecondB);
	  actionMap.set('genresecondc', genreSecondC);
	  actionMap.set('genrethirda', genreThirdA);
	  actionMap.set('genrethirdb', genreThirdB);
	  actionMap.set('genrethirdc', genreThirdC);
	  actionMap.set('psyonea', psyOneA);
	  actionMap.set('psyoneb', psyOneB);
	  actionMap.set('psyonec', psyOneC);
	  actionMap.set('psytwoa', psyTwoA);
	  actionMap.set('psytwob', psyTwoB);
	  actionMap.set('psythreea', psyThreeA);
	  actionMap.set('psythreeb', psyThreeB);
	  actionMap.set('psyfoura', psyFourA);
	  actionMap.set('psyfourb', psyFourB);
	  actionMap.set('scionea', sciOneA);
	  actionMap.set('scioneb', sciOneB);
	  actionMap.set('scionec', sciOneC);
	  actionMap.set('scitwoa', sciTwoA);
	  actionMap.set('scitwob', sciTwoB);
	  actionMap.set('scithreea', sciThreeA);
	  actionMap.set('scithreeb', sciThreeB);
	  actionMap.set('scifoura', sciFourA);
	  actionMap.set('scifourb', sciFourB);
	  actionMap.set('suponea', supOneA);
	  actionMap.set('suponeb', supOneB);
	  actionMap.set('suponec', supOneC);
	  actionMap.set('suponec', supOneC);
	  actionMap.set('suptwoa', supTwoA);
	  actionMap.set('suptwob', supTwoB);
	  actionMap.set('suptwoc', supTwoC);
	  actionMap.set('supthreea', supThreeA);
	  actionMap.set('supthreeb', supThreeB);
	  actionMap.set('supthreec', supThreeC);
	  actionMap.set('supfoura', supFourA);
	  actionMap.set('supfourb', supFourB);
	  actionMap.set('supfourc', supFourC);




	  app.handleRequest(actionMap);


});
