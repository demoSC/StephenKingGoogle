process.env.DEBUG = 'actions-on-google:*';
const { DialogflowApp } = require('actions-on-google');
const functions = require('firebase-functions');
const firebase = require('firebase-admin');

const introText = "Welcome to the Stephen King Library. We will guide you through a series of questions. Follow your imagination and curiosity. Your answers will allow us to recommend a personalized reading list of Stephen King books best suited to you. If you’re ready to start, just say begin.";
const genreQOne = "Imagine an apocalyptic world. You have to belong to one of three groups to survive. Your options are; The Magicians who are masters of illusion. The Mentalists who spin a web of gripping mind games. Or the Scientists who are creating cutting edge technology. Do you create ties with the Magicians, the Mentalists or the Scientists?";
const genreQTwo = "Wise choice. Next question. Your friend invites you over for his annual campfire. Every year he starts the night with a story. You know that he has three terrific tales in his arsenal. One is a chilling ghost story. The second is about an alien invasion. And the third is the story of a small town serial killer. Do you hope he tells the one about a ghost, aliens or the serial killer?";
const genreQThree = "Good to know, let's keep going. You just checked into an old hotel and decide to explore. You reach the end of a hallway and there are three marked doors ahead of you. Door One is a portal to an alternate world. Door Two leads to a labyrinth. And Door Three leads to a time travel machine. Which do you choose; the door that leads to the alternate world, the labyrinth, or the time travel machine?";
const psyQuestionOne = "You’re in for a journey. 3 questions down, 4 more to go. You’re on a long bus ride. It’s been smooth so far and you’re dozing off. Then, all of a sudden, the driver starts speeding and veering from one lane to another" /*[INSERT CAR SPEEDING NOISE].*/ + "You could; Shout at the driver to slow down. Sit in your seat terrified hoping the driver regains control. Or laugh and encourage the driver to go faster. Do you, tell the driver to slow down, sit in your seat, or tell the driver go faster";
const psyQuestionTwo = "I'd probably do the same. Next question. You wake with a headache and have a vague memory of the night before. You look around and see chairs knocked over. Books are scattered all over the floor. You walk out of your bedroom and notice the hallway mirror is cracked. Did someone break in? Was there an earthquake? Did you have a fight with someone? Or is it possible you did this in a blind act of rage? You have to make a choice. You can either; call the police to get help right away or keep exploring, looking for clues because you, yourself, may be the culprit. Do you call the police or keep exploring?";
const psyQuestionThree = "Interesting choice. Two questions left. You accidentally dented your neighbor’s car this morning. You hear a knock at the door. " /*[INSERT SFX].*/ + "You’re sure the neighbors are here to question you. You could completely deny it and make up a cover story or tell the truth and hope they will understand. Do you make up a cover-story or tell the truth?";
const psyQuestionFour = "I had a feeling you were going to say that. Last Question. You're traveling with friends in a historic town. Tomorrow night, it’s your turn to plan the group activity. You have the options whittled down to two. Take everyone on a guided ghost tour of downtown. Or design your own murder mystery dinner. Do you take the ghost tour or make dinner?";
const sciQuestionOne = "You’re in for a journey. 3 questions down, 4 more to go. You recently moved to a new town and have been invited to the town meeting. There are three topics on the agenda. Corruption charges against the mayor, increasing crime rates, and survival preparedness. Which topic do you think is the most important. Charges against the mayor, crime rates or survival prep?";
const sciQuestionTwo = "Interesting. Onward to the next question. You open your medicine cabinet and notice two blue bottles. One is labeled full immunity and the other is remember everything. You have no idea where these came from, but super health and remembering everything sound good to you. Which do you take, immunity or memory?";
const sciQuestionThree = "Another interesting choice. Two more questions to go. Your friend has been raving about a meditation studio they love and finally persuades you to go. There are two classes from which to choose. One focuses on inspiration and personal growth and one promises a relaxing out-of-body experience. Which class appeals more to you; personal growth or out of body experience?";
const sciQuestionFour = "Enlightening. Let’s continue. A friend is getting married in a month and has developed cold feet. You don’t know much about their partner, but they’ve put you on the spot for advice. You could advise them to go through with the wedding because a commitment has been made or suggest they postpone their plans and take some time to think things through. Do you choose to tell your friend to go through with it or postpone?";
const supQuestionOne = "You’re in for a journey. 3 questions down, 4 more to go. You’re going to an amusement park for the day. What do you want to do first? Go to the haunted house where everyone leaves terrified, play an arcade game where you battle monsters, or throw popcorn at strangers from the ferris wheel. Do you head towards the haunted house, the arcade game or the ferris wheel?";
const supQuestionTwo = "Let the fun begin. Next question. It’s Friday night, you know what that means, movies and take-out. You have three movie options in your queue to choose from. A thriller about a murderer on the loose, a movie where con men evade the police or your last option is about ship mysteriously lost at sea? What do you choose to watch; Murderer on the loose, evade the police, or lost at sea?";
const supQuestionThree = "I would’ve chosen the same movie. Two more questions to go. You’re out at sea and rough winds are breaking your ship apart. You know you have to get to shore and you only have time to grab one item before you jump in the life raft. Do you choose to take a telescope, your journal, or a slingshot";
const supQuestionFour = "Hopefully you’re found soon. Last question, make it a good one. You’re on vacation. It’s your last day, and you want to visit one of the town’s world renowned museums before you leave. You only have time to visit one museum. The best options in town are; the museum dedicated to paranormal activity. The museum of the world’s best explorers. Or the museum featuring lost cities of the world. Do you choose to visit the paranormal museum, the explorers museum or the lost cities museum?";

const psyPackOneIntro = "Nice work! You’ve completed all of the questions. Your answers reveal that you are someone who would enjoy reading Misery, the story of a fan turned captor, whose obsession with a writer gets dangerous. Would you like to hear a short preview of the book?";
const psyPackOneClip = "Here’s a short clip of Misery. <audio src= ' ' />";
const psyPackOneEnd = "Other books we recommend for your personal reading list include King’s Bazaar of Bad Dreams, Blaze, Cujo, and Gerald’s Game. By the way, if you’re interested in learning more about Stephen King, his book titled On Writing; part memoir, part masterclass; takes the reader on a compelling journey through King’s craft. We’re sure you’re eager to start the new books on your reading list, but come back soon for more recommendations tailored to your imagination. Now, go forth and turn the pages of your next great Stephen King read!";
const psyPackOneRep = "Would you like to hear a short preview of Misery?";

const psyPackTwoIntro = "Nice work! You’ve completed all of the questions. Your answers reveal that you are someone who would enjoy reading Finders Keepers, part of the Bill Hodges Trilogy, this riveting story about the power of storytelling, and a vengeful reader, starring the same trio of unlikely and winning heroes King introduced in Mr. Mercedes. Would you like to hear a short preview of the book?";
const psyPackTwoClip = "Here’s a short clip of Finders Keepers. <audio src= ' ' />";
const psyPackTwoEnd = "Other books we recommend for your personal reading list include King’s Different Seasons, Dolores Claiborne, Carrie, and Roadwork. By the way, if you’re interested in learning more about Stephen King, his book titled On Writing; part memoir, part masterclass; takes the reader on a compelling journey through King’s craft. We’re sure you’re eager to start the new books on your reading list, but come back soon for more recommendations tailored to your imagination. Now, go forth and turn the pages of your next great Stephen King read!";
const psyPackTwoRep = "Would you like to hear a short preview of Finders Keepers?";

const psyPackThreeIntro = "Nice work! You’ve completed all of the questions. Your answers reveal that you are someone who would enjoy reading Bag of Bones, a haunted love story from the master storyteller that will take you on a gripping and unforgettable journey. Would you like to hear a short preview of the book?";
const psyPackThreeClip = "Here’s a short clip of Bag of Bones. <audio src= ' ' />";
const psyPackThreeEnd = "Other books we recommend for your personal reading list include King’s Full Dark No Stars, Hearts in Atlantis, Skeleton Crew, and The Girl Who Loved Tom Gordon. By the way, if you’re interested in learning more about Stephen King, his book titled On Writing; part memoir, part masterclass; takes the reader on a compelling journey through King’s craft. We’re sure you’re eager to start the new books on your reading list, but come back soon for more recommendations tailored to your imagination. Now, go forth and turn the pages of your next great Stephen King read!";
const psyPackThreeRep = "Would you like to hear a short preview of Bag of Bones?";


const sciPackOneIntro = "Nice work! You’ve completed all of the questions. Your answers reveal that you are someone who would enjoy reading Firestarter, a story about a child with extraordinary psychic powers on the run from the government. Would you like to hear a short preview of the book?";
const sciPackOneClip = "Here’s a short clip of Firestarter. <audio src= ' ' />";
const sciPackOneEnd = "Other books we recommend for your personal reading list include King’s Cell, Insomnia, Rose Madder, The Running Man, and Tommy Knockers. By the way, if you’re interested in learning more about Stephen King, his book titled On Writing; part memoir, part masterclass; takes the reader on a compelling journey through King’s craft. We’re sure you’re eager to start the new books on your reading list, but come back soon for more recommendations tailored to your imagination. Now, go forth and turn the pages of your next great Stephen King read!";
const sciPackOneRep = "Would you like to hear a short preview of Firestarter";

const sciPackTwoIntro = "Nice work! You’ve completed all of the questions. Your answers reveal that you are someone who would enjoy reading Dark Tower 1, The story that begins the popular Dark Tower Series. Dark Tower 1 centers around Roland of Gilean, the last gunslinger on his epic quest to save the dark tower. Would you like to hear a short preview of the book?";
const sciPackTwoClip = "Here’s a short clip of Dark Tower 1. <audio src= ' ' />";
const sciPackTwoEnd = "Other books we recommend for your personal reading list include King’s Dark Tower II, The Talisman, Eyes of the Dragon, and The Stand. By the way, if you’re interested in learning more about Stephen King, his book titled On Writing; part memoir, part masterclass; takes the reader on a compelling journey through King’s craft. We’re sure you’re eager to start the new books on your reading list, but come back soon for more recommendations tailored to your imagination. Now, go forth and turn the pages of your next great Stephen King read!";
const sciPackTwoRep = "Would you like to hear a short preview of the Dark Tower 1?";

const sciPackThreeIntro = "Nice work! You’ve completed all of the questions. Your answers reveal that you are someone who would enjoy reading 11, 22, 19 63, An incredible journey into the past and the possibility of altering it. On November 22, 19 63, three shots rang out in Dallas., President Kennedy died, and the world changed. This story begs the question, what if you could change it back? Would you like to hear a short preview of the book?";
const sciPackThreeClip = "Here’s a short clip of 11, 22, 19 63. <audio src= ' ' />";
const sciPackThreeEnd = "Other books we recommend for your personal reading list include King’s The Long Walk, Dreamcatcher, Under The Dome, and Black House. And don’t forget to check out the sequel to Black House, The Talisman. By the way, if you’re interested in learning more about Stephen King, his book titled On Writing; part memoir, part masterclass; takes the reader on a compelling journey through King’s craft. We’re sure you’re eager to start the new books on your reading list, but come back soon for more recommendations tailored to your imagination. Now, go forth and turn the pages of your next great Stephen King read!";
const sciPackThreeRep = "Would you like to hear a short preview of 11, 22, 19 63?";


const supPackOneIntro = "Nice work! You’ve completed all of the questions. Your answers reveal that you are someone who would enjoy reading The Outsider, an unsettling and compulsively readable story about an unspeakable crime, an abundance of evil and the investigation into Terry Maitland who was thought to be the popular small town nice guy. Would you like to hear a short preview of the book?";
const supPackOneClip = "Here’s a short clip of The Outsider. <audio src= ' ' />";
const supPackOneEnd = "Other books we recommend for your personal reading list include King’s Green Mile, Four Past Midnight, and From a Buick 8, and End of Watch, part of the Bill Hodges Trilogy. By the way, if you’re interested in learning more about Stephen King, his book titled On Writing; part memoir, part masterclass; takes the reader on a compelling journey through King’s craft. We’re sure you’re eager to start the new books on your reading list, but come back soon for more recommendations tailored to your imagination. Now, go forth and turn the pages of your next great Stephen King read!";
const supPackOneRep = "Would you like to hear a short preview of the Outsider?";

const supPackTwoIntro = "Nice work! You’ve completed all of the questions. Your answers reveal that you are someone who would enjoy reading Lisey’s Story, an extraordinarily moving and haunting story of a marriage, a love lost, and the aftermath. Would you like to hear a short preview of the book?";
const supPackTwoClip = "Here’s a short clip of Lisey’s Story. <audio src= ' ' />";
const supPackTwoEnd = "Other books we recommend for your personal reading list include King’s Dead Zone, Desperation, Duma Key, and Sleeping Beauties. By the way, if you’re interested in learning more about Stephen King, his book titled On Writing; part memoir, part masterclass; takes the reader on a compelling journey through King’s craft. We’re sure you’re eager to start the new books on your reading list, but come back soon for more recommendations tailored to your imagination. Now, go forth and turn the pages of your next great Stephen King read!";
const supPackTwoRep = "Would you like to hear a short preview of Lisey's Story?";

const supPackThreeIntro = "Nice work! You’ve completed all of the questions. Your answers reveal that you are someone who would enjoy reading It, the terrifying classic about seven adults who return to their hometown to confront nightmares from their pasts. Would you like to hear a short preview of the book?";
const supPackThreeClip = "Here’s a short clip of It. <audio src= ' ' />";
const supPackThreeEnd = "Other books we recommend for your personal reading list include King’s Doctor Sleep, Christine, Salem’s Lot, and Mr Mercedes, part of the Bill Hodges Trilogy. By the way, if you’re interested in learning more about Stephen King, his book titled On Writing; part memoir, part masterclass; takes the reader on a compelling journey through King’s craft. We’re sure you’re eager to start the new books on your reading list, but come back soon for more recommendations tailored to your imagination. Now, go forth and turn the pages of your next great Stephen King read!";
const supPackThreeRep = "Would you like to hear a short preview of It?";

const supPackFourIntro = "Nice work! You’ve completed all of the questions. Your answers reveal that you are someone who would enjoy reading Revival, a dark and electrifying novel about addiction, fanaticism and what might exist on the other side. Would you like to hear a short preview of the book?";
const supPackFourClip = "Here’s a short clip of Revival. <audio src= ' ' />";
const supPackFourEnd = "Other books we recommend for your personal reading list include King’s Needful Things, Gwendy’s Button Box, Everything’s Eventual, and Elevation, one of King’s newest books of 2018. By the way, if you’re interested in learning more about Stephen King, his book titled On Writing; part memoir, part masterclass – takes the reader on a compelling journey through King’s craft. We’re sure you’re eager to start the new books on your reading list, but come back soon for more recommendations tailored to your imagination. Now, go forth and turn the pages of your next great Stephen King read!";
const supPackFourRep = "Would you like to hear a short preview of Revival?";

const supPackFiveIntro = "Nice work! You’ve completed all of the questions. Your answers reveal that you are someone who would enjoy reading Pet Sematary, a story about a family who moves into a house near a pet cemetery where dark secrets are buried and an unthinkable evil is about to be resurrected. Would you like to hear a short preview of the book?";
const supPackFiveClip = "Here’s a short clip of Pet Sematary. <audio src= ' ' />";
const supPackFiveEnd = "Other books we recommend for your personal reading list include King’s The Dark Half, The Regulators, The Shining, and Thinner. By the way, if you’re interested in learning more about Stephen King, his book titled On Writing; part memoir, part masterclass; takes the reader on a compelling journey through King’s craft. We’re sure you’re eager to start the new books on your reading list, but come back soon for more recommendations tailored to your imagination. Now, go forth and turn the pages of your next great Stephen King read!";
const supPackFiveRep = "Would you like to hear a short preview of Pet Sematary?";

const psyPackOne = "Your answers reveal that you are someone who would enjoy reading Misery, Bazaar of Bad Dreams, Blaze, Cujo, and Gerald’s Game.";
const psyPackTwo = "Your answers reveal that you are someone who would enjoy reading Finders Keepers, Different Seasons, Dolores Claiborne, Carrie, and Roadwork.";
const psyPackThree = "Your answers reveal that you are someone who would enjoy reading Bag of Bones, Full Dark No Stars, Hearts in Atlantis, Skeleton Crew, and The Girl Who Loved Tom Gordon.";

const sciPackOne = "Your answers reveal that you are someone who would enjoy reading Firestarter, Cell, Insomnia, Rose Madder, The Running Man, and Tommy Knockers.";
const sciPackTwo = "Your answers reveal that you are someone who would enjoy reading Dark Tower 1, Dark Tower II, The Talisman, Eyes of the Dragon, and The Stand";
const sciPackThree = "Your answers reveal that you are someone who would enjoy reading 11, 22, 19 63, The Long Walk, Dreamcatcher, Under The Dome, and Black House.";

const supPackOne = "Your answers reveal that you are someone who would enjoy reading The Outsider, Green Mile, Four Past Midnight, and From a Buick 8, and End of Watch, part of the Bill Hodges Trilogy.";
const supPackTwo = "Your answers reveal that you are someone who would enjoy reading Lisey’s Story, Dead Zone, Desperation, Duma Key, and Sleeping Beauties.";
const supPackThree = "Your answers reveal that you are someone who would enjoy reading IT, Doctor Sleep, Christine, Salem’s Lot, and Mr Mercedes, part of the Bill Hodges Trilogy.";
const supPackFour = "Your answers reveal that you are someone who would enjoy reading Revival, Needful Things, Gwendy’s Button Box, Everything’s Eventual, and Elevation, one of King’s newest books of 2018.";
const supPackFive = "Your answers reveal that you are someone who would enjoy reading Pet Sematary, The Dark Half, The Regulators, The Shining, and Thinner.";



firebase.initializeApp({

  credential: firebase.credential.cert({
      projectId: 'stephen-king-93995',
      clientEmail: 'firebase-adminsdk-yusl7@stephen-king-93995.iam.gserviceaccount.com',
      privateKey: '-----BEGIN PRIVATE KEY-----\nMIIEvAIBADANBgkqhkiG9w0BAQEFAASCBKYwggSiAgEAAoIBAQCu5uxolehD4tKR\nmL4OtHP2NwX9dZhVgipqzesk/SQseBCiaDqnMQeFMlG9d8cCrNjDILxgVVlyP3lK\nDnACTwieQdAAuDL2N7+mQ1TJXlwq7T/QT0NGm+8YKP8NySIBQy+KPrRS9M4ycX2X\nCTdZfUXZTVJdu71FImWA8xJS/flQH8adWE6LOqL+6wsLF3oBq7+fanIGphZu7p1B\nq+uByED5vdVHpg+akl5/HkmZeQZapU9AJEwHK6teEP2UqfubA9Xo0yBIolPNG3rk\nhtTBkcBkcUgw1tAcpDqXlpf09BueAiV6VlWWkmlTFAiTSXqyoKfCXuSvDw0rjZes\nUTCPJdnnAgMBAAECggEADDm+Cq13187yExVPK633cR11gLsIk+mOV3rfVe2P6r/V\nwdRxTSCDOw9CYXEO6yPz3ufZ4w30O6UuMDwEHlUx8AX/qR03Crjo35FTSuQaozGE\nRWZU+ImL0++BrJADnXz5xLsPVcEg7Ku8MKOHR+0WxdK+0CiAWWXHHJVhEYYJOE1y\nd6mNEA0ZbDEquD2/d3Eub8WyiN/DrKzz5nBxCSkHJSArcXi46HGV1EXV8Xerp+9L\nXCgRxzDz02+xEYyCuHGFAPuGq5rBJ9t80P4ZDP5tXku16Nnzq3vk9qwPe0jsGX5E\nowXpWKakPG4q6/AH5IkqQE7qLFY3dtvHOCLMKR2p0QKBgQDxr0sAyIsB3fLZbDTD\nIQwUfWXjHW99FDRUkHLT7FVAMa8ZeZmin058e+LPxN/CxAksPU+d/3W6q5MomzC+\nWVsB9JQ8aucH6Q9tFnBm+uFf+Q7lZhyvg5OQd905aUGgK8YjVzdtCwACYDXoMloy\nnlWUljenXYoSJD9/OKRfyNWiuQKBgQC5Qv47D9n2VYXAGXd9wSAYKccuextoxHqo\nLKZCzbhH6XU/QwCc+cjef/tdtFHlAB6puEJFH4grzLpE5Qs/GmqMnowjyfsvIfxB\n3HRPUJTcqbB/tThIMdFS+H4uPlUi2TTKy/fv8jrIrx1sGB8uydqYJcX56NQtiuVd\nzrUgIiORnwKBgDxpsvfpKUY4MsJCmBXGpvxgNB3Hd9zuNf6FdQ6gXtcDFF/r04mh\nBL99QD7rWXuYASr70HEQMF+PD+Pwlwid0W/1sTBBEKsbiO2d1E8Jm1igKycQlU8S\nNsrAC56UPwFIr+iZnpM1UrVFU3RNUdqhVYck3ZiKez75rJ2ijQQccbqRAoGABcFj\nDIqths2ZXiJsZ+e8C4Qgv/zrGRIhjV/1ulWRyAokrlZyim3oI6FuObcEZEzgpv0m\ncedM3694ifNjqg40CTJTwDjiKNCxeYpTwrMKLODIru7+VJ/XlPBLWzxsgKymyzYS\n+c1Yritiip0lOtrig5+Iyv7EuLV78rIdRmZJHJkCgYA3IbZIlN517wJ4RTQ0RWCQ\nLOloBSN2JUJiXWZdCGsexelbIzvihBK833HmMc1GuzP7/m5y6Xx3fl5YFRxF2Tvq\nDTrdUoQG9TTqzqURDKHmmBQinAAeCeOzq6hZrWOAp0Oa06aMs/KyPAcp38wmCnoL\nP3rVC3EFE+KL3xcAELMcBQ==\n-----END PRIVATE KEY-----\n'
  }),
  databaseURL: 'https://stephen-king-93995.firebaseio.com/'

});

let database = firebase.database();
// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//


let writeUserData = function(userId){

  firebase.database().ref('users/' + userId).set({

  		prevPack : ""

  });

};


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




	  function supEndNo(app){

	  		let winner = app.data.winner;
	  		let output = "";
	  		if(winner == "P1"){
				output = supPackOneEnd;
			}else if(winner == "P2"){
				output = supPackTwoEnd;
			}else if(winner == "P3"){
				output = supPackThreeEnd;
			}else if(winner == "P4"){
				output = supPackFourEnd;
			}else if(winner == "P5"){
				output = supPackFiveEnd;
			}

			app.setContext('supend', 0, {});
			app.tell(output);

	  }


	  function supEndYes(app){

	  		let winner = app.data.winner;
	  		let output = "";
	  		if(winner == "P1"){
				output = supPackOneClip + supPackOneEnd;
			}else if(winner == "P2"){
				output = supPackTwoClip + supPackTwoEnd;
			}else if(winner == "P3"){
				output = supPackThreeClip + supPackThreeEnd;
			}else if(winner == "P4"){
				output = supPackFourClip + supPackFourEnd;
			}else if(winner == "P5"){
				output = supPackFiveClip + supPackFiveEnd;
			}

			app.setContext('supend', 0, {});
			app.tell(output);


	  }

	 
	  function supFourC(app){
	  		let answerOne = app.data.answerOne;
	  		let answerTwo = app.data.answerTwo;
	  		let answerThree = app.data.answerThree;
	  		let answerFour = "Dys";
	  		let winner = calculateWinner(3, answerOne, answerTwo, answerThree, answerFour);
	  		app.data.winner = winner;
	  		let output = "";
	  		let prevPack = "";
	  		if(winner == "P1"){
				output = supPackOneIntro;
				prevPack = supPackOne;
			}else if(winner == "P2"){
				output = supPackTwoIntro;
				prevPack = supPackTwo;
			}else if(winner == "P3"){
				output = supPackThreeIntro;
				prevPack = supPackThree;
			}else if(winner == "P4"){
				output = supPackFourIntro;
				prevPack = supPackFour;
			}else if(winner == "P5"){
				output = supPackFiveIntro;
				prevPack = supPackFive;
			}


			let user = app.getUser().userId;
		    let userRef = firebase.database().ref('/users/' + user);

		    userRef.once('value').then(function(snapshot){

		      let updates ={};
		      updates['/users/' + user + '/prevPack'] = prevPack;
		      firebase.database().ref().update(updates);



		    });
	  		
	  		app.setContext('supfour', 0, {});
	  		app.setContext('supend', 1, {});
	  		app.ask(output);

	  }

	  function supFourB(app){
	  		let answerOne = app.data.answerOne;
	  		let answerTwo = app.data.answerTwo;
	  		let answerThree = app.data.answerThree;
	  		let answerFour = "CoA";
	  		let winner = calculateWinner(3, answerOne, answerTwo, answerThree, answerFour);
	  		app.data.winner = winner;
	  		let output = "";
	  		let prevPack = "";
	  		if(winner == "P1"){
				output = supPackOneIntro;
				prevPack = supPackOne;
			}else if(winner == "P2"){
				output = supPackTwoIntro;
				prevPack = supPackTwo;
			}else if(winner == "P3"){
				output = supPackThreeIntro;
				prevPack = supPackThree;
			}else if(winner == "P4"){
				output = supPackFourIntro;
				prevPack = supPackFour;
			}else if(winner == "P5"){
				output = supPackFiveIntro;
				prevPack = supPackFive;
			}


			let user = app.getUser().userId;
		    let userRef = firebase.database().ref('/users/' + user);

		    userRef.once('value').then(function(snapshot){

		      let updates ={};
		      updates['/users/' + user + '/prevPack'] = prevPack;
		      firebase.database().ref().update(updates);



		    });
	  		
	  		app.setContext('supfour', 0, {});
	  		app.setContext('supend', 1, {});
	  		app.ask(output);

	  }

	  function supFourA(app){
	  		let answerOne = app.data.answerOne;
	  		let answerTwo = app.data.answerTwo;
	  		let answerThree = app.data.answerThree;
	  		let answerFour = "GH";
	  		let winner = calculateWinner(3, answerOne, answerTwo, answerThree, answerFour);
	  		app.data.winner = winner;
	  		let output = "";
	  		let prevPack = "";
	  		if(winner == "P1"){
				output = supPackOneIntro;
				prevPack = supPackOne;
			}else if(winner == "P2"){
				output = supPackTwoIntro;
				prevPack = supPackTwo;
			}else if(winner == "P3"){
				output = supPackThreeIntro;
				prevPack = supPackThree;
			}else if(winner == "P4"){
				output = supPackFourIntro;
				prevPack = supPackFour;
			}else if(winner == "P5"){
				output = supPackFiveIntro;
				prevPack = supPackFive;
			}


			let user = app.getUser().userId;
		    let userRef = firebase.database().ref('/users/' + user);

		    userRef.once('value').then(function(snapshot){

		      let updates ={};
		      updates['/users/' + user + '/prevPack'] = prevPack;
		      firebase.database().ref().update(updates);



		    });
	  		
	  		app.setContext('supfour', 0, {});
	  		app.setContext('supend', 1, {});
	  		app.ask(output);

	  }

	  function supThreeC(app){
	  		app.data.answerThree = "ID";
	  		app.data.prevIntent = "supQfour";
	  		app.ask(supQuestionFour);
	  		app.setContext('supfour', 1, {});
	  		app.setContext('supthree', 0, {});

	  }

	  function supThreeB(app){
	  		app.data.answerThree = "PoC";
	  		app.data.prevIntent = "supQfour";
	  		app.ask(supQuestionFour);
	  		app.setContext('supfour', 1, {});
	  		app.setContext('supthree', 0, {});

	  }

	  function supThreeA(app){
	  		app.data.answerThree = "Alt";
	  		app.data.prevIntent = "supQfour";
	  		app.ask(supQuestionFour);
	  		app.setContext('supfour', 1, {});
	  		app.setContext('supthree', 0, {});

	  }

	  function supTwoC(app){
	  		app.data.answerTwo = "Mys";
	  		app.data.prevIntent = "supQthree";
	  		app.ask(supQuestionThree);
	  		app.setContext('supthree', 1, {});
	  		app.setContext('suptwo', 0, {});
	  }

	  function supTwoB(app){
	  		app.data.answerTwo = "C";
	  		app.data.prevIntent = "supQthree";
	  		app.ask(supQuestionThree);
	  		app.setContext('supthree', 1, {});
	  		app.setContext('suptwo', 0, {});
	  }

	  function supTwoA(app){
	  		app.data.answerTwo = "Mur";
	  		app.data.prevIntent = "supQthree";
	  		app.ask(supQuestionThree);
	  		app.setContext('supthree', 1, {});
	  		app.setContext('suptwo', 0, {});
	  }

	  function supOneC(app){
	  		app.data.answerOne = "HoD";
	  		app.data.prevIntent = "supQtwo";
	  		app.setContext('suptwo', 1, {});
	  		app.setContext('scione', 0, {});
	  		app.setContext('psyone', 0, {});
	  		app.setContext('supone', 0, {});
	  		app.ask(supQuestionTwo);


	  }
	  
	  function supOneB(app){
	  		app.data.answerOne = "GvE";
	  		app.data.prevIntent = "supQtwo";
	  		app.setContext('suptwo', 1, {});
	  		app.setContext('scione', 0, {});
	  		app.setContext('psyone', 0, {});
	  		app.setContext('supone', 0, {});
	  		app.ask(supQuestionTwo);


	  }

	  function supOneA(app){
	  		app.data.answerOne = "T";
	  		app.data.prevIntent = "supQtwo";
	  		app.setContext('suptwo', 1, {});
	  		app.setContext('scione', 0, {});
	  		app.setContext('psyone', 0, {});
	  		app.setContext('supone', 0, {});
	  		app.ask(supQuestionTwo);
	  		


	  }


	  function sciEndNo(app){
	  		let winner = app.data.winner;
	  		let output = "";
	  		if(winner == "P1"){
				output = sciPackOneEnd;
			}else if(winner == "P2"){
				output = sciPackTwoEnd;
			}else if(winner == "P3"){
				output = sciPackThreeEnd;
			}

			app.setContext('sciend', 0, {});
			app.tell(output);

	  }


	  function sciEndYes(app){

	  		let winner = app.data.winner;
	  		let output = "";
	  		if(winner == "P1"){
				output = sciPackOneClip + sciPackOneEnd;
			}else if(winner == "P2"){
				output = sciPackTwoClip + sciPackTwoEnd;
			}else if(winner == "P3"){
				output = sciPackThreeClip + sciPackThreeEnd;
			}

			app.setContext('sciend', 0, {});
			app.tell(output);

	  }

	  
	  function sciFourB(app){
	  		let answerOne = app.data.answerOne;
	  		let answerTwo = app.data.answerTwo;
	  		let answerThree = app.data.answerThree;
	  		let answerFour = "Mys";
	  		let winner = calculateWinner(2, answerOne, answerTwo, answerThree, answerFour);
	  		app.data.winner = winner;
	  		let output = "";
	  		let prevPack = "";
	  		if(winner == "P1"){
				output = sciPackOneIntro;
				prevPack = sciPackOne;
			}else if(winner == "P2"){
				output = sciPackTwoIntro;
				prevPack = sciPackTwo;
			}else if(winner == "P3"){
				output = sciPackThreeIntro;
				prevPack = sciPackThree;
			}

			let user = app.getUser().userId;
		    let userRef = firebase.database().ref('/users/' + user);

		    userRef.once('value').then(function(snapshot){

		      let updates ={};
		      updates['/users/' + user + '/prevPack'] = prevPack;
		      firebase.database().ref().update(updates);



		    });
	  		app.data.prevIntent = "sciEnd";
	  		app.setContext('scifour', 0, {});
	  		app.setContext('sciend', 1, {});
	  		app.ask(output);
	  }

	  function sciFourA(app){
	  		let answerOne = app.data.answerOne;
	  		let answerTwo = app.data.answerTwo;
	  		let answerThree = app.data.answerThree;
	  		let answerFour = "Mar";
	  		let winner = calculateWinner(2, answerOne, answerTwo, answerThree, answerFour);
	  		app.data.winner = winner;
	  		let output = "";
	  		let prevPack = "";
	  		if(winner == "P1"){
				output = sciPackOneIntro;
				prevPack = sciPackOne;
			}else if(winner == "P2"){
				output = sciPackTwoIntro;
				prevPack = sciPackTwo;
			}else if(winner == "P3"){
				output = sciPackThreeIntro;
				prevPack = sciPackThree;
			}

			let user = app.getUser().userId;
		    let userRef = firebase.database().ref('/users/' + user);

		    userRef.once('value').then(function(snapshot){

		      let updates ={};
		      updates['/users/' + user + '/prevPack'] = prevPack;
		      firebase.database().ref().update(updates);



		    });
	  		app.data.prevIntent = "sciEnd";
	  		app.setContext('scifour', 0, {});
	  		app.setContext('sciend', 1, {});
	  		app.ask(output);
	  }

	  function sciThreeB(app){
	  		app.data.answerThree = "Alt";
	  		app.data.prevIntent = "sciQfour";
	  		app.ask(sciQuestionFour);
	  		app.setContext('scifour', 1, {});
	  		app.setContext('scithree', 0, {});
	  }

	  function sciThreeA(app){
	  		app.data.answerThree = "CoA";
	  		app.data.prevIntent = "sciQfour";
	  		app.ask(sciQuestionFour);
	  		app.setContext('scifour', 1, {});
	  		app.setContext('scithree', 0, {});
	  }

	  function sciTwoB(app){
	  		app.data.answerTwo = "SotP";
	  		app.data.prevIntent = "sciQthree";
	  		app.ask(sciQuestionThree);
	  		app.setContext('scithree', 1, {});
	  		app.setContext('scitwo', 0, {});
	  }

	  function sciTwoA(app){
	  		app.data.answerTwo = "S";
	  		app.data.prevIntent = "sciQthree";
	  		app.ask(sciQuestionThree);
	  		app.setContext('scithree', 1, {});
	  		app.setContext('scitwo', 0, {});
	  }

	  function sciOneC(app){
	  		app.data.answerOne = "Dys";
	  		app.data.prevIntent = "sciQtwo";
	  		app.setContext('scitwo', 1, {});
	  		app.setContext('scione', 0, {});
	  		app.setContext('psyone', 0, {});
	  		app.setContext('supone', 0, {});
	  		app.ask(sciQuestionTwo);

	  }

	  function sciOneB(app){
	  		app.data.answerOne = "T";
	  		app.data.prevIntent = "sciQtwo";
	  		app.setContext('scitwo', 1, {});
	  		app.setContext('scione', 0, {});
	  		app.setContext('psyone', 0, {});
	  		app.setContext('supone', 0, {});
	  		app.ask(sciQuestionTwo);

	  }


	  function sciOneA(app){

	  		app.data.answerOne = "GvE";
	  		app.data.prevIntent = "sciQtwo";
	  		app.setContext('scitwo', 1, {});
	  		app.setContext('scione', 0, {});
	  		app.setContext('psyone', 0, {});
	  		app.setContext('supone', 0, {});
	  		app.ask(sciQuestionTwo);

	  }

	  function psyEndNo(app){

	  		let winner = app.data.winner;
	  		let output = "";
	  		if(winner == "P1"){
				output = psyPackOneEnd;
			}else if(winner == "P2"){
				output = psyPackTwoEnd;
			}else if(winner == "P3"){
				output = psyPackThreeEnd;
			}

			app.setContext('psyend', 0, {});
			app.tell(output);
	  }


	  function psyEndYes(app){

	  		let winner = app.data.winner;
	  		let output = "";
	  		if(winner == "P1"){
				output = psyPackOneClip + psyPackOneEnd;
			}else if(winner == "P2"){
				output = psyPackTwoClip + psyPackTwoEnd;
			}else if(winner == "P3"){
				output = psyPackThreeClip + psyPackThreeEnd;
			}

			app.setContext('psyend', 0, {});
			app.tell(output);

	  }

	  function psyFourB(app){

	  		let answerOne = app.data.answerOne;
	  		let answerTwo = app.data.answerTwo;
	  		let answerThree = app.data.answerThree;
	  		let answerFour = "PoC";
	  		let winner = calculateWinner(1, answerOne, answerTwo, answerThree, answerFour);
	  		app.data.winner = winner;
	  		let output = "";
	  		let prevPack = ""
	  		if(winner == "P1"){
				output = psyPackOneIntro;
				prevPack = psyPackOne;
			}else if(winner == "P2"){
				output = psyPackTwoIntro;
				prevPack = psyPackTwo;
			}else if(winner == "P3"){
				output = psyPackThreeIntro;
				prevPack = psyPackThree;
			}

			let user = app.getUser().userId;
		    let userRef = firebase.database().ref('/users/' + user);

		    userRef.once('value').then(function(snapshot){

		      let updates ={};
		      updates['/users/' + user + '/prevPack'] = prevPack;
		      firebase.database().ref().update(updates);



		    });
	  		app.data.prevIntent = "psyEnd";
	  		app.setContext('psyfour', 0, {});
	  		app.setContext('psyend', 1, {});
	  		app.ask(output);
	  }


	  function psyFourA(app){
	  		let answerOne = app.data.answerOne;
	  		let answerTwo = app.data.answerTwo;
	  		let answerThree = app.data.answerThree;
	  		let answerFour = "GH";
	  		let winner = calculateWinner(1, answerOne, answerTwo, answerThree, answerFour);
	  		app.data.winner = winner;
	  		let output = "";
	  		if(winner == "P1"){
				output = psyPackOneIntro;
			}else if(winner == "P2"){
				output = psyPackTwoIntro;
			}else if(winner == "P3"){
				output = psyPackThreeIntro;
			}
	  		app.data.prevIntent = "psyEnd";
	  		app.setContext('psyfour', 0, {});
	  		app.setContext('psyend', 1, {});
	  		app.ask(output);


	  }

	  function psyThreeB(app){
	  		app.data.answerThree = "CoA";
	  		app.data.prevIntent = "psyQfour";
	  		app.ask(psyQuestionFour);
	  		app.setContext('psyfour', 1, {});
	  		app.setContext('psythree', 0, {});
	  }

	  function psyThreeA(app){
	  		app.data.answerThree = "SotP";
	  		app.data.prevIntent = "psyQfour";
	  		app.ask(psyQuestionFour);
	  		app.setContext('psyfour', 1, {});
	  		app.setContext('psythree', 0, {});

	  }

	  function psyTwoB(app){
	  		app.data.answerTwo = "ID";
	  		app.data.prevIntent = "psyQthree";
	  		app.ask(psyQuestionThree);
	  		app.setContext('psythree', 1, {});
	  		app.setContext('psytwo', 0, {});

	  }

	  function psyTwoA(app){
	  		app.data.answerTwo = "C";
	  		app.data.prevIntent = "psyQthree";
	  		app.ask(psyQuestionThree);
	  		app.setContext('psythree', 1, {});
	  		app.setContext('psytwo', 0, {});

	  }


	  function psyOneC(app){
	  		app.data.answerOne = "HoD";
	  		app.data.prevIntent = "psyQtwo";
	  		app.setContext('psytwo', 1, {});
	  		app.setContext('psyone', 0, {});
	  		app.setContext('scione', 0, {});
	  		app.setContext('supone', 0, {});
	  		app.ask(psyQuestionTwo);
	  }

	  function psyOneB(app){
	  		app.data.answerOne = "T";
	  		app.data.prevIntent = "psyQtwo";
	  		app.setContext('psytwo', 1, {});
	  		app.setContext('psyone', 0, {});
	  		app.setContext('scione', 0, {});
	  		app.setContext('supone', 0, {});
	  		app.ask(psyQuestionTwo);


	  }

	  function psyOneA(app){

	  		app.data.answerOne = "S";
	  		app.data.prevIntent = "psyQtwo";
	  		app.setContext('psytwo', 1, {});
	  		app.setContext('psyone', 0, {});
	  		app.setContext('scione', 0, {});
	  		app.setContext('supone', 0, {});
	  		app.ask(psyQuestionTwo);


	  }


	  function genreThirdC(app){

	  		let genreOne = app.data.genreFirst;
	  		let genreTwo = app.data.genreSecond;
	  		let genreThree = 3;

	  		let catChoice = calculateGenre(genreOne, genreTwo, genreThree);
	  		
	  		if(catChoice == 1){
	  			app.data.prevIntent = "psyQone";
	  			app.ask(psyQuestionOne);
	  			app.setContext('psyone', 1, {});
	  			app.setContext('thirdgenre', 0, {});

	  		}else if(catChoice == 2){
	  			app.data.prevIntent = "sciQone";
	  			app.ask(sciQuestionOne);
	  			app.setContext('scione', 1, {});
	  			app.setContext('thirdgenre', 0, {});

	  		}else{
	  			app.data.prevIntent = "supQone";
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
	  			app.data.prevIntent = "psyQone";
	  			app.ask(psyQuestionOne);
	  			app.setContext('psyone', 1, {});
	  			app.setContext('thirdgenre', 0, {});

	  		}else if(catChoice == 2){
	  			app.data.prevIntent = "sciQone";
	  			app.ask(sciQuestionOne);
	  			app.setContext('scione', 1, {});
	  			app.setContext('thirdgenre', 0, {});

	  		}else{
	  			app.data.prevIntent = "supQone";
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
	  			app.data.prevIntent = "psyQone";
	  			app.ask(psyQuestionOne);
	  			app.setContext('psyone', 1, {});
	  			app.setContext('thirdgenre', 0, {});

	  		}else if(catChoice == 2){
	  			app.data.prevIntent = "sciQone";
	  			app.ask(sciQuestionOne);
	  			app.setContext('scione', 1, {});
	  			app.setContext('thirdgenre', 0, {});

	  		}else{
	  			app.data.prevIntent = "supQone";
	  			app.ask(supQuestionOne);
	  			app.setContext('supone', 1, {});
	  			app.setContext('thirdgenre', 0, {});

	  		}

	  }


	  function genreSecondC(app){
	  		app.data.genreSecond = 2;
	  		app.ask(genreQThree);
	  		app.data.prevIntent = "genreQthree";
	  		app.setContext('thirdgenre', 1, {});
	  		app.setContext('secondgenre', 0, {});

	  }

	  function genreSecondB(app){
	  		app.data.genreSecond = 1;
	  		app.ask(genreQThree);
	  		app.data.prevIntent = "genreQthree";
	  		app.setContext('thirdgenre', 1, {});
	  		app.setContext('secondgenre', 0, {});

	  }


	  function genreSecondA(app){
	  		app.data.genreSecond = 3;
	  		app.ask(genreQThree);
			app.data.prevIntent = "genreQthree";
	  		app.setContext('thirdgenre', 1, {});
	  		app.setContext('secondgenre', 0, {});

	  }


	  function genreFirstC(app){

	  		app.data.genreFirst = 2;
	  		app.ask(genreQTwo);
	  		app.data.prevIntent = "genreQtwo";
	  		app.setContext('secondgenre', 1, {});
	  		app.setContext('firstgenre', 0, {});	  		

	  }

	  function genreFirstB(app){

	  		app.data.genreFirst = 1;
	  		app.ask(genreQTwo);
	  		app.data.prevIntent = "genreQtwo";
	  		app.setContext('secondgenre', 1, {});
	  		app.setContext('firstgenre', 0, {});

	  }

	  function genreFirstA(app){
	  		app.data.genreFirst = 3;
	  		app.ask(genreQTwo);
	  		app.data.prevIntent = "genreQtwo";
	  		app.setContext('secondgenre', 1, {});
	  		app.setContext('firstgenre', 0, {});

	  }

	  function yes(app){

	  		app.data.prevIntent = "genreQone";
	  		app.ask(genreQOne);
	  		app.setContext('firstgenre', 1, {});
	  		app.setContext('intro', 0, {});


	  }


	  function welcomeIntent(app){


		    let user = app.getUser().userId;
		    let root = firebase.database().ref();
		    let userTest = app.getUser();


		    root.once('value').then(function(snapshot){
		        let dataBool = snapshot.child('users/' + user).exists();

		        if(dataBool == true){


		            console.log(dataBool + ", data exists for this user!");


		        }else{

		            console.log(dataBool + ", lets make a new profile!");
		            writeUserData(user);

		        }

		    });
	  		
	  		app.data.prevIntent = "welcome";
	  		app.ask(introText);
	  		app.setContext('intro', 1, {});


	  }



	  let actionmap = new Map();
	  actionMap.set('input.welcome', welcomeIntent);
	  actionMap.set('genreonea', genreOneA);
	  actionMap.set('genreoneb', genreOneB);
	  actionMap.set('genreonec', genreOneC);
	  actionMap.set('genretwoa', genreTwoA);
	  actionMap.set('genretwob', genreTwoB);
	  actionMap.set('genretwoc', genreTwoC);
	  actionMap.set('genrethreea', genreThreeA);
	  actionMap.set('genrethreeb', genreThreeB);
	  actionMap.set('genrethreec', genreThreeC);
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
	  actionMap.set('suptwoa', supTwoA);
	  actionMap.set('suptwob', supTwoB);
	  actionMap.set('suptwoc', supTwoC);
	  actionMap.set('supthreea', supThreeA);
	  actionMap.set('supthreeb', supThreeB);
	  actionMap.set('supThreec', supThreeC);
	  actionMap.set('supfoura', supFourA);
	  actionMap.set('supfourb', supFourB);
	  actionMap.set('supFourc', supFourC);





	  app.handleRequest(actionMap);


});
