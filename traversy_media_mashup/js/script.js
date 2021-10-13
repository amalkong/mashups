let _loader = '<div class="bouncing-loader"><div></div><div></div><div></div></div>';
let hasDocument = ('undefined' !== typeof document);

const clickEvent = hasDocument && document.ontouchstart ? 'touchstart' : 'click';
const inArray = (needle, arr) => {if ((typeof arr == 'undefined') || !arr.length || !arr.push) return false;for (var i = 0; i < arr.length; i++) if (arr[i] == needle) return true;return false;}
const isString = (str) => typeof(str) === "string";
const isArray = (arr) => Array.isArray(arr) || typeof(arr) === "array";
const isObject = (obj) => {return obj === Object(obj);}
const isPlainObject = (val) => {return !!val && typeof(val) === 'object' && val.constructor === Object;}
const isElement = (obj) => {return (typeof HTMLElement === "object" ? obj instanceof HTMLElement : obj && typeof obj === "object" && obj !== null && obj.nodeType === 1 && typeof obj.nodeName==="string");}
const isInteger = (x) => {return typeof(x) === "number" && x.toString().search(/^-?[0-9]+$/) == 0;}
const isNumber = (val) => {return typeof( val ) === 'number' && val === val;}
const isNumeric = ( obj ) => {var realStringObj = obj && obj.toString();return isArray( obj ) && ( realStringObj - parseFloat( realStringObj ) + 1 ) >= 0;}
const occurrence = (array) => {
	"use strict";
	var result = {};
	if (array instanceof Array) {
		array.forEach(function (v, i) {
			if (!result[v]) {
				result[v] = [i];
			} else {
				result[v].push(i);
			}
		});
		Object.keys(result).forEach(function (v) {
			result[v] = {"name": v, "index": result[v], "total": result[v].length};
		});
	}
	return result;
}
const shuffle = (arr) => {
	// Shuffle slide order if needed		
	if (isArray(arr)){
		for(var j, x, i = arr.length; i; j = parseInt(Math.random() * i), x = arr[--i], arr[i] = arr[j], arr[j] = x);	// Fisher-Yates shuffle algorithm (jsfromhell.com/array/shuffle)
		return arr
	}

	return this;
}
const sorter = (arr, by, ascdsc="asc") => {
	if(!isArray(arr) || (by && !isString(by)) ) return -1;
	let _strip = (str) => isString(str) && str.replace(/^(a |an |the )/gi, '').trim();
	ascdsc= isString(ascdsc) ? ascdsc : "asc";
	let sortedArr = arr.sort((a, b) => ascdsc && ascdsc !== "dsc" ? (_strip(a[by]||a) < _strip(b[by]||b) ? -1 : 1) : _strip(a[by]||a) > _strip(b[by]||b) ? -1 : 1);
	return sortedArr
};
const downloadImage = (data, filename = 'untitled.jpeg') => {
	var a = document.createElement('a');
	a.href = data;
	a.download = filename;
	document.body.appendChild(a);
	a.click();
}
// Fetch data from JSON file
async function loadReadme(url) {
	url = url || `./README.md`;
	const res = await fetch(url);
	const data = await res.text();
	return data;
}
async function getJsonFile(url) {
	url = url || `./data/snippets.json`;
	const res = await fetch(url);
	const data = await res.json();
	return data;
}
async function getRepos(user,api_url){
	try{
		user = user||"amalkong";
		api_url = api_url || `https://api.github.com/users/${user}/repos`;
		const data = await getJsonFile(api_url);
		return data;
	} catch(e){
		console.log('An error has occurred',e);
	}
}
async function initSideSearch(){
	let type = "articles", query = "title", 
	dataArr = await getJsonFile("./data/site.json") || {},
	$matchesElem = $('#matches'),
	$matchesParentElem = $($matchesElem.parent());
	// Respond to any input change, and show first few matches
	$("#search_for").on('keypress keyup change input', function() { 
		var val = $(this).val().toLowerCase(),
		where = $("#search_where").val().toLowerCase();
		if(dataArr && dataArr[where]){
			$matchesElem.html(!val.length ? '' : 
				dataArr[where].filter(function(what) {
					$matchesParentElem.removeClass("has--results");
					// look for the entry with a matching `code` value
					return (what.title.toLowerCase().indexOf(val) !== -1 || what.summary.toLowerCase().indexOf(val) !== -1);
				}).map(function(what) {
					// get titles/summary of matches
					$matchesParentElem.addClass("has--results");
					return `<a href="./view.html?where=${where}&id=${what.id}">${what.title}</a>`;
				}).join('\n')); // create one text with a line per matched title
				
			if(val.length === 0) $($('#matches').parent()).removeClass("has--results");
		}
	});
}
async function getRecent(what, limit, sortby, ascdsc){
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

async function tagCloud(typeKey){
	let tags = [],
	dataArr = await getJsonFile("./data/site.json") || {},
	keys = Object.keys(dataArr);
	if(typeKey && isString(typeKey) && dataArr && dataArr[typeKey]){
		let items = dataArr[typeKey];
		//sortedArr = sorter(dataArr[type], sortby, ascdsc);
		items.forEach(function(item,i) {
			if(item.tags && item.tags.length > 0){
				if(isString(item.tags)) _tags = item.tags.split(",");
				else _tags = item.tags;
				if(isArray(_tags) && _tags.length > 0){
					_tags.forEach(_tag=>{
						tags.push(_tag);
					})
				} else tags.push(_tags);
				
			}
		});
	} else if(isArray(keys) && keys.length > 0){
		keys.forEach(key=>{
			if(dataArr && dataArr[key]){
				let items = dataArr[key];
				//sortedArr = sorter(dataArr[type], sortby, ascdsc);
				items.forEach(function(item,i) {
					if(item.tags && item.tags.length > 0){
						if(isString(item.tags)) _tags = item.tags.split(",");
						else _tags = item.tags;
						if(isArray(_tags) && _tags.length > 0){
							_tags.forEach(_tag=>{
								tags.push(_tag);
							})
						} else tags.push(_tags);
						
					}
				});
			}
		});
	}
	return tags;
}
// -------------------------------------------------------------
function urlVars(url) {
	var vars = [], hash;
	// --
	url = url || window.location.href;
	if(/#/.test(url)){url = url.split("#")[0];}
	// --
	if(url){
		var hashes = url.slice(url.indexOf('?') + 1).split('&');
	} else var hashes = window.location.href.slice(window.location.href.indexOf('?') + 1).split('&');
	for (var i = 0; i < hashes.length; i++) {
		hash = hashes[i].split('=');
		vars.push(hash[0]);
		vars[hash[0]] = hash[1];
	}
	return vars;
}
function loader($el, $cont, delay = 750){
	$el = $($el)[0];
	$el.innerHTML = _loader;
	setTimeout(()=>{if(typeof $cont === 'string') {$el.innerHTML = $cont;} else {$el.innerHTML = '';$el.append($cont);}},delay);
	return {
		then:(cb)=>{if(cb && typeof(cb) === 'function') {if(delay){delay = (delay + 100);setTimeout(cb,delay);} else cb();}}
	}
}
function getFilename(path){let rPath = /.*(\/|\\)/;return path.replace( rPath, '' );}

function buildNavbar(navArr,targetId,tmpl){
	let toggle = $('#toggle'),
	navbar = $('#main-sidebar'),
	split = location.pathname.split('/'),
	filename = Array.isArray(split) && split.length > 0 ? split.pop() : navArr?.index || '',
	fileID = filename.split('.')[0];
	
	if(navArr && typeof navArr === "object" && navArr.links && Array.isArray(navArr.links) && navArr.links.length > 0){
		$(targetId).html(navArr.links.map(link=> {let _class = fileID === link.id ? 'class="active"': '';return link.id === "divider" ? '<li class="line-divider"></li>' : `<li id="${link.id}" ${_class}><a href="${navArr.base_url}${link.url}">${link.icon} ${link.text}</a></li>`}).join(''));
	}
	// This function closes navbar if user clicks anywhere outside of navbar once it's opened
	// Does not leave unused event listeners on
	// It's messy, but it works
	let $body = $('body');
	function closeNavbar(e) {
		if ($body.hasClass('show-nav') && e.target !== toggle[0] && !toggle[0].contains(e.target) && e.target !== navbar[0] && !navbar[0].contains(e.target)) {
			$body.toggleClass('show-nav');
			$body.off(clickEvent, closeNavbar);
		} else if (!$body.hasClass('show-nav')) {
			$body.off(clickEvent, closeNavbar);
		}
	}
	// Toggle nav
	toggle.on(clickEvent, () => {
		$body.toggleClass('show-nav');
		$body.on(clickEvent, closeNavbar);
	});
}
function openTab(evt, tabId,parentId,anim,dsp="block") {
    var i, x, tablinks, display = dsp || "block", animation = anim || "w3-animate-fading",
    _parent = document.querySelector(parentId);
    x = _parent && typeof _parent === "object" ? _parent.getElementsByClassName("tab__content") : document.getElementsByClassName("tab__content");
    for (i = 0; i < x.length; i++) {
        if(x[i].classList.contains('active')) x[i].classList.remove('active');
    }
    tablinks = _parent && typeof _parent === "object" ? _parent.getElementsByClassName("tablink") : document.getElementsByClassName("tablink");
    for (i = 0; i < x.length; i++) {
        tablinks[i].className = tablinks[i].className.replace(" w3-red", "");
    }
    let activeTab = document.getElementById(tabId);
    activeTab.classList.add('active');
    evt.currentTarget.className += " w3-red";
}

function initModals(){
	let close = $('#close'),
	open = $('#open'),
	modal = $('#modal')

	// Show modal
	if(open) open.on(clickEvent, () => modal.addClass('show-modal'));
	// Hide modal
	if(close) close.on(clickEvent, () => modal.removeClass('show-modal'));
	// Hide modal on outside click
	window.addEventListener(clickEvent, e =>
		e.target == modal[0] ? modal.removeClass('show-modal') : false
	);
}
// ----------------------------------------
$(document).ready(function(){
	const navArr = {index:'index.html',base_url:'./',links:[
		{id:'index', text:'Home', url:'index.html', icon:'<i class="fa fa-home"></i>', children:[]},
		{id:'login', text:'Login', url:'login.html', icon:'<i class="fa fa-sign-in-alt"></i>', children:[]},
		{id:'movies', text:'Movies App', url:'movies.html', icon:'<i class="fa fa-film"></i>', children:[]},
		{id:'blog', text:'Blog', url:'blog.html', icon:'<i class="fa fa-edit"></i>', children:[]},
		{id:'note', text:'Note App', url:'note.html', icon:'<i class="fa fa-edit"></i>', children:[]},
		{id:'view', text:'Viewer Page', url:'view.html', icon:'<i class="fa fa-eye"></i>', children:[]},
		{id:'divider'},
		{id:'search', text:'search/Filter Page', url:'search.html', icon:'<i class="fa fa-search"></i>', children:[]},
		{id:'store', text:'Store App', url:'store.html', icon:'<i class="fa fa-store-alt"></i>', children:[]},
		{id:'drawing', text:'Drawing App', url:'drawing.html', icon:'<i class="fa fa-paint-brush"></i>', children:[]},
		{id:'ajax-viewer', text:'Ajax Viewer Page', url:'ajax.html', icon:'<i class="fa fa-atom"></i>', children:[]},
		{id:'admin', text:'Admin Page', url:'admin.html', icon:'<i class="fa fa-user-lock"></i>', children:[
			//{id:'', text:'Admin: ??? Page', url:'./admin/.html', icon:'<i class="fa fa-user-secret"></i>'},
		]},
		//{id:'', text:' App', url:'./.html', icon:'<i class="fa fa-"></i>', children:[]},
	]};
	let recentArticles = getRecent("articles", 3,'pubdate');
	let recentSnippets = getRecent("snippets", 3,'pubdate');
	let allTags = tagCloud();
	Promise.all([recentArticles,recentSnippets,allTags]).then((results) => {
		let articles = results[0], snippets = results[1], art = results[2];
		if(articles && isArray(articles) && articles.length > 0){
			let t_html = '';
			articles.forEach((article,i) => {
				t_html += `<li key="${i}"><a href="./view.html?where=articles&id=${article.id}">${article.title}</a></li>`;
			})
			t_html += '<li><a href="./view.html?where=articles">(view all posts…)</a></li>';
			//$(".recent-posts").append(t_html);
			$(".recent-posts-list").html(t_html);
		}
		
		if(snippets && isArray(snippets) && snippets.length > 0){
			let sn_html = '';
			snippets.forEach((snippet,i) => {
				sn_html += `<li key="${i}"><a href="./view.html?where=snippets&id=${snippet.id}">${snippet.title}</a></li>`;
			})
			sn_html += '<li><a href="./view.html?where=snippets">(view all snippets…)</a></li>';
			$(".recent-snippets-list").html(sn_html);
		}
		
		if(art && isArray(art) && art.length > 0){
			let tmp = '', fontSizeProperty = '';
			let tags = occurrence(art);
			
			tmp += '<li><a href="#tag-all" data-tag="all">All</a></li>'
			for(const x in tags){
				let name = tags[x].name, total = tags[x].total;
				tmp += `<li key="${name}"><a href="./view.html?where=tags&tag=${name}" data-tag="${name}">${name} <span>(${total})</span></a></li>`;
			}
			$("#tags").html(tmp);
		}
	})
	// -----------------------------------------------------------------------
	$(document).on("change","#darkmode-toggler",function(e){
		$("html,body").toggleClass("darkmode");
	});
	// -----------------------------------------------------------------------
	buildNavbar(navArr, '#sidebar-list');
	initModals();
	initSideSearch();
	//--------------------------------------------- 
	(function() {
		var $main_body = $("body");
		var items = $(document).find('.archive_item');
		var tags = $(document).find('.tags a');

		function filter() {
			var _tag = /^#tag-/.test(location.hash) ? location.hash.replace('#tag-', '') : false;
			items = $main_body.find('.archive_item[data-tags]');
			tags = $main_body.find('.tags a');
			tags.removeAttr('data-active');
			
			if(_tag){
				if (_tag === 'all') {
					items.css('display','block');
				} else {
					items.each(function(i, item){
						let tagText = $(item).data("tags"), default_display = "flex";
						if(tagText.indexOf(_tag) > -1) {
							$(item).css('display',default_display);
							$(document).find('[data-tag="'+_tag+'"]').attr('data-active', true);
						} else {
							$(item).css('display','none');
						}
					});
				}
			}
		}
		
		$(window).on('hashchange', filter);

		filter();
	}());
	//--------------------------------------------- 
	const labels = document.querySelectorAll('.form-control label')
	if(labels){
		labels.forEach(label => {
			label.innerHTML = label.innerText
				.split('')
				.map((letter, idx) => `<span style="transition-delay:${idx * 50}ms">${letter}</span>`)
				.join('')
		})
	}
});