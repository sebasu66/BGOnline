# BGOnline

Component types:

Table
Board
GameBox
Token
Money (Coins / Bills)
Card
Deck
Dice

Component Definition

    Each game definition must be created maintaining the template folder structure (currently a manual process, in the future there will be a wizard to interact with the template), within each component type folder a subfolder must be created containing the media assets to be loaded and a ComponentDefinition.json file containing the component group properties.
    
    Game init, component folders parsing and loading

        The server will allow to host game instances, when started the server will look under the /GAMES path for subfolder matching the game ID, if found, it will expect and validate the folder structure is valid and then it will scan the structure to load the component list, in this process each subfolder, each file name and content is relevant. example:

        GAME_MAIN_FOLDER
            CARD
                Minion_deck
                    ComponentDefinition.json
                    Card1.png
                    Card2.png
                    ...
                    Card50.png
                    Back.png
                Items_deck
                    ComponentDefinition.json
                    Card1.png
                    Card2.png
                    ...
            DICE
                Resource_d6
                    ComponentDefinition.json
                    Side1.png
                    Side2.png
                    ...
        
        For this structure the server code will load
         Two card groups (named as the subfolder), each card using the properties on the ComponentDefinition.json (for example this will define the card group dimensions, start position, owner) one card per image, all sharing the same Back.png.
        Then it will create one Dice called "Resource_d6", assigning an image to each side according to the file names.

        All this refers to the Game definition then there is game states. The first one is a constant, it represents the game box and its contents. The game state represents a snapshot of where each game component is located at the time the state was created, a "save file", which is needed to have games last more than a session.


