Roguelike Tutorial Workshop
===============

Working through the roguelike tutorials at:
* http://www.codingcookies.com/2013/04/01/building-a-roguelike-in-javascript-part-1/
* http://trystans.blogspot.ca/2011/08/roguelike-tutorial-01-java-eclipse.html

As I work through the tutorial, I'll be making minor adjustments along the way and documenting them as I work through them

Tutorial 01
====
* Normal Tutorial 01 stuff
* converted to using Browserify for dependencies
* switched to using the npm version of rot-js ( https://github.com/blinkdog/rot.js )

Tutorial 02
====
* Normal Tutorial 2 stuff
* Instead of having a screen object with all the screens, I have each screen as it's own file in assets/screens directory
* Launching a screen is handled by 'requiring' the screen and passing it to the switch screen function
* added a gameconfig.js that currently just contains the screen dimensions
* gameconfig is accessible from Game.config
* TODO: may create an array of screens in the Game object that auto-loads each screen..not sure yet.

Tutorial 03
====
* Normal Tutorial 3 stuff
* TODO: Make revealing module pattern on all screens
* TODO: hang everything off Game
* TODO: add screenManager to game object, have it load screens via config entries
* Made a base screen and extended it for each screen
* moved the logic from the playscreen that generates the world to a separate worldbuilder class to mimic the Java tutorial
* modified the key bindings to also allow Vi style movement keys
* created a CellularAutomataWorldBuilder object

Tutorial 04
====
* Normal Tutorial 4 stuff
* switched over to Bower to pull official rot.js so we can get latest
** had to build a rot.js shim that can be used as a commonjs interface to the bower rot.js
** TODO: need to come up with a better build pattern for bower components
* Started adding in support for the blueprint manager (along with additional development of entity-blueprint system)

Tutorial 05
===
* Normal Tutorial 5 stuff
* x,y,map moved from Entity to mixin called "Position"
* mixin.groupName renamed to mixin.type
* added Entity.attachMixin from a previous work I did.  In the prior work, I had mixins attached as sub properties a'la Dungeon Siege, but decided we probably don't need this level and it might not be optimal for Javascript
* added Entity.hasMixin and have it look at either the 'type' or the 'name' and ignore case
* added new mixin called Aspect that handles entity visuals
* migrated the "draw" functions to the Tile object and the Aspect mixin instead of inside the play screen
* TODO: look into the browserify plugin that converts a directory of files to a single JSON object (for entities and blueprints)


Tutorial 06
===
* Normal Tutorial 6 stuff



