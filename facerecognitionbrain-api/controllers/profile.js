
const handleProfile = (req, res, db) => {
	const { id } = req.params;

	db('users')
	.select('*')
	.where({
		id: id
	})
	.then(user => {
		if (user.length) {
			res.json(user[0]);			
		} else {
			res.status(400).json('no such user');
		}
	})
	.catch(res.status(400).json('roor in getting the user'));	
}

module.exports = {
	handleProfile: handleProfile
}