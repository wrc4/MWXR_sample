const dispatchCustomEvent = (type, detail) => {
  window.dispatchEvent(new CustomEvent(type, {
    detail: typeof cloneInto !== 'undefined' ? cloneInto(detail, window) : detail
  }));
};

window.addEventListener('message', function(event) {
  // Assuming you trust the sender
  // console.log('111 Received message:', event.data);
  // console.dir(event);
  if (event.data.type == 'MWXR') {
    console.log('Received pose:', event.data.q);
    dispatchCustomEvent('webxr-pose', {
      position: [0, 1.6, 0],
      quaternion: [event.data.q.x, event.data.q.y, event.data.q.z, event.data.q.w]
    });
  }
});

// Set up listeners for events coming from EmulatedXRDevice.

window.addEventListener('device-pose', event => {
  // port.postMessage({
  //   action: 'device-pose',
  //   position: event.detail.position,
  //   quaternion: event.detail.quaternion
  // });
}, false);

window.addEventListener('device-input-pose', event => {
  // port.postMessage({
  //   action: 'device-input-pose',
  //   objectName: event.detail.objectName,
  //   position: event.detail.position,
  //   quaternion: event.detail.quaternion
  // });
}, false);

window.addEventListener('device-enter-immersive', event => {
	console.log('device-enter-immersive');
  // Test with a custom pose
	//dispatchCustomEvent('webxr-pose', {
  //    position: [0, 1.6, 0],
  //    quaternion: [0.1, 1, 0, 1]
  //  });

  // port.postMessage({
  //   action: 'device-enter-immersive'
  // });
}, false);

window.addEventListener('device-leave-immersive', event => {
  // port.postMessage({
  //   action: 'device-leave-immersive'
  // });
}, false);

// Set up listeners for requests coming from EmulatedXRDevice.
// Send back the response with the result.

//// Disable webxr-virtual-room
// window.addEventListener('webxr-virtual-room-request', event => {
//   fetch(chrome.runtime.getURL('assets/hall_empty.glb')).then(response => {
//     return response.arrayBuffer();
//   }).then(buffer => {
//     dispatchCustomEvent('webxr-virtual-room-response', {
//       buffer: buffer
//     });
//   });
// }, false);


// function to load script in a web page

const loadScript = source => {
  const script = document.createElement('script');
  script.textContent = source;
  (document.head || document.documentElement).appendChild(script);
  script.parentNode.removeChild(script);
};

// Synchronously adding WebXR polyfill because
// some applications for example Three.js WebVR examples
// check if WebXR is available by synchronously checking
// navigator.xr , window.XR or whatever when the page is loaded.

loadScript(`
  (function() {
    (` + WebXRPolyfillInjection + `)();
    const polyfill = new CustomWebXRPolyfill();
    //console.log(this); // to check if loaded
  })();
`);

// send the configuration parameters to the polyfill as an event
dispatchCustomEvent('webxr-device-init', {
  deviceDefinition: {
    "id": "Oculus Quest",
    "name": "Oculus Quest",
    "modes": [
      "inline",
      "immersive-vr"
    ],
    "headset": {
      "hasPosition": true,
      "hasRotation": true
    },
    "controllers": [
      {
        "id": "Oculus Touch V2 (Right)",
        "buttonNum": 7,
        "primaryButtonIndex": 0,
        "primarySqueezeButtonIndex": 1,
        "hasPosition": true,
        "hasRotation": true,
        "hasSqueezeButton": true
      },
      {
        "id": "Oculus Touch V2 (Left)",
        "buttonNum": 7,
        "primaryButtonIndex": 0,
        "primarySqueezeButtonIndex": 1,
        "hasPosition": true,
        "hasRotation": true,
        "hasSqueezeButton": true
      }
    ]
  },
  stereoEffect: true
});
