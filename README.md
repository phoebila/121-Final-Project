# 121-Final-Project
This is the CMPM121 final project repository

## Devlog Entry = [11/17/2024]
### Project Setup
We went to James's house to work together on setting up defaults and initial tile-based movement. We used Live Share to make our collaboration smooth. In the future, we will be using individual branches, but for the initial tile-movement setup, we decided that group programming was best, since the grid would be the basis of the rest of the project.

### Current F0 Software Requirments
- [X] [F0.a] You control a character moving over a 2D grid.
- [ ] [F0.b] You advance time manually in the turn-based simulation.
- [ ] [F0.c] You can reap or sow plants on grid cells only when you are near them. (Phoebe)
- [ ] [F0.d] Grid cells have sun and water levels. The incoming sun and water for each cell is somehow randomly generated each turn. Sun energy cannot be stored in a cell (it is used immediately or lost) while water moisture can be slowly accumulated over several turns.
- [ ] [F0.e] Each plant on the grid has a distinct type (e.g. one of 3 species) and a growth level (e.g. “level 1”, “level 2”, “level 3”). (Phoebe)
- [ ] [F0.f] Simple spatial rules govern plant growth based on sun, water, and nearby plants (growth is unlocked by satisfying conditions).
- [ ] [F0.g] A play scenario is completed when some condition is satisfied (e.g. at least X plants at growth level Y or above).

## Devlog Entry - [11/12/2024]
### Initial Setup
Our group rented out a study room in the Science and Engineering library to come up with the plan for how we will implement our final project and also how to put together this DevLog.
  
### Introducing the team
Rozy Dixon - Tools\
Phoebe Royer - Design/Engine\
Jackson Mclane - Engine\
Jack Sims - Tools/Design\
James Milestone - Engine/Tools

### Tools and materials
  1.  The library we're using is Phaser. Since as a group we have more experience working with the phaser library from CMPM120. We also have some projects we had gotten inspired by to adapt to our final project. Because we have all taken CMPM120 and have used Phaser to prototype in other classes (CMPM179 and CMPM170), we think that there will be less friction with Phaser as the engine we're using.
  2.  We will be transferring from Javascript to TypeScript in Phaser, we believe that it has better interchangability and as a team we understand the syntax better. We also believe using Phaser will better achieve the project we wish to create, so the most experience we have is Javascript, and now through this class now TypeScript. We chose to go from Javascript to Typescript because it will serve as motivation for keeping our Javascript code organized and typed strictly, in order to make the transition easy.
  3.  We will be using: Github for version control, VSCode for our IDEs, Prettier as our styling tool, ESLint as a linter, LiveServer for testing before deployments, ChatGPT and Brace for debugging and style critique, the Live Share extension on VS Code to collaborate on the same files simultaneously, Discord Whiteboard for brainstorming and mind mapping, and Aesprite for our 2D art, if sound is needed Jack is going to use his synthesizer to create the sounds and the program Audacity to record and edit the sounds.
  4.   We're going to be switching our language from JavaScript to TypeScript for our alternate platform in the final project. We figured this would be a quick swap, since its pretty much the same language, but it includes type casting. As long as we are familiar with our structure, it should be easy to type cast each object and function. Additionally, Javascript does not have typescripts' interfaces. We will account for this but just using classes. 

### Outlook
- We are hoping to create something publishable, and eventually host our project on itch.io.
- The hardest or riskiest part of the project is the impending shift from JavaScript to TypeScript.
- We are hoping to learn how to each specialize within respective responsibilities so that we can provide the greatest benefit to our team based on the roles we chose.
