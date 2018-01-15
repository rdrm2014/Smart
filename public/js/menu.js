/**
 * Created by ricardomendes on 07/04/16.
 */

// ----------------------------
// -----Project Management-----
// ----------------------------

/**
 * display a list of versions with date and comments
 */
function loadInterface() {

    var body =
        '<div style="max-height: 500px; overflow-y: scroll;">' +
        '<table class="table" style="table-layout: fixed;">' +
        '<tr>' +
        '<th>Data</th>' +
        '<th>Hora</th>' +
        '<th class="col-lg-6 col-md-6">Comentário</th>' +
        '<th class="col-lg-3 col-md-3">Carregar</th>' +
        '</tr>';

    for (var i = 0, n = versions.length; i < n; i++) {

        var timestamp = versions[i]['data']['date'].split(/\s+/);

        body +=
            '<!-- informações da versão -->' +
            '<tr id="version-info-' + versions[i]['id'] + '">' +
            '<td>' + timestamp[0] + '</td>' +
            '<td>' + timestamp[1] + '</td>' +
            '<td style="white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">' + (versions[i]['comentario'] || 'Nenhum') + '</td>' +
            '<td>' +
            '<button class="btn btn-default" title="Carregar" onclick="loadVersion(' + versions[i]['id'] + ')"><span class="glyphicon glyphicon-folder-open"></span></button>' +
            '<button class="btn btn-danger" title="Eliminar" onclick="deleteVersion(' + versions[i]['id'] + ')" style="margin-left: 5px;"><span class="glyphicon glyphicon-trash"></span></button>' +
            '</td>' +
            '</tr>' +
            '<!-- apagar versão -->' +
            '<tr class="bg-danger hidden" id="version-delete-' + versions[i]['id'] + '">' +
            '<td colspan="3">Confirmar eliminar?</td>' +
            '<td>' +
            '<button class="btn btn-default" title="Confirmar" onclick="confirmDeleteVersion(' + versions[i]['id'] + ')"><span class="glyphicon glyphicon-ok"></span></button>' +
            '<button class="btn btn-danger" title="Cancelar" onclick="cancelDeleteVersion(' + versions[i]['id'] + ')"><span class="glyphicon glyphicon-ban-circle"></span></button>' +
            '</td>' +
            '</tr>' +
            '<!-- dummie para alternar cor nas linhas corretamente -->' +
            '<tr class="hidden"></tr>';
    }

    body +=
        '</table>' +
        '</div>';

    var footer = '<button type="button" class="btn btn-sm btn-default" data-dismiss="modal">Fechar</button>';
    var modalClass = 'modal-md modal-cable';

    buildModal('Carregar Projeto', body, footer, modalClass);
}

/**
 * load studio objects from the database and updates the application
 * @param id - planta id
 * @param async - async request boolean
 * @param animate - update the application
 */
function load(id, async, animate) {

    if (typeof async == 'undefined')
        async = true;

    if (typeof animate == 'undefined')
        animate = true;

    // perform ajax request
    $.ajax({
        type: 'POST',
        url: '/planta/' + id + '/load',
        crossDomain: true,
        data: {'id': id},
        dataType: 'json',
        async: async,
        beforeSend: function () {
            if (animate)
                $('#loader').removeClass('hidden'); // show loading screen
        },
        success: function (response) {

            $('svg').attr('viewBox', null);
            $('#planta').find('*').css('stroke-width', '');

            applications = response['applicationTypes'];
            applicationModels = response['applicationModels'];
            cableTypes = response['cableTypes'];
            components = response['components'];
            diameters = response['diameters'];
            planta = response['planta'];
            qualities = response['qualities'];
            size = response['size'];
            versions = response['versions'];
            vertical = response['planta']['vertical'];

            insertTypes(response['componentTypes']);

            if (animate) {

                // update scale
                if (versions[0]['escala'])
                    scale = versions[0]['escala'];

                // reset nodes and links
                resetStudio();
                cables = response['cables'];
                floors = response['floors'];
                insertNodes(response['nodes']);
                insertLinks(response['links']);
                insertTubes(response['tubes']);
                updateMatrix();

                if (!vertical)
                    insertBackwardsAttenuation(response['attenuation']);
                else
                    updateFloorsSVG();
            } else {
                nodes.length = 0;
                links.length = 0;
                tubes.length = 0;
                cables = response['cables'];
                insertNodes(response['nodes']);
                insertLinks(response['links']);
                insertTubes(response['tubes']);
            }
        },
        error: function (response, status, error) {
            logErrors(response, status, error, 'Ocorreu um erro ao carregar o projeto.');
        },
        complete: function () {
            if (animate) {

                verticalTheme();
                update();
                resizeWorkspace();
                saveOperation();
                resetOperations();
                applyPanZoom('#studio svg'); // studio zoom properties
                scalePlanta(0);
                restart();

                $('#loader').addClass('hidden');
                $('body').css('overflow-y', 'initial');
            }
        }
    });
}

/**
 * build a modal form for saving the project
 */
function saveChangesForm() {

    var body = '<textarea class="form-control input-sm" rows="5" id="comment" placeholder="Inserir comentário..."></textarea>';
    var footer =
        '<button type="button" class="btn btn-sm btn-default" data-dismiss="modal">Fechar</button>' +
        '<button type="button" class="btn btn-sm btn-primary" onclick="saveChanges()">Guardar</button>';
    var modalClass = 'modal-sm';

    buildModal('Gravar alterações', body, footer, modalClass);
}

/**
 * save studio objects to database
 */

/**
 * guarda alterações do estúdio na base de dados
 * @param async ligação assíncrona?
 */
function saveChanges(async) {

    async = (typeof async === 'undefined') ? true : async; // valor por defeito

    closeModal(); // close the modal window
    correctID(); // apply corrections to ID's before sending the data

    var data = {
        'id': plantaID,
        'nodes': nodes,
        'links': links,
        'floors': floors,
        'tubes': tubes,
        'cables': cables,
        'scale': scale,
        'size': size,
        'comment': $('#comment').val()
    };

    if (vertical)
        data['planta'] = planta;

    // perform ajax request
    $.ajax({
        type: 'POST',
        url: '/planta/' + plantaID + '/save',
        crossDomain: true,
        data: data,
        dataType: 'json',
        async: async,
        error: function (response, status, error) {
            logErrors(response, status, error, 'Ocorreu um erro ao guardar as alterações.');
        },
        success: function (response) {
            versions.unshift(response.version);
        }
    });
}


/**
 * delete all elements inside the whiteboard and reset the arrays
 */
function resetStudio() {
    // reset variables
    nodes = [];
    links = [];
    tubes = [];
    cables = [];
    lastNodeId = 0;
    // update layout items
    updateMatrix();
    update();
    saveOperation();
    restart();
}

/**
 * undo operations
 */
function undo() {
    if (--currentOperation >= 0) {
        nodes = deepCopy(operations[currentOperation].nodes);
        links = deepCopy(operations[currentOperation].links);
        tubes = deepCopy(operations[currentOperation].tubes);
        cables = deepCopy(operations[currentOperation].cables);
        size = operations[currentOperation].size;
        scale = operations[currentOperation].scale;

        indexesToObjects(nodes, links, tubes, function () {
            updateMatrix();
            update();
            updateStrokeWidth();
            restart();
        });
    } else {
        currentOperation++;
    }
}

/**
 * redo operations
 */
function redo() {
    if (++currentOperation < operations.length) {
        nodes = deepCopy(operations[currentOperation].nodes);
        links = deepCopy(operations[currentOperation].links);
        tubes = deepCopy(operations[currentOperation].tubes);
        cables = deepCopy(operations[currentOperation].cables);
        size = operations[currentOperation].size;
        scale = operations[currentOperation].scale;

        indexesToObjects(nodes, links, tubes, function () {
            updateMatrix();
            update();
            updateStrokeWidth();
            restart();
        });
    } else {
        currentOperation--;
    }
}

// Inspection ---------------------------------------------------------------------------------------------------------

/**
 * check if the circuit follows the ITED norms
 */
function inspect() {

    /** RULES **/

    var correctness = true;
    var html = '<div class="modal-inspection">';

    // RECOMENDAR CAIXA DE PASSAGEM QUANDO DISTANCIA DO CABO > 15m
    for (var i = 0, n = links.length; i < n; i++) {
        if (links[i].distance * scale > 15) {
            correctness = false;

            html += '<p><span class="glyphicon glyphicon-remove text-danger"></span> recomenda-se a instalação de uma caixa de passagem entre o nó ' + getTipoNo(links[i]['source']) + ' nº. ' + numberByType(nodes.indexOf(links[i]['source']));
            if (links[i]['source']['label'])
                html += ' (' + links[i]['source']['label'] + ')';
            html += ' e o nó ' + getTipoNo(links[i]['target']) + ' nº. ' + numberByType(nodes.indexOf(links[i]['target']));
            if (links[i]['target']['label'])
                html += ' (' + links[i]['target']['label'] + ')';
            html += '</p>';
        }
    }

    // VERIFICAR COMPRIMENTO DA LIGACAO ENTRE ATI->ATE & ATI->TT <= 90m
    for (i = 0, n = links.length; i < n; i++) {
        if ((
                ((getTipoNo(links[i].source) == 'ATI' && getTipoNo(links[i].target) == 'ATE') || (getTipoNo(links[i].source) == 'ATE' && getTipoNo(links[i].target) == 'ATI')) ||
                ((getTipoNo(links[i].source) == 'ATI' && getTipoNo(links[i].target) == 'TT') || (getTipoNo(links[i].source) == 'TT' && getTipoNo(links[i].target) == 'ATI'))
            ) && (links[i].distance * scale) > 90) {
            correctness = false;

            html += '<p><span class="glyphicon glyphicon-remove text-danger"></span> a ligação entre o nó ' + getTipoNo(links[i]['source']) + ' nº. ' + numberByType(nodes.indexOf(links[i]['source']));
            if (links[i]['source']['label'])
                html += ' (' + links[i]['source']['label'] + ')';
            html += ' e o nó ' + getTipoNo(links[i]['target']) + ' nº. ' + numberByType(nodes.indexOf(links[i]['target']));
            if (links[i]['target']['label'])
                html += ' (' + links[i]['target']['label'] + ')';
            html += ' tem um tamanho superior a 90m</p>';
        }
    }

    // INSTALACAO DE PAT OBRIGATORIA EM PLANTAS VERTICAIS
    if (vertical) {
        var hasPAT = false;
        for (i = 0, n = nodes.length; i < n; i++)
            if (getTipoNo(nodes[i]) == 'PAT')
                hasPAT = true;

        if (!hasPAT) {
            correctness = false;
            html += '<p><span class="glyphicon glyphicon-remove text-danger"></span> a instação de uma PAT é obrigatória</p>';
        }
    }

    // VERIFICAR SE TODOS OS NOS ESTAO LIGADOS
    nodeLoop:
        for (i = 0; i < nodes.length; i++) {
            for (var j = 0, m = links.length; j < m; j++)
                if (links[j].source.id == nodes[i].id || links[j].target.id == nodes[i].id)
                    continue nodeLoop;

            correctness = false;

            html += '<p><span class="glyphicon glyphicon-remove text-danger"></span> o nó ' + getTipoNo(nodes[i]) + ' nº. ' + numberByType(i);
            if (nodes[i]['label'])
                html += ' (' + nodes[i]['label'] + ')';
            html += ' está isolado.</p>';
        }

    // VERIFICAR SE OS TUBOS TÊM O DIAMETRO MINIMO
    for (i = 0, n = tubes.length; i < n; i++) {
        var minDiametro = minTubeDiameter(tubes[i]);
        if (tubes[i]['diametro'] < minDiametro) {
            correctness = false;
            var no1 = tubes[i]['link']['source'];
            var no2 = tubes[i]['link']['target'];
            html +=
                '<p><span class="glyphicon glyphicon-remove text-danger"></span>' +
                ' o tubo (' + tubes[i]['id'] + ') entre os componentes (' +
                getTipoNo(no1) + ' nº. ' + numberByType(nodes.indexOf(no1)) +
                ') e (' +
                getTipoNo(no2) + ' nº. ' + numberByType(nodes.indexOf(no2)) +
                ') não tem diâmetro suficiente (min. ' + Math.round(minDiametro) + ' mm)' +
                '</p>';
        }
    }

    html += '</div>';

    /** PRINT ERROR MESSAGES */

    var footer = '<button type="button" class="btn btn-sm btn-default" data-dismiss="modal">Fechar</button>';

    if (correctness)
        html = '<div class="modal-inspection"><p><span class="glyphicon glyphicon-ok text-success"></span>Diagrama sem problemas!<p></div>';

    var modalClass = 'modal-md';

    buildModal('Inspeção do diagrama', html, footer, modalClass);
}

/**
 * Ativa/Desativa a ferramenta de escala
 */
function setScale() {
    scaling = !scaling;
}

/**
 * Atualiza a escala da planta
 */
function updateScale() {

    var scaleDimensionElement = $('#scalebar_dimension');
    var scaleDimension = scaleDimensionElement.val();
    var scaleDimensionForm = scaleDimensionElement.parent();
    scaleDimensionForm.removeClass('has-error');

    // verifica erros no input
    if (!scaleDimension || !parseInt(scaleDimension)) {
        scaleDimensionForm.addClass('has-error');
        return;
    }

    // obtem a dimensão da régua
    var point1 = {x: scale_line.attr('x1'), y: scale_line.attr('y1')};
    var point2 = {x: scale_line.attr('x2'), y: scale_line.attr('y2')};

    // atualiza a escala
    scale = scaleDimension / 100 / computeDistance(point1, point2);
    scale_line.classed('hidden', true);

    updateStrokeWidth();
    closeModal();
    saveOperation();
}

/**
 * remove nodes which are not connected to anything
 */
function removeIsolatedNodes() {
    for (var i = 0, n = nodes.length; i < n; i++) {
        var isolated = true;
        for (var j = 0, m = links.length; j < m; j++) {
            if (compareNodes(nodes[i], links[j].source) || compareNodes(nodes[i], links[j].target)) {
                isolated = false;
                break;
            }
        }
        if (isolated) {
            deleteNode(nodes[i]);
            saveOperation();
        }
    }
    restart();
}

/**
 * save a SVG graph
 */
function saveSVG(title, main) {

    // valores por defeito
    if (typeof title == 'undefined')
        title = 'diagrama';
    if (typeof main == 'undefined')
        main = false;

    var stylesheet;
    for (var i = 0, n = document.styleSheets.length; i < n; i++) {
        if (document.styleSheets[i].href.indexOf('bundles/ieetaited/theme/css/theme.css') != -1) {
            stylesheet = document.styleSheets[i];
            break;
        }
    }

    var color1, color2;
    for (i = 0, n = stylesheet.rules.length; i < n; i++) {
        if (stylesheet.rules[i].selectorText == '.color-1')
            color1 = stylesheet.rules[i].cssText;
        if (stylesheet.rules[i].selectorText == '.color-2')
            color2 = stylesheet.rules[i].cssText;
    }

    var filename = title + '.svg';

    if (main) {
        var studioClone = $('#studio').clone();
        var svgClone = studioClone.find('svg');
        svgClone.find('#svg-pan-zoom-controls').remove();
        svgClone
            .prepend('<style>' + color1 + ' ' + color2 + ' .hidden { display: none; } text { font-family: arial; }</style>')
            .attr('width', '100%')
            .attr('height', '100%')
            .attr('style', null);
        svgImage = studioClone.html();
    }
    else {
        studioClone = $('#map').clone();
        studioClone.find('.viewport').attr('transform', null);
        studioClone.find('#svg-pan-zoom-controls').remove();

        var svgImage =
            '<svg version="1.1" xmlns="http://www.w3.org/2000/svg">' +
            '<style>' + color1 + ' ' + color2 + ' .hidden { display: none; } text { font-family: arial; }</style>' +
            studioClone.html() +
            '</svg>';
    }

    var image = 'data:image/svg+xml;utf8,' + svgImage;

    // for non-IE
    if (!window.ActiveXObject) {
        var save = document.createElement('a');
        save.hreflang = 'image/svg+xml';
        save.href = image;
        save.target = '_blank';
        save.download = filename || 'unknown';

        var event = document.createEvent('Event');
        event.initEvent('click', true, true);
        save.dispatchEvent(event);
        (window.URL || window.webkitURL).revokeObjectURL(save.href);
    }

    // for IE
    else if (!!window.ActiveXObject && document.execCommand) {
        var _window = window.open(image, '_blank');
        _window.document.close();
        _window.document.execCommand('SaveAs', true, filename || image);
        _window.close();
    }
}

///////////////// Sub-Menu Top /////////////////
/**
 * toggle the visibility of node ID's
 */
function toggleNodeID() {
    hideNodeID = !hideNodeID;
    restart();
}

/**
 * toggle between cable/tube view
 */
function toggleView() {
    view = $('input:radio[name=toggle-view]:checked').val();
    restart();
}

///////////////// Menu Lateral /////////////////
/**
 * resize the svg
 * @param value scale value
 */
function scalePlanta(value) {
    size += value;
    updateStrokeWidth();
    restart();
    saveOperation();
}
