# Tech Stack

| Name | Link | Version |
| ---- | ---- | ------- |
| Typescript |  https://www.typescriptlang.org/ | 5.0.2 |
| JEST | https://jestjs.io/ | 29.5 |
| Phaser | https://phaser.io/ | 3.55.2 |
| EJS | https://ejs.co/ | 3.1.9 |
| Prisma | https://www.prisma.io/ | 4.12.0 |
| PassportJs | https://www.passportjs.org/ | 0.6.0 |
| ExpressJs | https://expressjs.com/ | 4.18.2 |
| Nodemon | https://nodemon.io/ | 2.0.22 |

**Typescript:** Create a object oriented, class based structure for the game mechanic logic and source code.

**JEST:** Testing logical functionality to ensure the codebase works as intended.

**Phaser:** API for browser games that will be used to handle animations and sound

**EJS:** Templating framework used for rendering user specific/state derived information.

**Prisma:** ORM will be used with SQLite to create an easy to use and manipulate database structure for information storage.

**PassportJs:** Library will be used to handle authentication and authorization for server routes.

**ExpressJs:** Library will be used to instantiate and run the server hosting the game.

**Nodemon:** Library will be used in development in order to view changes made in development easily and efficiently.

<br>

# Unit Testing

## Dice Rolls - Mohammad Fakih A01298047

In this section I used unit testing and TDD methodology to define the boundaries of what a potential total roll can be. I also created test logic around how the dice values could be retrieved for when rolled dice are rendered.

To do this I first created the function signatures for my mock functionality in diceRoll.js. Then in diceRoll.test.js I stipulated the requirements that each function would need to meet to achieve its purpose.

From there I fleshed out my function signatures into full functions and ran them through my tests to confirm the logic was sound.

## True or False - Tony Paik A00567207

