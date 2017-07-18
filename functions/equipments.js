/**
 * Created by ricardomendes on 15/06/17.
 */
var src = process.cwd() + '/';
var EquipmentModel = require(src + 'models/equipment');

// Equipments
module.exports = {
    equipmentGetAll: function (req) {
        EquipmentModel.find({owner: req.user}, function (err, equipments) {
            if (!err) {
                return equipments;
            } else {
                res.statusCode = 500;
                return {error: 'Server error'};
            }
        });
    },
    equipmentShow: function (req) {
        EquipmentModel
            .findOne({_id: req.query['id'], owner: req.user})
            .populate('install') // only return the Persons name
            .exec(function (err, equipment) {
                if (err) return handleError(err);

                return equipment;
            });
    }
};