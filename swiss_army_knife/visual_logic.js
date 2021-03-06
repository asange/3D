/**
 * Generated by Verge3D Puzzles v.3.1.1
 * Fri Jun 12 2020 21:47:55 GMT+0800 (中国标准时间)
 * Prefer not editing this file as your changes may get overridden once Puzzles are saved.
 * Check out https://www.soft8soft.com/docs/manual/en/introduction/Using-JavaScript.html
 * for the information on how to add your own JavaScript to Verge3D apps.
 */

'use strict';

(function() {

// global variables/constants used by puzzles' functions
var _pGlob = {};

_pGlob.objCache = {};
_pGlob.fadeAnnotations = true;
_pGlob.objClickCallbacks = [];
_pGlob.pickedObject = '';
_pGlob.objHoverCallbacks = [];
_pGlob.hoveredObject = '';
_pGlob.objMovementInfos = {};
_pGlob.objDragOverCallbacks = [];
_pGlob.objDragOverInfoByBlock = {}
_pGlob.dragMoveOrigins = {};
_pGlob.dragScaleOrigins = {};
_pGlob.mediaElements = {};
_pGlob.loadedFiles = {};
_pGlob.loadedFile = '';
_pGlob.animMixerCallbacks = [];
_pGlob.arHitPoint = new v3d.Vector3(0, 0, 0);
_pGlob.states = [];
_pGlob.percentage = 0;
_pGlob.animateParamUpdate = null;
_pGlob.openedFile = '';
_pGlob.xrSessionAcquired = false;
_pGlob.xrSessionCallbacks = [];
_pGlob.screenCoords = new v3d.Vector2();
_pGlob.gamepadIndex = 0;

_pGlob.AXIS_X = new v3d.Vector3(1, 0, 0);
_pGlob.AXIS_Y = new v3d.Vector3(0, 1, 0);
_pGlob.AXIS_Z = new v3d.Vector3(0, 0, 1);
_pGlob.MIN_DRAG_SCALE = 10e-4;
_pGlob.SET_OBJ_ROT_EPS = 1e-8;

_pGlob.vec2Tmp = new v3d.Vector2();
_pGlob.vec2Tmp2 = new v3d.Vector2();
_pGlob.vec3Tmp = new v3d.Vector3();
_pGlob.vec3Tmp2 = new v3d.Vector3();
_pGlob.vec3Tmp3 = new v3d.Vector3();
_pGlob.vec3Tmp4 = new v3d.Vector3();
_pGlob.eulerTmp = new v3d.Euler();
_pGlob.eulerTmp2 = new v3d.Euler();
_pGlob.quatTmp = new v3d.Quaternion();
_pGlob.quatTmp2 = new v3d.Quaternion();
_pGlob.mat4Tmp = new v3d.Matrix4();
_pGlob.planeTmp = new v3d.Plane();
_pGlob.raycasterTmp = new v3d.Raycaster();
_pGlob.intervals = {};

_pGlob.wooProductInfo = {};

var _pPhysics = {};

_pPhysics.tickCallbacks = [];
_pPhysics.syncList = [];

// internal info
_pPhysics.collisionData = [];

// goes to collision callback
_pPhysics.collisionInfo = {
    objectA: '',
    objectB: '',
    distance: 0,
    positionOnA: [0, 0, 0],
    positionOnB: [0, 0, 0],
    normalOnB: [0, 0, 0]
};

var PL = v3d.PL = v3d.PL || {};

// a more readable alias for PL (stands for "Puzzle Logic")
v3d.puzzles = PL;

PL.procedures = PL.procedures || {};

PL.execInitPuzzles = function(options) {
    // always null, should not be available in "init" puzzles
    var appInstance = null;

    var _initGlob = {};
    _initGlob.percentage = 0;
    _initGlob.output = {
        initOptions: {
            fadeAnnotations: true,
            useBkgTransp: false,
            preserveDrawBuf: false,
            useCompAssets: false,
            useFullscreen: true,
            useCustomPreloader: false,
            preloaderStartCb: function() {},
            preloaderProgressCb: function() {},
            preloaderEndCb: function() {},
        }
    }

    // provide the container's id to puzzles that need access to the container
    _initGlob.container = options !== undefined && 'container' in options
            ? options.container : "";

    

    // initSettings puzzle
_initGlob.output.initOptions.fadeAnnotations = true;
_initGlob.output.initOptions.useBkgTransp = false;
_initGlob.output.initOptions.preserveDrawBuf = false;
_initGlob.output.initOptions.useCompAssets = true;
_initGlob.output.initOptions.useFullscreen = true;

    return _initGlob.output;
}

PL.init = function(appInstance, initOptions) {
initOptions = initOptions || {};

if ('fadeAnnotations' in initOptions) {
    _pGlob.fadeAnnotations = initOptions.fadeAnnotations;
}



var unfolded_knife, camera_moving, annotaion_visiable;



// utility function envoked by almost all V3D-specific puzzles
// filter off some non-mesh types
function notIgnoredObj(obj) {
    return (obj.type !== "AmbientLight" && obj.name !== ""
            && !(obj.isMesh && obj.isMaterialGeneratedMesh));
}


// utility function envoked by almost all V3D-specific puzzles
// find first occurence of the object by its name
function getObjectByName(objName) {
    var objFound;
    var runTime = _pGlob !== undefined;
    objFound = runTime ? _pGlob.objCache[objName] : null;

    if (objFound && objFound.name === objName)
        return objFound;

    appInstance.scene.traverse(function(obj) {
        if (!objFound && notIgnoredObj(obj) && (obj.name == objName)) {
            objFound = obj;
            if (runTime) {
                _pGlob.objCache[objName] = objFound;
            }
        }
    });
    return objFound;
}


// utility function envoked by almost all V3D-specific puzzles
// retrieve all objects on the scene
function getAllObjectNames() {
    var objNameList = [];
    appInstance.scene.traverse(function(obj) {
        if (notIgnoredObj(obj))
            objNameList.push(obj.name)
    });
    return objNameList;
}


// utility function envoked by almost all V3D-specific puzzles
// retrieve all objects which belong to the group
function getObjectNamesByGroupName(targetGroupName) {
    var objNameList = [];
    appInstance.scene.traverse(function(obj){
        if (notIgnoredObj(obj)) {
            var groupNames = obj.groupNames;
            if (!groupNames)
                return;
            for (var i = 0; i < groupNames.length; i++) {
                var groupName = groupNames[i];
                if (groupName == targetGroupName) {
                    objNameList.push(obj.name);
                }
            }
        }
    });
    return objNameList;
}


// utility function envoked by almost all V3D-specific puzzles
// process object input, which can be either single obj or array of objects, or a group
function retrieveObjectNames(objNames) {
    var acc = [];
    retrieveObjectNamesAcc(objNames, acc);
    return acc;
}

function retrieveObjectNamesAcc(currObjNames, acc) {
    if (typeof currObjNames == "string") {
        acc.push(currObjNames);
    } else if (Array.isArray(currObjNames) && currObjNames[0] == "GROUP") {
        var newObj = getObjectNamesByGroupName(currObjNames[1]);
        for (var i = 0; i < newObj.length; i++)
            acc.push(newObj[i]);
    } else if (Array.isArray(currObjNames) && currObjNames[0] == "ALL_OBJECTS") {
        var newObj = getAllObjectNames();
        for (var i = 0; i < newObj.length; i++)
            acc.push(newObj[i]);
    } else if (Array.isArray(currObjNames)) {
        for (var i = 0; i < currObjNames.length; i++)
            retrieveObjectNamesAcc(currObjNames[i], acc);
    }
}




// addAnnotation and removeAnnotation puzzles
function handleAnnot(add, annot, objNames, contents, id) {
    objNames = retrieveObjectNames(objNames);
    if (!objNames)
        return;
    for (var i = 0; i < objNames.length; i++) {
        var objName = objNames[i];
        if (!objName)
            continue;
        var obj = getObjectByName(objName);
        if (!obj)
            continue;
        // check if it already has an annotation and remove it
        for (var j = 0; j < obj.children.length; j++) {
            var child = obj.children[j];
            if (child.type == "Annotation") {
                obj.remove(child);
                appInstance.container.removeChild(child.annotation);
            }
        }
        if (add) {
            var aObj = new v3d.Annotation(appInstance.container, annot, contents);
            aObj.name = annot;
            aObj.fadeObscured = _pGlob.fadeAnnotations;
            if (id) {
                aObj.annotation.id = id;
                aObj.annotationDialog.id = id+'_dialog';
            }
            obj.add(aObj);
        }
    }
}



// utility functions envoked by the HTML puzzles
function getElements(ids, isParent) {
    var elems = [];
    if (Array.isArray(ids) && ids[0] != 'CONTAINER' && ids[0] != 'WINDOW' &&
        ids[0] != 'DOCUMENT' && ids[0] != 'BODY' && ids[0] != 'QUERYSELECTOR') {
        for (var i = 0; i < ids.length; i++)
            elems.push(getElement(ids[i], isParent));
    } else {
        elems.push(getElement(ids, isParent));
    }
    return elems;
}

function getElement(id, isParent) {
    var elem;
    if (Array.isArray(id) && id[0] == 'CONTAINER') {
        if (appInstance !== null) {
            elem = appInstance.container;
        } else if (typeof _initGlob !== 'undefined') {
            // if we are on the initialization stage, we still can have access
            // to the container element
            var id = _initGlob.container;
            if (isParent) {
                elem = parent.document.getElementById(id);
            } else {
                elem = document.getElementById(id);
            }
        }
    } else if (Array.isArray(id) && id[0] == 'WINDOW') {
        if (isParent)
            elem = parent;
        else
            elem = window;
    } else if (Array.isArray(id) && id[0] == 'DOCUMENT') {
        if (isParent)
            elem = parent.document;
        else
            elem = document;
    } else if (Array.isArray(id) && id[0] == 'BODY') {
        if (isParent)
            elem = parent.document.body;
        else
            elem = document.body;
    } else if (Array.isArray(id) && id[0] == 'QUERYSELECTOR') {
        if (isParent)
            elem = parent.document.querySelector(id);
        else
            elem = document.querySelector(id);
    } else {
        if (isParent)
            elem = parent.document.getElementById(id);
        else
            elem = document.getElementById(id);
    }
    return elem;
}



// setHTMLElemStyle puzzle
function setHTMLElemStyle(prop, value, ids, isParent) {
    var elems = getElements(ids, isParent);
    for (var i = 0; i < elems.length; i++) {
        var elem = elems[i];
        if (!elem || !elem.style)
            continue;
        elem.style[prop] = value;
    }
}



// setCSSRuleStyle puzzle
function setCSSRuleStyle(prop, value, id, isParent, mediaRule) {
    var styles = (isParent) ? parent.document.styleSheets : document.styleSheets;
    for (var i = 0; i < styles.length; i++) {
        /**
         * workaround for "DOMException: Failed to read the 'cssRules' property
         * from 'CSSStyleSheet': Cannot access rules"
         */
        try { var cssRules = styles[i].cssRules; }
        catch (e) { continue; }

        for (var j = 0; j < cssRules.length; j++) {
            var cssRule = cssRules[j];
            if (!mediaRule && cssRule.selectorText == id)
                cssRule.style[prop] = value;
            else if (mediaRule && cssRule.conditionText == mediaRule) {
                var cssRulesMedia = cssRule.cssRules;
                for (var k = 0; k < cssRulesMedia.length; k++) {
                    if (cssRulesMedia[k].selectorText == id)
                        cssRulesMedia[k].style[prop] = value;
                }
            }
        }
    }
}



// eventHTMLElem puzzle
function eventHTMLElem(eventType, ids, isParent, callback) {
    var elems = getElements(ids, isParent);
    for (var i = 0; i < elems.length; i++) {
        var elem = elems[i];
        if (!elem)
            continue;
        elem.addEventListener(eventType, callback, false);
    }
}



// autoRotateCamera puzzle
function autoRotateCamera(enabled, speed) {

    if (appInstance.controls && appInstance.controls instanceof v3d.OrbitControls) {
        appInstance.controls.autoRotate = enabled;
        appInstance.controls.autoRotateSpeed = speed;
    } else {
        console.error('autorotate camera: Wrong controls type');
    }
}



// setTimer puzzle
function registerSetTimer(id, timeout, callback, repeat) {

    if (id in _pGlob.intervals) {
        window.clearInterval(_pGlob.intervals[id]);
    }

    _pGlob.intervals[id] = window.setInterval(function() {
        if (repeat-- > 0) {
            callback();
        }
    }, 1000 * timeout);
}



// utility function used by the whenClicked, whenHovered and whenDraggedOver puzzles
function initObjectPicking(callback, eventType, mouseDownUseTouchStart) {

    var elem = appInstance.renderer.domElement;
    elem.addEventListener(eventType, pickListener);
    if (eventType == "mousedown") {
        var touchEventName = mouseDownUseTouchStart ? "touchstart" : "touchend";
        elem.addEventListener(touchEventName, pickListener);
    }

    var raycaster = new v3d.Raycaster();
    function pickListener(event) {
        event.preventDefault();

        var xNorm = 0, yNorm = 0;
        if (event instanceof MouseEvent) {
            xNorm = event.offsetX / elem.clientWidth;
            yNorm = event.offsetY / elem.clientHeight;
        } else if (event instanceof TouchEvent) {
            var rect = elem.getBoundingClientRect();
            xNorm = (event.changedTouches[0].clientX - rect.left) / rect.width;
            yNorm = (event.changedTouches[0].clientY - rect.top) / rect.height;
        }

        _pGlob.screenCoords.x = xNorm * 2 - 1;
        _pGlob.screenCoords.y = -yNorm * 2 + 1;
        raycaster.setFromCamera(_pGlob.screenCoords, appInstance.camera);
        var objList = [];
        appInstance.scene.traverse(function(obj){objList.push(obj);});
        var intersects = raycaster.intersectObjects(objList);
        if (intersects.length > 0) {
            var obj = intersects[0].object;
            callback(obj, event);
        } else {
            callback(null, event);
        }
    }
}

// utility function used by the whenDraggedOver puzzles
function fireObjectPickingCallbacks(objName, source, index, cbParam) {
    for (var i = 0; i < source.length; i++) {
        var cb = source[i];
        if (objectsIncludeObj([cb[0]], objName)) {
            cb[index](cbParam);
        }
    }
}

function objectsIncludeObj(objNames, testedObjName) {
    if (!testedObjName) return false;

    for (var i = 0; i < objNames.length; i++) {
        if (testedObjName == objNames[i]) {
            return true;
        } else {
            // also check children which are auto-generated for multi-material objects
            var obj = getObjectByName(objNames[i]);
            if (obj && obj.type == "Group") {
                for (var j = 0; j < obj.children.length; j++) {
                    if (testedObjName == obj.children[j].name) {
                        return true;
                    }
                }
            }
        }
    }
    return false;
}

// utility function used by the whenClicked, whenHovered and whenDraggedOver puzzles
function getPickedObjectName(obj) {
    // auto-generated from a multi-material object, use parent name instead
    if (obj.isMesh && obj.isMaterialGeneratedMesh && obj.parent) {
        return obj.parent.name;
    } else {
        return obj.name;
    }
}



// whenClicked puzzle
initObjectPicking(function(obj) {

    // save the object for the pickedObject block
    _pGlob.pickedObject = obj ? getPickedObjectName(obj) : '';

    _pGlob.objClickCallbacks.forEach(function(el) {
        var isPicked = obj && objectsIncludeObj(el.objNames, getPickedObjectName(obj));
        el.callbacks[isPicked ? 0 : 1]();
    });
}, 'mousedown');



// whenClicked puzzle
function registerOnClick(objNames, cbDo, cbIfMissedDo) {
    objNames = retrieveObjectNames(objNames) || [];
    var objNamesFiltered = objNames.filter(function(name) {
        return name;
    });
    _pGlob.objClickCallbacks.push({
        objNames: objNamesFiltered,
        callbacks: [cbDo, cbIfMissedDo]
    });
}



// loadSound puzzle
function loadSoundAdv(url) {
    var elems = _pGlob.mediaElements;
    if (!(url in elems)) {
        elems[url] = document.createElement('audio');
        elems[url].src = url;
    }
    return elems[url];
}



// volume puzzle
function volume(audioElem, volume) {
    if (!audioElem)
        return;
    if (typeof volume != "number")
        return;
    audioElem.volume = v3d.Math.clamp(volume, 0.0, 1.0);
}



// playSound puzzle
function playSound(audioElem, loop) {
    if (!audioElem)
        return;
    audioElem.loop = loop;
    audioElem.play();
}



// getAnimations puzzle
function getAnimations(objNames) {
    objNames = retrieveObjectNames(objNames);
    if (!objNames)
        return;
    var animations = [];
    for (var i = 0; i < objNames.length; i++) {
        var objName = objNames[i];
        if (!objName)
            continue;
        // use objName as animName - for now we have one-to-one match
        var action = v3d.SceneUtils.getAnimationActionByName(appInstance, objName);
        if (action)
            animations.push(objName);
    }
    return animations;
}



/**
 * Get a scene that contains the root of the given action.
 */
function getSceneByAction(action) {
    var root = action.getRoot();
    var scene = root.type == "Scene" ? root : null;
    root.traverseAncestors(function(ancObj) {
        if (ancObj.type == "Scene") {
            scene = ancObj;
        }
    });
    return scene;
}



/**
 * Get the current scene's framerate.
 */
function getSceneAnimFrameRate(scene) {
    if (scene && "v3d" in scene.userData && "animFrameRate" in scene.userData.v3d) {
        return scene.userData.v3d.animFrameRate;
    }
    return 24;
}



var initAnimationMixer = function() {

    function onMixerFinished(e) {
        var cb = _pGlob.animMixerCallbacks;
        var found = [];
        for (var i = 0; i < cb.length; i++) {
            if (cb[i][0] == e.action) {
                cb[i][0] = null; // desactivate
                found.push(cb[i][1]);
            }
        }
        for (var i = 0; i < found.length; i++) {
            found[i]();
        }
    }

    return function initAnimationMixer() {
        if (appInstance.mixer && !appInstance.mixer.hasEventListener('finished', onMixerFinished))
            appInstance.mixer.addEventListener('finished', onMixerFinished);
    };

}();



// animation puzzles
function operateAnimation(operation, animations, from, to, loop, speed, callback, isPlayAnimCompat, rev) {
    if (!animations)
        return;
    // input can be either single obj or array of objects
    if (typeof animations == "string")
        animations = [animations];

    function processAnimation(animName) {
        var action = v3d.SceneUtils.getAnimationActionByName(appInstance, animName);
        if (!action)
            return;
        switch (operation) {
        case 'PLAY':
            if (!action.isRunning()) {
                action.reset();
                if (loop && (loop != "AUTO"))
                    action.loop = v3d[loop];
                var scene = getSceneByAction(action);
                var frameRate = getSceneAnimFrameRate(scene);

                // compatibility reasons: deprecated playAnimation puzzles don't
                // change repetitions
                if (!isPlayAnimCompat) {
                    action.repetitions = Infinity;
                }

                var timeScale = Math.abs(parseFloat(speed));
                if (rev)
                    timeScale *= -1;

                action.timeScale = timeScale;
                action.timeStart = from !== null ? from/frameRate : 0;
                if (to !== null) {
                    action.getClip().duration = to/frameRate;
                } else {
                    action.getClip().resetDuration();
                }
                action.time = timeScale >= 0 ? action.timeStart : action.getClip().duration;

                action.paused = false;
                action.play();

                // push unique callbacks only
                var callbacks = _pGlob.animMixerCallbacks;
                var found = false;

                for (var j = 0; j < callbacks.length; j++)
                    if (callbacks[j][0] == action && callbacks[j][1] == callback)
                        found = true;

                if (!found)
                    _pGlob.animMixerCallbacks.push([action, callback]);
            }
            break;
        case 'STOP':
            action.stop();

            // remove callbacks
            var callbacks = _pGlob.animMixerCallbacks;
            for (var j = 0; j < callbacks.length; j++)
                if (callbacks[j][0] == action) {
                    callbacks.splice(j, 1);
                    j--
                }

            break;
        case 'PAUSE':
            action.paused = true;
            break;
        case 'RESUME':
            action.paused = false;
            break;
        case 'SET_FRAME':
            var scene = getSceneByAction(action);
            var frameRate = getSceneAnimFrameRate(scene);
            action.time = from ? from/frameRate : 0;
            action.play();
            action.paused = true;
            break;
        }
    }

    for (var i = 0; i < animations.length; i++) {
        var animName = animations[i];
        if (animName)
            processAnimation(animName);
    }

    initAnimationMixer();
}



// bloom puzzle
function bloom(threshold, strength, radius) {
    appInstance.enablePostprocessing([{
        type: 'bloom',
        threshold: threshold,
        strength: strength,
        radius: radius
    }]);
}



/**
 * Retreive standard accessible textures for MeshNodeMaterial,
 * MeshStandardMaterial or MeshPhongMaterial. If "collectSameNameMats" is true
 * then all materials in the scene with the given name will be used for collecting
 * textures, otherwise will be used only the first found material (default behavior).
 */
function matGetEditableTextures(matName, collectSameNameMats) {

    var mats = [];
    if (collectSameNameMats) {
        mats = v3d.SceneUtils.getMaterialsByName(appInstance, matName);
    } else {
        var firstMat = v3d.SceneUtils.getMaterialByName(appInstance, matName);
        if (firstMat !== null) {
            mats = [firstMat];
        }
    }

    var textures = mats.reduce(function(texArray, mat) {
        var matTextures = [];
        switch (mat.type) {
            case 'MeshNodeMaterial':
                matTextures = Object.values(mat.nodeTextures);
                break;

            case 'MeshStandardMaterial':
                matTextures = [
                    mat.map, mat.lightMap, mat.aoMap, mat.emissiveMap,
                    mat.bumpMap, mat.normalMap, mat.displacementMap,
                    mat.roughnessMap, mat.metalnessMap, mat.alphaMap, mat.envMap
                ]
                break;

            case 'MeshPhongMaterial':
                matTextures = [
                    mat.map, mat.lightMap, mat.aoMap, mat.emissiveMap,
                    mat.bumpMap, mat.normalMap, mat.displacementMap,
                    mat.specularMap, mat.alphaMap, mat.envMap
                ];
                break;
            default:
                console.error('matGetEditableTextures: Unknown material type ' + mat.type);
                break;
        }

        Array.prototype.push.apply(texArray, matTextures);
        return texArray;
    }, []);

    return textures.filter(function(elem) {
        // check Texture type exactly
        return elem && (elem.constructor == v3d.Texture || elem.constructor == v3d.DataTexture);
    });
}



// replaceTexture puzzle
function replaceTexture(matName, texName, texUrlOrElem, doCb) {

    var textures = matGetEditableTextures(matName, true).filter(function(elem) {
        return elem.name == texName;
    });

    if (!textures.length)
        return;

    if (texUrlOrElem instanceof Promise) {

        texUrlOrElem.then(function(response) {
           processImageUrl(response);
        }, function(error) {});

    } else if (typeof texUrlOrElem == 'string') {

        processImageUrl(texUrlOrElem);

    } else if (texUrlOrElem instanceof HTMLVideoElement) {

        processVideo(texUrlOrElem);

    } else {

        return;

    }

    function processImageUrl(url) {

        var isHDR = (url.search(/\.hdr$/) > 0);

        if (!isHDR) {
            var loader = new v3d.ImageLoader();
            loader.setCrossOrigin('Anonymous');
        } else {
            var loader = new v3d.FileLoader();
            loader.setResponseType('arraybuffer');
        }

        loader.load(url, function(image) {
            // JPEGs can't have an alpha channel, so memory can be saved by storing them as RGB.
            var isJPEG = url.search(/\.(jpg|jpeg)$/) > 0 || url.search(/^data\:image\/jpeg/) === 0;

            textures.forEach(function(elem) {

                if (!isHDR) {
                    elem.image = image;
                } else {
                    // parse loaded HDR buffer
                    var rgbeLoader = new v3d.RGBELoader();
                    var texData = rgbeLoader.parse(image);

                    // NOTE: reset params since the texture may be converted to float
                    elem.type = v3d.UnsignedByteType;
                    elem.encoding = v3d.RGBEEncoding;

                    elem.image = {
                        data: texData.data,
                        width: texData.width,
                        height: texData.height
                    }

                    elem.magFilter = v3d.LinearFilter;
                    elem.minFilter = v3d.LinearFilter;
                    elem.generateMipmaps = false;
                    elem.isDataTexture = true;

                }

                elem.format = isJPEG ? v3d.RGBFormat : v3d.RGBAFormat;
                elem.needsUpdate = true;

                // update world material if it is using this texture
                var wMat = appInstance.worldMaterial;
                if (wMat)
                    for (var texName in wMat.nodeTextures)
                        if (wMat.nodeTextures[texName] == elem)
                            appInstance.updateEnvironment(wMat);

            });

            // exec once
            doCb();

        });
    }

    function processVideo(elem) {
        var videoTex = new v3d.VideoTexture(elem);
        videoTex.flipY = false;
        videoTex.name = texName;

        var videoAssigned = false;

        var mats = v3d.SceneUtils.getMaterialsByName(appInstance, matName);
        mats.forEach(function(mat) {

            if (mat.type != 'MeshNodeMaterial')
                return;

            for (var name in mat.nodeTextures) {

                textures.forEach(function(tex) {

                    if (mat.nodeTextures[name] == tex) {
                        mat.nodeTextures[name] = videoTex;
                    }

                });

            }

            mat.needsUpdate = true;
            videoAssigned = true;
        });

        if (videoAssigned)
            doCb();

    }
}



// whenMoved puzzle
function whenMoved(objNames, delta, period, cb_start, cb_move, cb_stop) {

    objNames = retrieveObjectNames(objNames);
    if (!objNames)
        return;

    function savePreviousCoords(objName, obj, prevIsMoving, frameCounter) {
        // GC optimization
        if (_pGlob.objMovementInfos[objName]) {
            var info = _pGlob.objMovementInfos[objName];

            info.prevPosX = obj.position.x;
            info.prevPosY = obj.position.y;
            info.prevPosZ = obj.position.z;
            info.prevRotX = obj.rotation.x;
            info.prevRotY = obj.rotation.y;
            info.prevRotZ = obj.rotation.z;
            info.prevScaX = obj.scale.x;
            info.prevScaY = obj.scale.y;
            info.prevScaZ = obj.scale.z;
            info.prevIsMoving = prevIsMoving;
            info.frameCounter = frameCounter;
        } else {
            var info = {
                prevPosX: obj.position.x,
                prevPosY: obj.position.y,
                prevPosZ: obj.position.z,
                prevRotX: obj.rotation.x,
                prevRotY: obj.rotation.y,
                prevRotZ: obj.rotation.z,
                prevScaX: obj.scale.x,
                prevScaY: obj.scale.y,
                prevScaZ: obj.scale.z,
                prevIsMoving: prevIsMoving,
                frameCounter: frameCounter
            };
            _pGlob.objMovementInfos[objName] = info;
        }

        return info;
    }

    function checkMoving(objName, obj) {

        var info = _pGlob.objMovementInfos[objName] ||
            savePreviousCoords(objName, obj, false, -1);

        info.frameCounter = info.frameCounter + 1;

        if ((info.frameCounter % period) != 0)
            return;

        var isMoving =
            Math.abs(obj.position.x - info.prevPosX) > delta ||
            Math.abs(obj.position.y - info.prevPosY) > delta ||
            Math.abs(obj.position.z - info.prevPosZ) > delta ||
            Math.abs(obj.rotation.x - info.prevRotX) > delta ||
            Math.abs(obj.rotation.y - info.prevRotY) > delta ||
            Math.abs(obj.rotation.z - info.prevRotZ) > delta ||
            Math.abs(obj.scale.x - info.prevScaX) > delta ||
            Math.abs(obj.scale.y - info.prevScaY) > delta ||
            Math.abs(obj.scale.z - info.prevScaZ) > delta;

        if (!info.prevIsMoving && isMoving) {
            cb_start();
            savePreviousCoords(objName, obj, true, info.frameCounter);
        } else if (info.prevIsMoving && isMoving) {
            cb_move();
            savePreviousCoords(objName, obj, true, info.frameCounter);
        } else if (info.prevIsMoving && !isMoving) {
            cb_stop();
            savePreviousCoords(objName, obj, false, info.frameCounter);
        } else {
            savePreviousCoords(objName, obj, false, info.frameCounter);
        }
    }

    function addToRender(objName) {

        var obj = getObjectByName(objName);
        if (!obj)
            return;

        appInstance.renderCallbacks.push(function() { checkMoving(objName, obj); });
    }

    for (var i = 0; i < objNames.length; i++) {

        var objName = objNames[i];
        if (!objName)
            continue;

        addToRender(objName);
    }
}



// enableRendering puzzle
function enableRendering() {
    appInstance.enableRendering();
}



// disableRendering puzzle
function disableRendering(enableSSAA) {
    appInstance.ssaaOnPause = enableSSAA;
    appInstance.disableRendering(1);
}



// everyFrame puzzle
function registerEveryFrame(callback) {
    if (typeof callback == "function")
        appInstance.renderCallbacks.push(callback);
}



handleAnnot(true, '1', 'awl-annotation', 'awl', 'ann_1');
handleAnnot(true, '2', 'back_cover-annotation', 'back_cover', 'ann_2');
handleAnnot(true, '3', 'big_knife-annotation', 'big_knife', 'ann_3');
handleAnnot(true, '4', 'bottle_opener-annotation', 'bottle_opener', 'ann_4');
handleAnnot(true, '5', 'can-opener-annotation', 'can_opener', 'ann_5');
handleAnnot(true, '6', 'corkscrew-annotation', 'corkscrew', 'ann_6');
handleAnnot(true, '7', 'front_cover-annotation', 'front_cover', 'ann_7');
handleAnnot(true, '8', 'hook-annotation', 'hook', 'ann_8');
handleAnnot(true, '9', 'saw-annotation', 'saw', 'ann_9');
handleAnnot(true, '10', 'scissors_annotation', 'scissors', 'ann_10');
handleAnnot(true, '11', 'small_knife-annotation', 'knife', 'ann_11');
handleAnnot(true, '12', 'toothpick-annotation', 'toothpick', 'ann_12');
handleAnnot(true, '13', 'tweezers_handle-annotation', 'tweezer', 'ann_13');
setHTMLElemStyle('display', 'none', ['ann_1', 'ann_3', 'ann_4', 'ann_5', 'ann_6', 'ann_8', 'ann_9', 'ann_10', 'ann_11'], false);

annotaion_visiable = true;

eventHTMLElem('click', 'annotation_button', true, function(event) {
  if (annotaion_visiable == true) {
    setHTMLElemStyle('display', 'none', ['ann_1', 'ann_2', 'ann_3', 'ann_4', 'ann_5', 'ann_6', 'ann_7', 'ann_8', 'ann_9', 'ann_10', 'ann_11', 'ann_12', 'ann_13'], false);
    annotaion_visiable = false;
    setCSSRuleStyle('backgroundImage', 'url(image/annotation_hidden_button.svg)', '.annotation-button', true,);
  } else {
    if (unfolded_knife == true) {
      setHTMLElemStyle('display', 'block', ['ann_1', 'ann_2', 'ann_3', 'ann_4', 'ann_5', 'ann_6', 'ann_7', 'ann_8', 'ann_9', 'ann_10', 'ann_11', 'ann_12', 'ann_13'], false);
    } else {
      setHTMLElemStyle('display', 'block', ['ann_2', 'ann_7', 'ann_12', 'ann_13'], false);
    }
    annotaion_visiable = true;
    setCSSRuleStyle('backgroundImage', 'url(image/annotation_visible_button.svg)', '.annotation-button', true,);
  }
});

unfolded_knife = false;

autoRotateCamera(true, 2);
registerOnClick(['ALL_OBJECTS'], function() {
  autoRotateCamera(false, 2);
  registerSetTimer('autorotation', 10, function() {
    autoRotateCamera(true, 2);
  }, Infinity);
}, function() {});

setHTMLElemStyle('display', 'block', ['left_panel', 'right_panel'], true);

volume(loadSoundAdv('sounds/unfold.mp3'), 0.2);
volume(loadSoundAdv('sounds/fold.mp3'), 0.2);

eventHTMLElem('click', 'unfold_button', true, function(event) {
  if (unfolded_knife == false) {
    playSound(loadSoundAdv('sounds/unfold.mp3'), false);

    operateAnimation('PLAY', getAnimations(['GROUP', 'animated_parts']), null, null, 'LoopOnce', 1,
            function() {
      unfolded_knife = true;
      setHTMLElemStyle('display', 'block', ['ann_1', 'ann_3', 'ann_4', 'ann_5', 'ann_6', 'ann_8', 'ann_9', 'ann_10', 'ann_11'], false);
    }, undefined, false);

        }
});

eventHTMLElem('click', 'fold_button', true, function(event) {
  if (unfolded_knife == true) {
    playSound(loadSoundAdv('sounds/fold.mp3'), false);

    operateAnimation('PLAY', getAnimations(['GROUP', 'animated_parts']), null, null, 'LoopOnce', 1,
            function() {
      unfolded_knife = false;
      setHTMLElemStyle('display', 'none', ['ann_1', 'ann_3', 'ann_4', 'ann_5', 'ann_6', 'ann_8', 'ann_9', 'ann_10', 'ann_11'], false);
    }, undefined, true);

        }
});

bloom(0.9, 0.3, 0.6);

eventHTMLElem('click', 'wood_button', true, function(event) {
  replaceTexture('cover', 'basecolor', './wood_basecolor.jpg', function() {});
  replaceTexture('cover', 'OclussionRoughnessMetallic', './wood_OclussionRoughnessMetallic.jpg', function() {});
  replaceTexture('cover', 'normal', './wood_normal.jpg', function() {});
});
eventHTMLElem('click', 'plastic_button', true, function(event) {
  replaceTexture('cover', 'basecolor', './plastic_basecolor.jpg', function() {});
  replaceTexture('cover', 'OclussionRoughnessMetallic', './plastic_OclussionRoughnessMetallic.jpg', function() {});
  replaceTexture('cover', 'normal', './plastic_normal.jpg', function() {});
});
eventHTMLElem('click', 'carbon_button', true, function(event) {
  replaceTexture('cover', 'basecolor', './carbon_basecolor.jpg', function() {});
  replaceTexture('cover', 'OclussionRoughnessMetallic', './carbon_OclussionRoughnessMetallic.jpg', function() {});
  replaceTexture('cover', 'normal', './carbon_normal.jpg', function() {});
});

camera_moving = false;

whenMoved('Camera', 0.001, 5, function() {
  camera_moving = true;
}, function() {}, function() {
  camera_moving = false;
});

registerEveryFrame(function() {
  if (camera_moving == true) {
    enableRendering();
  } else {
    disableRendering(true);
  }
});

appInstance.printPerformanceInfo();



} // end of PL.init function

})(); // end of closure

/* ================================ end of code ============================= */
