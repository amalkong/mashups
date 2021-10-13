const ADMIN = {
	data : null,
	result : null,
	returnTypes : ["array","object","string","promise"],
	get(){
		
		return this;
	},
	from(fr="articles"){
		
		return this;
	},
	as(type="array"){
		if(type && inArray(type,this.returnTypes)){
			
		}
		return this;
	},
	_load(url,as){
		url = url || `./README.md`;
		const res = await fetch(url);
		//this.data = await res[as]();
		this.data = as === "text" ? await res.text() : await res.json();
		return this;
	}
}
async function getRecent2(what, limit, sortby, ascdsc){
	limit = limit || 5;
	sortby = sortby || "id";
	ascdsc = ascdsc || "asc";
	let html = [],type = "articles",
	dataArr = await getJsonFile("./data/site.json") || {};
	what = typeof what === "string" ? what : "article";
	
	if(what === "article" || what === "articles") type = "articles";
	else if(what === "snippet" || what === "snippets") type = "snippets";
	else if(what === "page" || what === "pages") type = "pages";
	
	if(dataArr && dataArr[type]){
		sortedArr = sorter(dataArr[type], sortby, ascdsc);
		sortedArr.forEach(function(what,i) {
			if(i<limit || limit === 0){
				html.push(what);
			}
		});
	}
	return html;
}

$(document).ready(function(){
	let dataArr = getJsonFile("./data/site.json") || {};
	Promise.resolve(dataArr).then((data)=>{
		console.log(data);
	});
});