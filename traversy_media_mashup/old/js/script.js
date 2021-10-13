function $(sel,context){return (context || document).querySelector(sel);}
function loader($el, $cont, delay = 750){
	$el.innerHTML = _loader;
	setTimeout(()=>{if(typeof $cont === 'string') {$el.innerHTML = $cont;} else {$el.innerHTML = '';$el.append($cont);}},delay);
	return {
		then:(cb)=>{if(cb && typeof(cb) === 'function') {if(delay){delay = (delay + 100);setTimeout(cb,delay);} else cb();}}
	}
}

// -----------------------------------------------------------------------
let _loader = '<div class="bouncing-loader" style="position: absolute;top:40%;bottom:40%;left:40%;right:40%; "><div></div><div></div><div></div></div>';
let hasDocument = ('undefined' !== typeof document);

const clickEvent = hasDocument && document.ontouchstart ? 'touchstart' : 'click', 
navArr = {index:'index.html',links:[
	{id:'index', text:'Home', url:'./index.html', icon:'<i class="fa fa-home"></i>', children:[]},
	{id:'blog', text:'Blog', url:'./blog.html', icon:'<i class="fa fa-edit"></i>', children:[]},
	{id:'note', text:'Note App', url:'./note.html', icon:'<i class="fa fa-edit"></i>', children:[]},
	{id:'movies', text:'Movies App', url:'./movies.html', icon:'<i class="fa fa-film"></i>', children:[]},
	{id:'drawing', text:'Drawing App', url:'./drawing.html', icon:'<i class="fa fa-paint-brush"></i>', children:[]},
	{id:'store', text:'Store App', url:'./store.html', icon:'<i class="fa fa-store-alt"></i>', children:[]},
	{id:'login', text:'Login', url:'./login.html', icon:'<i class="fa fa-sign-in-alt"></i>', children:[]},
	//{id:'', text:' App', url:'./.html', icon:'<i class="fa fa-"></i>', children:[]},
]},
toggle = $('#toggle'),
close = $('#close'),
open = $('#open'),
modal = $('#modal'),
navbar = $('#navbar'),
sidebarList = $('#sidebar-list')

let split = location.pathname.split('/'),
filename = Array.isArray(split) && split.length > 0 ? split.pop() : navArr?.index || '',
fileID = filename.split('.')[0];

function buildNavbar(){
	if(navArr && typeof navArr === "object" && navArr.links && Array.isArray(navArr.links) && navArr.links.length > 0){
		sidebarList.innerHTML = navArr.links.map(link=> {let _class = fileID === link.id ? 'class="active"': '';return `<li id="${link.id}" ${_class}><a href="${link.url}">${link.icon} ${link.text}</a></li>`}).join('');
	}
}
// This function closes navbar if user clicks anywhere outside of navbar once it's opened
// Does not leave unused event listeners on
// It's messy, but it works
function closeNavbar(e) {
  if (
    document.body.classList.contains('show-nav') &&
    e.target !== toggle &&
    !toggle.contains(e.target) &&
    e.target !== navbar &&
    !navbar.contains(e.target)
  ) {
    document.body.classList.toggle('show-nav');
    document.body.removeEventListener(clickEvent, closeNavbar);
  } else if (!document.body.classList.contains('show-nav')) {
    document.body.removeEventListener(clickEvent, closeNavbar);
  }
}
// -------------------------------------------------------------
buildNavbar();
// Toggle nav
toggle.addEventListener(clickEvent, () => {
  document.body.classList.toggle('show-nav');
  document.body.addEventListener(clickEvent, closeNavbar);
});

// Show modal
if(open) open.addEventListener(clickEvent, () => modal.classList.add('show-modal'));

// Hide modal
if(close) close.addEventListener(clickEvent, () => modal.classList.remove('show-modal'));

// Hide modal on outside click
window.addEventListener(clickEvent, e =>
  e.target == modal ? modal.classList.remove('show-modal') : false
);

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
// ----------------------------------------
/* const nav = document.querySelector('.nav')
window.addEventListener('scroll', fixNav)
function fixNav() {
    if(window.scrollY > nav.offsetHeight + 150) {
        nav.classList.add('active')
    } else {
        nav.classList.remove('active')
    }
} */
