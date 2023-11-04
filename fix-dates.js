const fs = require('fs/promises');


async function renamemarkdown() {
	const files = await fs.readdir('./content/blog');

	await Promise.all(files
		.filter(file => file.toLowerCase().endsWith('.md'))
		.map(async (file) => {
			const computedDirectory = file.replace('.md', '').replace('.MD', '')
			await fs.rename(`./content/blog/${file}`, `./content/blog/${file}-bkp`)
			await fs.mkdir(`./content/blog/${computedDirectory}`)
			await fs.rename(`./content/blog/${file}-bkp`, `./content/blog/${computedDirectory}/${file}`)
	}));
}

async function MoveImages() {
	const dirs = await fs.readdir('./content/img');
	const blogDirs = await fs.readdir('./content/blog');
	dirs
	.filter(dir => blogDirs.includes(dir))
	.map(async dir => {
		// get all files in dir
		const files = await fs.readdir(`./content/img/${dir}`);
		await Promise.all(
			files.map(async subfile => {
				await fs.rename(`./content/img/${dir}/${subfile}`, `./content/blog/${dir}/${subfile}`)
			})
		)
		const hasFiles = (await fs.readdir(`./content/img/${dir}`)).length > 0;
		if(!hasFiles) {
			await fs.rmdir(`./content/img/${dir}`)
		}
	})
}

async function fixDateInFrontMatter() {
	const dirs = await fs.readdir('./content/blog');
	await Promise.all(dirs.filter(dir => !dir.includes('.')).map(async dir => {
		const blogFile = (await fs.readdir(`./content/blog/${dir}`)).find(file => file.toLowerCase().endsWith('.md'));
		if(!blogFile) {
			return;
		}
		const content = await fs.readFile(`./content/blog/${dir}/${blogFile}`, 'utf8');
		if(content.trimStart().startsWith('---')) {
			return;
		}
		const newContent = `---\n${content.trimStart()}\n---`;
		await fs.writeFile(`./content/blog/${dir}/${blogFile}`, newContent);
		// console.log(file);
		// const content = await fs.readFile(`./content/blog/${file}`, 'utf8');
		// const date = content.match(/date: (.*)/)[1];
		// const newContent = content.replace(date, newDate);
		// await fs.writeFile(`./content/blog/${file}`, newContent);
	}))
}

// renamemarkdown();

// MoveImages();
fixDateInFrontMatter()

