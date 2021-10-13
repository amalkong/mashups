$(document).ready(function(){
	let readme = loadReadme();
	let repos = getRepos();
	Promise.all([readme,repos]).then((result)=>{
		let readmeContent = marked(result[0]);
		let githubUser = result[1];
		
		if(readmeContent){
			$("#readme-display").html(readmeContent);
		}
		
		if(githubUser && isArray(githubUser) && githubUser.length > 0){
			let ghu_html = githubUser.map(repo=>{
				return `<li style="display: inline-flex;"><a class="offset-right-5" href="${repo.html_url}" title="go to repository" target="_blank"><i class="fa fa-code-branch"></i> ${repo.name}: repository</a><a href="${repo.homepage}" title="view demo" target="_blank"><i class="fa fa-globe"></i> ${repo.name}: demo</a> | </li>`;
			}).join('');
			$("#repos").html(ghu_html);
		}
	})
})