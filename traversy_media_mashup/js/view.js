async function loadView(what, id, data = {resolve:false,target:''}){
	id = Number(id) || false;
	let html = [],type = "articles",
	dataArr = await getJsonFile("./data/site.json") || {};
	what = typeof what === "string" ? what : "article";
	
	if(what === "article" || what === "articles") type = "articles";
	else if(what === "snippet" || what === "snippets") type = "snippets";
	else if(what === "page" || what === "pages") type = "pages";
	
	if(dataArr && dataArr[type]){
		let total = dataArr[type].length;
		dataArr[type].forEach(function(item,i) {
			if(item){
				if((isNumber(id) || isInteger(id)) && id === Number(item.id)){
					item.totalItems = total;
					if(data.resolve === true){
						$targetElem = $(data.target);
						$targetElem.html(item.summary);
					} else {
						html = item;
					}
				} else if(!id) {html.push(item);}
			}
		});
	}
	return html;
}
async function loadViewsByTags(tag, data = {resolve:false,target:''}){
	let taggedObjs = [],
	dataArr = await getJsonFile("./data/site.json") || {},
	keys = Object.keys(dataArr);
	if(tag && isArray(keys) && keys.length > 0){
		keys.forEach(key=>{
			if(dataArr && dataArr[key]){
				let items = dataArr[key];
				//sortedArr = sorter(dataArr[type], sortby, ascdsc);
				items.forEach(function(item,i) {
					if(item.tags && item.tags.length > 0){
						if(isString(item.tags) && (item.tags.indexOf(tag) > -1||new RegExp(tag).test(item.tags))) {
							item.viewType = key;
							taggedObjs.push(item);
						} else if(isArray(item.tags) && item.tags.length > 0 && inArray(tag, item.tags)){
							item.viewType = key;
							taggedObjs.push(item);
						}
					}
				});
			}
		});
	}
	return taggedObjs;
}
let bvi = 0;
function buildView(view, vType, vId, dsp="list"){
	let renderedView = "", code = "", cfg = {};
	
	if(arguments.length > 1 && isObject(arguments[1])){
		cfg = arguments[1];
		vId = cfg?.vId??null;
		vType = cfg?.vType??"articles";
		displayType = cfg?.dsp??"list";
	} else {
		vId = vId || null;
		vType = vType || "articles";
		displayType = dsp || "list";
	}
	
	if(isObject(view)){
		let viewTags = '', contentBody = '',format = view?.format??"text";
		prev_id = ( vId === 1 ? view.totalItems : (vId - 1) ),
		next_id = (vId < view.totalItems) ? (vId + 1) : 1;
		let tags = isArray(view.tags) && view.tags.length > 0 ? view.tags : ((isString(view.tags) && view.tags.length>0) ? view.tags.split(","): false);
		let tags_str = isArray(view.tags) && tags.length > 0 ? view.tags.join(",") : (isString(view.tags)?view.tags: "");
		if(tags){
			viewTags = tags.map((tag)=>{
				return `<span class="tag">
					<a href="./view.html?where=tags&tag=${tag}">
						<i class="fa fa-tag"></i> 
						<span>${tag}</span>
					</a>
				</span>`;
			}).join(""); 
		}
		if(displayType === "list"){
			let tag = isArray(view.tags) && tags.length > 0 ? view.tags[0] : (isString(view.tags)?view.tags.split(",")[0]: "all");
			renderedView += `<article class="archive_item tag-${tag}" key="${bvi}" data-tags="${tags_str}">
				<!--<div class="archive_item_date">Mar 1, 2014</div>-->
				<div class="archive_item_date">${view?.date?.postdate||view.pubdate}</div>
				<div class="archive_item_title">
					<a href="./view.html?where=${vType}&id=${view.id}">${view.title||view.name||unknown}</a>
				</div>
			</article>`;
			bvi++;
		} else {
			if(view.type && view.type === "code"){
				code = `<div class="code-box full">
					<div class="code-box-toolbar">
						<label class="code-box-label" for="">
							<span class="label warning label-text flex-place-center"><span class="mobile--hidden">Syntax</span> Theme</span>
							<select id="highlighter-theme-select">
								<option value="default" selected>default</option>
								<option value="atom-one-light">Atom-one (light)</option>
								<option value="atom-one-dark">Atom-one (dark)</option>
								<option value="atom-one-dark-reasonable">Atom-one (dark-reasonable)</option>
								<option value="github">Github</option>
								<option value="github-dark">Github (dark)</option>
								<option value="github-dark-dimmed">Github (dark-dimmed)</option>
							</select>
						</label>
						<label class="code-box-label" for="">
							<span class="label warning label-text flex-place-center">Wrap <span class="mobile--hidden">Syntax?</span></span>
							<select id="wrap-select">
								<option value="pre" selected>default</option>
								<option value="pre-line">pre line</option>
								<option value="pre-wrap">pre wrap</option>
								<option value="nowrap">no wrap</option>
								<option value="normal">normal</option>
							</select>
						</label>
						<span class="code-box-toolbar-buttons">
							<button id="syntax-toggler" class="code-box-toolbar-button double-fa-btn" title="toggle highlighter height"><i class="fa fa-caret-up"></i><i class="fa fa-caret-down"></i></button>
							<button id="syntax-copy-to-clipboard" class="code-box-toolbar-button"><i class="fa fa-clipboard"></i></button>
						</span>
					</div>
					<pre id="code-box-syntax-wrapper" class="code-box-syntax-wrapper hljs language-javascript">${view.syntax}</pre>
				</div>`; 
			}
				
			if(format === "markdown"){
				content = marked(view.body? view.body : view.summary);
				contentBody = `<div class="article_desc markdown">
					${content}
				</div>`;
			} else if(format === "html"){
				contentBody = view.body;
			} else {
				content = view.body? view.body : view.summary;
				contentBody = `<p class="article_desc">${content}</p>`;
			}
			
			renderedView += `<article class="article" data-tags="${tags_str}">
				<h1 class="article_title"><span>${view.title}</span></h1>
				<div class="flex flex--even">
					<span class="article_date"><i class="fa fa-calendar"></i> ${view?.date?.postdate||view.pubdate}</span>
					<span class="article_author"><i class="fa fa-user"></i> ${view.author||'unknown'}</span>
					<span class="article_tags flex tags">${viewTags}</span>
				</div>
				${contentBody}
				<hr />
				${code}
				<div class="article_links flex flex--even">
					<a class="cta-btn" href="./view.html?where=${vType}&id=${prev_id}"><i class="fa fa-chevron-left"></i> previous </a>
					<a class="cta-btn" href="./view.html?where=${vType}&id=${next_id}"> next <i class="fa fa-chevron-right"></i></a>
				</div>
			</article>`;
		}
	}
	
	return renderedView;
}

$(document).ready(function(){
	let renderedView = `
		<h1 class="animated-bg-text">If You See This</h1>
		<p class="home_welcome animated-bg-text">That means the article/snippet selected wasn't loaded.</p>
		<div class="">
			<a class="cta-btn" href="#more"><i class="fa fa-book"></i> Read More</a>
			<a class="cta-btn" href="login.html"><i class="fa fa-sign-in-alt"></i> Log In</a>
			<button class="cta-btn" id="open"><i class="fa fa-user-circle"></i> Sign Up</button>
		</div>`,
	code = "", 
	vId = parseInt(decodeURI(urlVars()["id"])), 
	//vTitle = decodeURI(urlVars()["title"]), 
	vType = decodeURI(urlVars()["where"]);
	vTag = decodeURI(urlVars()["tag"]);
	
	if(vType){
		let viewObj = loadView(vType,vId);
		let allTags = tagCloud(vType);
		let taggedViews = loadViewsByTags(vTag);
		Promise.all([viewObj,allTags,taggedViews]).then((results) => {
			let view = results[0],_tags = results[1],t_views = results[2];
			if(vType !== "tags" && !vId && _tags && isArray(_tags) && _tags.length > 0){
				let tmp = '', fontSizeProperty = '';
				let tags = occurrence(_tags);
				
				tmp += '<li><a href="#tag-all" data-tag="all">All</a></li>'
				for(const x in tags){
					let name = tags[x].name, total = tags[x].total;
					tmp += `<li key="${name}"><a href="#tag-${name}" data-tag="${name}">${name} <span>(${total})</span></a></li>`;
				}
				$("#tags-top").addClass("show").html(tmp).parent().removeClass("animated-bg");
			} else $("#tags-top").parent().removeClass("animated-bg");
			
			if(vType !== "tags" && view){
				renderedView = '';
				if(!vId && isArray(view)){
					view.forEach(vObj=>{
						renderedView += buildView(vObj,vType);
					})
				} else{
					renderedView += buildView(view,vType,vId,"article");
				}
			}
			
			if(vType === "tags" && t_views){
				renderedView = '';
				if(!vId && isArray(t_views)){
					t_views.forEach(vObj=>{
						renderedView += buildView(vObj,vObj.viewType);
					})
				} 
			}
			
			$("#view-display").removeClass("no-view").addClass(vType+"-view").attr({"data-view-type":vType}).html(renderedView).fadeIn(1500);
			
			$('.code-box > pre').each(function(i, block) {
				hljs.highlightElement(block);
			});
			
			let default_maxheight = $("#code-box-syntax-wrapper").css("max-height");
			$(document).on("click","#syntax-toggler",function(e){
				if($("#code-box-syntax-wrapper").hasClass("toggled")) {
					$("#code-box-syntax-wrapper").removeClass("toggled").css("max-height",default_maxheight/* "50vh" */);
					$(this).html('<i class="fa fa-caret-up"></i><i class="fa fa-caret-down"></i>');
				} else {
					$("#code-box-syntax-wrapper").addClass("toggled").css("max-height", "100%");
					$(this).html('<i class="fa fa-caret-down"></i><i class="fa fa-caret-up"></i>'); 
				}
			});
			
			$(document).on("change","#highlighter-theme-select, #wrap-select",(e)=>{
				if(e.target.id && e.target.id === "highlighter-theme-select"){
					$("#highlight-theme").attr("href","./css/themes/highlight/"+$(e.target).val()+".min.css");
				}
				if(e.target.id && e.target.id === "wrap-select"){
					$("#code-box-syntax-wrapper").css("white-space",$(e.target).val());
				}
			});
		});
	}
});
