const fs = require('fs/promises');


async function run() {
	const files = await fs.readdir('./content/blog');
	console.log(files);

	await Promise.all(files
		.filter(file => file.endsWith('.md'))
		.map(async (file) => {
		// const fileContent = await fs.readFile(file, 'utf8');
		// regex find the line date:
		// const date = fileContent.match(/date: (.*)/);
		// const parsedDate = date[1].split(' ');
	}));
}

run();
