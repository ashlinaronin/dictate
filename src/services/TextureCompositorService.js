(function(){
	'use strict';

	angular
        .module('faceworld')
		.factory('TextureCompositorService', TextureCompositor);

        TextureCompositor.$inject = ['$q'];

        function TextureCompositor($q) {

            var canvas, context;
            var textureDeferred = $q.defer();

            // @immediate
            _createElements();
            _combineCanvasses();

            return {
                getTextAndWebcamTexture: _getTextAndWebcamTexture
            }

            function _getTextAndWebcamTexture() {
                return textureDeferred.promise;
            }

            function _createElements() {
                canvas = document.createElement('canvas');
                context = canvas.getContext('2d');
            }

            function _combineCanvasses(canvas1Promise, canvas2Promise) {
                $q.all({
                    canvas1: canvas1Promise,
                    canvas2: canvas2Promise
                }).then(function(resolved) {
                    // write contents of canvas 2 over canvas 1
                    var newCanvas = 'placeholder for contents of two canvases combined';
                    textureDeferred.resolve(newCanvas);
                });
            }

        }

})();
