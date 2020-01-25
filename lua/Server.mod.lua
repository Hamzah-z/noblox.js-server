-- THIS IS A MODULESCRIPT (insert as child of Main)

local Server = {}

--// SERVICES

local HttpService = game:GetService("HttpService")

--// MODULES

local Configs = require(script.Parent.Configs)

--// MAIN
 
local function Request(Function, RequestBody)
	
	--Before sending the request, add our auth_key to the body
	RequestBody["auth_key"] = Configs.AUTH_KEY
	
	local response = HttpService:RequestAsync(
		{
			-- The website to send the request to. Function is the extended part of the URL for specific functions.
			-- In this case, Function = 'GroupShout'
			-- Example: 
			--	"Configs.BaseUrl..Function" would be equal to: http://test-app.glitch.me/GroupShout
					
			Url = Configs.BaseUrl..Function, 

			-- The request method (all of ours will be POST)
			Method = "POST",

			-- We are sending JSON data in the body
			Headers = {
				["Content-Type"] = "application/json"
			},
			-- The body of the request containing the parameters for the request
			Body = HttpService:JSONEncode(RequestBody)
		}
	)
 
	if response.Success then
		print("Status code:", response.StatusCode, response.Body)
		print("Response body:\n", response.Body)
		
		return response.Body
	else
		print("The request failed:", response.StatusCode, response.Body)
		return response.Body
	end
end

Server.Promote = function(GroupId, UserId)
	assert(typeof(GroupId) == "number", "Error: GroupId must be an integer") -- Throw error if GroupId is not an integer
	assert(typeof(UserId) == "number", "Error: UserId must be an integer") -- Throw error if UserId is not an integer

	local Body = {
		Group = GroupId;
		Target = UserId;
	}
	
	 -- pcall the function 'Request', with arguments 'Promote' and Body
	local Success, Result = pcall(function()
	    return Request('Promote', Body)
	end)
	
	print(Result)
end

Server.Demote = function(GroupId, UserId)
	assert(typeof(GroupId) == "number", "Error: GroupId must be an integer") -- Throw error if GroupId is not an integer
	assert(typeof(UserId) == "number", "Error: UserId must be an integer") -- Throw error if UserId is not an integer
	
	local Body = {
		Group = GroupId;
		Target = UserId;
	}
	
	local Success, Result = pcall(function()
	    return Request('Demote', Body)
	end)
	
	print(Result)
end

Server.SetRank = function(GroupId, UserId, RankId)
	assert(typeof(GroupId) == "number", "Error: GroupId must be an integer") -- Throw error if GroupId is not an integer
	assert(typeof(UserId) == "number", "Error: UserId must be an integer") -- Throw error if UserId is not an integer
	assert(typeof(RankId) == "number", "Error: RankId must be an integer") -- Throw error if RankId is not an integer

	local Body = {
		Group = GroupId;
		Target = UserId;
		Rank = RankId;
	}
	
	local Success, Result = pcall(function()
	    return Request('SetRank', Body)
	end)
	
	print(Result)
end

Server.HandleJoinRequest = function(GroupId, PlayerUsername, Boolean)
	assert(typeof(GroupId) == "number", "Error: GroupId must be an integer") -- Throw error if GroupId is not an integer
	assert(typeof(PlayerUsername) == "string", "Error: PlayerUsername must be a string") -- Throw error if PlayerUsername is not a string
	assert(typeof(Boolean) == "boolean", "Error: Boolean must be a boolean value") -- Throw error if Boolean is not a boolean value

	local Body = {
		Group = GroupId;
		Username = PlayerUsername;
		Accept = Boolean; -- true or false
	}
	
	local Success, Result = pcall(function()
	    return Request('HandleJoinRequest', Body)
	end)
	
	print(Result)
end

Server.GroupShout = function(GroupId, ShoutMessage)
	assert(typeof(GroupId) == "number", "Error: GroupId must be an integer") -- Throw error if GroupId is not an integer
	assert(typeof(ShoutMessage) == "string", "Error: ShoutMessage must be a string") -- Throw error if ShoutMessage is not a string

	local Body = {
		Group = GroupId;
		Message = ShoutMessage;
	}
	
	local Success, Result = pcall(function()
	    return Request('GroupShout', Body)
	end)
	
	print(Result)
end

return Server
