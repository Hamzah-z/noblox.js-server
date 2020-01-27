
# noblox.js-server

  

[![ROBLOX API Discord](https://img.shields.io/badge/discord-roblox%20api%20chat-blue.svg?style=flat-square)](https://discord.gg/EDXNdAT)

  

This is an improved example server that uses the [noblox.js](https://github.com/suufi/noblox.js) library, allowing users to execute site actions from in-game via HttpService.

## Instructions

- Go to `config.json` and set `user_cookie` to the .ROBLOSECURITY cookie of the account you want to use. 
- The `auth_key` field is essentially a password for the site (to prevent strangers from accessing account functions).  I recommend generating a random string or just smashing your keyboard since this will typically be accessed by a script from Roblox.
- There is also an optional setting `maximum_rank` which can be used to prevent attacks. User's above this rank are immune from having their rank changed and attempts to change a user's rank to something above this will be rejected.

**NOTE:** If you choose to use Hosting such as glitch.me for this server, it is *highly* recommended you move the `config.json` variables into a `.env` file for added security.
(Note that if you do this you must update the `.js` files to point to `process.env` as the new `configs` file.
i.e. `config.auth_key` will become `process.env.auth_key`


## Lua Example

A script is available in [Main.lua](./lua/Main.lua) that allows you to use functions to send commands to the server. 
The ModuleScript [Server.mod.lua](./lua/Server.mod.lua) contains the functions to send a HttpRequest to the server. It being a ModuleScript allows easy access to call the functions from any server-sided Script in your game.
The ModuleScript [Configs.mod.lua](./lua/Configs.mod.lua) contains the configuration variables required to send the requests. This has a field to enter your secret `auth_key` from above, and also for the `BaseUrl` of your server.

The functions`promote`, `demote`, `setRank`, `shout`, `handleJoinRequest` from the library are available, all arguments are in the same order as they are in the documentation. Arguments are passed in the Body as JSON.

Example usage, assuming the following setup in your game:

The Script [Main](./lua/Main.lua) is a `Script` in `ServerScriptService`.
The ModuleScript [Server.mod.lua](./lua/Server.mod.lua) is a `ModuleScript` called *Server* as a Child of [Main](./lua/Main.lua)
The ModuleScript [Configs.mod.lua](./lua/Configs.mod.lua) is a `ModuleScript` called *Configs* as a Child of [Main](./lua/Main.lua)


```lua
local Server =  require(script.Server)

-- EXAMPLE USAGE

Server.Promote(GroupIdHere, PlayerUserIdHere)
Server.Demote(GroupIdHere, PlayerUserIdHere)
Server.SetRank(GroupIdHere, PlayerUserIdHere, RankIdHere)

Server.HandleJoinRequest(GroupIdHere, "PlayerUsernameHere", true) -- Accept the request
Server.HandleJoinRequest(GroupIdHere, "PlayerUsernameHere", false) -- Decline the request
Server.GroupShout(GroupIdHere, "MessageToShoutHere")
```
