const { check, validationResult } = require('express-validator')

function Validate(req, res, next) { // Validate using express-validator when type's of data are finished checking
	const errors = validationResult(req)
	if (errors.isEmpty()) {
		return next()
	}
	const extractedErrors = []
	errors.array().map(err => extractedErrors.push({ [err.param]: err.msg }))

	return res.status(422).json({ // The request was well formed but the data wasn't what was expected. We reject the request.
		errors: extractedErrors,
	})
}

// Schema's for the different requests we can get

function Promotions() { // Validator for Promotions
	return [
		check('Group')
			.custom((value, { req, loc, path }) => {
				if (typeof req.body.Group === "number") { return value; } else { throw new Error(`Parameter 'Group' must be an integer, not type '${typeof (value)}'`) }
			}),
		check('Target')
			.custom((value, { req, loc, path }) => {
				if (typeof req.body.Target === "number") { return value; } else { throw new Error(`Parameter 'Target' must be an integer, not type '${typeof (value)}'`) }
			}),
		check('Rank')
			.custom((value, { req, loc, path }) => {
				if (typeof req.body.Rank === "number") { return value; } else { throw new Error(`Parameter 'Rank' must be an integer, not type '${typeof (value)}'`) }
			})
	]
}

function SetRank() { // Validator for SetRank
	return [
		check('Group')
			.custom((value, { req, loc, path }) => {
				if (typeof req.body.Group === "number") { return value; } else { throw new Error(`Parameter 'Group' must be an integer, not type '${typeof (value)}'`) }
			}),
		check('Target')
			.custom((value, { req, loc, path }) => {
				if (typeof req.body.Target === "number") { return value; } else { throw new Error(`Parameter 'Group' must be an integer, not type '${typeof (value)}'`) }
			})
	]
}

function JoinRequests() { // Validator for HandleJoinRequest
	return [
		check('Group')
			.custom((value, { req, loc, path }) => {
				if (typeof req.body.Group === "number") { return value; } else { throw new Error(`Parameter 'Group' must be an integer, not type '${typeof (value)}'`) }
			}),
		check('Username')
			.custom((value, { req, loc, path }) => {
				if (typeof req.body.Username === "string") { return value; } else { throw new Error(`Parameter 'Username' must be a string, not type '${typeof (value)}'`) }
			}),
		check('Accept')
			.custom((value, { req, loc, path }) => {
				if (typeof req.body.Accept === "boolean") { return `${value}` } else { throw new Error(`Parameter 'Accept' must be a boolean, not type '${typeof (value)}'`) }
			})
	]
}

function GroupShouts() { // Validator for GroupShout
	return [
		check('Group')
			.custom((value, { req, loc, path }) => {
				if (typeof req.body.Group === "number") { return value; } else { throw new Error(`Parameter 'Group' must be an integer, not type '${typeof (value)}'`) }
			}),
		check('Message')
			.custom((value, { req, loc, path }) => {
				if (typeof req.body.Message === "string") { return value; } else {
					throw new Error(`Parameter 'Message' must be a string, not type '${typeof (value)}'`)
				}
				// If Message is a blank string or " ", this will clear the shout.
				// See https://github.com/suufi/noblox.js/wiki/Group-Functions#shout
			})
	]
}

// Export

module.exports = {
	Promotions,
	SetRank,
	JoinRequests,
	GroupShouts,
	Validate,
}