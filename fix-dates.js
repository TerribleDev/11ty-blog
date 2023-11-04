const fs = require('fs/promises');


async function renamemarkdown() {
	const files = await fs.readdir('./content/blog');

	await Promise.all(files
		.filter(file => file.toLowerCase().endsWith('.md'))
		.map(async (file) => {
			const computedDirectory = file.replace('.md', '').replace('.MD', '')
			await fs.rename(`./content/blog/${file}`, `./content/blog/${file}-bkp`)
			await fs.mkdir(`./content/blog/${file}`)
			await fs.rename(`./content/blog/${file}-bkp`, `./content/blog/${computedDirectory}/${file}`)
		// const fileContent = await fs.readFile(file, 'utf8');
		// regex find the line date:
		// const date = fileContent.match(/date: (.*)/);
		// const parsedDate = date[1].split(' ');
	}));
}

// async function MoveImages() {
// 	const dirs = await fs.readdir('./content/img');
// 	const blogDirs = await fs.readdir('./content/blog');
// 	dirs
// 	.filter(dir => !blogDirs.includes(dir))
// 	.map(async dir => {
// 		// get all files in dir
// 		const files = await fs.readdir(`./content/img/${dir}`);
// 		await Promise.all(
// 			files.map(async subfile => {
// 				await fs.rename(`./content/img/${dir}/${subfile}`, `./content/blog/${dir}/${subfile}`)
// 			})
// 		)
// 		const hasFiles = (await fs.readdir(`./content/img/${dir}`)).length > 0;
// 		if(!hasFiles) {
// 			await fs.rmdir(`./content/img/${dir}`)
// 		}
// 	})
// }

renamemarkdown();

// MoveImages();
