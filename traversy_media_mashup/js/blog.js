const snippetsContainer = document.getElementById('snippets-container');
const postsContainer = document.getElementById('posts-container');
const loading = document.querySelector('.loader');
const bpFilter = document.getElementById('filter-posts');
const snFilter = document.getElementById('filter-snippet');

let limit = snLimit = 5;
let page = 1;
let snPage = 0;

// Show snippets in DOM
let x=0;
async function showSnippets(data) {
	const frameworkLinks = await getJsonFile('./data/frameworks.json');
	let snippets = frameworkLinks?.data??frameworkLinks?.frameworks??frameworkLinks;
	data = data || {
		paginatePage: true,
		targetElem: snippetsContainer,
		page: snPage,
		perPage: snLimit,
	}
	try{
		let _content = "", header= `<h1>Resources : Micro Frameworks</h1>`, body = ``;
		//fileName = _$.util().get.filename;
		//fileName = (str) => typeof str === "string" ? str.split(".")[1] : str;
		if(snippets && Array.isArray(snippets)){
			if(data.paginatePage && data.paginatePage === true){
				let targetElem = data.targetElem || snippetsContainer, 
				perPage = data.perPage || snLimit, 
				_page = data.page || snPage, 
				page = ~~_page, 
				from = page * perPage, 
				to = from + perPage;
				//console.log('showing page %s : %s..%s', page, from, to);
				//that.album_info_box_p2[x].textContent = 'showing page :'+ (page +1) + ' of ' + (totalPages +1 );
				snippets = snippets.slice(from, to);
				//snippets = paginator(snippets, page, perPage, targetElem)
			}
			_content += `${snippets.map((fmw) => {
				x++;
				let _theme = /* themes ? _.shuffle(themes) : */ [],
				tags = isArray(fmw.tags) && fmw.tags.length > 0 ? fmw.tags.map((tag)=>{
					return `<span class="tag">
						<a href="#!/search/for/tags/~tag=${tag}">
							<i class="fa fa-tag"></i> 
							<span>${tag}</span>
						</a>
					</span>`;
				}).join("") : `<span class="tag"><a href="#!/search/for/tags/~tag=${fmw.tag}"><i class="fa fa-tag"></i><span>${fmw.tag}</span></a></span>`, 
				sources = isArray(fmw.source) && fmw.source.length > 0 ? fmw.source.map((source)=>{
					return `<span class="source">
						<a href="${source}" target="_blank">
							<i class="fa fa-code"></i> 
							<span>${getFilename(source)}</span>
						</a>
					</span>`;}).join("") : `<span class="source"><a href="${fmw.source}" target="_blank"><i class="fa fa-code"></i><span>${getFilename(fmw.source)}</span></a></span>`;
				return `
				<div class="snippet">
					<div class="number">${x}</div>
					<div class="snippet-info">
						<h2 class="snippet-title"><span>${fmw.name}</span></h2>
						<div class="snippet-body">
							<ul class="pad-by-5">
								<li class="username"><i class="fa fa-address-card"></i> <span>${fmw.name}</span></li>
								<li class="url"><i class="fa fab-github"></i><a href="${fmw.url}">${fmw.github}</a></li>
								<li class="sources"><i class="fa fa-code-branch"></i>&nbsp;<div class="flexiwrap">${sources}</div></li>
								<li class="tags"><i class="fa fa-tags"></i>&nbsp;<div class="flexiwrap">${tags}</div></li>
								<li class="description"><i class="fa fa-comment"></i><p class="">${fmw.description}</p></li>
							</ul>
						</div>
					</div>
				</div>`;
			}).join('')}`;
		}
		
		body = `<div id="" class="pad-by-5">${header}<div class="spacer mini"></div>${_content}</div>`;
		
		snippetsContainer.innerHTML += _content;
		
		//_content = body = null;
		return _content;
	} catch(e){console.log(e)}
}

// Show loader & fetch more posts
function showSnLoading() {
	loading.classList.add('show');

	setTimeout(() => {
		loading.classList.remove('show');
		setTimeout(() => {
			snPage++;
			showSnippets({
				paginatePage: true,
				page: snPage,
				perPage: snLimit,
				targetElem: snippetsContainer
			});
		}, 300);
	}, 1000);
}
// Filter snippets by input
function filterSnippets(e) {
	const term = e.target.value.toUpperCase();
	const snippets = document.querySelectorAll('.snippet');

	snippets.forEach(snippet => {
		const title = snippet.querySelector('.snippet-title').innerText.toUpperCase();
		const body = snippet.querySelector('.snippet-body').innerText.toUpperCase();

		if (title.indexOf(term) > -1 || body.indexOf(term) > -1) {
			snippet.style.display = 'flex';
		} else {
			snippet.style.display = 'none';
		}
	});
}

async function getPosts() {
	try{
		const res = await fetch(`https://jsonplaceholder.typicode.com/posts?_limit=${limit}&_page=${page}`);
		const data = await res.json();
		return data;
	} catch(e){
		console.log(e)
	}
}

// Show posts in DOM
async function showPosts() {
	const posts = await getPosts();

	posts.forEach(post => {
		const postEl = document.createElement('div');
		postEl.classList.add('post');
		postEl.innerHTML = `
		<div class="number">${post.id}</div>
		<div class="post-info">
			<h2 class="post-title">${post.title}</h2>
			<p class="post-body">${post.body}</p>
		</div>`;

		postsContainer.appendChild(postEl);
	});
}

// Show loader & fetch more posts
function showLoading() {
	loading.classList.add('show');

	setTimeout(() => {
		loading.classList.remove('show');
		setTimeout(() => {
			page++;
			showPosts();
		}, 300);
	}, 1000);
}

// Filter posts by input
function filterPosts(e) {
	const term = e.target.value.toUpperCase();
	const posts = document.querySelectorAll('.post');

	posts.forEach(post => {
		const title = post.querySelector('.post-title').innerText.toUpperCase();
		const body = post.querySelector('.post-body').innerText.toUpperCase();

		if (title.indexOf(term) > -1 || body.indexOf(term) > -1) {
			post.style.display = 'flex';
		} else {
			post.style.display = 'none';
		}
	});
}

// Show initial posts
showPosts();

//window.addEventListener('scroll', () => {
postsContainer.addEventListener('scroll', (e) => {
	//const { scrollTop, scrollHeight, clientHeight } = document.documentElement;
	const { scrollTop, scrollHeight, clientHeight } = e.target;
	
	if (scrollHeight - scrollTop === clientHeight) {
		showLoading();
	}
});

bpFilter.addEventListener('input', filterPosts);


// Show initial snippets
showSnippets({
	paginatePage: true,
	page: snPage,
	perPage: snLimit,
	targetElem: snippetsContainer
});
//window.addEventListener('scroll', () => {
snippetsContainer.addEventListener('scroll', (e) => {
	//const { scrollTop, scrollHeight, clientHeight } = document.documentElement;
	const { scrollTop, scrollHeight, clientHeight } = e.target;
	
	if (scrollHeight - scrollTop === clientHeight) {
		showSnLoading();
	}
});
snFilter.addEventListener('input', filterSnippets);


//initSideSearch();
