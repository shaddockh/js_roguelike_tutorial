Roguelike Tutorial Workshop
===============

Working through the roguelike tutorials at:
* http://www.codingcookies.com/2013/04/01/building-a-roguelike-in-javascript-part-1/
* http://trystans.blogspot.ca/2011/08/roguelike-tutorial-01-java-eclipse.html

As I work through the tutorial, I'll be making minor adjustments along the way and documenting them as I work through them

Note that there is a dependency on my Entity-Blueprint-Manager repo that is under active development and not in NPM yet.  For development, I've been linking it in via npm-link.

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
* had to build a rot.js shim that can be used as a commonjs interface to the bower rot.js
* TODO: need to come up with a better build pattern for bower components
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
* DONE: look into the browserify plugin that converts a directory of files to a single JSON object (for entities and blueprints) - Note: just have a _index in the root of blueprint or mixins and require the files in


Tutorial 06
===
* Normal Tutorial 6 stuff

Tutorial 07
===
* Normal Tutorial 7 stuff
* modified Entity constructor to take the name of a blueprint and it will look it up in the blueprint catalog
* moved the routine that renders the map out of the playscreen and into the map prototype
* refactored the tiles to use the blueprint system to allow for blueprint inheritance
* created a new TileCatalog that has instances of each type of tile to be used to build the map
* removed the Tile class since it's no longer used
* created a Tile mixin that tiles all use
* created a new tiles.js that defines the tiles
* renamed the entities.js to singletons.js and added an initialize() export that is called at game startup.  This will load up all the mixins, the tiles, and the blueprints.
* exposed TileCatalog, BlueprintCatalog, and MixinCatalog from the Singletons object
* removed base class "Glyph" and all reliance on it...the mixin handler will handle building object by composition instead of inheritance
* clean up Entity class to use the Dictionary object for holding on to mixin references
* modify the builders to use blueprints to allow for configuring building a level
* create a new LevelBuilder object that takes in a blueprint and returns a World object
* refactored World to Level
* implemented a new way of handling stairs by using a Portal mixin and having that mixin handle moving the player between levels
* instead of having a single 3 dimensional array for levels, just have an array of Level objects
* redid the way regions were determined and linked together between levels
* created a new 'Portal' type of gizmo that will respond to an active message from the player and transport them between levels
* created an activate subsystem that will send an activate to any entity on the current square if the player sends an activate keystroke (or if it's sent via another component)
* TODO: need to filter activate messages in case there are specific messages that an activate needs to respond to
* moved Player into Singletons so the player is accessed from everywhere
* created new World singleton that contains all the levels
* store each level by name in the world.  Levels will become active/inactive as the player traverses through them and the entities will be added/removed from the scheduler
* created specific directories for mixins and blueprints with an index on each that requires in the appropriate files.  The Singletons.initialize will now just require in the index and load the blueprints and mixins into the catalogs

Tutorial 08 
====
* From: http://www.codingcookies.com/2013/08/25/building-a-roguelike-in-javascript-part-8a/
* Normal Tutorial 8 stuff
* Playing with the idea of moving the FOV algorithm into a separate builder.
* modified aspect.draw to accept a options field with { outsideFOV: true|false } to determine if it should render with the obscuredForeground setting or not.
* TODO: render entities, but have actors use the obscuredForeground valud of 'invisible' so they don't show up

Tutorial 09
====
* From: http://www.codingcookies.com/2013/08/29/building-a-roguelike-in-javascript-part-9/
* Normal Tutorial 9 stuff
* added concept of render layers to "Aspect" so that things such as decals would render below actors
* added bloodstain decal on death of some actors
* deviated from way tutorial 9 stored entities..just filter to viewport, then sort entities by renderLayer
* TODO: discovered that in some cases a wandering monster and the player were ending up moving to the same space
