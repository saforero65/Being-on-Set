
function main() {
    let mixer;
    const canvas = document.querySelector('#c');
    const view1Elem = document.querySelector('#view1');
    const view2Elem = document.querySelector('#view2');
    const view3Elem = document.querySelector('#view3');
    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });

    const fov = 45;
    const aspect = 2;  // the canvas default
    const near = 5;
    const far = 100;
    camera = new THREE.PerspectiveCamera(45, aspect, 0.1, 300);
    camera.position.y = 26;
    camera.position.z = 90;
    camera.lookAt(new THREE.Vector3(0, 0, 0));

    const cameraHelper = new THREE.CameraHelper(camera);

    class MinMaxGUIHelper {
        constructor(obj, minProp, maxProp, minDif) {
            this.obj = obj;
            this.minProp = minProp;
            this.maxProp = maxProp;
            this.minDif = minDif;
        }
        get min() {
            return this.obj[this.minProp];
        }
        set min(v) {
            this.obj[this.minProp] = v;
            this.obj[this.maxProp] = Math.max(this.obj[this.maxProp], v + this.minDif);
        }
        get max() {
            return this.obj[this.maxProp];
        }
        set max(v) {
            this.obj[this.maxProp] = v;
            this.min = this.min;  // this will call the min setter
        }
    }

    const gui = new dat.GUI();
    gui.add(camera, 'fov', 1, 180);
    const minMaxGUIHelper = new MinMaxGUIHelper(camera, 'near', 'far', 0.1);
    gui.add(minMaxGUIHelper, 'min', 0.1, 50, 0.1).name('near');
    gui.add(minMaxGUIHelper, 'max', 0.1, 300, 0.1).name('far');

    const controls = new THREE.OrbitControls(camera, view1Elem);
    controls.target.set(0, 5, 0);
    controls.update();

    const camera2 = new THREE.OrthographicCamera(
        -130,
        130,
        130,
        -130,
        10,
        2000
    );
    camera2.position.set(0, 100, 0);
    camera2.up.set(0, 0, -1);
    camera2.lookAt(new THREE.Vector3(0, 0, 0));

    const camera3 = new THREE.PerspectiveCamera(
        60,  // fov
        2,   // aspect
        0.1, // near
        500, // far
    );
    camera3.position.set(40, 10, 130);
    camera3.lookAt(0, 5, 0);


    clock = new THREE.Clock();


    const api = { state: 'Walking' };

    const loader = new THREE.GLTFLoader();
    loader.load('models/RobotExpressive.glb', function (gltf) {


        model = gltf.scene;
        model.scale.set(8, 8, 8); scene.add(model);

        mixer = new THREE.AnimationMixer(model);
        mixer.clipAction(gltf.animations[0]).play()

        render()

    }, undefined, function (e) {

        console.error(e);

    });


    const scene = new THREE.Scene();
    scene.background = new THREE.Color('black');
    scene.add(cameraHelper);

    //toda la escena
    var floorTexture = new THREE.ImageUtils.loadTexture('src/img/marker.jpg');
    floorTexture.wrapS = floorTexture.wrapT = THREE.RepeatWrapping;
    floorTexture.repeat.set(2, 2);
    var floorMaterial = new THREE.MeshBasicMaterial({ map: floorTexture, side: THREE.DoubleSide });

    var floorTexture2 = new THREE.ImageUtils.loadTexture('src/img/marker2.jpg');
    floorTexture2.wrapS = floorTexture2.wrapT = THREE.RepeatWrapping;
    floorTexture2.repeat.set(2, 2);
    var floorMaterial2 = new THREE.MeshBasicMaterial({ map: floorTexture2, side: THREE.DoubleSide });

    const geometry = new THREE.PlaneGeometry(200, 100);
    const material = new THREE.MeshBasicMaterial({ color: 0x82FF33, side: THREE.DoubleSide });
    const plane = new THREE.Mesh(geometry, floorMaterial);
    const plane2 = new THREE.Mesh(geometry, floorMaterial2);
    const plane3 = new THREE.Mesh(geometry, floorMaterial2);
    plane.position.set(0, 50, -100);

    plane2.position.set(100, 50, 0);
    plane2.rotation.y = Math.PI / 2;

    plane3.position.set(-100, 50, 0);
    plane3.rotation.y = Math.PI / 2;


    scene.add(plane);
    scene.add(plane2);
    scene.add(plane3);


    left_box = new THREE.Mesh(
        new THREE.BoxGeometry(20, 20, 20),
        new THREE.MeshLambertMaterial({ color: 0xff2211 })
    );
    left_box.position.set(-50, 10, 0);
    scene.add(left_box);

    right_box = new THREE.Mesh(
        new THREE.BoxGeometry(20, 20, 20),
        new THREE.MeshLambertMaterial({ color: 0xffff00 })
    );
    right_box.position.set(50, 10, 0);
    scene.add(right_box);

    const size = 200;
    const divisions = 20;

    const gridHelper = new THREE.GridHelper(size, divisions);
    scene.add(gridHelper);

    let pointLight = new THREE.PointLight(0xffffff);
    pointLight.position.set(0, 300, 200);
    scene.add(pointLight);

    let ambientLight = new THREE.AmbientLight(0xffffff);
    scene.add(ambientLight);

    const controls3 = new THREE.OrbitControls(camera3, view3Elem);
    controls3.update();
    // controls3.addEventListener('change', render);

    control = new THREE.TransformControls(camera3, view3Elem);
    // control.addEventListener('change', render);

    control.addEventListener('dragging-changed', function (event) {

        controls3.enabled = !event.value;

    });

    control2 = new THREE.TransformControls(camera3, view3Elem);
    // control2.addEventListener('change', render);

    control2.addEventListener('dragging-changed', function (event) {

        controls3.enabled = !event.value;

    });

    control.attach(right_box);
    control2.attach(left_box);

    scene.add(control);
    scene.add(control2);


    window.addEventListener("resize", onWindowResize);

    window.addEventListener('keydown', function (event) {

        switch (event.keyCode) {

            case 87: // W
                control.setMode('translate');
                control2.setMode('translate');
                break;

            case 69: // E
                control.setMode('rotate');
                control2.setMode('rotate');
                break;

            case 82: // R
                control.setMode('scale');
                control2.setMode('scale');
                break;



            case 27: // Esc
                control.reset();
                control2.reset();
                break;

        }

    });

    window.addEventListener('keyup', function (event) {

        switch (event.keyCode) {

            case 16: // Shift
                control.setTranslationSnap(null);
                control.setRotationSnap(null);
                control.setScaleSnap(null);

                control2.setTranslationSnap(null);
                control2.setRotationSnap(null);
                control2.setScaleSnap(null);
                break;

        }

    });

    function resizeRendererToDisplaySize(renderer) {
        const canvas = renderer.domElement;
        const width = canvas.clientWidth;
        const height = canvas.clientHeight;
        const needResize = canvas.width !== width || canvas.height !== height;
        if (needResize) {
            renderer.setSize(width, height, false);
        }
        return needResize;
    }

    function setScissorForElement(elem) {
        const canvasRect = canvas.getBoundingClientRect();
        const elemRect = elem.getBoundingClientRect();

        // compute a canvas relative rectangle
        const right = Math.min(elemRect.right, canvasRect.right) - canvasRect.left;
        const left = Math.max(0, elemRect.left - canvasRect.left);
        const bottom = Math.min(elemRect.bottom, canvasRect.bottom) - canvasRect.top;
        const top = Math.max(0, elemRect.top - canvasRect.top);

        const width = Math.min(canvasRect.width, right - left);
        const height = Math.min(canvasRect.height, bottom - top);

        // setup the scissor to only render to that part of the canvas
        const positiveYUpBottom = canvasRect.height - bottom;

        renderer.setScissor(left, positiveYUpBottom, width, height);
        renderer.setViewport(left, positiveYUpBottom, width, height);


        // return the aspect
        return width / height;
    }
    function onWindowResize() {

    }


    function render() {

        resizeRendererToDisplaySize(renderer);

        // turn on the scissor
        renderer.setScissorTest(true);

        // render the original view


        const delta = clock.getDelta();

        if (mixer != null) {
            mixer.update(delta);
        }

        {
            const aspect = setScissorForElement(view1Elem);

            // adjust the camera for this aspect
            camera.aspect = aspect;
            camera.updateProjectionMatrix();
            cameraHelper.update();

            // don't draw the camera helper in the original view
            cameraHelper.visible = false;

            // scene.background.set(0x000000);

            // render
            renderer.render(scene, camera);
        }

        // render from the 2nd camera
        {
            const aspect = setScissorForElement(view2Elem);

            // adjust the camera for this aspect
            camera2.aspect = aspect;
            camera2.updateProjectionMatrix();

            // draw the camera helper in the 2nd view
            cameraHelper.visible = true;

            // scene.background.set(0x000040);

            renderer.render(scene, camera2);
        }
        {
            const aspect = setScissorForElement(view3Elem);

            // adjust the camera for this aspect
            camera3.aspect = aspect;
            camera3.updateProjectionMatrix();

            // draw the camera helper in the 2nd view
            cameraHelper.visible = true;

            // scene.background.set(0x000040);

            renderer.render(scene, camera3);
        }


        requestAnimationFrame(render);
    }

    requestAnimationFrame(render);
}

main();
