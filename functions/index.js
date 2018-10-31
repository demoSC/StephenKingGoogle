process.env.DEBUG = 'actions-on-google:*';
const { DialogflowApp } = require('actions-on-google');
const functions = require('firebase-functions');
const firebase = require('firebase-admin');

const introText = "<audio src='https://s3.amazonaws.com/stephenkingassets/googleassets/techmsg/INTRO.mp3'>Welcome to the Stephen King Library</audio>";
const introRepeat = "<audio src='https://s3.amazonaws.com/stephenkingassets/googleassets/techmsg/04_WELCOME_BACK_2W.MUSIC.mp3'>Welcome to the Stephen King Library</audio>";
const genreQOne = "<audio src='https://s3.amazonaws.com/stephenkingassets/googleassets/genrequestions/01_IGQ1.mp3'>Question One</audio>";
const genreQTwo = "<audio src='https://s3.amazonaws.com/stephenkingassets/googleassets/genrequestions/02_IGQ1.1.mp3'></audio><break time='.25s' /><audio src='https://s3.amazonaws.com/stephenkingassets/googleassets/genrequestions/03_IGQ2.mp3'>Question Two</audio>";
const genreQThree = "<audio src='https://s3.amazonaws.com/stephenkingassets/googleassets/genrequestions/04_IGQ2.1.mp3'></audio><break time='.25s' /><audio src='https://s3.amazonaws.com/stephenkingassets/googleassets/genrequestions/05_IGQ3.mp3'>Question Three</audio>";
const psyQuestionOne = "<audio src='https://s3.amazonaws.com/stephenkingassets/googleassets/genrequestions/06_IGQ3.1.mp3'></audio><break time='.25s' /><audio src='https://s3.amazonaws.com/stephenkingassets/googleassets/psyquestions/01_GAQ1.mp3'>Question Four</audio>";
const psyQuestionTwo = "<audio src='https://s3.amazonaws.com/stephenkingassets/googleassets/psyquestions/02_GAQ1.1.mp3'></audio><break time='.25s' /><audio src='https://s3.amazonaws.com/stephenkingassets/googleassets/psyquestions/03_GAQ2.mp3'>Question Five</audio>";
const psyQuestionThree = "<audio src='https://s3.amazonaws.com/stephenkingassets/googleassets/psyquestions/04_GAQ2.1.mp3'></audio><break time='.25s' /><audio src='https://s3.amazonaws.com/stephenkingassets/googleassets/psyquestions/05_GAQ3.mp3'>Question Six</audio>";
const psyQuestionFour = "<audio src='https://s3.amazonaws.com/stephenkingassets/googleassets/psyquestions/06_GAQ3.1.mp3'></audio><break time='.25s' /><audio src='https://s3.amazonaws.com/stephenkingassets/googleassets/psyquestions/07_GAQ4_V2.mp3'>Question Seven</audio>";
const sciQuestionOne = "<audio src='https://s3.amazonaws.com/stephenkingassets/googleassets/genrequestions/06_IGQ3.1.mp3'></audio><break time='.25s' /><audio src='https://s3.amazonaws.com/stephenkingassets/googleassets/sciquestions/01_GBQ1.mp3'>Question Four</audio>";
const sciQuestionTwo = "<audio src='https://s3.amazonaws.com/stephenkingassets/googleassets/sciquestions/02_GBQ1.1.mp3'></audio><break time='.25s' /><audio src='https://s3.amazonaws.com/stephenkingassets/googleassets/sciquestions/03_GBQ2.mp3'>Question Five</audio>";
const sciQuestionThree = "<audio src='https://s3.amazonaws.com/stephenkingassets/googleassets/sciquestions/04_GBQ2.1.mp3'></audio><break time='.25s' /><audio src='https://s3.amazonaws.com/stephenkingassets/googleassets/sciquestions/05_GBQ3.mp3'>Question Six</audio>";
const sciQuestionFour = "<audio src='https://s3.amazonaws.com/stephenkingassets/googleassets/sciquestions/06_GBQ3.1.mp3'></audio><break time='.25s' /><audio src='https://s3.amazonaws.com/stephenkingassets/googleassets/sciquestions/07_GBQ4.mp3'>Question Seven</audio>";
const supQuestionOne = "<audio src='https://s3.amazonaws.com/stephenkingassets/googleassets/genrequestions/06_IGQ3.1.mp3'></audio><break time='.25s' /><audio src='https://s3.amazonaws.com/stephenkingassets/googleassets/supquestions/01_GCQ1.mp3'>Question Four</audio>";
const supQuestionTwo = "<audio src='https://s3.amazonaws.com/stephenkingassets/googleassets/supquestions/02_GCQ1.1.mp3'></audio><break time='.25s' /><audio src='https://s3.amazonaws.com/stephenkingassets/googleassets/supquestions/03_GCQ2.mp3'>Question Five</audio>";
const supQuestionThree = "<audio src='https://s3.amazonaws.com/stephenkingassets/googleassets/supquestions/04_GCQ2.1.mp3'></audio><break time='.25s' /><audio src='https://s3.amazonaws.com/stephenkingassets/googleassets/supquestions/05_GCQ3.mp3'>Question Six</audio>";
const supQuestionFour = "<audio src='https://s3.amazonaws.com/stephenkingassets/googleassets/supquestions/06_GCQ3.1.mp3'></audio><break time='.25s' /><audio src='https://s3.amazonaws.com/stephenkingassets/googleassets/supquestions/07_GCQ4.mp3'>Question Seven</audio>";


const genreQTwoRepeat = "<audio src='https://s3.amazonaws.com/stephenkingassets/googleassets/genrequestions/03_IGQ2.mp3'>Question Two</audio>";
const genreQThreeRepeat = "<audio src='https://s3.amazonaws.com/stephenkingassets/googleassets/genrequestions/05_IGQ3.mp3'>Question Three</audio>";
const psyQuestionOneRepeat = "<audio src='https://s3.amazonaws.com/stephenkingassets/googleassets/psyquestions/01_GAQ1.mp3'>Question Four</audio>";
const psyQuestionTwoRepeat = "<audio src='https://s3.amazonaws.com/stephenkingassets/googleassets/psyquestions/03_GAQ2.mp3'>Question Five</audio>";
const psyQuestionThreeRepeat = "<audio src='https://s3.amazonaws.com/stephenkingassets/googleassets/psyquestions/05_GAQ3.mp3'>Question Six</audio>";
const psyQuestionFourRepeat = "<audio src='https://s3.amazonaws.com/stephenkingassets/googleassets/psyquestions/07_GAQ4_V2.mp3'>Question Seven</audio>";
const sciQuestionOneRepeat = "<audio src='https://s3.amazonaws.com/stephenkingassets/googleassets/sciquestions/01_GBQ1.mp3'>Question Four</audio>";
const sciQuestionTwoRepeat = "<audio src='https://s3.amazonaws.com/stephenkingassets/googleassets/sciquestions/03_GBQ2.mp3'>Question Five</audio>";
const sciQuestionThreeRepeat = "<audio src='https://s3.amazonaws.com/stephenkingassets/googleassets/sciquestions/05_GBQ3.mp3'>Question Six</audio>";
const sciQuestionFourRepeat = "<audio src='https://s3.amazonaws.com/stephenkingassets/googleassets/sciquestions/07_GBQ4.mp3'>Question Seven</audio>";
const supQuestionOneRepeat = "<audio src='https://s3.amazonaws.com/stephenkingassets/googleassets/supquestions/01_GCQ1.mp3'>Question Four</audio>";
const supQuestionTwoRepeat = "<audio src='https://s3.amazonaws.com/stephenkingassets/googleassets/supquestions/03_GCQ2.mp3'>Question Five</audio>";
const supQuestionThreeRepeat = "<audio src='https://s3.amazonaws.com/stephenkingassets/googleassets/supquestions/05_GCQ3.mp3'>Question Six</audio>";
const supQuestionFourRepeat = "<audio src='https://s3.amazonaws.com/stephenkingassets/googleassets/supquestions/07_GCQ4.mp3'>Question Seven</audio>";



const introRep = "<audio src='https://s3.amazonaws.com/stephenkingassets/googleassets/techmsg/INTRO_Rep.mp3'>Introduction Message</audio>";
const genreOneRep = "<audio src='https://s3.amazonaws.com/stephenkingassets/googleassets/genrequestions/01_IGQ1_Rep.mp3'>Question One</audio>";
const genreTwoRep = "<audio src='https://s3.amazonaws.com/stephenkingassets/googleassets/genrequestions/03_IGQ2_Rep.mp3'>Question Two</audio>";
const genreThreeRep = "<audio src='https://s3.amazonaws.com/stephenkingassets/googleassets/genrequestions/05_IGQ3_Rep.mp3'>Question Three</audio>";
const psyOneRep = "<audio src='https://s3.amazonaws.com/stephenkingassets/googleassets/psyquestions/01_GAQ1_Rep.mp3'>Question Four</audio>";
const psyTwoRep = "<audio src='https://s3.amazonaws.com/stephenkingassets/googleassets/psyquestions/03_GAQ2_Rep.mp3'>Question Five</audio>";
const psyThreeRep = "<audio src='https://s3.amazonaws.com/stephenkingassets/googleassets/psyquestions/05_GAQ3_Rep.mp3'>Question Six</audio>";
const psyFourRep = "<audio src='https://s3.amazonaws.com/stephenkingassets/googleassets/psyquestions/07_GAQ4_V2_Rep.mp3'>Question Seven</audio>";
const sciOneRep = "<audio src='https://s3.amazonaws.com/stephenkingassets/googleassets/sciquestions/01_GBQ1_Rep.mp3'>Question Four</audio>";
const sciTwoRep = "<audio src='https://s3.amazonaws.com/stephenkingassets/googleassets/sciquestions/03_GBQ2_Rep.mp3'>Question Five</audio>";
const sciThreeRep = "<audio src='https://s3.amazonaws.com/stephenkingassets/googleassets/sciquestions/05_GBQ3_Rep.mp3'>Question Six</audio>";
const sciFourRep = "<audio src='https://s3.amazonaws.com/stephenkingassets/googleassets/sciquestions/07_GBQ4_Rep.mp3'>Question Seven</audio>";
const supOneRep = "<audio src='https://s3.amazonaws.com/stephenkingassets/googleassets/supquestions/01_GCQ1_Rep.mp3'>Question Four</audio>";
const supTwoRep = "<audio src='https://s3.amazonaws.com/stephenkingassets/googleassets/supquestions/03_GCQ2_Rep.mp3'>Question Five</audio>";
const supThreeRep = "<audio src='https://s3.amazonaws.com/stephenkingassets/googleassets/supquestions/05_GCQ3Rep.mp3'>Question Six</audio>";
const supFourRep = "<audio src='https://s3.amazonaws.com/stephenkingassets/googleassets/supquestions/07_GCQ4Rep.mp3'>Question Seven</audio>";
const psyPackOneRepeat = "<audio src='https://s3.amazonaws.com/stephenkingassets/googleassets/outros/01_OUTRO1.mp3'>Your Reading List</audio>";
const psyPackTwoRepeat = "<audio src='https://s3.amazonaws.com/stephenkingassets/googleassets/outros/04_OUTRO2.mp3'>Your Reading List</audio>";
const psyPackThreeRepeat = "<audio src='https://s3.amazonaws.com/stephenkingassets/googleassets/outros/07_OUTRO3.mp3'>Your Reading List</audio>";
const sciPackOneRepeat = "<audio src='https://s3.amazonaws.com/stephenkingassets/googleassets/outros/10_OUTRO4.mp3'>Your Reading List</audio>";
const sciPackTwoRepeat = "<audio src='https://s3.amazonaws.com/stephenkingassets/googleassets/outros/13_OUTRO5.mp3'>Your Reading List</audio>";
const sciPackThreeRepeat = "<audio src='https://s3.amazonaws.com/stephenkingassets/googleassets/outros/16_OUTRO6.mp3'>Your Reading List</audio>";
const supPackOneRepeat = "<audio src='https://s3.amazonaws.com/stephenkingassets/googleassets/outros/19_OUTRO7.mp3'>Your Reading List</audio>";
const supPackTwoRepeat = "<audio src='https://s3.amazonaws.com/stephenkingassets/googleassets/outros/22_OUTRO8.mp3'>Your Reading List</audio>";
const supPackThreeRepeat = "<audio src='https://s3.amazonaws.com/stephenkingassets/googleassets/outros/25_OUTRO9.mp3'>Your Reading List</audio>";
const supPackFourRepeat = "<audio src='https://s3.amazonaws.com/stephenkingassets/googleassets/outros/28_OUTRO10.mp3'>Your Reading List</audio>";
const supPackFiveRepeat = "<audio src='https://s3.amazonaws.com/stephenkingassets/googleassets/outros/31_OUTRO11.mp3'>Your Reading List</audio>";

const psyPackOneIntro = "<audio src='https://s3.amazonaws.com/stephenkingassets/googleassets/psyquestions/08_GAQ4.2.mp3'></audio><break time='.25s'/><audio src='https://s3.amazonaws.com/stephenkingassets/googleassets/outros/01_OUTRO1.mp3'>www.stephenkinglibrary1.com</audio>";
const psyPackOneClip = "<audio src='https://s3.amazonaws.com/stephenkingassets/googleassets/outros/02_OUTRO1.1.mp3'></audio><break time='.25s'/><audio src='https://s3.amazonaws.com/stephenkingassets/googleassets/outros/01_Misery_Final.mp3'>www.stephenkinglibrary1.com</audio>";
const psyPackOneEnd = "<audio src='https://s3.amazonaws.com/stephenkingassets/googleassets/outros/03_OUTRO1.2.mp3'></audio><break time='.25s'/><audio src='https://s3.amazonaws.com/stephenkingassets/googleassets/outros/34_OUTROENDING.mp3'>www.stephenkinglibrary1.com</audio>";
const psyPackOneRep = "Would you like to hear a short preview of Misery?";

const psyPackTwoIntro = "<audio src='https://s3.amazonaws.com/stephenkingassets/googleassets/psyquestions/08_GAQ4.2.mp3'></audio><break time='.25s'/><audio src='https://s3.amazonaws.com/stephenkingassets/googleassets/outros/04_OUTRO2.mp3'>www.stephenkinglibrary2.com</audio>";
const psyPackTwoClip = "<audio src='https://s3.amazonaws.com/stephenkingassets/googleassets/outros/05_OUTRO2.1.mp3'></audio><break time='.25s'/><audio src='https://s3.amazonaws.com/stephenkingassets/googleassets/outros/02_Finders+Keepers_Final.mp3'>www.stephenkinglibrary2.com</audio>";
const psyPackTwoEnd = "<audio src='https://s3.amazonaws.com/stephenkingassets/googleassets/outros/06_OUTRO2.2.mp3'></audio><break time='.25s'/><audio src='https://s3.amazonaws.com/stephenkingassets/googleassets/outros/34_OUTROENDING.mp3'>www.stephenkinglibrary2.com</audio>";
const psyPackTwoRep = "Would you like to hear a short preview of Finders Keepers?";

const psyPackThreeIntro = "<audio src='https://s3.amazonaws.com/stephenkingassets/googleassets/psyquestions/08_GAQ4.2.mp3'></audio><break time='.25s'/><audio src='https://s3.amazonaws.com/stephenkingassets/googleassets/outros/07_OUTRO3.mp3'>www.stephenkinglibrary3.com</audio>";
const psyPackThreeClip = "<audio src='https://s3.amazonaws.com/stephenkingassets/googleassets/outros/08_OUTRO3.1.mp3'></audio><break time='.25s'/><audio src='https://s3.amazonaws.com/stephenkingassets/googleassets/outros/03_Bag+of+Bones_Final.mp3'>www.stephenkinglibrary3.com</audio>";
const psyPackThreeEnd = "<audio src='https://s3.amazonaws.com/stephenkingassets/googleassets/outros/09_OUTRO3.2.mp3'></audio><break time='.25s'/><audio src='https://s3.amazonaws.com/stephenkingassets/googleassets/outros/34_OUTROENDING.mp3'>www.stephenkinglibrary3.com</audio>";
const psyPackThreeRep = "Would you like to hear a short preview of Bag of Bones?";


const sciPackOneIntro = "<audio src='https://s3.amazonaws.com/stephenkingassets/googleassets/sciquestions/08_GBQ4.1.mp3'></audio><break time='.25s'/><audio src='https://s3.amazonaws.com/stephenkingassets/googleassets/outros/10_OUTRO4.mp3'>www.stephenkinglibrary4.com</audio>";
const sciPackOneClip = "<audio src='https://s3.amazonaws.com/stephenkingassets/googleassets/outros/11_OUTRO4.1.mp3'></audio><break time='.25s'/><audio src='https://s3.amazonaws.com/stephenkingassets/googleassets/outros/04_Firestarter_Final.mp3'>www.stephenkinglibrary4.com</audio>";
const sciPackOneEnd = "<audio src='https://s3.amazonaws.com/stephenkingassets/googleassets/outros/12_OUTRO4.2.mp3'></audio><break time='.25s'/><audio src='https://s3.amazonaws.com/stephenkingassets/googleassets/outros/34_OUTROENDING.mp3'>www.stephenkinglibrary4.com</audio>";
const sciPackOneRep = "Would you like to hear a short preview of Firestarter";

const sciPackTwoIntro = "<audio src='https://s3.amazonaws.com/stephenkingassets/googleassets/sciquestions/08_GBQ4.1.mp3'></audio><break time='.25s'/><audio src='https://s3.amazonaws.com/stephenkingassets/googleassets/outros/13_OUTRO5.mp3'>www.stephenkinglibrary5.com</audio>";
const sciPackTwoClip = "<audio src='https://s3.amazonaws.com/stephenkingassets/googleassets/outros/14_OUTRO5.1.mp3'></audio><break time='.25s'/><audio src='https://s3.amazonaws.com/stephenkingassets/googleassets/outros/05_Dark+Tower+I+_FINAL.mp3'>www.stephenkinglibrary5.com</audio>";
const sciPackTwoEnd = "<audio src='https://s3.amazonaws.com/stephenkingassets/googleassets/outros/15_OUTRO5.2.mp3'></audio><break time='.25s'/><audio src='https://s3.amazonaws.com/stephenkingassets/googleassets/outros/34_OUTROENDING.mp3'>www.stephenkinglibrary5.com</audio>";
const sciPackTwoRep = "Would you like to hear a short preview of the Dark Tower 1?";

const sciPackThreeIntro = "<audio src='https://s3.amazonaws.com/stephenkingassets/googleassets/sciquestions/08_GBQ4.1.mp3'></audio><break time='.25s'/><audio src='https://s3.amazonaws.com/stephenkingassets/googleassets/outros/16_OUTRO6.mp3'>www.stephenkinglibrary6.com</audio>";
const sciPackThreeClip = "<audio src='https://s3.amazonaws.com/stephenkingassets/googleassets/outros/17_OUTRO6.1.mp3'></audio><break time='.25s'/><audio src='https://s3.amazonaws.com/stephenkingassets/googleassets/outros/06_11.22.63_Final.mp3'>www.stephenkinglibrary6.com</audio>";
const sciPackThreeEnd = "<audio src='https://s3.amazonaws.com/stephenkingassets/googleassets/outros/18_OUTRO6.2.mp3'></audio><break time='.25s'/><audio src='https://s3.amazonaws.com/stephenkingassets/googleassets/outros/34_OUTROENDING.mp3'>www.stephenkinglibrary6.com</audio>";
const sciPackThreeRep = "Would you like to hear a short preview of 11, 22, 19 63?";


const supPackOneIntro = "<audio src='https://s3.amazonaws.com/stephenkingassets/googleassets/supquestions/08_GCQ4.1.mp3'></audio><break time='.25s'/><audio src='https://s3.amazonaws.com/stephenkingassets/googleassets/outros/19_OUTRO7.mp3'>www.stephenkinglibrary7.com</audio>";
const supPackOneClip = "<audio src='https://s3.amazonaws.com/stephenkingassets/googleassets/outros/20_OUTRO7.1.mp3'></audio><break time='.25s'/><audio src='https://s3.amazonaws.com/stephenkingassets/googleassets/outros/11_The+Outsider_Final.mp3'>www.stephenkinglibrary7.com</audio>";
const supPackOneEnd = "<audio src='https://s3.amazonaws.com/stephenkingassets/googleassets/outros/21_OUTRO7.2.mp3'></audio><break time='.25s'/><audio src='https://s3.amazonaws.com/stephenkingassets/googleassets/outros/34_OUTROENDING.mp3'>www.stephenkinglibrary7.com</audio>";
const supPackOneRep = "Would you like to hear a short preview of the Outsider?";

const supPackTwoIntro = "<audio src='https://s3.amazonaws.com/stephenkingassets/googleassets/supquestions/08_GCQ4.1.mp3'></audio><break time='.25s'/><audio src='https://s3.amazonaws.com/stephenkingassets/googleassets/outros/22_OUTRO8.mp3'>www.stephenkinglibrary8.com</audio>";
const supPackTwoClip = "<audio src='https://s3.amazonaws.com/stephenkingassets/googleassets/outros/23_OUTRO8.1.mp3'></audio><break time='.25s'/><audio src='https://s3.amazonaws.com/stephenkingassets/googleassets/outros/07_Lisey_s+Story_Final.mp3'>www.stephenkinglibrary8.com</audio>";
const supPackTwoEnd = "<audio src='https://s3.amazonaws.com/stephenkingassets/googleassets/outros/24_OUTRO8.2.mp3'></audio><break time='.25s'/><audio src='https://s3.amazonaws.com/stephenkingassets/googleassets/outros/34_OUTROENDING.mp3'>www.stephenkinglibrary8.com</audio>";
const supPackTwoRep = "Would you like to hear a short preview of Lisey's Story?";

const supPackThreeIntro = "<audio src='https://s3.amazonaws.com/stephenkingassets/googleassets/supquestions/08_GCQ4.1.mp3'></audio><break time='.25s'/><audio src='https://s3.amazonaws.com/stephenkingassets/googleassets/outros/25_OUTRO9.mp3'>www.stephenkinglibrary9.com</audio>";
const supPackThreeClip = "<audio src='https://s3.amazonaws.com/stephenkingassets/googleassets/outros/26_OUTRO9.1.mp3'></audio><break time='.25s'/><audio src='https://s3.amazonaws.com/stephenkingassets/googleassets/outros/08_IT_Final.mp3'>www.stephenkinglibrary9.com</audio>";
const supPackThreeEnd = "<audio src='https://s3.amazonaws.com/stephenkingassets/googleassets/outros/27_OUTRO9.2.mp3'></audio><break time='.25s'/><audio src='https://s3.amazonaws.com/stephenkingassets/googleassets/outros/34_OUTROENDING.mp3'>www.stephenkinglibrary9.com</audio>";
const supPackThreeRep = "Would you like to hear a short preview of It?";

const supPackFourIntro = "<audio src='https://s3.amazonaws.com/stephenkingassets/googleassets/supquestions/08_GCQ4.1.mp3'></audio><break time='.25s'/><audio src='https://s3.amazonaws.com/stephenkingassets/googleassets/outros/28_OUTRO10.mp3'>www.stephenkinglibrary10.com</audio>";
const supPackFourClip = "<audio src='https://s3.amazonaws.com/stephenkingassets/googleassets/outros/29_OUTRO10.1.mp3'></audio><break time='.25s'/><audio src='https://s3.amazonaws.com/stephenkingassets/googleassets/outros/09_Revival_Final.mp3'>www.stephenkinglibrary10.com</audio>";
const supPackFourEnd = "<audio src='https://s3.amazonaws.com/stephenkingassets/googleassets/outros/30_OUTRO10.2.mp3'></audio><break time='.25s'/><audio src='https://s3.amazonaws.com/stephenkingassets/googleassets/outros/34_OUTROENDING.mp3'>www.stephenkinglibrary10.com</audio>";
const supPackFourRep = "Would you like to hear a short preview of Revival?";

const supPackFiveIntro = "<audio src='https://s3.amazonaws.com/stephenkingassets/googleassets/supquestions/08_GCQ4.1.mp3'></audio><break time='.25s'/><audio src='https://s3.amazonaws.com/stephenkingassets/googleassets/outros/31_OUTRO11.mp3'>www.stephenkinglibrary11.com</audio>";
const supPackFiveClip = "<audio src='https://s3.amazonaws.com/stephenkingassets/googleassets/outros/32_OUTRO11.1.mp3'></audio><break time='.25s'/><audio src='https://s3.amazonaws.com/stephenkingassets/googleassets/outros/10_Pet+Sematary_Final.mp3'>www.stephenkinglibrary11.com</audio>";
const supPackFiveEnd = "<audio src='https://s3.amazonaws.com/stephenkingassets/googleassets/outros/33_OUTRO11.2.mp3'></audio><break time='.25s'/><audio src='https://s3.amazonaws.com/stephenkingassets/googleassets/outros/34_OUTROENDING.mp3'>www.stephenkinglibrary11.com</audio>";
const supPackFiveRep = "Would you like to hear a short preview of Pet Sematary?";

const writeEgg = "<audio src='https://s3.amazonaws.com/stephenkingassets/googleassets/eastereggs/12_On_Writing_Final.mp3'>On Writing Easter Egg</audio>";
const sbEE = "<audio src='https://s3.amazonaws.com/stephenkingassets/googleassets/eastereggs/SKOK_mixdown.mp3'>Sleeping Beauties Easter Egg</audio>";
const outClip = "<audio src='https://s3.amazonaws.com/stephenkingassets/googleassets/eastereggs/11_The_Outsider_Final.mp3'>The Outsider Easter Egg</audio>";
const psClip = "<audio src ='https://s3.amazonaws.com/stephenkingassets/googleassets/eastereggs/10_Pet+Sematary_Final.mp3' >Let God have his own cat. Smucky was my cat. Such anger I think is the sanest first response to grief that a thinking feeling human being can have. I've always loved her for that defiant cry. Let God have his own cat. Right on. Beautiful right on. Our youngest son Ben less than 2 years old had only learned to walk but already he was practicing his running skills. On a day not long after Smucky’s demise while we were out in the neighboring yard fooling around with a kite our toddler took it into his head to go running toward the road. I ran after him and damned if I couldn't hear one of those Chinchorro trucks coming or Rinko in the novel. Either I caught him and pulled him down or he tripped on his own. To this day I'm not entirely sure which. When you're really scared your memory often blanks out. All I know for sure is that he is still fine and well and in his young manhood, but a part of my mind has never escaped from that gruesome, ‘what if’?</audio>";

const startOv = "<audio src='https://s3.amazonaws.com/stephenkingassets/googleassets/techmsg/06_STARTING_OVER.mp3'>Starting Over</audio>";
const stopMsg = "<audio src='https://s3.amazonaws.com/stephenkingassets/googleassets/techmsg/11_EXIT_SEEYOUSOON.mp3'>Stopping</audio>";
const helpMsg = "<audio src='https://s3.amazonaws.com/stephenkingassets/googleassets/techmsg/09_HELP_STUCK.mp3'>Help!</audio>";
const errorMsg = "<audio src='https://s3.amazonaws.com/stephenkingassets/googleassets/techmsg/10_ERROR_REPEAT.mp3'>Please Repeat</audio>";
const pauseMsg = "<audio src='https://s3.amazonaws.com/stephenkingassets/googleassets/techmsg/05_PAUSING.mp3'>Pause does not work in this experience</audio>";

const funFacts = [
	"In Finders Keepers, a deranged fan murders a reclusive writer and steals notebooks containing unpublished, hand-written work. In 1999, Stephen King submitted an entirely handwritten manuscript to his publisher. Dreamcatcher went on to be a big bestseller. Find your personalized King reading list. <break time='.25s'/> Say Ok Google, Open Stephen King Library. Or for another fun fact, say Ok Google ask Stephen King Library for Extras.",
	"Stephen King wrote several bestselling books under the name Richard Bachman. Fittingly, his secret identity was exposed by a bookstore clerk. Find your personalized King reading list. Say Ok Google, Open Stephen King Library. Or for another fun fact, say Ok Google, ask Stephen King Library for Extras.",
	"On a recent episode of Jeopardy, Stephen King is credited as being the first author to use the phrase shut your pie hole in a novel. That’s also what David Duchovny might tell you if you mentioned this to him; he’s still upset about losing Jeopardy to Stephen in 1995. Find your personalized King reading list. Say Ok Google, Open Stephen King Library. Or for another fun fact, say Ok Google ask Stephen King Library for Extras.",
	"Stephen King married Tabitha Spruce in 1971.  They met in the stacks of the Fogler Library, at the University of Maine at Orono, where they both worked as students. Find your personalized King reading list. Say Ok Google, Open Stephen King Library. Or for another fun fact, say Ok Google ask Stephen King Library for Extras.",
	"Stephen King’s first novel, Carrie was published in 1974.  His 60th novel, The Outsider, was published in 2018. Find your personalized King reading list. Say Ok Google, Open Stephen King Library. Or for another fun fact, say Ok Google ask Stephen King Library for Extras."

];


// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//




let calculateWinner = function(catChoice, answerOne, answerTwo, answerThree, answerFour){

	let P1 = 0;
	let P2 = 0;
	let P3 = 0;
	let P4 = 0;
	let P5 = 0;

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


	
	console.log(winner+", "+answerOne+", "+answerTwo+", "+answerThree+", "+answerFour);
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

	  function pause(app){
	  		let output = "";
	  		let prevIntent = app.data.prevIntent;

	  		if(prevIntent == "welcome"){
	  			if(app.getLastSeen()){
	  				output = introRepeat;
	  			}else{
	  				output = introText;
	  			}
	  		}else if(prevIntent == "genreQone"){
	  			output = genreQOne;
	  		}else if(prevIntent == "genreQtwo"){
	  			output = genreQTwoRepeat;
	  		}else if(prevIntent == "genreQthree"){
	  			output = genreQThreeRepeat;
	  		}else if(prevIntent == "psyQone"){
	  			output = psyQuestionOneRepeat;
	  		}else if(prevIntent == "psyQtwo"){
	  			output = psyQuestionTwoRepeat;
	  		}else if(prevIntent == "psyQthree"){
	  			output = psyQuestionThreeRepeat;
	  		}else if(prevIntent == "psyQfour"){
	  			output = psyQuestionFourRepeat;
	  		}else if(prevIntent == "sciQone"){
	  			output = sciQuestionOneRepeat;
	  		}else if(prevIntent == "sciQtwo"){
	  			output = sciQuestionTwoRepeat;
	  		}else if(prevIntent == "sciQthree"){
	  			output = sciQuestionThreeRepeat;
	  		}else if(prevIntent == "sciQfour"){
	  			output = sciQuestionFourRepeat;
	  		}else if(prevIntent == "supQone"){
	  			output = supQuestionOneRepeat;
	  		}else if(prevIntent == "supQtwo"){
	  			output = supQuestionTwoRepeat;
	  		}else if(prevIntent == "supQthree"){
	  			output = supQuestionThreeRepeat;
	  		}else if(prevIntent == "supQfour"){
	  			output = supQuestionFourRepeat;
	  		}else if(prevIntent == "psyEnd"){
	  			let winner = app.data.winner;
	  			if(winner == "P1"){
	  				output = psyPackOneRepeat;
	  			}else if(winner == "P2"){
	  				output = psyPackTwoRepeat;
	  			}else if(winner == "P3"){
	  				output = psyPackThreeRepeat;
	  			}
	  		}else if(prevIntent == "sciEnd"){
	  			let winner = app.data.winner;
	  			if(winner == "P1"){
	  				output = sciPackOneRepeat;
	  			}else if(winner == "P2"){
	  				output = sciPackTwoRepeat;
	  			}else if(winner == "P3"){
	  				output = sciPackThreeRepeat;
	  			}
	  		}else if(prevIntent == "supEnd"){
	  			let winner = app.data.winner;
	  			if(winner == "P1"){
	  				output = supPackOneRepeat;
	  			}else if(winner == "P2"){
	  				output = supPackTwoRepeat;
	  			}else if(winner == "P3"){
	  				output = supPackThreeRepeat;
	  			}else if(winner == "P4"){
	  				output = supPackFourRepeat;
	  			}else if(winner == "P5"){
	  				output = supPackFiveRepeat;
	  			}
	  		}
	  		app.ask("<speak>"+pauseMsg+"<break time='.25s'/>"+output+"</speak>");
	  }

	  function it(app){
	  	let output = "<speak>The paperback edition of It, weighs more than 2 pounds. If you listen to the audio book, it will take more than 40 hours. Plan a long car ride and turn on the audio. If you’re looking for your next great read say, OK Google, Open Stephen King Library.</speak>";
	  	app.tell(output);
	  }

	  function elevation(app){
	  	let output = "<speak>Something eerie is happening in Castle Rock, Maine. Make sure to check out Elevation, a new novel by Stephen King. It's set in the fictional town of Castle Rock - a recurring setting in King's tales. And if you’re looking for your next great read, say OK Google, open Stephen King Library. </speak>";
	  	app.tell(output);
	  }

	  function sb(app){
		  	let output = "<speak>Here is a clip of Stephen King and his son, Owen King, talking about writing the book together."+sbEE+"By the way, If you’re looking for your next great read, say, Ok Google, open Stephen King Library.</speak>";
		  	app.tell(output);
	  }

	  function castle(app){
		  	let output = "<speak>Castle Rock is a fictional town deep in the main woodlands. Many of King’s works, Cujo, The Dark Half, and Needful Things, as well as the novella, The Body and numerous short stories such as Rita Hayworth and The Shawshank Redemption are set there or contain references to Castle Rock. By the way, If you’re looking for your next great read, say, Ok Google, open Stephen King Library.</speak>";
		  	app.tell(output);
	  }

	  function onWrite(app){
		  	let output = "<speak>You don't often hear a true master talking about his craft. But here is Stephen King talking about his art. Enjoy!"+ writeEgg + "You just listened to an excerpt from On Writing. If you’re looking for your next great read, say, Ok Google, open Stephen King Library</speak>";
		  	app.tell(output);
	  }

	  function outsider(app){
		  	let output ="<speak>Here's an audio excerpt from the Outsider."+outClip+"If you’re looking for your next great read, say Alexa, open Stephen King Library.</speak>";
		  	app.tell(output);

	  }

	  function mercedes(app){
	  		let output = "<speak>Can a man who is hospitalized in a vegetative state still create chaos?  Did you know Mr. Mercedes is the first book in Stephen King’s Bill Hodges trilogy?  And if you’re looking for your next great read, say Ok Google, open Stephen King Library. </speak>";
	  		app.tell(output);
	  }

	  function pet(app){
	  		let output = "<speak> "+psClip+" Check out the movie after you've finished reading the book. By the way, if you're looking for your next great read say ok Google, open Stephen King Library. </speak>";
	  		app.tell(output);
	  }

	  function facts(app){
	  		let number = Math.floor(Math.random()*5);
	  		let output = funFacts[number];
	  		app.tell("<speak>"+output+"</speak>");	
	  }

	  function errorIntent(app){
	  		let output = errorMsg;
	  		let context = app.getContexts();
	  		let str = JSON.stringify(context, null, 4);
	  		console.log("error: "+str);

	  		app.ask("<speak>"+output+"</speak>");

	  }


	  function repeat(app){

	  		let output = "";
	  		let prevIntent = app.data.prevIntent;

	  		if(prevIntent == "welcome"){
	  			if(app.getLastSeen()){
	  				output = introRepeat;
	  			}else{
	  				output = introText;
	  			}
	  		}else if(prevIntent == "genreQone"){
	  			output = genreQOne;
	  		}else if(prevIntent == "genreQtwo"){
	  			output = genreQTwoRepeat;
	  		}else if(prevIntent == "genreQthree"){
	  			output = genreQThreeRepeat;
	  		}else if(prevIntent == "psyQone"){
	  			output = psyQuestionOneRepeat;
	  		}else if(prevIntent == "psyQtwo"){
	  			output = psyQuestionTwoRepeat;
	  		}else if(prevIntent == "psyQthree"){
	  			output = psyQuestionThreeRepeat;
	  		}else if(prevIntent == "psyQfour"){
	  			output = psyQuestionFourRepeat;
	  		}else if(prevIntent == "sciQone"){
	  			output = sciQuestionOneRepeat;
	  		}else if(prevIntent == "sciQtwo"){
	  			output = sciQuestionTwoRepeat;
	  		}else if(prevIntent == "sciQthree"){
	  			output = sciQuestionThreeRepeat;
	  		}else if(prevIntent == "sciQfour"){
	  			output = sciQuestionFourRepeat;
	  		}else if(prevIntent == "supQone"){
	  			output = supQuestionOneRepeat;
	  		}else if(prevIntent == "supQtwo"){
	  			output = supQuestionTwoRepeat;
	  		}else if(prevIntent == "supQthree"){
	  			output = supQuestionThreeRepeat;
	  		}else if(prevIntent == "supQfour"){
	  			output = supQuestionFourRepeat;
	  		}else if(prevIntent == "psyEnd"){
	  			let winner = app.data.winner;
	  			if(winner == "P1"){
	  				output = psyPackOneRepeat;
	  			}else if(winner == "P2"){
	  				output = psyPackTwoRepeat;
	  			}else if(winner == "P3"){
	  				output = psyPackThreeRepeat;
	  			}
	  		}else if(prevIntent == "sciEnd"){
	  			let winner = app.data.winner;
	  			if(winner == "P1"){
	  				output = sciPackOneRepeat;
	  			}else if(winner == "P2"){
	  				output = sciPackTwoRepeat;
	  			}else if(winner == "P3"){
	  				output = sciPackThreeRepeat;
	  			}
	  		}else if(prevIntent == "supEnd"){
	  			let winner = app.data.winner;
	  			if(winner == "P1"){
	  				output = supPackOneRepeat;
	  			}else if(winner == "P2"){
	  				output = supPackTwoRepeat;
	  			}else if(winner == "P3"){
	  				output = supPackThreeRepeat;
	  			}else if(winner == "P4"){
	  				output = supPackFourRepeat;
	  			}else if(winner == "P5"){
	  				output = supPackFiveRepeat;
	  			}
	  		}

	  		app.ask("<speak>"+output+"</speak>");

	  }


	  function noInput(app){

	  		let output = "";
	  		let prevIntent = app.data.prevIntent;

	  		if(prevIntent == "welcome"){
	  			output = introRep;
	  		}else if(prevIntent == "genreQone"){
	  			output = genreOneRep;
	  		}else if(prevIntent == "genreQtwo"){
	  			output = genreTwoRep;
	  		}else if(prevIntent == "genreQthree"){
	  			output = genreThreeRep;
	  		}else if(prevIntent == "psyQone"){
	  			output = psyOneRep;
	  		}else if(prevIntent == "psyQtwo"){
	  			output = psyTwoRep;
	  		}else if(prevIntent == "psyQthree"){
	  			output = psyThreeRep;
	  		}else if(prevIntent == "psyQfour"){
	  			output = psyFourRep;
	  		}else if(prevIntent == "sciQone"){
	  			output = sciOneRep;
	  		}else if(prevIntent == "sciQtwo"){
	  			output = sciTwoRep;
	  		}else if(prevIntent == "sciQthree"){
	  			output = sciThreeRep;
	  		}else if(prevIntent == "sciQfour"){
	  			output = sciFourRep;
	  		}else if(prevIntent == "supQone"){
	  			output = supOneRep;
	  		}else if(prevIntent == "supQtwo"){
	  			output = supTwoRep;
	  		}else if(prevIntent == "supQthree"){
	  			output = supThreeRep;
	  		}else if(prevIntent == "supQfour"){
	  			output = supFourRep;
	  		}else if(prevIntent == "psyEnd"){
	  			let winner = app.data.winner;
	  			if(winner == "P1"){
	  				output = psyPackOneRep;
	  			}else if(winner == "P2"){
	  				output = psyPackTwoRep;
	  			}else if(winner == "P3"){
	  				output = psyPackThreeRep;
	  			}
	  		}else if(prevIntent == "sciEnd"){
	  			let winner = app.data.winner;
	  			if(winner == "P1"){
	  				output = sciPackOneRep;
	  			}else if(winner == "P2"){
	  				output = sciPackTwoRep;
	  			}else if(winner == "P3"){
	  				output = sciPackThreeRep;
	  			}
	  		}else if(prevIntent == "supEnd"){
	  			let winner = app.data.winner;
	  			if(winner == "P1"){
	  				output = supPackOneRep;
	  			}else if(winner == "P2"){
	  				output = supPackTwoRep;
	  			}else if(winner == "P3"){
	  				output = supPackThreeRep;
	  			}else if(winner == "P4"){
	  				output = supPackFourRep;
	  			}else if(winner == "P5"){
	  				output = supPackFiveRep;
	  			}
	  		}

	  		app.ask("<speak>"+output+"</speak>");

	  }

	  function help(app){
	  		

	  		app.ask("<speak>"+helpMsg+"</speak>");
	  }

	  function startOver(app){

	  		let output = startOv + genreQOne;
	  		app.data.prevIntent = "genreQone";
	  		app.setContext('firstgenre', 5, {});
	  		app.setContext('thirdgenre', 0, {});
	  		app.setContext('secondgenre', 0, {});
	  		app.setContext('intro', 0, {});
	  		app.setContext('scione', 0, {});
	  		app.setContext('psyone', 0, {});
	  		app.setContext('supone', 0, {});
	  		app.setContext('scitwo', 0, {});
	  		app.setContext('psytwo', 0, {});
	  		app.setContext('suptwo', 0, {});
	  		app.setContext('scithree', 0, {});
	  		app.setContext('psythree', 0, {});
	  		app.setContext('supthree', 0, {});
	  		app.setContext('scifour', 0, {});
	  		app.setContext('psyfour', 0, {});
	  		app.setContext('supfour', 0, {});
	  		app.setContext('sciend', 0, {});
	  		app.setContext('psyend', 0, {});
	  		app.setContext('supend', 0, {});
	  		app.ask("<speak>"+output+"</speak>");


	  }



	  function supEndNo(app){
	  		app.setContext('supend', 0, {});
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

			
			app.tell("<speak>"+output+"</speak>");

	  }


	  function supEndYes(app){
	  		app.setContext('supend', 0, {});
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

			
			app.tell("<speak>"+output+"</speak>");


	  }

	 
	  function supFourC(app){
	  		app.setContext('supfour', 0, {});
	  		app.setContext('supend', 5, {});
	  		let answerOne = app.data.answerOne;
	  		let answerTwo = app.data.answerTwo;
	  		let answerThree = app.data.answerThree;
	  		let answerFour = "Dys";
	  		let winner = calculateWinner(3, answerOne, answerTwo, answerThree, answerFour);
	  		app.data.winner = winner;
	  		let output = "";
	  		if(winner == "P1"){
				output = supPackOneIntro;
			}else if(winner == "P2"){
				output = supPackTwoIntro;
			}else if(winner == "P3"){
				output = supPackThreeIntro;
			}else if(winner == "P4"){
				output = supPackFourIntro;
			}else if(winner == "P5"){
				output = supPackFiveIntro;
			}

	  		app.data.prevIntent = "supEnd";
	  		
	  		app.ask("<speak>"+output+"</speak>");

	  }

	  function supFourB(app){
	  		app.setContext('supfour', 0, {});
	  		app.setContext('supend', 5, {});
	  		let answerOne = app.data.answerOne;
	  		let answerTwo = app.data.answerTwo;
	  		let answerThree = app.data.answerThree;
	  		let answerFour = "CoA";
	  		let winner = calculateWinner(3, answerOne, answerTwo, answerThree, answerFour);
	  		app.data.winner = winner;
	  		let output = "";
	  		
	  		if(winner == "P1"){
				output = supPackOneIntro;
				
			}else if(winner == "P2"){
				output = supPackTwoIntro;
			
			}else if(winner == "P3"){
				output = supPackThreeIntro;
			
			}else if(winner == "P4"){
				output = supPackFourIntro;
				
			}else if(winner == "P5"){
				output = supPackFiveIntro;
				
			}

	  		app.data.prevIntent = "supEnd";
	  		
	  		app.ask("<speak>"+output+"</speak>");

	  }

	  function supFourA(app){
	  		app.setContext('supfour', 0, {});
	  		app.setContext('supend', 5, {});
	  		let answerOne = app.data.answerOne;
	  		let answerTwo = app.data.answerTwo;
	  		let answerThree = app.data.answerThree;
	  		let answerFour = "GH";
	  		let winner = calculateWinner(3, answerOne, answerTwo, answerThree, answerFour);
	  		app.data.winner = winner;
	  		let output = "";
	  		if(winner == "P1"){
				output = supPackOneIntro;
			}else if(winner == "P2"){
				output = supPackTwoIntro;
			}else if(winner == "P3"){
				output = supPackThreeIntro;
			}else if(winner == "P4"){
				output = supPackFourIntro;
			}else if(winner == "P5"){
				output = supPackFiveIntro;
			}



	  		app.data.prevIntent = "supEnd";

	  		app.ask("<speak>"+output+"</speak>");

	  }

	  function supThreeC(app){
	  		app.setContext('supthree', 0, {});
	  		app.setContext('supfour', 5, {});
	  		app.data.answerThree = "ID";
	  		app.data.prevIntent = "supQfour";
	  		app.ask("<speak>"+supQuestionFour+"</speak>");
	  		
	  		

	  }

	  function supThreeB(app){
	  		app.setContext('supthree', 0, {});
	  		app.setContext('supfour', 5, {});
	  		app.data.answerThree = "PoC";
	  		app.data.prevIntent = "supQfour";
	  		app.ask("<speak>"+supQuestionFour+"</speak>");
	  		
	  		

	  }

	  function supThreeA(app){
	  		app.setContext('supthree', 0, {});
	  		app.setContext('supfour', 5, {});
	  		app.data.answerThree = "Alt";
	  		app.data.prevIntent = "supQfour";
	  		app.ask("<speak>"+supQuestionFour+"</speak>");
	  		
	  		

	  }

	  function supTwoC(app){
	  		app.setContext('suptwo', 0, {});
	  		app.setContext('supthree', 5, {});
	  		app.data.answerTwo = "Mys";
	  		app.data.prevIntent = "supQthree";
	  		app.ask("<speak>"+supQuestionThree+"</speak>");
	  		
	  		
	  }

	  function supTwoB(app){
	  		app.setContext('suptwo', 0, {});
	  		app.setContext('supthree', 5, {});
	  		app.data.answerTwo = "C";
	  		app.data.prevIntent = "supQthree";
	  		app.ask("<speak>"+supQuestionThree+"</speak>");
	  		
	  		
	  }

	  function supTwoA(app){
	  		app.setContext('suptwo', 0, {});
	  		app.setContext('supthree', 5, {});
	  		app.data.answerTwo = "Mur";
	  		app.data.prevIntent = "supQthree";
	  		app.ask("<speak>"+supQuestionThree+"</speak>");
	  		
	  		
	  }

	  function supOneC(app){
	  		app.setContext('supone', 0, {});
	  		app.setContext('suptwo', 5, {});
	  		app.data.answerOne = "HoD";
	  		app.data.prevIntent = "supQtwo";
	  		

	  		
	  		app.ask("<speak>"+supQuestionTwo+"</speak>");


	  }
	  
	  function supOneB(app){
	  		app.setContext('supone', 0, {});
	  		app.setContext('suptwo', 5, {});
	  		app.data.answerOne = "GvE";
	  		app.data.prevIntent = "supQtwo";
	  		

	  		
	  		app.ask("<speak>"+supQuestionTwo+"</speak>");


	  }

	  function supOneA(app){
	  		app.setContext('supone', 0, {});
	  		app.setContext('suptwo', 5, {});
	  		app.data.answerOne = "T";
	  		app.data.prevIntent = "supQtwo";
	  		

	  		
	  		app.ask("<speak>"+supQuestionTwo+"</speak>");
	  		


	  }


	  function sciEndNo(app){
	  		app.setContext('sciend', 0, {});
	  		let winner = app.data.winner;
	  		let output = "";
	  		if(winner == "P1"){
				output = sciPackOneEnd;
			}else if(winner == "P2"){
				output = sciPackTwoEnd;
			}else if(winner == "P3"){
				output = sciPackThreeEnd;
			}

			
			app.tell("<speak>"+output+"</speak>");

	  }


	  function sciEndYes(app){
	  		app.setContext('sciend', 0, {});
	  		let winner = app.data.winner;
	  		let output = "";
	  		if(winner == "P1"){
				output = sciPackOneClip + sciPackOneEnd;
			}else if(winner == "P2"){
				output = sciPackTwoClip + sciPackTwoEnd;
			}else if(winner == "P3"){
				output = sciPackThreeClip + sciPackThreeEnd;
			}

			
			app.tell("<speak>"+output+"</speak>");

	  }

	  
	  function sciFourB(app){
	  		app.setContext('scifour', 0, {});
	  		app.setContext('sciend', 5, {});
	  		let answerOne = app.data.answerOne;
	  		let answerTwo = app.data.answerTwo;
	  		let answerThree = app.data.answerThree;
	  		let answerFour = "Mys";
	  		let winner = calculateWinner(2, answerOne, answerTwo, answerThree, answerFour);
	  		app.data.winner = winner;
	  		let output = "";
	  		if(winner == "P1"){
				output = sciPackOneIntro;
			}else if(winner == "P2"){
				output = sciPackTwoIntro;
			}else if(winner == "P3"){
				output = sciPackThreeIntro;
			}

	  		app.data.prevIntent = "sciEnd";

	  		app.ask("<speak>"+output+"</speak>");
	  }

	  function sciFourA(app){
	  		app.setContext('scifour', 0, {});
	  		app.setContext('sciend', 5, {});
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
		
			}else if(winner == "P2"){
				output = sciPackTwoIntro;
			
			}else if(winner == "P3"){
				output = sciPackThreeIntro;
		
			}

	  		app.data.prevIntent = "sciEnd";
	  		
	  		
	  		app.ask("<speak>"+output+"</speak>");
	  }

	  function sciThreeB(app){
	  		app.setContext('scithree', 0, {});
	  		app.setContext('scifour', 5, {});
	  		app.data.answerThree = "Alt";
	  		app.data.prevIntent = "sciQfour";
	  		app.ask("<speak>"+sciQuestionFour+"</speak>");
	  		
	  		
	  }

	  function sciThreeA(app){
	  		app.setContext('scithree', 0, {});
	  		app.setContext('scifour', 5, {});
	  		app.data.answerThree = "CoA";
	  		app.data.prevIntent = "sciQfour";
	  		app.ask("<speak>"+sciQuestionFour+"</speak>");
	  		
	  		
	  }

	  function sciTwoB(app){
	  		app.setContext('scitwo', 0, {});
	  		app.setContext('scithree', 5, {});
	  		app.data.answerTwo = "SotP";
	  		app.data.prevIntent = "sciQthree";
	  		app.ask("<speak>"+sciQuestionThree+"</speak>");
	  		
	  		
	  }

	  function sciTwoA(app){
	  		app.setContext('scitwo', 0, {});
	  		app.setContext('scithree', 5, {});
	  		app.data.answerTwo = "S";
	  		app.data.prevIntent = "sciQthree";
	  		app.ask("<speak>"+sciQuestionThree+"</speak>");
	  		
	  		
	  }

	  function sciOneC(app){
	  		app.setContext('scione', 0, {});
	  		app.setContext('scitwo', 5, {});
	  		app.data.answerOne = "Dys";
	  		app.data.prevIntent = "sciQtwo";
	  		
	  		

	  		app.ask("<speak>"+sciQuestionTwo+"</speak>");

	  }

	  function sciOneB(app){
	  		app.setContext('scione', 0, {});
	  		app.setContext('scitwo', 5, {});
	  		app.data.answerOne = "T";
	  		app.data.prevIntent = "sciQtwo";
	  		
	  		

	  		app.ask("<speak>"+sciQuestionTwo+"</speak>");

	  }


	  function sciOneA(app){
	  		app.setContext('scione', 0, {});
	  		app.setContext('scitwo', 5, {});
	  		app.data.answerOne = "GvE";
	  		app.data.prevIntent = "sciQtwo";
	  		
	  		
	
	  		app.ask("<speak>"+sciQuestionTwo+"</speak>");

	  }

	  function psyEndNo(app){
	  		app.setContext('psyend', 0, {});
	  		let winner = app.data.winner;
	  		let output = "";
	  		if(winner == "P1"){
				output = psyPackOneEnd;
			}else if(winner == "P2"){
				output = psyPackTwoEnd;
			}else if(winner == "P3"){
				output = psyPackThreeEnd;
			}

			
			app.tell("<speak>"+output+"</speak>");
	  }


	  function psyEndYes(app){
	  		app.setContext('psyend', 0, {});
	  		let winner = app.data.winner;
	  		let output = "";
	  		if(winner == "P1"){
				output = psyPackOneClip + psyPackOneEnd;
			}else if(winner == "P2"){
				output = psyPackTwoClip + psyPackTwoEnd;
			}else if(winner == "P3"){
				output = psyPackThreeClip + psyPackThreeEnd;
			}

			
			app.tell("<speak>"+output+"</speak>");

	  }

	  function psyFourB(app){
	  		app.setContext('psyfour', 0, {});
	  		app.setContext('psyend', 5, {});
	  		let answerOne = app.data.answerOne;
	  		let answerTwo = app.data.answerTwo;
	  		let answerThree = app.data.answerThree;
	  		let answerFour = "PoC";
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
	  		
	  		
	  		app.ask("<speak>"+output+"</speak>");
	  }


	  function psyFourA(app){
	  		app.setContext('psyfour', 0, {});
	  		app.setContext('psyend', 5, {});
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
	  		
	  		
	  		app.ask("<speak>"+output+"</speak>");


	  }

	  function psyThreeB(app){
	  		app.setContext('psythree', 0, {});
	  		app.setContext('psyfour', 5, {});
	  		app.data.answerThree = "CoA";
	  		app.data.prevIntent = "psyQfour";
	  		app.ask("<speak>"+psyQuestionFour+"</speak>");
	  		
	  		
	  }

	  function psyThreeA(app){
	  		app.setContext('psythree', 0, {});
	  		app.setContext('psyfour', 5, {});
	  		app.data.answerThree = "SotP";
	  		app.data.prevIntent = "psyQfour";
	  		app.ask("<speak>"+psyQuestionFour+"</speak>");
	  		
	  		

	  }

	  function psyTwoB(app){
	  		app.setContext('psytwo', 0, {});
	  		app.setContext('psythree', 5, {});
	  		app.data.answerTwo = "ID";
	  		app.data.prevIntent = "psyQthree";
	  		app.ask("<speak>"+psyQuestionThree+"</speak>");
	  		
	  		

	  }

	  function psyTwoA(app){
	  		app.setContext('psytwo', 0, {});
	  		app.setContext('psythree', 5, {});
	  		app.data.answerTwo = "C";
	  		app.data.prevIntent = "psyQthree";
	  		app.ask("<speak>"+psyQuestionThree+"</speak>");
	  		
	  		

	  }


	  function psyOneC(app){
	  		app.setContext('psyone', 0, {});
	  		app.setContext('psytwo', 5, {});
	  		app.data.answerOne = "HoD";
	  		app.data.prevIntent = "psyQtwo";
	  		
	  		

	  		app.ask("<speak>"+psyQuestionTwo+"</speak>");
	  }

	  function psyOneB(app){
	  		app.setContext('psyone', 0, {});
	  		app.setContext('psytwo', 5, {});
	  		app.data.answerOne = "T";
	  		app.data.prevIntent = "psyQtwo";
	  		
	  		
	  		app.ask("<speak>"+psyQuestionTwo+"</speak>");


	  }

	  function psyOneA(app){
	  		app.setContext('psyone', 0, {});
	  		app.setContext('psytwo', 5, {});
	  		app.data.answerOne = "S";
	  		app.data.prevIntent = "psyQtwo";
	  		
	  		

	  		app.ask("<speak>"+psyQuestionTwo+"</speak>");


	  }


	  function genreThirdC(app){

	  		let genreOne = app.data.genreFirst;
	  		let genreTwo = app.data.genreSecond;
	  		let genreThree = 2;

	  		let catChoice = calculateGenre(genreOne, genreTwo, genreThree);
	  		
	  		if(catChoice == 1){
	  			app.setContext('thirdgenre', 0, {});
	  			app.setContext('psyone', 5, {});
	  			app.data.prevIntent = "psyQone";
	  			app.ask("<speak>"+psyQuestionOne+"</speak>");
	  			
	 
	  			

	  		}else if(catChoice == 2){
	  			app.setContext('thirdgenre', 0, {});
	  			app.setContext('scione', 5, {});
	  			app.data.prevIntent = "sciQone";
	  			app.ask("<speak>"+sciQuestionOne+"</speak>");
	  			
	  	
	  			

	  		}else{
	  			app.setContext('thirdgenre', 0, {});
	  			app.setContext('supone', 5, {});
	  			app.data.prevIntent = "supQone";
	  			app.ask("<speak>"+supQuestionOne+"</speak>");
	  			
	  			

	  		}

	  }

	  function genreThirdB(app){

	  		let genreOne = app.data.genreFirst;
	  		let genreTwo = app.data.genreSecond;
	  		let genreThree = 1;

	  		let catChoice = calculateGenre(genreOne, genreTwo, genreThree);
	  		
	  		if(catChoice == 1){
	  			app.setContext('thirdgenre', 0, {});
	  			app.setContext('psyone', 5, {});
	  			app.data.prevIntent = "psyQone";
	  			app.ask("<speak>"+psyQuestionOne+"</speak>");
	  			
	  			

	  		}else if(catChoice == 2){
	  			app.setContext('thirdgenre', 0, {});
	  			app.setContext('scione', 5, {});
	  			app.data.prevIntent = "sciQone";
	  			app.ask("<speak>"+sciQuestionOne+"</speak>");
	  			
	  		
	  			

	  		}else{
	  			app.setContext('thirdgenre', 0, {});
	  			app.setContext('supone', 5, {});
	  			app.data.prevIntent = "supQone";
	  			app.ask("<speak>"+supQuestionOne+"</speak>");
	  			
	  		
	  			

	  		}

	  }


	  function genreThirdA(app){
	  		let genreOne = app.data.genreFirst;
	  		let genreTwo = app.data.genreSecond;
	  		let genreThree = 3;

	  		let catChoice = calculateGenre(genreOne, genreTwo, genreThree);
	  		
	  		if(catChoice == 1){
	  			app.setContext('thirdgenre', 0, {});
	  			app.setContext('psyone', 5, {});
	  			app.data.prevIntent = "psyQone";
	  			app.ask("<speak>"+psyQuestionOne+"</speak>");
	  			
	  		
	  			

	  		}else if(catChoice == 2){
	  			app.setContext('thirdgenre', 0, {});
	  			app.setContext('scione', 5, {});
	  			app.data.prevIntent = "sciQone";
	  			app.ask("<speak>"+sciQuestionOne+"</speak>");
	  			
	  
	  			

	  		}else{
	  			app.setContext('thirdgenre', 0, {});
	  			app.setContext('supone', 5, {});
	  			app.data.prevIntent = "supQone";
	  			app.ask("<speak>"+supQuestionOne+"</speak>");
	  			
	  			

	  		}

	  }


	  function genreSecondC(app){
	  		app.data.prevIntent = "genreQthree";
	  		app.setContext('secondgenre', 0, {});
	  		app.setContext('thirdgenre', 5, {});
	  		app.data.genreSecond = 1;
	  		app.ask("<speak>"+genreQThree+"</speak>");
	  		let context = app.getContexts();
	  		let str = JSON.stringify(context, null, 4);
	  		console.log("genre 2C "+str);
	  		
	  		
	  		

	  }

	  function genreSecondB(app){
	  		app.data.prevIntent = "genreQthree";
	  		app.setContext('secondgenre', 0, {});
	  		app.setContext('thirdgenre', 5, {});
	  		app.data.genreSecond = 2;
	  		app.ask("<speak>"+genreQThree+"</speak>");
	  		let context = app.getContexts();
	  		let str = JSON.stringify(context, null, 4);
	  		console.log("genre 2B "+str);
	  		
	  		
	  		

	  }


	  function genreSecondA(app){
	  		app.data.prevIntent = "genreQthree";
	  		app.setContext('secondgenre', 0, {});
	  		app.setContext('thirdgenre', 5, {});
	  		app.data.genreSecond = 3;
	  		app.ask("<speak>"+genreQThree+"</speak>");
	  		let context = app.getContexts();
	  		let str = JSON.stringify(context, null, 4);
	  		console.log("genre 2a "+str);
			
	  		
	  		

	  }


	  function genreFirstC(app){
	  		app.data.prevIntent = "genreQtwo";
			app.setContext('firstgenre', 0, {});
			app.setContext('secondgenre', 5, {});
	  		app.data.genreFirst = 2;
	  		app.ask("<speak>"+genreQTwo+"</speak>");
	  		let context = app.getContexts();
	  		let str = JSON.stringify(context, null, 4);
	  		console.log("genre 1c "+str);
	  		
	  		
	  			  		

	  }

	  function genreFirstB(app){
	  		app.data.prevIntent = "genreQtwo";
	  		app.setContext('firstgenre', 0, {});
	  		app.setContext('secondgenre', 5, {});
	  		app.data.genreFirst = 1;
	  		app.ask("<speak>"+genreQTwo+"</speak>");
	  		let context = app.getContexts();
	  		let str = JSON.stringify(context, null, 4);
	  		console.log("genre 1B "+str);
	  		


	  }

	  function genreFirstA(app){
	  		app.data.prevIntent = "genreQtwo";
	  		app.setContext('firstgenre', 0, {});
	  		app.setContext('secondgenre', 5, {});
	  		app.data.genreFirst = 3;
	  		app.ask("<speak>"+genreQTwo+"</speak>");
	  		let context = app.getContexts();
	  		let str = JSON.stringify(context, null, 4);
	  		console.log("genre 1A "+str);
	  		
	  		
	  		

	  }

	  function yes(app){
	  		app.data.prevIntent = "genreQone";
			app.setContext('intro', 0, {});
			app.setContext('firstgenre', 5, {});
	  		
	  		app.ask("<speak>"+genreQOne+"</speak>");
	  		
	  		


	  }

	  function begin(app){
	  		app.setContext('intro', 0, {});
	  		app.setContext('firstgenre', 5, {});
	  		
	  		app.data.prevIntent = "genreQone";
	  		let context = app.getContexts();
	  		let str = JSON.stringify(context, null, 4);
	  		console.log("begin "+str);
	  		app.ask("<speak>"+genreQOne+"</speak>");

	  }


	  function welcomeIntent(app){



	  		app.setContext('intro', 5, {});
	  		app.data.prevIntent = "welcome";
	  		if(app.getLastSeen()){
	  			app.ask("<speak>"+introRepeat+"</speak>");
	  			// app.ask("testing the action");
	  			
	  		}else{
	  			app.ask("<speak>"+introText+"</speak>");
	  			// app.ask("testing the action");
	  		}
	  		let context = app.getContexts();
	  		let str = JSON.stringify(context, null, 4);
	  		console.log("welcome intent "+str);
	  		


	  }

	  function openIntent(app){



	  		app.setContext('intro', 5, {});
	  		app.data.prevIntent = "welcome";
	  		if(app.getLastSeen()){
	  			app.ask("<speak>"+introRepeat+"</speak>");
	  			// app.ask("testing the action");
	  			
	  		}else{
	  			app.ask("<speak>"+introText+"</speak>");
	  			// app.ask("testing the action");
	  		}
	  		let context = app.getContexts();
	  		let str = JSON.stringify(context, null, 4);
	  		console.log("welcome intent "+str);
	  		


	  }



	  let actionMap = new Map();
	  actionMap.set('itEgg', it);
	  actionMap.set('elevation', elevation);
	  actionMap.set('welcome', welcomeIntent);
	  actionMap.set('yesstart', yes);
	  actionMap.set('begin', begin);
	  actionMap.set('help', help);
	  actionMap.set('startover', startOver);
	  actionMap.set('onwrite', onWrite);
	  actionMap.set('sb', sb);
	  actionMap.set('castle', castle);
	  actionMap.set('facts', facts);
	  actionMap.set('pause', pause);
	  actionMap.set('repeat', repeat);
	  actionMap.set('outsider', outsider);
	  actionMap.set('mercedes', mercedes);
	  actionMap.set('pet', pet);
	  actionMap.set('genreonea', genreFirstA);
	  actionMap.set('genreoneb', genreFirstB);
	  actionMap.set('genreonec', genreFirstC);
	  actionMap.set('genretwoa', genreSecondA);
	  actionMap.set('genretwob', genreSecondB);
	  actionMap.set('genretwoc', genreSecondC);
	  actionMap.set('genrethreea', genreThirdA);
	  actionMap.set('genrethreeb', genreThirdB);
	  actionMap.set('genrethreec', genreThirdC);
	  actionMap.set('psyonea', psyOneA);
	  actionMap.set('psyoneb', psyOneB);
	  actionMap.set('psyonec', psyOneC);
	  actionMap.set('psytwoa', psyTwoA);
	  actionMap.set('psytwob', psyTwoB);
	  actionMap.set('psythreea', psyThreeA);
	  actionMap.set('psythreeb', psyThreeB);
	  actionMap.set('psyfoura', psyFourA);
	  actionMap.set('psyfourb', psyFourB);
	  actionMap.set('psyendyes', psyEndYes);
	  actionMap.set('psyendno', psyEndNo);
	  actionMap.set('scionea', sciOneA);
	  actionMap.set('scioneb', sciOneB);
	  actionMap.set('scionec', sciOneC);
	  actionMap.set('scitwoa', sciTwoA);
	  actionMap.set('scitwob', sciTwoB);
	  actionMap.set('scithreea', sciThreeA);
	  actionMap.set('scithreeb', sciThreeB);
	  actionMap.set('scifoura', sciFourA);
	  actionMap.set('scifourb', sciFourB);
	  actionMap.set('sciendyes', sciEndYes);
	  actionMap.set('sciendno', sciEndNo);
	  actionMap.set('suponea', supOneA);
	  actionMap.set('suponeb', supOneB);
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
	  actionMap.set('supendyes', supEndYes);
	  actionMap.set('supendno', supEndNo);
	  actionMap.set('no.input', noInput);
	  actionMap.set('input.unknown', errorIntent);
	  actionMap.set('open', openIntent);




	  app.handleRequest(actionMap);


});
