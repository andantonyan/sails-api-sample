/**
 * ImageController
 *
 * @description :: Server-side logic for managing Images
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
	getUploadUrl: function (req, res) {
    req.checkQuery('type', sails.__('imageTypeRequired')).notEmpty();
    req.checkQuery('type',  sails.__('invalidImageType')).isInArray(['image/png']);

    var errors = req.validationErrors();

    if (errors) {
      return res.badRequest({
        success: false,
        message: 'validationError',
        error: errors
      });
    }

    var signData = ImageService.sign(req.query.type, 'images/' + req.user.id);
    res.ok({
      success: true,
      data: signData
    });
  }
};

