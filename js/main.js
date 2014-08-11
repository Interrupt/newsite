var mouse = new THREE.Vector2(0, 0); 
var mouseLerp = new THREE.Vector2(0, 0);
var scrollPos = new THREE.Vector2(0, 0);

var name = "CHAD CUDDIGAN";

var maxDustLayers = 3;

function start() {
  var time = 0;
  var scene = new THREE.Scene();
  var camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
  var dusts = [];

  var clock = new THREE.Clock();

  var renderer = new THREE.WebGLRenderer();
  renderer.setSize( window.innerWidth, window.innerHeight );
  renderer.domElement.setAttribute( "id", "glCanvas" );
  document.body.appendChild( renderer.domElement );

  // make comet material 
  var bgTexture = THREE.ImageUtils.loadTexture( "images/background.jpg" );
  var bgMaterial = new THREE.MeshBasicMaterial( { map: bgTexture, depthTest: false, depthWrite: false, shading: THREE.None } );

  // make dust material
  var dustTexture = THREE.ImageUtils.loadTexture( "images/dust.png" );
  var dustMaterial = new THREE.MeshBasicMaterial( { map: dustTexture, transparent: true, depthTest: false, depthWrite: false, shading: THREE.None } );

  dustTexture.wrapS = dustTexture.wrapT = THREE.RepeatWrapping;
  dustTexture.repeat.set( 8, 8 );

  // plane geometry
  var geometry = new THREE.PlaneGeometry( 15, 15 ); 
  var dustGeometry = new THREE.PlaneGeometry( 50, 50 );

  // assemble the comet
  var comet = new THREE.Mesh( geometry, bgMaterial );
  comet.rotation.z = Math.random() * 360;
  comet.position.y = 2;
  scene.add( comet );

  // add the dust planes
  for(var i = 0; i < maxDustLayers; i++) {
    var dust = new THREE.Mesh( dustGeometry, dustMaterial );
    dust.position.z = (i + 1) * (9 / maxDustLayers);
    dust.position.x = Math.random() * 4;
    dust.position.y = Math.random() * 4;
    dust.rotation.z = Math.random() * 360;
    scene.add( dust );
    dusts[i] = dust;
  }

  // update everything and render
  function render() {
    time = clock.getElapsedTime();

    // comet movement
    comet.rotation.z += 0.0006;

    scrollPos.x = mouse.x;
    scrollPos.y = mouse.y;
    scrollPos.y -= $("body").scrollTop() * 2;

    // make the mouse lag a bit behind when it moves
    mouseLerp.lerp(scrollPos, 0.05);

    // camera position
    camera.position.x = Math.sin(time * 0.001) + mouseLerp.x * 0.001;
    camera.position.y = Math.sin(time * 0.0013) + mouseLerp.y * 0.001;
    camera.position.z = 10 + Math.sin(time * 0.05);
    camera.rotation.z = time * 0.001;

    // move the dust planes
    for(i = 0; i < maxDustLayers; i++) {
      dusts[i].rotation.z += 0.0004 * i;
    }

    renderer.render(scene, camera);
    requestAnimationFrame(render);
  }

  // start the render loop
  render();

  window.addEventListener('resize', function() {
    renderer.setSize( window.innerWidth, window.innerHeight );
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
  }, false);

  function type(number) {
    setTimeout(function() {
      var n = name.substring(0, number);
      n += "_";
      $("#name").text(n).show();
      if(number < name.length) type(number + 1);
    }, 100);
  }

  //type(0);
}

document.addEventListener('mousemove', function(e) {
  mouse.x = e.clientX || e.pageX;
  mouse.y = e.clientY || e.pageY;
}, false);

