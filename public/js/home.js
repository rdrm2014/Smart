/**
 * Created by ricardomendes on 22/11/17.
 */
/**
 * confirms users desire to delete a "Install"
 * @param callback user action
 */
function deleteObject(callback) {
    if (confirm('Are you sure?')) {
        //this.parentNode.submit();
        return callback();
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
 * navigate to the given url
 * @param url destination url
 */
function navigate(url) {
    location.href = url;
}
