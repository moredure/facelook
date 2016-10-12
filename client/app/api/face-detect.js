const $ = require('jquery');

function uploadImage(image) {
	return $.post('/detect', { data: image });
}

module.exports = uploadImage;
