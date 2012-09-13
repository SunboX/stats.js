/**
 * @author mrdoob / http://mrdoob.com/
 */

var Stats = function () {

	var startTime = Date.now(), prevTime = startTime;
	var ms = 0, msMin = Infinity, msMax = 0;
	var fps = 0, fpsMin = Infinity, fpsMax = 0;
	var frames = 0, mode = 0;
	var heapSizeSupport = !(!window.performance && !window.performance.memory);

	var container = document.createElement( 'div' );
	container.id = 'stats';
	container.addEventListener( 'mousedown', function ( event ) { event.preventDefault(); setMode( ++ mode % ( heapSizeSupport ? 3 : 2 ) ) }, false );
	container.style.cssText = 'width:80px;opacity:0.9;cursor:pointer';

	// -- FPS --
	var fpsDiv = document.createElement( 'div' );
	fpsDiv.id = 'fps';
	fpsDiv.style.cssText = 'padding:0 0 3px 3px;text-align:left;background-color:#002';
	container.appendChild( fpsDiv );

	var fpsText = document.createElement( 'div' );
	fpsText.id = 'fpsText';
	fpsText.style.cssText = 'color:#0ff;font-family:Helvetica,Arial,sans-serif;font-size:9px;font-weight:bold;line-height:15px';
	fpsText.innerHTML = 'FPS';
	fpsDiv.appendChild( fpsText );

	var fpsGraph = document.createElement( 'div' );
	fpsGraph.id = 'fpsGraph';
	fpsGraph.style.cssText = 'position:relative;width:74px;height:30px;background-color:#0ff';
	fpsDiv.appendChild( fpsGraph );

	while ( fpsGraph.children.length < 74 ) {

		var bar = document.createElement( 'span' );
		bar.style.cssText = 'width:1px;height:30px;float:left;background-color:#113';
		fpsGraph.appendChild( bar );

	}

	// -- MS --
	var msDiv = document.createElement( 'div' );
	msDiv.id = 'ms';
	msDiv.style.cssText = 'padding:0 0 3px 3px;text-align:left;background-color:#020;display:none';
	container.appendChild( msDiv );
	
	var msText = document.createElement( 'div' );
	msText.id = 'msText';
	msText.style.cssText = 'color:#0f0;font-family:Helvetica,Arial,sans-serif;font-size:9px;font-weight:bold;line-height:15px';
	msText.innerHTML = 'MS';
	msDiv.appendChild( msText );
	
	var msGraph = document.createElement( 'div' );
	msGraph.id = 'msGraph';
	msGraph.style.cssText = 'position:relative;width:74px;height:30px;background-color:#0f0';
	msDiv.appendChild( msGraph );
	
	while ( msGraph.children.length < 74 ) {
	
		var bar = document.createElement( 'span' );
		bar.style.cssText = 'width:1px;height:30px;float:left;background-color:#131';
		msGraph.appendChild( bar );
	
	}

	// -- JS Heap Size
	if ( heapSizeSupport ) {
		var heapSizeDiv = document.createElement( 'div' );
		heapSizeDiv.id = 'heapSize';
		heapSizeDiv.style.cssText = 'padding:0 0 3px 3px;text-align:left;background-color:#200;display:none';
		container.appendChild( heapSizeDiv );
		
		var heapSizeText = document.createElement( 'div' );
		heapSizeText.id = 'heapSizeText';
		heapSizeText.style.cssText = 'color:#f00;font-family:Helvetica,Arial,sans-serif;font-size:9px;font-weight:bold;line-height:15px';
		heapSizeText.innerHTML = 'MB';
		heapSizeDiv.appendChild( heapSizeText );
		
		var heapSizeGraph = document.createElement( 'div' );
		heapSizeGraph.id = 'msGraph';
		heapSizeGraph.style.cssText = 'position:relative;width:74px;height:30px;background-color:#f00';
		heapSizeDiv.appendChild( heapSizeGraph );
		
		while ( heapSizeGraph.children.length < 74 ) {
		
			var bar = document.createElement( 'span' );
			bar.style.cssText = 'width:1px;height:30px;float:left;background-color:#311';
			heapSizeGraph.appendChild( bar );
		
		}
	}

	var setMode = function ( value ) {

		mode = value;

		switch ( mode ) {

			case 0:
				fpsDiv.style.display = 'block';
				msDiv.style.display = 'none';
				heapSizeDiv.style.display = 'none';
				break;
			case 1:
				fpsDiv.style.display = 'none';
				msDiv.style.display = 'block';
				heapSizeDiv.style.display = 'none';
				break;
			case 2:
				if ( heapSizeSupport ) {
					fpsDiv.style.display = 'none';
					msDiv.style.display = 'none';
					heapSizeDiv.style.display = 'block';
					break;
				}
		}

	}

	var updateGraph = function ( dom, value ) {

		var child = dom.appendChild( dom.firstChild );
		child.style.height = value + 'px';

	}

	return {

		REVISION: 12,

		domElement: container,

		setMode: setMode,

		begin: function () {

			startTime = Date.now();

		},

		end: function () {

			var time = Date.now();

			ms = time - startTime;
			msMin = Math.min( msMin, ms );
			msMax = Math.max( msMax, ms );

			msText.textContent = ms + ' MS (' + msMin + '-' + msMax + ')';
			updateGraph( msGraph, Math.min( 30, 30 - ( ms / 200 ) * 30 ) );

			frames ++;

			if ( time > prevTime + 1000 ) {

				fps = Math.round( ( frames * 1000 ) / ( time - prevTime ) );
				fpsMin = Math.min( fpsMin, fps );
				fpsMax = Math.max( fpsMax, fps );

				fpsText.textContent = fps + ' FPS (' + fpsMin + '-' + fpsMax + ')';
				updateGraph( fpsGraph, Math.min( 30, 30 - ( fps / 100 ) * 30 ) );

				prevTime = time;
				frames = 0;

				if ( heapSizeSupport ) {
					var used = window.performance.memory.usedJSHeapSize;
					var total = window.performance.memory.totalJSHeapSize;
					
					heapSizeText.textContent = used + ' MB';
					updateGraph( heapSizeGraph, Math.min( 30, 30 - ( used / total ) * 30 ) );
				}

			}

			return time;

		},

		update: function () {

			startTime = this.end();

		}

	}

};