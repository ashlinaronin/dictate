(function(){
	'use strict';

	angular
        .module('faceworld')
		.factory('HeadService', Head);

        Head.$inject = ['$q', 'LoadingManagerService'];

        function Head($q, LoadingManagerService) {

            var objLoader;
            var bigHeadDeferred = $q.defer();
            var headMaterial = new THREE.MeshBasicMaterial({
            	color: 0xffffff,
            	side: THREE.BackSide
            });

            // Start loading objs as soon as we have a loading manager
            _startLoading();

            function _startLoading() {
                LoadingManagerService.getLoadingManager().then(function(manager) {
                    objLoader = new THREE.OBJLoader(manager);
                    _createBigHead(160);
                });
            }

            function _createBigHead(size) {
                objLoader.load('assets/young_boy_head.obj', function(object) {
                    object.traverse(function(child) {
                        if (child instanceof THREE.Mesh) {
                            child.material = headMaterial;
                        }
                    });
                    object.scale.set(size, size, size);
                    object.position.set(0, -225, 0);

                    bigHeadDeferred.resolve(object);
                });
            }

            /* Return a random integer between min (inclusive) and max (inclusive).
            ** Thanks to MDN. */
            function _getRandomInt(min, max) {
                return Math.floor(Math.random() * (max - min + 1)) + min;
            }

            return {
                getBigHead: function() {
                    return bigHeadDeferred.promise;
                }
			}

        }

})();
