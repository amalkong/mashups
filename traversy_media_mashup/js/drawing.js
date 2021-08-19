const sketchpad = $('#sketchpad');
const canvas = $('canvas');
const ctx = canvas.getContext('2d');
const increaseBtn = $('#increase');
const decreaseBtn = $('#decrease');
const sizeEL = $('#size');
const colorEl = $('#color');
const clearEl = $('#clear');
const image_file = $('#image-file');
const useImgHeightEl = $('#use-image-height');
const canvasKitToggler = $('#canvas-kit-toggler');
const shadowBlurEl = $('#shadowBlur');
const shadowColorEl = $('#shadowColor');
const shadowOffsetXEl = $('#shadowOffsetX');
const shadowOffsetYEl = $('#shadowOffsetY');
const shadowEffectCanvas = $('#shadow-effect-canvas');
const shadow_ctx = shadowEffectCanvas.getContext('2d');

let hue = 0;
let size = 2
let sizeAmount = 2
let isPressed = false
colorEl.value = 'black'
let color = colorEl.value
let x
let y

let winW = window.innerWidth, winH = window.innerHeight,
defaultW = `${winW-50}`, defaultH = `${winH-100}`,
useImgHeight = (useImgHeightEl.checked === true || useImgHeightEl.checked === 'true') ? true : false

canvas.width = defaultW;
canvas.height = defaultH;

//ctx.strokeStyle = color || 'black';
ctx.lineWidth = size;
ctx.shadowOffsetX = shadowOffsetXEl.value || 10;
ctx.shadowOffsetY = shadowOffsetYEl.value || 10;
ctx.shadowBlur = shadowBlurEl.value || 10;
ctx.shadowColor = shadowColorEl.value || 'black';
//ctx.globalCompositeOperation = 'difference';
function drawCircle(x, y) {
    ctx.beginPath();
    ctx.arc(x, y, size, 0, Math.PI * 2)
    ctx.fillStyle = color
    ctx.fill()
}

function drawLine(x1, y1, x2, y2) {
    ctx.beginPath()
    ctx.moveTo(x1, y1)
    ctx.lineTo(x2, y2)
    ctx.strokeStyle = color
    ctx.lineWidth = size * 2
    ctx.stroke()
}
function previewEffect(_ctx, x1, y1, x2, y2) {
	_ctx.clearRect(0,0,shadowEffectCanvas.width,shadowEffectCanvas.height)
	_ctx.shadowOffsetX = shadowOffsetXEl.value || 10;
	_ctx.shadowOffsetY = shadowOffsetYEl.value || 10;
	_ctx.shadowBlur = shadowBlurEl.value || 10;
	_ctx.shadowColor = shadowColorEl.value || 'black';
    _ctx.strokeStyle = color
    _ctx.lineWidth = size * 2
    _ctx.beginPath()
    _ctx.moveTo(x1||50, y1||20)
    _ctx.lineTo(x2||20, y2||20)
	//_ctx.restore();
	//_ctx.closePath();
    _ctx.stroke()
}

function updateSizeOnScreen() {
    sizeEL.innerText = size
}

function drawImage($mainImage,ctx, blob){
	useImgHeight = (useImgHeightEl.checked === true || useImgHeightEl.checked === 'true') ? true : false
	canvas.width = useImgHeight ? $mainImage.width : defaultW;
	canvas.height = useImgHeight ? $mainImage.height : defaultH;
	
	console.log(useImgHeight)
	ctx.drawImage($mainImage, 0, 0, canvas.width, canvas.height); //ctx.drawImage($mainImage, 0, 0);
	// Convert canvas to image
	/* var fileName = 'my-canvas.jpeg', imgType = "image/jpeg", imgQuality = 1.0, 
	dataURL = canvas.toDataURL(imgType, imgQuality);
	if (window.navigator.msSaveBlob) {
	  window.navigator.msSaveBlob(canvas.msToBlob(), fileName);
	  e.preventDefault();
	} else {
	  downloadImage(dataURL, fileName);
	} */
}


function drawShape(x, y, radius, inset, n){
	ctx.fillStyle = 'hsl('+hue+',100%,100%)';
	ctx.beginPath();
	ctx.save();
	ctx.translate(x,y);
	ctx.moveTo(0, 0 - radius);
	
	for(var i = 0;i < n;i++){
		ctx.rotate(Math.PI / n);
		ctx.lineTo(0,0 - (radius * inset));
		ctx.rotate(Math.PI / n);
		ctx.lineTo(0,0 - radius);
	}
	
	ctx.restore();
	ctx.closePath();
	ctx.stroke();
	ctx.fill();
}

const radius = 70;
const inset = 0.5;
const n = 6;
let angle = 0;

//drawShape(120, 120, radius * 1.45, 1, 1.5);
//drawShape(120, 120, radius, inset, n);
previewEffect(shadow_ctx);

canvas.addEventListener('mousedown', (e) => {
    isPressed = true

    x = e.offsetX
    y = e.offsetY
})

canvas.addEventListener('mousemove', (e) => {
	if(isPressed){
		/* //color = 'hsl('+hue+',100%,100%)';
		ctx.save();
		ctx.translate(e.x,e.y);
		ctx.rotate(angle);
		hue += 3;
		//angle += 2.5;
		drawShape(0,0,radius * 1.45,1,1.5)
		ctx.rotate(-angle*2);
		drawShape(0,0,radius,inset,n)
		angle += 0.1;
		ctx.restore();
		//drawShape(e.x,e.y,radius,inset,n) */
        const x2 = e.offsetX
        const y2 = e.offsetY

        drawCircle(x2, y2)
        drawLine(x, y, x2, y2)

        x = x2
        y = y2
    }
})

increaseBtn.addEventListener('click', () => {
    size += sizeAmount

    if(size > 50) {
        size = 50
    }

    updateSizeOnScreen()
})

decreaseBtn.addEventListener('click', () => {
    size -= sizeAmount

    if(size < sizeAmount) {
        size = sizeAmount
    }

    updateSizeOnScreen()
})

colorEl.addEventListener('change', (e) => color = e.target.value)

clearEl.addEventListener('click', () => ctx.clearRect(0,0, canvas.width, canvas.height))

canvasKitToggler.addEventListener('click', () => $('.canvas-kit').classList.toggle('toggled'))

image_file.addEventListener('change', (e) => {
	let files = e.target.files
	console.log(files)
	if(files && files.length > 0){
		let fr = new FileReader()
		fr.onloadend = (function(theFile) {
			return function(e) {
				try{
					//$mainImage = document.createElement("img")
					//document.body.appendChild($mainImage);
					//$mainImage.style.display = 'none';
					$mainImage = new Image;
					$mainImage.onload = function(e){
						drawImage($mainImage,ctx,files[0])
					}
					$mainImage.src = e.target.result;
				} catch(e){alert(e)}
			};
		})(files[0]);
		fr.readAsDataURL(files[0]);
	}
});

[shadowOffsetXEl, shadowOffsetYEl, shadowBlur, shadowColorEl].forEach(el=>{
	el.addEventListener('change',e=>{
		if(e.target === shadowOffsetXEl) {ctx.shadowOffsetX = shadowOffsetXEl.value;}
		if(e.target === shadowOffsetYEl) {ctx.shadowOffsetY = shadowOffsetYEl.value;}
		if(e.target === shadowBlur) {ctx.shadowBlur = shadowBlurEl.value;}
		if(e.target === shadowColorEl) {ctx.shadowColor = shadowColorEl.value;}
		previewEffect(shadow_ctx)
	})
})

window.addEventListener('resize', (e) => {
    let winW = window.innerWidth, winH = window.innerHeight,
	defaultW = `${winW-50}`, defaultH = `${winH-100}`
	
	canvas.width = defaultW;
	canvas.height = defaultH;
})

document.addEventListener('mouseup', (e) => {
    isPressed = false

    x = undefined
    y = undefined
})
