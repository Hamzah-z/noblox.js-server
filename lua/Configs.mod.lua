-- THIS IS A MODULESCRIPT (insert as child of Main)

return {
	-- NOTE: The final '/' in the URL is very important!
	["BaseUrl"] = "http://test-app.glitch.me/"; -- The base URL of your deployed server. Example: http://test-app.glitch.me/ 
	["AUTH_KEY"] = "SECRET_REQUEST_AUTH_KEY"; -- Secret Key defined as 'auth_key' in the config.json file of your server
}