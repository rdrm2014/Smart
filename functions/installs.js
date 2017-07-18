/**
 * Created by ricardomendes on 15/06/17.
 */
var src = process.cwd() + '/';
var InstallModel = require(src + 'models/install');

// installs
module.exports = {
    installGetAll: function () {
        InstallModel.find(function (err, installs) {
            if (!err) {
                return installs;
            } else {
                res.statusCode = 500;
                return {error: 'Server error'};
            }
        });
    },
    installShow: function installShow(idInstall) {
        InstallModel
            .findOne({_id: idInstall})
            .exec(function (err, install) {
                if (err) return handleError(err);

                return install;
            });
    }
};
