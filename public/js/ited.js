/**
 *
 * @param input
 * @param image
 */
function readURL(input, image) {
    if (input.files && input.files[0]) {
        var reader = new FileReader();
        reader.onload = function (e) {
            image.attr('src', e.target.result);
            input.attr('value', e.target.result);
        };
        reader.readAsDataURL(input.files[0]);
    }
}

/**
 * confirms the deletion of an image
 * @param url controller url for image deletion
 */
function deleteImage(callback) {
    if (confirm('Tem a certeza que deseja apagar a imagem?'))
        navigate(callback);
    else
        return false;
}

/**
 * navigate to the given url
 * @param url destination url
 */
function navigate(url) {
    location.href = url;
}

/**
 * remove accents from a string
 * @returns {string} processed string
 */
String.prototype.stripAccents = function () {

    var in_chrs = 'àáâãäçèéêëìíîïñòóôõöùúûüýÿÀÁÂÃÄÇÈÉÊËÌÍÎÏÑÒÓÔÕÖÙÚÛÜÝ';
    var out_chrs = 'aaaaaceeeeiiiinooooouuuuyyAAAAACEEEEIIIINOOOOOUUUUY';
    var transl = {};

    eval('var chars_rgx = /[' + in_chrs + ']/g');

    for (var i = 0; i < in_chrs.length; i++)
        transl[in_chrs.charAt(i)] = out_chrs.charAt(i);

    return this.replace(chars_rgx, function (match) {
        return transl[match];
    });
};

/**
 * formats the string for search operations
 * @param string input string
 * @returns {string} output string
 */
function parseString(string) {
    return string.trim().toLowerCase().stripAccents();
}

/**
 * confirms users desire to delete a "Obra"
 * @param callback user action
 */
function deleteObra(callback) {
    if (confirm('Tem a certeza que deseja eliminar este projeto e todas as plantas associadas?')) {
        navigate(callback);
    }
}

/**
 * confirms users desire to duplicate a "Planta"
 * @param callback user action
 */
function duplicatePlanta(callback) {
    if (confirm('Tem a certeza que deseja duplicar esta planta?')) {
        navigate(callback);
    }
}

/**
 * confirms users desire to delete a "Planta"
 * @param callback user action
 */
function deletePlanta(callback) {
    if (confirm('Tem a certeza que deseja eliminar esta planta?')) {
        navigate(callback);
    }
}

/**
 * returns the max with of a set of elements
 * @param elements set of elements
 */
function getMaxWidth(elements) {
    var max = 0;
    $(elements).each(function () {
        var width = $(this).width();
        if (width > max) {
            max = width;
        }
    });
    return max;
}
/**
 * Format all labels in form
 */
function formatLabels() {
    var maxWidth = 0;
    var inputs = $('.input-group-addon').find('label');
    inputs.css('width', '');
    inputs.each(function () {
        if ($(this).outerWidth() > maxWidth) {
            maxWidth = $(this).outerWidth();
        }
    });
    inputs.css('width', maxWidth + 'px');
}

$(function() {
    formatLabels();
});

/**
 * confirms users exit system
 * @param callback user action
 */
function exitSystem(callback) {
    if (confirm('Tem a certeza que deseja sair do sistema?')) {
        navigate(callback);
    }
}