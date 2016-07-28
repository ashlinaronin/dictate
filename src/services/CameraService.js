(function(){
	'use strict';

	angular
        .module('faceworld')
		.factory('CameraService', Camera);

        Camera.$inject = ['$q', 'MicrophoneService'];

        function Camera($q, MicrophoneService) {

            var cameraDeferred = $q.defer();
            var camera = new THREE.PerspectiveCamera(90, window.innerWidth / window.innerHeight, 0.1, 100000);
			var origin = new THREE.Vector3(0, 0, 0);

			camera.position.z = 3;
			camera.lookAt(origin);
			camera.up = new THREE.Vector3(0, 1, 0);
            cameraDeferred.resolve(camera);

			// MicrophoneService.subscribe(_rotate);

			function _rotate(speechResult) {
				camera.position.x += (speechResult.length * 0.01);
			}

            return {
                getCamera: function() {
                    return cameraDeferred.promise;
                }
            }
        }

})();
