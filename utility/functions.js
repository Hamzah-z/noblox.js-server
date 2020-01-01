let roblox = require('noblox.js')
let config = require('../config.json')

function SendResponse(res, json, status) { // Function for ease of sending response
	res.status(status).send(json);
}

function Authenticate(req, res, next_func) {
	if (req.body.auth_key === config.auth_key) { // Does the request's key match the key in our config?
		next_func();
	} else {
		SendResponse(res, { error: 'Incorrect authentication key.' }, 401)
	}
}

function CheckRank(request) {
	let Group = request.Group;
	let TargetUser = request.Target;

	return roblox.getRankInGroup(Group, TargetUser) // Check their rank
		.then(rank => {
			if (rank === 0) { // 0 means 'Guest' aka not in group
				throw new Error('Target user ' + TargetUser + ' is not in group ' + Group);
			}
			if (rank > config.maximum_rank) { // Can't promote them because their rank is higher than our config.maximum_rank
				throw new Error('Original rank ' + rank + ' is above rank limit ' + config.maximum_rank);
			}
			return rank;
		});
}

function SetRank(res, Group, Target, Rank) {
	return new Promise(function (resolve, reject) {

		roblox.setRank({group: Group, target: Target, rank: Rank})
			.then(roleset => {
				res.status(200).send({
					error: null,
					data: {
						NewRoleSetId: roleset, NewRankName: roleset.name, NewRank: roleset.rank
					},
					message: `Successfully changed rank of user ${Target} to rank ${roleset.name} in group ${Group}`
				});

				resolve(roleset) // Resolve the promise
				console.log(`Successfully changed rank of user ${Target} to rank ${roleset.name} in group ${Group}`)
			})
			.catch(err => {
				reject(err) // Reject the promise
				res.status(500).send({ error: `Failed to Set the rank of user ${Target}`})
			})
	})
}

function ChangeRank(amount) {
	return function (req, res, next) {

		let Group = req.body.Group
		let Target = req.body.Target
		let Rank = 0
	
		CheckRank({Group: Group, Target: Target})
			.then(rank => {
				return roblox.getRoles(Group)
					.then(roles => {
						// Taken directly from the old noblox.js-server
						var found;
						var foundRank;

						// Roles is actually sorted on ROBLOX's side and returned the same way
						for (var i = 0; i < roles.length; i++) {
							var role = roles[i];
							var thisRank = role.rank;

							if (thisRank === rank) {
								var change = i + amount;
								found = roles[change];

								if (!found) {
									SendResponse(res, { error: 'Rank change is out of range' }, 401);
									return;
								}

								foundRank = found.rank;
								var up = roles[change + 1];
								var down = roles[change - 1];

								if ((up && up.Rank === foundRank) || (down && down.Rank === foundRank)) {
									SendResponse(res, { error: 'There are two or more roles with the same rank number, please change or commit manually.' }, 500);
									return;
								}

								Rank = foundRank;

								if (foundRank == 0) {
									SendResponse(res, { error: 'User is already at the lowest rank.' }, 400);
									return
								}


								SetRank(res, Group, Target, Rank)
                .catch(err => {
                  console.log(err)
                  SendResponse(res, { error: err }, 400);
                })
							}
						}
					});
			})
			.catch(err => {
				SendResponse(res, { error: 'Change rank failed: ' + err.message }, 500);
			});
	};
}

module.exports = {
	CheckRank: CheckRank,
	ChangeRank: ChangeRank,
	SetRank: SetRank,
	Authenticate: Authenticate,
}