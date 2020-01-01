-- THIS IS A SCRIPT (put in ServerScriptService)

local HttpService = game:GetService("HttpService")

local Server = require(script.Server)

-- EXAMPLE USAGE

--[[
	
	Server.Promote(GroupIdHere, PlayerUserIdHere)
	Server.Demote(GroupIdHere, PlayerUserIdHere)
	Server.SetRank(GroupIdHere, PlayerUserIdHere, RankIdHere)
	
	Server.HandleJoinRequest(GroupIdHere, "PlayerUsernameHere", true) -- Accept the request
	Server.HandleJoinRequest(GroupIdHere, "PlayerUsernameHere", false) -- Decline the request

	Server.GroupShout(GroupIdHere, "MessageToShoutHere")
	Server.SetRank(GroupIdHere, PlayerUserIdHere, RankIdHere)
	
]]--