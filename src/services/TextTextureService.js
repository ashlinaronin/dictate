(function(){
	'use strict';

	angular
        .module('faceworld')
		.factory('TextTextureService', TextTexture);

        TextTexture.$inject = ['$q'];

        function TextTexture($q) {

            var canvas, context;
            var textureDeferred = $q.defer();

            // @immediate
            _createElements();
            _writeTexture();

            return {
                getTextCanvas: _getTextCanvas
            }

            function _getTextCanvas() {
                return textureDeferred.promise;
            }

            function _createElements() {
                canvas = document.createElement('canvas');
                context = canvas.getContext('2d');
            }

            function _writeTexture() {
                context.font = "48px serif";
                context.fillStyle = '#ffffff';
                context.fillText("Hello world", 10, 50);
                textureDeferred.resolve(canvas);
            }

        }

})();
