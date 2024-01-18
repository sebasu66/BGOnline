/**
 * @module internalCommEvent
 * Provides event handlers for internal communication between components
*/

//event names constants 
export const eventNames = {
    connected_to_main_server: "connected_to_main_server",
    connected_to_game_server: "connected_to_game_server",
    disconnected_from_game_server: "disconnected_from_game_server",
    disconnected_from_main_server: "disconnected_from_main_server",
    obtained_game_servers_list: "obtained_game_servers_list",
    refresh_game_servers_list: "refresh_game_servers_list",
    connect_to_game_server: "connect_to_game_server"
}

/**
 * dispatches an event to the web document
 * @param {*} _eventName //event name to be dispatched
 * @param {*} _detail //data to be dispatched with the event (optional)
 */
export function dispatchEvent(_eventName, _detail) {
    let event = new CustomEvent(_eventName, { detail: _detail });
    document.dispatchEvent(event);
}

/**
 * Registers event listeners for each event name and triggers the given function.
 * @param {string[]} eventNames - The names of the events to listen for.
 * @param {function} callback - The function to trigger when an event is fired.
 */
export function registerEventListeners(eventNames, callback) {
    //is eventNames an array of strings?
    if (!Array.isArray(eventNames)) {
        eventNames = [eventNames];
    }

    eventNames.forEach(eventName => {
        document.addEventListener(eventName, callback);
    });
}


