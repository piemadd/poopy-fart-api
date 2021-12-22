const express = require('express');
const dirTree = require("directory-tree");

const app = express();
app.use(express.static('public'));

const getRandomInt = ((max) => {
  return Math.floor(Math.random() * max);
});

const genRandomID = (async () => {
	const tree = dirTree('./farts/').children;
	let id = getRandomInt(tree.length);
	if (id.length == 1) {
		return `0${id}`
	} else {
		return id;
	}
})

app.get('/', (req, res) => {
  res.sendFile('index.html');
}); 

app.get('/fart/meta/:id', async (req, res) => {
	let id = req.params.id;
	
	if (id == 'random') {
		id = await genRandomID();
	}

	if (id.length == 1) {
		id = `0${id}`;
	};

	if (id == 'all') {
		const fileNames = dirTree('./farts/').children;
		const allFarts = fileNames.map((filename) => {
			const id = filename.name.substring(0, 2);
			let x = {
				id: id,
				filename: filename.path,
				url: `https://fart.one/fart/${id}`
			}
			console.log(x)
			return x
		})
		console.log(allFarts)
		res.send(allFarts);
	}

	const filename = `${__dirname}/farts/${id}.mp3`;
	console.log(`Returning ${filename} (metadata)`)
	let json = {
		id: id,
		filename: filename,
		url: `https://fart.one/fart/${id}`
	}
	res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify(json));
});

app.get('/fart/:id', async (req, res) => {
	let id = req.params.id;
	if (id == 'random') {
		id = await genRandomID();
	}
	console.log(id)
	if (id.toString().length == 1) {
		id = `0${id}`;
	};
	const filename = `${__dirname}/farts/${id}.mp3`;
	console.log(`Returning ${filename}`)
	res.sendFile(filename);
});

app.listen(8008, () => {
	console.log('server started');
});