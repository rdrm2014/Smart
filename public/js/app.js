// -------------------
// -----Variables-----
// -------------------

// studio variables
var ati; // ati node ID
var ate; // ate node ID
var hideNodeID = false; // visibility of node IDs
var hideGrid = false; // visibility of grid
var lastNodeId = 0; // last node ID
var obraID = -1; // obra ID
var panZoom; // pan/zoom tool
var plantaID = -1; // planta ID
var scale = 1; // blueprint scale
var side = 50; // rect dimension
var size; // svg scale
var status; // current operation
var vertical = false; // blueprint type (horizontal/vertical)
var view = $('input:radio[name=toggle-view]:checked').val(); // cable/tube view
var width, height; // studio dimensions
var sizeSquare = 1000;

// event variables
var currentOperation = -1; // current operation
var draggingNode = false; // dragging node action
var holdPan = false; // pan viewport vs. drag elements
var lastKeyDown = -1; // last key pressed
var mouse = {x: 0, y: 0}; // mouse pointer position
var mousedown = false; // mouse down status
var mousedown_link = null; // target link on mousedown
var mousedown_node = null; // target node on mousedown
var mouseup_node = null; // target node on mouseup
var selected_node = null; // clicked node
var selected_link = null; // clicked link
var scaling = false; // is system scalling
var showing_tooltip = false; // is system showing a tooltip

// data structure
var applicationModels = []; // node application models
var applications = []; // application list
var basket = []; // material list
var cables = []; // cable list
//var cableColor = {CATV: '#BE0712', MATV: '#BE0712', FO: '#1AAE54', PC: '#1689E7'}; // cable type color
var cableColor = {CC: '#BE0712', FO: '#1AAE54', PC: '#1689E7'}; // cable type color
var cableTypes = []; // cable types list
var components; // component list
var diameters = []; // tube diameters list
//var excludeList = ['CATV', 'CEMU', 'Curva', 'CVM', 'PAT', 'Repartidor', 'SMATV']; // don't show recommendations for this nodes
var excludeList = ['CEMU', 'Curva', 'CVM', 'PAT', 'Repartidor']; // don't show recommendations for this nodes
var floors = []; // floors list
var links = []; // link list
var matrix = []; // node matrix
var nodes = []; // node list
var operations = []; // operations list
var pathToCC = []; // cable pathes to the CC
var pathToATE = []; // cable pathes to the ATE
var planta; // planta info
var qualities = []; // cable qualities list
var shoppingCart = []; // list of selected materials
var tubes = []; // tube list
var tiposComponente = []; // lista de tipos de componente
var versions = []; // version list
var typeGraph;

// tt nodes svg for different combinations
var ttSvg = {
    CC: '<rect width="1000" height="1000" fill="#BE0712"/><text x="500" y="625" fill="white" font-family="Arial" font-size="350" text-anchor="middle">CC</text>',
    FO: '<rect width="1000" height="1000" fill="#1AAE54"/><text x="500" y="625" fill="white" font-family="Arial" font-size="350" text-anchor="middle">FO</text>',
    PC: '<rect width="1000" height="1000" fill="#1689E7"/><text x="500" y="625" fill="white" font-family="Arial" font-size="350" text-anchor="middle">PC</text>',
    CCCC: '<polygon points="0,0 1000,0 1000,1000" fill="#BE0712" stroke="white" stroke-width="5"/><polygon points="0,0 0,1000 1000,1000" fill="#BE0712" stroke="white" stroke-width="5"/><text x="750" y="325" fill="white" font-family="Arial" font-size="200" text-anchor="middle">CC</text><text x="250" y="825" fill="white" font-family="Arial" font-size="200" text-anchor="middle">CC</text>',
    FOFO: '<polygon points="0,0 1000,0 1000,1000" fill="#1AAE54" stroke="white" stroke-width="5"/><polygon points="0,0 0,1000 1000,1000" fill="#1AAE54" stroke="white" stroke-width="5"/><text x="750" y="325" fill="white" font-family="Arial" font-size="200" text-anchor="middle">FO</text><text x="250" y="825" fill="white" font-family="Arial" font-size="200" text-anchor="middle">FO</text>',
    PCPC: '<polygon points="0,0 1000,0 1000,1000" fill="#1689E7" stroke="white" stroke-width="5"/><polygon points="0,0 0,1000 1000,1000" fill="#1689E7" stroke="white" stroke-width="5"/><text x="750" y="325" fill="white" font-family="Arial" font-size="200" text-anchor="middle">PC</text><text x="250" y="825" fill="white" font-family="Arial" font-size="200" text-anchor="middle">PC</text>',
    CCFO: '<polygon points="0,0 1000,0 1000,1000" fill="#BE0712" stroke="white" stroke-width="5"/><polygon points="0,0 0,1000 1000,1000" fill="#1AAE54" stroke="white" stroke-width="5"/><text x="750" y="325" fill="white" font-family="Arial" font-size="200" text-anchor="middle">CC</text><text x="250" y="825" fill="white" font-family="Arial" font-size="200" text-anchor="middle">FO</text>',
    FOPC: '<polygon points="0,0 1000,0 1000,1000" fill="#1AAE54" stroke="white" stroke-width="5"/><polygon points="0,0 0,1000 1000,1000" fill="#1689E7" stroke="white" stroke-width="5"/><text x="750" y="325" fill="white" font-family="Arial" font-size="200" text-anchor="middle">FO</text><text x="250" y="825" fill="white" font-family="Arial" font-size="200" text-anchor="middle">PC</text>',
    PCCC: '<polygon points="0,0 1000,0 1000,1000" fill="#1689E7" stroke="white" stroke-width="5"/><polygon points="0,0 0,1000 1000,1000" fill="#BE0712" stroke="white" stroke-width="5"/><text x="750" y="325" fill="white" font-family="Arial" font-size="200" text-anchor="middle">PC</text><text x="250" y="825" fill="white" font-family="Arial" font-size="200" text-anchor="middle">CC</text>',
    CCFOPC: '<polygon points="0,0 500,500 1000,0" fill="#BE0712" stroke="white" stroke-width="5"/><polygon points="0,0 500,500 500,1000 0,1000" fill="#1AAE54" stroke="white" stroke-width="5"/><polygon points="1000,0 500,500 500,1000 1000,1000" fill="#1689E7" stroke="white" stroke-width="5"/><text x="500" y="250" fill="white" font-family="Arial" font-size="200" text-anchor="middle">CC</text><text x="225" y="900" fill="white" font-family="Arial" font-size="200" text-anchor="middle">FO</text><text x="765" y="900" fill="white" font-family="Arial" font-size="200" text-anchor="middle">PC</text>',
    ERROR: '<rect width="1000" height="1000" fill="black"/><polygon points="0,875 1000,875 500,125" stroke="red" stroke-linejoin="round" stroke-alignment="inside" stroke-width="50" fill="white" transform="scale(.5) translate(500, 500)" /><text x="500" y="600" font-family="Arial" font-size="200" fill="black" text-anchor="middle">!</text>'
};

// setup svg
var svg = d3.select('svg')
    .on('mousemove', whiteboard_mousemove)
    .on('mouseup', whiteboard_mouseup)
    .on('mousedown', whiteboard_mousedown);

// window key events
d3.select(window)
    .on('keydown', d3_keydown)
    .on('keyup', d3_keyup);

// prevent default right mouse click
$(document).bind('contextmenu', function (e) {
    e.preventDefault();
});

// update mouse position
$(document).on('mousemove', function (event) {
    mouse.x = event.pageX;
    mouse.y = event.pageY;
});

// on leaving window warn user of losing changes
window.onbeforeunload = function () {
    return 'Se sair da página irá perder alterações não guardadas.';
};

// init D3 force layout
var force = d3.layout.force()
    .nodes(nodes)
    .links(links)
    .on('tick', layout_tick);

// line displayed when dragging new nodes
var drag_line = svg
    .append('svg:line')
    .attr('class', 'hidden')
    .attr('stroke', '#000000');

// --------------------
// -----SCALE TOOL-----
// --------------------

// linha da ferramenta de escala
var scale_line = svg
    .append('svg:line')
    .attr('class', 'hidden')
    .attr('stroke', '#000000');

// ponto inicial da ferramenta de escala
var initialPoint = {x: 0, y: 0};


// ------------------------
// -----SCALE TOOL END-----
// ------------------------

// path and node element groups
var path = svg.append('svg:g').attr('id', 'links').selectAll('path');
var rect = svg.append('svg:g').attr('id', 'nodes').selectAll('g');

// -------------------
// -----Functions-----
// -------------------

/**
 * set the mousedown flag true
 */
$(document).mousedown(function () {
    mousedown = true;
});

/**
 * set the mouseup flag true
 */
$(document).mouseup(function () {
    mousedown = false;
});

/**
 * reset the mouse event variables
 */
function resetMouseVars() {
    mousedown_node = null;
    mouseup_node = null;
    mousedown_link = null;
}

/**
 * update force layout (called automatically each iteration)
 */
function layout_tick() {

    // update rect position on drag
    if (mousedown && svg.classed('ctrl')) {
        updateNodePositions();
        drawPaths();
        updateDistances();
    }
}

/**
 * return the colors in a link by the type of its cables
 * @param link link between nodes
 * @param duplicates accept duplicates flag. default = false
 * @returns {Array} color array
 */
function linkCables(link, duplicates) {

    if (typeof duplicates == 'undefined')
        duplicates = false;

    var arr = [];

    for (var i = 0, n = tubes.length; i < n; i++) {
        if (compareLinks(tubes[i]['link'], link)) {
            var tubeId = tubes[i]['id'];
            for (var j = 0, m = cables.length; j < m; j++) {
                if (compareObjects(cables[j]['idTubo'], tubeId)) {
                    var color;
                    switch (cables[j]['tipo']) {
                        case 'CC':
                            //case 'CATV':
                            //case 'MATV':
                            color = 'red';
                            break;
                        case 'FO':
                            color = 'green';
                            break;
                        case 'PC':
                            color = 'blue';
                            break;
                    }
                    if (duplicates || arr.indexOf(color) == -1)
                        arr.push(color);
                }
            }
        }
    }
    return arr;
}

/**
 * draw the lines between node links
 */
function drawPaths() {

    // clear links container
    var linksDOM = d3.select('#links');
    linksDOM.selectAll('*').remove();

    for (var i = 0, n = links.length; i < n; i++) {

        var tubes = tubesInLink(links[i]);
        var colors = linkCables(links[i], false);
        var count = 1;

        // compute lines for link/tube
        if (view == 'tube' && tubes.length > 0)
            count = tubes.length;
        else if (view == 'cable' && colors.length > 0)
            count = colors.length;

        if (count == 0)
            count = 1;

        for (var j = 0; j < count; j++) {

            // get stroke color
            var strokeColor = 'grey';
            if (view == 'tube' && tubes.length > 0)
                strokeColor = 'black';
            else if ((view == 'cable' && colors.length > 0) || vertical)
                strokeColor = colors[j] || 'grey';

            // add line
            linksDOM.append('svg:path')
                .attr('class', 'link')
                .attr('id', 'link_' + i)
                .attr('fill', 'none')
                .attr('stroke', strokeColor)
                .attr('stroke-width', (20 * size) + 'px')
                .attr('d', (function () {

                    var d = links[i];
                    var x1 = d.source.x;
                    var x2 = d.target.x;
                    var y1 = d.source.y;
                    var y2 = d.target.y;

                    var distanceX = Math.abs(x1 - x2);
                    var distanceY = Math.abs(y1 - y2);
                    var offset = 4;

                    var desc = ((count - j) * offset) - ((count + 1) * offset / 2);
                    var asc = ((j + 1) * offset) - ((count + 1) * offset / 2);

                    var verticalOffset;
                    var horizontalOffset;

                    // horizontal line
                    if (distanceX >= distanceY) {
                        verticalOffset = asc;
                        return 'M' + (x1 + sizeSquare * size / 2) + ',' + ((y1 + sizeSquare * size / 2) + verticalOffset) + ' ' + (x2 + sizeSquare * size / 2) + ',' + ((y2 + sizeSquare * size / 2) + verticalOffset);
                    }
                    // vertical line
                    else {

                        horizontalOffset = asc;

                        // 1. down -> right
                        if (x1 < x2 && y1 < y2)
                            verticalOffset = desc;
                        // 2. down -> left
                        else if (x1 > x2 && y1 < y2)
                            verticalOffset = asc;
                        // 3. up -> right
                        else if (x1 < x2 && y1 > y2)
                            verticalOffset = asc;
                        // 4. up -> left
                        else
                            verticalOffset = desc;

                        return 'M' + (x1 + horizontalOffset + sizeSquare * size / 2) + ',' + ((y1 + sizeSquare * size / 2) + verticalOffset) + ' ' + (x2 + horizontalOffset + sizeSquare * size / 2) + ',' + ((y2 + sizeSquare * size / 2) + verticalOffset);
                    }
                })());
        }
    }

    // ----------------
    // -----Events-----
    // ----------------
    $('path.link').each(function () {

        var pathIndex = $(this).attr('id');
        if (pathIndex != undefined) {
            pathIndex = parseInt(pathIndex.substring(5));

            $(this)
                .off()
                .on('mouseover', function () {
                    path_mouseover(pathIndex);
                })
                .on('mouseout', function () {
                    path_mouseout();
                })
                .on('click', function (event) {
                    path_mousedown(event, pathIndex);
                });
        }
    });
}

/**
 * update graph (called when needed)
 */
function restart() {
    // update entries and exits values
    computeIO();

    // -----Paths-----
    drawPaths();

    // -----Nodes-----
    createNodes();
    updateNodePositions();

    // update the distance of every link
    updateDistances();

    // set the graph in motion
    force.start();
}

// D3 -----------------------------------------------------------------------------------------------------------------

/**
 * keydown on svg event
 */
function d3_keydown() {

    var event = d3.event;
    lastKeyDown = event.keyCode;

    if (event.ctrlKey) {
        switch (lastKeyDown) {
            // Ctrl - drag nodes
            case 17:
            {
                rect.call(force.drag);
                svg.classed('ctrl', true);
                break;
            }
            // Ctrl+Z - undo
            case 90:
            {
                undo();
                break;
            }
            // Ctrl+Y - redo
            case 89:
            {
                redo();
                break;
            }
            // Ctrl+S - save
            case 83:
            {
                saveChanges(plantaID);
                break;
            }
            // Ctrl+O - open
            case 79:
            {
                loadInterface();
                break;
            }
        }
    } else {
        // Delete - delete node
        if (lastKeyDown == 46) {
            // nothing selected
            if (!selected_node && !selected_link)
                return;
            // delete node
            if (selected_node) {
                deleteNode(selected_node);
                removeInfoBox();
            }
            // delete link
            else if (selected_link) {
                deleteLink();
                removeInfoBox();
            }
            selected_node = null;
            restart();
        }
    }
}

/**
 * keyup on svg event
 */
function d3_keyup() {

    lastKeyDown = -1;
    // ctrl
    if (!d3.event.ctrlKey) {
        rect.on('mousedown.drag', null)
            .on('touchstart.drag', null);
        svg.classed('ctrl', false);
    }
}

// Whiteboard Events --------------------------------------------------------------------------------------------------

/**
 * Evento de "mousemove" no SVG
 */
function whiteboard_mousemove() {

    if (d3.event.ctrlKey && mousedown_node && !draggingNode)
        draggingNode = true;

    // atualizar a posição da tooltip
    if (showing_tooltip)
        $('.info')
            .css('left', (mouse.x + 10) + 'px')
            .css('top', (mouse.y + 10) + 'px');

    // obter a posição do rato no SVG
    var px = (d3.mouse(this)[0] - panZoom.getPan().x) / (panZoom.getZoom());
    var py = (d3.mouse(this)[1] - panZoom.getPan().y) / (panZoom.getZoom());

    // atualizar a linha da ferramenta da escala
    if (scaling)
        scale_line
            .attr('x1', initialPoint.x)
            .attr('x2', px)
            .attr('y1', initialPoint.y)
            .attr('y2', py);

    // atualizar a linha de ligação de nós
    else if (mousedown_node)
        drag_line
            .attr('x1', mousedown_node.x + (side / 2))
            .attr('x2', px)
            .attr('y1', mousedown_node.y + (side / 2))
            .attr('y2', py);
}

/**
 * Evento de "mousedown" no SVG
 */
function whiteboard_mousedown() {

    // definir ponto inicial da régua no SVG
    if (scaling) {
        initialPoint.x = (d3.mouse(this)[0] - panZoom.getPan().x) / (panZoom.getZoom());
        initialPoint.y = (d3.mouse(this)[1] - panZoom.getPan().y) / (panZoom.getZoom());
        scale_line
            .attr('x1', initialPoint.x)
            .attr('x2', initialPoint.x)
            .attr('y1', initialPoint.y)
            .attr('y2', initialPoint.y)
            .classed('hidden', false);
    }
}

/**
 * Evento de "mouseup" no SVG
 */
function whiteboard_mouseup() {

    // definir a dimensão da régua
    if (scaling) {

        scaling = false;

        // construir html
        var body =
            '<div class="input-group input-group-sm">' +
            '<span class="input-group-addon"><label for="nodeHeight">Tamanho</label></span>' +
            '<input type="number" class="form-control" id="scalebar_dimension" placeholder="Tamanho (cm)">' +
            '<span class="input-group-addon">cm</span>' +
            '</div>';

        var footer =
            '<button type="button" class="btn btn-sm btn-default" data-dismiss="modal">Fechar</button>' +
            '<button type="button" class="btn btn-sm btn-primary" onclick="updateScale()">Guardar</button>';

        var modalClass = 'modal-sm';

        buildModal('Tamanho a representar', body, footer, modalClass);
    }

    // posicionar nó
    if (draggingNode) {
        draggingNode = false;
        saveOperation();
    }
    else if (mousedown_node)
        drag_line.classed('hidden', true); // hide drag line

    // because :active only works in WebKit?
    svg.classed('active', false);

    // clear mouse event vars
    resetMouseVars();
}

// Nodes --------------------------------------------------------------------------------------------------------------

/**
 * delete a node
 * @param node node to delete
 */
function deleteNode(node) {

    // delete link, tubes and cables
    spliceLinksForNode(node);

    // delete node
    nodes.splice(nodes.indexOf(node), 1);

    correctID();

    updateMatrix();

    // close the modal box
    closeModal();

    // redraw
    restart();
}

/**
 * node mouseover
 * @param event
 * @param index node index
 */
function node_mouseover(event, index) {

    if (event.ctrlKey)
        return;

    var d = nodes[index];
    var tipoNo = getTipoNo(d).toLowerCase();

    // entries and exits
    var html =
        '<tr><td>Entradas / Saídas</td><td>' + (d['fixedEntries'] + d['entries']) + ' / ' + (d['fixedExits'] + d['exits']) + '</td></tr>' +
        '<tr><td>Altura</td><td>' + d['height'] + ' cm</td></tr>' +
        '<tr><td>Equipamento</td><td>' + ((d['component']) ? d['component']['codigo'] : 'nenhum') + '</td></tr>';

    // ate/ati application
    if (tipoNo == 'ate' || tipoNo == 'ati')
        html += '<tr><td>Aplicação</td><td>' + d['application']['nome'] + '</td></tr>';

    // ati
    if (tipoNo == 'ati') {
        if (d['linkDistance'] != null)
            html += '<tr><td>Atenuação à entrada</td><td>' + (d['linkDistance']).toFixed(2) + ' dB</td></tr>';
        html +=
            '<tr><td>Ajuste de amplificação</td><td>' + d['properties']['amplificacao'] + ' dB</td></tr>' +
            '<tr><td>Nível de sinal</td><td>' + d['properties']['nivelSinal'] + ' dB µV</td></tr>';
    }

    // derivador
    if (tipoNo == 'derivador') {
        html +=
            '<tr><td>Atenuação de inserção</td><td>' + d['properties']['atenuacaoInsercao'] + ' dB</td></tr>' +
            '<tr><td>Atenuação de derivação</td><td>' + d['properties']['atenuacaoDerivacao'] + ' dB</td></tr>';
    }

    // remove old info boxes
    removeInfoBox();

    showing_tooltip = true;

    // show tooltip
    d3.select('body')
        .append('div')
        .attr('class', 'info')
        .style('left', (mouse.x + 15) + 'px')
        .style('top', (mouse.y + 15) + 'px')
        .append('table')
        .html(html);
}

/**
 * on mouse leaving a node event
 */
function node_mouseout() {
    removeInfoBox(); // remove old info boxes
}

/**
 * node mouse down
 * @param event
 * @param index node index
 */
function node_mousedown(event, index) {

    // selecionar nó
    mousedown_node = nodes[index];

    if (event.ctrlKey)
        return;

    // posicionar ligação de nó
    var x = mousedown_node.x + (side / 2);
    var y = mousedown_node.y + (side / 2);

    drag_line
        .classed('hidden', false)
        .attr('x1', x)
        .attr('x2', x)
        .attr('y1', y)
        .attr('y2', y);
}

/**
 * node mouseup
 * @param index node index
 */
function node_mouseup(index) {

    var d = nodes[index];

    // if two nodes were selected
    if (!mousedown_node)
        return;

    // hide drag-line
    drag_line.classed('hidden', true);

    // check for drag-to-self
    mouseup_node = d;
    if (compareNodes(mouseup_node, mousedown_node)) {
        resetMouseVars();
        return;
    }

    // add link to graph (update if exists)
    var source, target;

    // sort source and target by id
    if (mousedown_node.id < mouseup_node.id) {
        source = mousedown_node;
        target = mouseup_node;
    } else {
        source = mouseup_node;
        target = mousedown_node;
    }

    // check if selected nodes are linked
    var link = links.filter(function (d) {
        return (compareNodes(d.source, source) && compareNodes(d.target, target));
    })[0];

    if (!link) {
        links.push({
            source: source,
            target: target,
            distance: Math.sqrt(Math.pow(target.x - source.x, 2) + Math.pow(target.y - source.y, 2))
        });

        updateMatrix();

        // check if there are loops in the circuit
        if (circuitClosed(0, [])) {
            links.splice(links.length - 1, 1);
            alert('Não podem existir loops no circuito.');
            restart();
            return;
        }
    } else
        alert('Os nós selecionados já estão ligados.');

    updateMatrix();
    saveOperation();

    // select link/deselect node
    selected_link = link;
    selected_node = null;
    restart();
}

/**
 * node click
 * @param event
 * @param index node index
 */
function node_click(event, index) {

    if (event.ctrlKey)
        return;

    // selecionar nó e descelecionar ligação
    selected_node = nodes[index];
    selected_link = null;
    d3.select(event.target).classed('selected', true);

    var body;
    var tipoNo = getTipoNo(selected_node);

    // tipos de componente com opções específicas
    if (tipoNo == 'ATE' || tipoNo == 'ATI') {

        body =
            '<!-- aplicação -->' +
            '<div class="input-group input-group-sm">' +
            '<span class="input-group-addon">' +
            '<label for="labelValue">Aplicação</label>' +
            '</span>' +
            '<select class="form-control" id="nodeApplication">';

        // adicionar tipo de aplicação
        for (var i = 0, n = applicationModels.length; i < n; i++)
            if (applicationModels[i]['idTipoComponente'] == (selected_node['componentType']['id'])) {
                var tipoAplicacao = getTipoAplicacao(applicationModels[i]['idTipoAplicacao']);
                body += (tipoAplicacao == selected_node['application'])
                    ? '<option value="' + tipoAplicacao['id'] + '" selected>' + tipoAplicacao['nome'] + '</option>'
                    : '<option value="' + tipoAplicacao['id'] + '">' + tipoAplicacao['nome'] + '</option>';
            }

        body +=
            '</select>' +
            '</div>' +
            '<!-- label -->' +
            '<div class="input-group input-group-sm">' +
            '<span class="input-group-addon"><label for="labelValue">Label</label></span>' +
            '<input type="text" class="form-control" id="labelValue" placeholder="Label" value="' + (selected_node.label || '') + '">' +
            '</div>' +
            '<!-- altura -->' +
            '<div class="input-group input-group-sm">' +
            '<span class="input-group-addon"><label for="nodeHeight">Altura</label></span>' +
            '<input type="number" min="0" class="form-control" id="nodeHeight" placeholder="Altura (cm)" value="' + selected_node['height'] + '">' +
            '<span class="input-group-addon">cm</span>' +
            '</div>';

        if (tipoNo == 'ATI') {
            body +=
                '<!-- amplificação -->' +
                '<div class="input-group input-group-sm">' +
                '<span class="input-group-addon"><label for="amplificacao">Amplificação</label></span>' +
                '<input type="number" min="0" class="form-control" id="amplificacao" placeholder="Amplificação (dB)" value="' + selected_node['properties']['amplificacao'] + '">' +
                '<span class="input-group-addon">dB</span>' +
                '</div>' +
                '<!-- nivel de sinal -->' +
                '<div class="input-group input-group-sm">' +
                '<span class="input-group-addon"><label for="nivelSinal">Nível de sinal</label></span>' +
                '<input type="number" min="0" class="form-control" id="nivelSinal" placeholder="Nível de sinal (dB µV)" value="' + selected_node['properties']['nivelSinal'] + '">' +
                '<span class="input-group-addon">dB µV</span>' +
                '</div>';
        }
    }
    // tipos de componente com opções genéricas
    else {
        body =
            '<!-- node label -->' +
            '<div class="input-group input-group-sm">' +
            '<span class="input-group-addon">' +
            '<label for="labelValue">Label</label>' +
            '</span>' +
            '<input type="text" class="form-control" id="labelValue" placeholder="Label" value="' + (selected_node.label || '') + '">' +
            '</div>' +
            '<!-- node height -->' +
            '<div class="input-group input-group-sm">' +
            '<span class="input-group-addon"><label for="nodeHeight">Altura</label></span>' +
            '<input type="number" min="0" class="form-control" id="nodeHeight" placeholder="Altura (cm)" value="' + selected_node.height + '">' +
            '<span class="input-group-addon">cm</span>' +
            '</div>';
    }

    var modalClass = 'modal-md';
    var title = 'Propriedades ' + ((tipoNo == 'ATE' || tipoNo == 'ATI' || tipoNo == 'QE') ? 'do ' : 'da ') + tipoNo;
    var footer =
        '<button type="button" class="btn btn-sm btn-default" data-dismiss="modal">Fechar</button>' +
        '<button type="button" class="btn btn-sm btn-primary" onclick="updateNodeInfo()">Guardar</button>';

    // build the window
    buildModal(title, body, footer, modalClass);
}

/**
 * create nodes on the whiteboard
 */
function createNodes() {

    // refresh node data
    rect = rect.data([]);
    rect.exit().remove();
    rect = rect.data(nodes);


    // add node parent
    var g = rect.enter()
        // insert group with id
        .append('svg:g')
        .attr('id', function (d) {
            return 'node_' + d.id;
        });

    // add node type text
    if (isInternetExplorer()) {

        // grey rectangle
        g.append('svg:rect')
            .attr('width', side)
            .attr('height', side)
            .attr('fill', '#aaaaaa');

        // node type text
        g.append('svg:text')
            .attr('fill', 'black')
            .attr('text-anchor', 'middle')
            .attr('x', side / 2)
            .attr('y', (side / 2) + 4)
            .text(function (d) {
                return d['componentType']['name'];
            });
    }

    g.append('svg:g')
        //.attr('transform', 'scale(.05)')
        .attr('transform', 'scale(' + size + ')')
        .html(function (d) {
            if (getTipoNo(d) != 'TT')
                return d['componentType']['svg'];
            else {
                // compute the score to know which TT to use
                var score = 0;
                for (var i = 0, n = links.length; i < n; i++) {
                    var cableCount = countCablesInLinkByType(links[i]);
                    if (compareNodes(links[i].target, d))
                    //score += (cableCount['CATV'] * 100) + (cableCount['MATV'] * 100) + (cableCount['FO'] * 10) + cableCount['PC'];
                        score += (cableCount['CC'] * 100) + (cableCount['FO'] * 10) + cableCount['PC'];
                    if (compareNodes(links[i].source, d))
                    //score -= (cableCount['CATV'] * 100) + (cableCount['MATV'] * 100) + (cableCount['FO'] * 10) + cableCount['PC'];
                        score -= (cableCount['CC'] * 100) + (cableCount['FO'] * 10) + cableCount['PC'];
                }

                // select image based on connected cables
                switch (score) {
                    case 0:
                        return d['componentType']['svg'];
                    case 100:
                        return ttSvg['CC'];
                    case 10:
                        return ttSvg['FO'];
                    case 1:
                        return ttSvg['PC'];
                    case 200:
                        return ttSvg['CCCC'];
                    case 20:
                        return ttSvg['FOFO'];
                    case 2:
                        return ttSvg['PCPC'];
                    case 110:
                        return ttSvg['CCFO'];
                    case 11:
                        return ttSvg['FOPC'];
                    case 101:
                        return ttSvg['PCCC'];
                    case 111:
                        return ttSvg['CCFOPC'];
                    default:
                        return ttSvg['ERROR'];
                }
            }
        });

    var bgSize = 6;

    // node number
    var nodeSelect = g.select("g");
    nodeSelect.append('svg:rect')
        .attr('x', 865)
        .attr('y', 855)
        .attr('width', 120)
        .attr('height', 120)
        .attr('fill', 'white')
        .attr('class', function (d) {
            return (getTipoNo(d) == 'TT') ? (hideNodeID) ? 'node-id hidden' : 'node-id' : 'node-id hidden';
        });


    // node number
    nodeSelect.append('svg:text')
        .attr('font-weight', 'bold')
        .attr('x', 930)
        .attr('y', 950)
        .attr("font-size", 100)
        .attr('fill', '#222222')
        .attr('text-anchor', 'middle')
        .attr('class', function (d) {
            return (hideNodeID || getTipoNo(d) == 'Curva') ? 'node-id hidden' : 'node-id';
        })
        .text(function (d) {
            return numberByType(nodes.indexOf(d));
        });

    // interaction rect
    g.append('svg:rect')
        .attr('class', 'node')
        .attr('width', sizeSquare * size)
        .attr('height', sizeSquare * size)
        .attr('fill', 'rgba(0,0,0,0)')
        .classed('selected', function (d) {
            return compareNodes(d, selected_node);
        });

    // -----------------------
    // -----Tooltip Label-----
    // -----------------------

    // background
    //nodeSelect.append('svg:rect')
    //    //.attr('width', function (d) {
    //    //    return (d.label != null) ? (renderedTextSize(d.label, 'sans-serif', 8).width + 10) : 0;
    //    //})
    //    //.attr('height', 15)
    //    .attr('width', 1000)
    //    .attr('height', 1000)
    //    .attr('x', function (d) {
    //        return (d.label != null) ? (side - ((renderedTextSize(d.label, 'sans-serif', 8).width + 10) / 2)) : 0;
    //    })
    //    .attr('y', -18)
    //    .attr('rx', 1)
    //    .attr('ry', 1)
    //    .attr('fill', '#333333')
    //    .attr('class', function (d) {
    //        return (d.label != null) ? null : 'hidden';
    //    });

    g.append('svg:rect')
        .attr('width', function (d) {
            return (d.label != null) ? (renderedTextSize(d.label, 'sans-serif', size * 80).width + size * 100) : 0;
        })
        .attr('height', function (d) {
            return (d.label != null) ? (renderedTextSize(d.label, 'sans-serif', size * 80).height + size * 50) : 0;
        })
        .attr('x', function (d) {
            return (d.label != null) ? (side - ((renderedTextSize(d.label, 'sans-serif', size * 80).width + size * 100) / 2)) : 0;
        })
        //.attr('y', -18)
        .attr('y', function (d) {
            return (d.label != null) ? (-renderedTextSize(d.label, 'sans-serif', size * 80).height + size * -108) : 0;
        })
        .attr('rx', 1)
        .attr('ry', 1)
        .attr('fill', '#333333')
        .attr('class', function (d) {
            return (d.label != null) ? null : 'hidden';
        });

    // background triangle
    //nodeSelect.append('svg:polygon')
    g.append('svg:polygon')
        .attr('points', '0,-1 10,-1 5,3')
        .attr('transform', 'translate(' + (side - 10) + ', ' + size * -30 + ')')
        .attr('fill', '#333333')
        .attr('class', function (d) {
            return (d.label != null) ? null : 'hidden';
        });

    // label
    //nodeSelect.append('svg:text')
    g.append('svg:text')
        //.style('font-size', '8px')
        .style('font-size', function (d) {
            return (d.label != null) ? (renderedTextSize(d.label, 'sans-serif', size * 80).height) : 0;
        })
        .style('font-weight', '100')
        .attr('x', side)
        //.attr('y', -8)
        .attr('y', function (d) {
            return (d.label != null) ? size * -80 : 0;
        })
        .attr('fill', '#ffffff')
        .attr('text-anchor', 'middle')
        .attr('class', function (d) {
            return (d.label != null) ? null : 'hidden';
        })
        .text(function (d) {
            return d.label;
        });

    // ----------------
    // -----Events-----
    // ----------------

    $('rect.node').each(function () {

        var nodeIndex = $(this).parent().index();

        $(this)
            .off()
            .on('click', function (event) {
                node_click(event, nodeIndex);
            })
            .on('mouseover', function (event) {
                node_mouseover(event, nodeIndex);
            })
            .on('mouseout', function () {
                node_mouseout();
            })
            .on('mouseup', function () {
                node_mouseup(nodeIndex);
            })
            .on('mousedown', function (event) {
                node_mousedown(event, nodeIndex);
            });
    });
}

// -----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

/**
 * compute the width and height of a text element
 * @param string text
 * @param font font family
 * @param fontSize font size
 * @returns {{width: *, height: *}}
 */
function renderedTextSize(string, font, fontSize) {
    var paper = Raphael(0, 0, 0, 0);
    paper.canvas.style.visibility = 'hidden';
    var el = paper.text(0, 0, string);
    el.attr('font-family', font);
    el.attr('font-size', fontSize);
    var bBox = el.getBBox();
    paper.remove();
    return {
        width: bBox.width,
        height: bBox.height
    };
}

// -----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

/**
 * return the number of the node by it's type
 * @param index node index
 * @returns {number} number of the node by it's type
 */
function numberByType(index) {
    var nodeType = nodes[index]['componentType'];
    var number = 0;
    for (var i = 0, n = nodes.length; i < n; i++) {
        if (nodes[i]['componentType'] == nodeType)
            number++;
        if (i == index)
            return number;
    }
}

/**
 * remove links attached to a node
 * @param node - node to be removed
 */
function spliceLinksForNode(node) {

    // delete tubes and cables
    for (var i = 0; i < tubes.length; i++) {
        if (compareNodes(tubes[i]['link']['source'], node) || compareNodes(tubes[i]['link']['target'], node)) {
            deleteTube(tubes[i]['id']);
            i--;
        }
    }

    // delete link
    for (i = 0; i < links.length; i++) {
        if (compareNodes(links[i]['source'], node) || compareNodes(links[i]['target'], node)) {
            links.splice(i, 1);
            break;
        }
    }
}

/**
 * update the nodes positions on screen
 */
function updateNodePositions() {
    // set node positions
    rect.attr('transform', function (d) {
        return 'translate(' + d.x + ',' + d.y + ')';
    });
}

// ----------------
// ------Paths-----
// ----------------

/**
 * path mousedown
 * @param event
 * @param index path index
 */
function path_mousedown(event, index) {

    if (event.ctrlKey)
        return;

    status = 'editting link';

    // selected link visual clue
    d3.selectAll('#link_' + index).classed('selected', true);

    // select link
    selected_link = links[index];

    // create tooltip content
    var body =
        '<div class="list-group">' +
        '<!-- mostrar -->' +
        '<div class="list-group-item" style="padding: 0">' +
        '<table class="table">' +
        '<tr>' +
        '<th>Tubo</th>' +
        '<th>Diâmetro</th>';

    // adiciona os tipos de cabos dinâmicamente
    for (var i = 0, n = cableTypes.length; i < n; i++)
        body += '<th>' + cableTypes[i]['tipo'] + '</th>';

    body +=
        '<th>Quantidade</th>' +
        '<th>Ações</th>' +
        '</tr>';

    for (i = 0, n = tubes.length; i < n; i++) {

        var tubeId = tubes[i]['id'];

        // tube is in link
        if (compareLinks(tubes[i]['link'], selected_link)) {

            var cableCount = countCablesInTube(tubeId);

            body +=
                '<!-- informação do tubo -->' +
                '<tr id="tubo-' + tubeId + '">' +
                '<td>' + tubeId + '</td>' +
                '<td><select class="form-control input-sm" id="tube-diameter-' + tubeId + '" onchange="changeTubeDiameter(' + tubeId + ')" disabled>';

            // add diameters options
            for (var j = 0, m = diameters.length; j < m; j++) {
                if (diameters[j]['diametro'] == tubes[i]['diametro'])
                    body += '<option value="' + diameters[j]['id'] + '" selected>' + diameters[j]['diametro'] + ' mm</option>';
                else
                    body += '<option value="' + diameters[j]['id'] + '">' + diameters[j]['diametro'] + ' mm</option>';
            }

            body += '</select></td>';

            // adiciona a contagem de cabos por tipo, dinâmicamente
            for (var key in cableCount)
                if (cableCount.hasOwnProperty(key))
                    body += '<td>' + cableCount[key] + '</td>';

            body +=
                '<td>-</td>' +
                '<td>' +
                '<button type="button" class="btn btn-default" title="Editar" onclick="editTube(' + tubeId + ')"><span class="glyphicon glyphicon-pencil"></span></button>' +
                '<button type="button" class="btn btn-danger" title="Apagar" onclick="deleteTubeDialog(' + tubeId + ')"><span class="glyphicon glyphicon-trash"></span></button>' +
                '</td>' +
                '</tr>' +
                '<!-- apagar tubo -->' +
                '<tr class="bg-danger hidden" id="delete_tube_' + tubeId + '">' +
                '<td colspan="' + (cableTypes.length + 3) + '">Confirmar eliminar?</td>' +
                '<td>' +
                '<button type="button" class="btn btn-default" title="Confirmar" onclick="confirmDeleteTube(' + tubeId + ')"><span class="glyphicon glyphicon-ok"></span></button>' +
                '<button type="button" class="btn btn-danger" title="Cancelar" onclick="cancelDeleteTube(' + tubeId + ')"><span class="glyphicon glyphicon-ban-circle"></span></button>' +
                '</td>' +
                '</tr>' +

                '<!-- editar tubo -->' +
                '<tr class="table hidden" id="edit_tube_' + tubeId + '">' +
                '<td colspan="' + (cableTypes.length + 4) + '" class="tube-edit">' +
                '<table class="table">' +
                '<!-- cabos -->' +
                '<tr>' +
                '<th>Cabo</th>' +
                '<th>Tipo</th>' +
                '<th>Referência</th>' +
                '<th>Quantidade</th>' +
                '<th>Ações</th>' +
                '</tr>';

            // add cables
            for (j = 0, m = cables.length; j < m; j++) {
                if (cables[j]['idTubo'] == tubeId) {

                    // fetch cable ID
                    var cableId = 0;
                    for (var k = 0, o = cableTypes.length; k < o; k++) {
                        if (cables[j]['tipo'] == cableTypes[k]['tipo']) {
                            cableId = cableTypes[k]['id'];
                            break;
                        }
                    }

                    // fetch quality ID
                    var qualityId = 0;
                    for (k = 0, o = qualities.length; k < o; k++) {
                        if (cables[j]['idQualidade'] == qualities[k]['id']) {
                            qualityId = qualities[k]['id'];
                            break;
                        }
                    }

                    // ----------------------
                    // -----add cable id-----
                    // ----------------------

                    body += '<tr id="cable-' + cables[j]['id'] + '">' +
                        '<td>' + cables[j]['id'] + '</td>';

                    // -------------------------
                    // -----add cable types-----
                    // -------------------------

                    body += '<td><select class="form-control input-sm" id="cable-type-' + cables[j]['id'] + '" onchange="updateQualityOptions(' + cables[j]['id'] + ')">';

                    for (k = 0, o = cableTypes.length; k < o; k++) {
                        if (cableTypes[k]['tipo'] == cables[j]['tipo'])
                            body += '<option value="' + cableTypes[k]['id'] + '" selected>' + cableTypes[k]['tipo'] + '</option>';
                        else
                            body += '<option value="' + cableTypes[k]['id'] + '">' + cableTypes[k]['tipo'] + '</option>';
                    }

                    body += '</select></td>';

                    // -----------------------------
                    // -----add cable qualities-----
                    // -----------------------------

                    body += '<td><select class="form-control input-sm" id="cable-quality-' + cables[j]['id'] + '"  onchange="changeQuality(' + cables[j]['id'] + ')">';

                    for (k = 0, o = qualities.length; k < o; k++) {

                        if (qualities[k]['idCabo'] == cableId && qualities[k]['id'] == qualityId)
                            body += '<option value="' + qualities[k]['id'] + '" selected>' + qualities[k]['nome'] + '</option>';
                        else if (qualities[k]['idCabo'] == cableId)
                            body += '<option value="' + qualities[k]['id'] + '">' + qualities[k]['nome'] + '</option>';
                    }

                    body +=
                        '</select></td>' +
                        '<td>-</td>' +
                        '<td><button type="button" class="btn btn-danger" title="Apagar" onclick="deleteCable(' + cables[j]['id'] + ')"><span class="glyphicon glyphicon-trash"></span></button></td>' +
                        '</tr>';
                }
            }

            body +=
                '<!-- adicionar cabo -->' +
                '<tr class="bg-success" id="new-cable-' + tubeId + '">' +
                '<td>Novo</td>' +
                '<td>' +
                '<select class="form-control input-sm" id="new-cable-type-' + tubeId + '" onchange="updateNewQualityOptions(' + tubeId + ')">';

            // adicionar tipos de cabo
            for (j = 0, m = cableTypes.length; j < m; j++)
                body += '<option value="' + cableTypes[j]['id'] + '">' + cableTypes[j]['tipo'] + '</option>';

            body += '</select></td>';

            // adicionar qualidades de cabo
            body += '<td><select class="form-control input-sm" id="new-cable-quality-' + tubeId + '">';

            for (j = 0, m = qualities.length; j < m; j++)
                body += '<option value="' + qualities[j]['id'] + '">' + qualities[j]['nome'] + '</option>';

            body +=
                '</select>' +
                '</td>' +
                '<td><input class="form-control input-sm" type="number" placeholder="Quantidade" value="1" min="1" id="new-cable-quantity-' + tubeId + '"></td>' +
                '<td><button type="button" class="btn btn-default" title="Guardar" onclick="addCable(' + tubeId + ')"><span class="glyphicon glyphicon-ok"></span></button></td>' +
                '</tr>' +
                '<!-- fechar tabela -->' +
                '</table>' +
                '</td>' +
                '</tr>';
        }
    }

    body +=
        '<!-- adicionar tubo -->' +
        '<tr class="bg-success" id="new-tube">' +
        '<td>Novo</td>' +
        '<td><select class="form-control input-sm" id="new-tube-diameter">';

    // add options
    for (j = 0, m = diameters.length; j < m; j++)
        body += '<option value="' + diameters[j]['id'] + '">' + diameters[j]['diametro'] + ' mm</option>';

    body += '</select></td>';

    for (i = 0, n = cableTypes.length; i < n; i++)
        body += '<td>0</td>';

    body +=
        '<td><input class="form-control input-sm" type="number" placeholder="Quantidade" value="1" min="1" id="tubeQuantity"></td>' +
        '<td><button type="button" class="btn btn-sm btn-default" title="Guardar" onclick="addTube()"><span class="glyphicon glyphicon-plus"></span></button></td>' +
        '</tr>' +
        '<!-- fechar tabela -->' +
        '</table>' +
        '</div>' +
        '</div>';

    // remove old info boxes
    removeInfoBox();

    var modalClass = 'modal-md modal-cable';

    buildModal('Propriedades da ligação', body, null, modalClass);

    // deselect nodes
    selected_node = null;
}

/**
 * path mouseover
 * @param index path index
 */
function path_mouseover(index) {

    // remove old info boxes
    removeInfoBox();

    showing_tooltip = true;
    var cableCount = countCablesInLinkByType(links[index]);

    // add info box
    d3.select('body')
        .append('div')
        .attr('class', 'info')
        .style('left', (mouse.x + 10) + 'px')
        .style('top', (mouse.y + 10) + 'px')
        .append('table')
        .attr('class', 'table')
        .html(function () {
            var html = '<tr><td><img src="../../../bundles/ieetaited/images/icons/distance.png"></td><td>' + (links[index]['distance'] * scale).toFixed(2) + 'm' + '</td></tr>';
            for (var key in cableCount)
                if (cableCount.hasOwnProperty(key))
                    html += '<tr><td>' + key + '</td><td>' + cableCount[key] + '</td></tr>';
            return html;
        });
}

/**
 * path mouseout
 */
function path_mouseout() {
    // remove old info boxes
    removeInfoBox();
}

/**
 * build the modal window
 * @param title - modal title
 * @param body - modal content
 * @param footer - modal footer
 * @param modalClass - modal class (ex: modal-sm)
 */
function buildModal(title, body, footer, modalClass) {

    // build footer
    var modalFooter = $('.modal-footer');
    if (typeof footer == 'undefined' || footer == null) {
        modalFooter.addClass('hidden');
    } else {
        modalFooter.removeClass('hidden');
        modalFooter.html(footer);
    }

    removeInfoBox(); // remove old info boxes

    $('.modal-title').text(title);
    $('.modal-body').html(body);
    $('#modal').modal({
        keyboard: true,
        show: true
    })
        .on('shown.bs.modal', function () {
            // set label width
            var elements = $('.modal-body').find('.input-group-addon').find('label');
            elements.css('width', getMaxWidth(elements) + 'px');
        })
        .on('hidden.bs.modal', function () {

            switch (status) {
                // editting link/floor
                case 'editting link':
                case 'editting floor':
                    restart();
                    break;
            }

            // desselecionar nós e ligações
            d3.selectAll('rect.node').classed('selected', false);
            d3.selectAll('path.link').classed('selected', false);

            // esconde a ferramenta de escala ao cancelar
            scale_line.classed('hidden', true);

            // limpar variaveis
            status = null;
            selected_link = null;
            selected_node = null;
        })
        .find('.modal-dialog')
        .attr('class', 'modal-dialog')
        .addClass((typeof(modalClass) == 'undefined') ? 'modal-sm' : modalClass);
}

/**
 * save the default component for a node type
 */
function saveDefault() {
    var componentId = $('#default-component').val();
    var typeId;

    // remove default component
    if (isNaN(componentId)) {
        for (i = 0, n = tiposComponente.length; i < n; i++) {
            if (tiposComponente[i]['name'] == componentId) {
                tiposComponente[i]['default'] = null;
                break;
            }
        }
    }
    // set default component
    else {
        componentId = parseInt(componentId);

        // get type id
        for (var i = 0, n = components.length; i < n; i++) {
            if (components[i]['id'] == componentId) {
                var modeloAplicacao = getModeloAplicacao(components[i]['idModeloAplicacao']);
                typeId = modeloAplicacao['idTipoComponente'];
                break;
            }
        }

        // set node type default component
        for (i = 0, n = tiposComponente.length; i < n; i++) {
            if (tiposComponente[i]['id'] == tiposComponente) {
                tiposComponente[i]['default'] = componentId;
                break;
            }
        }
    }

    closeModal();
}

/**
 * compute a path's distance
 * @param path - path to measure
 * @returns {number} - path distance
 */
function pathDistance(path) {
    var distance = 0;
    if (path.length > 1) {
        for (var i = 0; i < path.length - 1; i++) {
            for (var j = 0; j < links.length; j++) {

                var source = path[i];
                var target = path[i + 1];
                var linkSource = nodes.indexOf(links[j]['source']);
                var linkTarget = nodes.indexOf(links[j]['target']);

                if ((source == linkSource && target == linkTarget) || (source == linkTarget && target == linkSource))
                    distance += parseFloat(links[j].distance);
            }
        }
    }
    return distance;
}

/**
 * compute all paths (tt > ati)
 */
function checkATIconnections() {

    // reset array
    pathToCC.length = 0;

    // find an ATI module
    ati = firstOfType('ATI');

    // check if ati exists
    if (ati != -1) {

        // add nodes and path
        for (var i = 0, n = nodes.length; i < n; i++) {
            if (getTipoNo(nodes[i]) == 'TT') {
                pathToCC.push({
                    startNode: i,
                    endNode: ati,
                    path: findPath(ati, i, neighbourNodes(ati, []), []).reverse()
                })
            }
        }
    }
}

/**
 * compute all paths (cc > ate)
 */
function checkATEconnections() {

    // reset array
    pathToATE.length = 0;

    // find an ATI module
    ate = firstOfType('ATE');

    // check if ate exists
    if (ate != -1) {

        // add nodes and path
        for (var i = 0, n = nodes.length; i < n; i++) {
            if (getTipoNo(nodes[i]) == 'CC') {
                pathToATE.push({
                    startNode: i,
                    endNode: ati,
                    path: findPath(ate, i, neighbourNodes(ate, []), []).reverse()
                })
            }
        }
    }
}


/**
 * compute the number of cables in a link
 * @param link - link
 * @returns {number} - number of cables in a link
 */
function countCablesInLink(link) {
    var count = 0;
    var tubeId;
    for (var i = 0, n = tubes.length; i < n; i++) {
        if (compareLinks(tubes[i]['link'], link)) {
            tubeId = tubes[i]['id'];
            for (var j = 0, m = cables.length; j < m; j++)
                if (cables[j]['idTubo'] == tubeId)
                    count++;
        }
    }
    return count;
}

/**
 * compute the tubes distance by diameter
 */
function tubesDistance() {
    var distance = {};
    for (var i = 0, n = diameters.length; i < n; i++)
        distance[diameters[i]['diametro']] = 0;
    for (i = 0, n = tubes.length; i < n; i++)
        distance[tubes[i]['diametro']] += (tubes[i]['link']['distance'] * scale) + (tubes[i]['link']['source']['height'] / 100) + (tubes[i]['link']['target']['height'] / 100);
    return distance;
}

/**
 * compute the attenuation of a cable
 * Alp: atenuação da ligação permanente
 * Acabo: atenuação dos dispositivos de repartição ou derivação
 * Adr: atenuação dos dispositivos de repartição ou derivação
 * n: número de conectores considerados
 * Ac: atenuação por conector
 * Att: atenuação da tomada terminal
 * @param path links composing the cable
 * @param Acomponentes components attenuation
 * @param freq cable frequency
 * @returns {number} cable attenuation (dB)
 * @constructor
 */
function attenuation(path, Acomponentes, freq) {
    // var Adr = 1; // PARA EFEITOS DE TESTE (CORRIGIR)
    // var Ac = 0.0001 * freq; // REVER
    // var Att = 1; // (substituido por atenuação do componente)
    // var n = path.length + 1;
    // var Alp = Acabo + Adr + (n * Ac) + Att;

    var L = (pathDistance(path) * scale);
    var Acabo = (L / 100) * ((0.597 * Math.sqrt(freq)) + (0.0026 * freq));

    // atenuação das ligações prévias ao ATI
    if (nodes[path[0]].hasOwnProperty('aComponents'))
        Acomponentes += nodes[path[0]]['aComponents'];

    var Alp = Acabo + Acomponentes;

    return parseFloat(Alp.toFixed(2));
}

/**
 * calcula as perdas nas tomadas da rede de fibra ótica
 * L: comprimento total das ligações
 * Pj: perdas nas junções (default: .1 dB)
 * Pcb: perdas nos cabos (4 dB / Km)
 * @param path caminho da tomada ao ATI
 * @param Pcn perdas nos conectores (default: .5 dB)
 * @returns {Number} Pt: perdas totais
 */
function losses(path, Pcn) {
    var L = pathDistance(path) * scale;
    var Pcb = L * 4 / 1000;
    var Pj = 0; // ONDE SAO FEITAS AS JUNÇÕES NO DESENHO?
    return parseFloat(Pcn + Pj + Pcb);
}

/**
 * delete a tube
 */
function deleteLink() {

    // close the modal box
    closeModal();

    // delete tubes and cables in link
    for (var i = 0; i < tubes.length; i++) {
        if (compareLinks(tubes[i]['link'], selected_link)) {
            deleteTube(tubes[i]['id']);
            i--;
        }
    }

    // delete link
    links.splice(links.indexOf(selected_link), 1);

    restart();
}

// ----------------
// -----Matrix-----
// ----------------

/**
 * update adjacency matrix values (cable distance)
 */
function updateMatrix() {

    // reset matrix
    matrix.length = 0;
    // if nodes exist
    if (nodes.length > 0) {

        // reset matrix values
        for (var i = 0; i < nodes.length; i++) {
            matrix.push([]);
            for (var j = 0; j < nodes.length; j++) {
                matrix[i].push(0);
            }
        }
        // set matrix cost
        for (i = 0; i < links.length; i++) {
            var source = nodes.indexOf(links[i]['source']);
            var target = nodes.indexOf(links[i]['target']);
            var distance = links[i]['distance'];

            if (source != -1 && target != -1) {
                matrix[source][target] = distance;
                matrix[target][source] = distance;
            }
        }
    }
}

/**
 * encontrar um caminho entre dois nós
 * @param nodeStart nó de partida
 * @param nodeEnd nó de destino
 * @param linked nós vizinhos
 * @param traversed nós já percorridos
 * @returns {*}
 */
function findPath(nodeStart, nodeEnd, linked, traversed) {

    traversed = (typeof traversed === 'undefined') ? [] : traversed; // valor por defeito

    // start and end nodes are the same, no paths to find
    if (nodeStart == nodeEnd)
        return [nodeEnd];

    // add node to list of visited nodes
    traversed.push(nodeStart);

    for (var i = 0; i < linked.length; i++) {

        var path = findPath(linked[i], nodeEnd, neighbourNodes(linked[i], traversed), traversed);

        // if link is correct and complete
        if (path.length > 0 && path[0] == nodeEnd) {
            path.push(nodeStart);
            return path;
        }
    }
    return [];
}

/**
 * return a list of neightbour nodes
 * @param fromNode target node
 * @param exceptions
 * @returns {Array}
 */
function neighbourNodes(fromNode, exceptions) {

    exceptions = (typeof exceptions === 'undefined') ? [] : exceptions; // valor por defeito

    var neighbours = [];

    for (var i = 0, n = matrix.length; i < n; i++)
        if ($.inArray(i, exceptions) < 0 && i != fromNode && matrix[fromNode][i] != 0)
            neighbours.push(i);
    return neighbours;
}

/**
 * check if a circuit is closed
 * @param point target node
 * @param traversed visited nodes
 * @returns {boolean} true if circuit has loops, false if it doesn't
 */
function circuitClosed(point, traversed) {

    var candidates = [];
    if (traversed.length == 0)
        candidates = neighbourNodes(point, []);
    else
        candidates = neighbourNodes(point, [traversed[traversed.length - 1]]);
    // node is endpoint
    if (candidates.length == 0)
        return false;
    // node is found again
    if ($.inArray(point, traversed) >= 0)
        return true;
    for (var i = 0; i < candidates.length; i++) {
        traversed.push(point);
        if (circuitClosed(candidates[i], traversed))
            return true;
    }
    return false;
}

// -----------------
// -----Windows-----
// -----------------

/**
 * update the tabs size
 */
function resizeWorkspace() {

    var windowHeight = $(window).outerHeight(true);
    var navigationbarHeight = $('nav').outerHeight(true);
    var sliderbarHeight = $('#slider').outerHeight(true);
    var toolbarHeight = $('#topToolbar').outerHeight(true);

    // effective area of work height
    var height = windowHeight - navigationbarHeight - sliderbarHeight - toolbarHeight;

    // if toolbox is shorter than page height, expand
    var studio = $('#studio');
    var toolbox = $('#toolbox');
    toolbox.css('height', '');
    if (toolbox.outerHeight(true) > height)
        height = toolbox.outerHeight(true);

    // apply new dimensions
    toolbox.css('height', height);
    studio.css('height', height);

    // -------------------------
    // -----Recommendations-----
    // -------------------------

    var nodeList = $('#node-list');
    var equipmentList = $('#equipment-list');
    var subequipmentList = $('#subequipment-list');
    var rightCol = $('#shopping').find('#right');

    if (nodeList.length) {

        // effective area of work
        height = windowHeight - navigationbarHeight - sliderbarHeight;

        nodeList
            .css('height', '')
            .css('overflow-y', '');

        equipmentList
            .css('height', '')
            .css('overflow-y', '');

        subequipmentList
            .css('height', '')
            .css('overflow-y', '');

        if (equipmentList.outerHeight(true) > (height / 2))
            equipmentList
                .css('height', height / 2)
                .css('overflow-y', 'scroll');

        if (equipmentList.outerHeight(true) + subequipmentList.outerHeight(true) > height)
            subequipmentList
                .css('height', height - equipmentList.outerHeight(true))
                .css('overflow-y', 'scroll');

        if (rightCol.outerHeight(true) > height)
            nodeList.css('height', rightCol.outerHeight(true));
        else if (nodeList.outerHeight(true) > height)
            nodeList
                .css('height', height)
                .css('overflow-y', 'scroll');
        else
            nodeList
                .css('height', height);
    }

    var maxWidth = 0;
    var labels = $('.testFields').find('label');
    labels.each(function () {
        maxWidth = Math.max(maxWidth, $(this).outerWidth(true));
    });
    labels.css('width', maxWidth);

    // -------------------
    // -----Checkout-----
    // -------------------

    height = windowHeight - navigationbarHeight - sliderbarHeight;
    var checkoutLeft = $('#checkout-left');
    var checkoutRight = $('#checkout-right');
    checkoutRight.css('height', '');

    if (checkoutRight.outerHeight(true) > height)
        height = checkoutRight.outerHeight(true);

    checkoutLeft.css('height', height);
    checkoutRight.css('height', height);
}

/**
 * on window resize
 */
$(window).resize(function () {
    resizeWorkspace();
});

/**
 * build the draggable node types on the left of the screen
 */
function buildDraggables() {

    var d3Toolbox = d3.select('#toolbox');

    // adicionar componentes ao menu esquerdo
    d3Toolbox.append('ul')
        .selectAll('*')
        .data(d3.keys(tiposComponente).filter(function (d) {
            return !tiposComponente[d]['hidden'];
        }))
        .enter()
        .append('li') // ul > li
        .attr('id', function (d) {
            return 'nodeType-' + (tiposComponente[d]['id']);
        })
        .attr('title', function (d) {
            return tiposComponente[d]['description'];
        })
        .append('img') // li > img
        .attr('src', function (d) {
            return '/bundles/ieetaited/theme/images/nodes/' + tiposComponente[d]['name'].toLowerCase() + '.png';
        });

    // adicionar separador no fim
    d3Toolbox.append('hr');

    // adicionar nós no estúdio ao arrastar
    var toolbox = $('#toolbox');
    toolbox.find('li')
        .draggable({
            revert: true,
            revertDuration: 0,
            cursorAt: {left: (side / 2), top: (side / 2)},
            // on mouse up
            stop: function (e) {

                var idTipoComponente = parseInt($(this).attr('id').replace('nodeType-', '')); // obter id do tipo de componente
                var tipoComponente = getTipoComponente(idTipoComponente); // obter tipo de componente

                // obter modelo de aplicação
                var modeloAplicacao;
                for (var i = 0, n = applicationModels.length; i < n; i++) {
                    if (applicationModels[i]['idTipoComponente'] == idTipoComponente) {
                        modeloAplicacao = applicationModels[i];
                        break;
                    }
                }

                // obter posição do rato
                e = e || window.event;
                var target = $('svg')[0];
                var rect = target.getBoundingClientRect();
                var offsetX = e.clientX - rect.left;
                var offsetY = e.clientY - rect.top;

                // obter posição do rato relativamente ao SVG
                var point = {
                    x: (offsetX - panZoom.getPan().x) / (panZoom.getZoom()) - (side / 2),
                    y: (offsetY - panZoom.getPan().y) / (panZoom.getZoom()) - (side / 2)
                };

                // inserir o nó na posição obtida
                var node = {
                    application: getTipoAplicacao(modeloAplicacao['idTipoAplicacao']),
                    component: null,
                    componentType: tipoComponente,
                    entries: 0,
                    exits: 0,
                    fixed: true,
                    fixedEntries: 0,
                    fixedExits: 0,
                    height: 0,
                    id: ++lastNodeId,
                    label: null,
                    originalId: null,
                    subcomponents: [],
                    properties: {},
                    x: point.x,
                    y: point.y
                };

                // inserir parâmetros por defeito com base no tipo de componente
                switch (tipoComponente['name'].toLowerCase()) {
                    case 'amp':
                        node.properties['atenuador'] = 0;
                        node.properties['atenuador1'] = 0;
                        node.properties['atenuador2'] = 0;
                        node.properties['equalizador'] = 0;
                        node.properties['ganho'] = 0;
                        node.properties['ganho1'] = 0;
                        node.properties['ganho2'] = 0;
                        node.properties['nivelSaida'] = 0;
                        node.properties['nivelSaidaRetorno'] = 0;
                        node.properties['preAcentuador'] = 0;
                        break;
                    case 'ati':
                    case 'cc':
                        node.properties['amplificacao'] = 0;
                        node.properties['nivelSinal'] = 0;
                        break;
                    case 'derivador':
                        node.properties['atenuacaoDerivacao'] = 0;
                        node.properties['atenuacaoInsercao'] = 0;
                        break;
                }

                // armazenar nó
                nodes.push(node);

                // atualizar matriz
                updateMatrix();

                // redesenhar
                restart();

                // guardar alterações
                saveOperation();
            }
        })
        .mousedown(function (e) {
            // adicionar evento de clique direito nos componentes
            if (e.button == 2)
                buildDefaultComponentInterface(e);
        });
}

/**
 * build the default component selection interface
 */
function buildDefaultComponentInterface(e) {

    var nodeTypeId = parseInt(e.currentTarget.id.replace('nodeType-', ''));
    var nodeType = getTipoComponente(nodeTypeId);

    status = 'default component';

    var body =
        '<div  class="input-group input-group-sm">' +
        '<span class="input-group-addon"><label for="default-material">' + nodeType.name + '</label></span>' +
        '<select class="form-control" id="default-component">' +
        '<option value="' + nodeType.name + '">Nenhum</option>';

    // adicionar componentes à lista
    for (var i = 0, n = components.length; i < n; i++) {

        // ignorar subcomponentes
        if (components[i]['subcomponente'])
            continue;

        // selecionar componentes do tipo selecionado
        if (getModeloAplicacao(components[i]['idModeloAplicacao'])['idTipoComponente'] == nodeTypeId) {
            if (components[i]['id'] == nodeType['default'])
                body += '<option value="' + components[i]['id'] + '" selected>' + components[i]['descricao'] + '</option>';
            else
                body += '<option value="' + components[i]['id'] + '">' + components[i]['descricao'] + '</option>';
        }
    }

    body += '</select></div>';

    var footer =
        '<button type="button" class="btn btn-sm btn-default" data-dismiss="modal">Fechar</button>' +
        '<button type="button" class="btn btn-sm btn-primary" onclick="saveDefault()">Guardar</button>';
    var modalClass = 'modal-md';

    buildModal('Material por defeito', body, footer, modalClass);
}

// ------------------------------
// -----Operation Management-----
// ------------------------------

/**
 * return a deep copy of the selected object
 * @param object object to copy
 * @returns {*}
 */
function deepCopy(object) {
    return $.extend(true, [], object);
}

/**
 * save an operation to the historic
 */
function saveOperation() {
    // delete operations after current operation
    operations.splice((currentOperation + 1), (operations.length - currentOperation));

    // save current operation
    operations.push({
        nodes: deepCopy(nodes),
        links: deepCopy(links),
        tubes: deepCopy(tubes),
        cables: deepCopy(cables),
        size: size,
        scale: scale
    });

    var latestOperation = operations[operations.length - 1];

    // update node info to avoid object linkage problems
    for (var i = 0, n = nodes.length; i < n; i++) {

        var subcomponentIndexes = [];
        for (var j = 0, m = nodes[i]['subcomponents'].length; j < m; j++)
            subcomponentIndexes.push(components.indexOf(nodes[i]['subcomponents'][j]));

        latestOperation.nodes[i]['application'] = applications.indexOf(nodes[i]['application']);
        latestOperation.nodes[i]['component'] = components.indexOf(nodes[i]['component']);
        latestOperation.nodes[i]['componentType'] = tiposComponente.indexOf(nodes[i]['componentType']);
        latestOperation.nodes[i]['subcomponents'] = subcomponentIndexes;
    }

    // update link info to avoid object linkage problems
    for (i = 0, n = links.length; i < n; i++) {
        latestOperation.links[i]['source'] = nodes.indexOf(links[i]['source']);
        latestOperation.links[i]['target'] = nodes.indexOf(links[i]['target']);
    }

    // update tube info to avoid object linkage problems
    for (i = 0, n = tubes.length; i < n; i++) {
        latestOperation.tubes[i]['link'] = links.indexOf(tubes[i]['link']);
    }

    currentOperation++;
}

/**
 * replace indexes with objects
 */
function indexesToObjects(nodeTest, linksTest, tubesTest, callback) {
    // replace node indexes with objects
    for (var i = 0, n = nodeTest.length; i < n; i++) {
        nodeTest[i]['application'] = applications[nodes[i]['application']] || null;
        nodeTest[i]['component'] = components[nodes[i]['component']] || null;
        nodeTest[i]['componentType'] = tiposComponente[nodes[i]['componentType']] || null;

        nodeTest[i]['fixed'] = nodes[i]['fixed'] == 1 ? true : false;

        for (var j = 0, m = nodes[i]['subcomponents'].length; j < m; j++)
            nodeTest[i]['subcomponents'][j] = components[nodes[i]['subcomponents'][j]] || null;
    }

    // replace link indexes with objects
    for (i = 0, n = linksTest.length; i < n; i++) {
        linksTest[i]['source'] = nodes[links[i]['source']];
        linksTest[i]['target'] = nodes[links[i]['target']];
    }

    // replace tube indexes with objects
    for (i = 0, n = tubesTest.length; i < n; i++) {
        tubesTest[i]['link'] = links[tubes[i]['link']];
    }
    callback();
}

/**
 * clears the operations history
 */
function resetOperations() {
    currentOperation = -1;
    operations.length = 0;
    saveOperation();
}

/**
 * load all the ATI nodes in a Obra
 * @param id_obra - Obra id
 * @param id_planta - Planta id
 * @param async - true for async request, false for sync request
 */
function loadAti(id_obra, id_planta, async) {

    if (typeof async == 'undefined')
        async = true;

    // perform ajax request
    var result = null;
    $.ajax({
        type: 'POST',
        url: '/planta/' + id_planta + '/load_ati',
        crossDomain: true,
        data: {'id': id_obra},
        dataType: 'json',
        async: async,
        success: function (response) {
            result = response.nodes;
        },
        error: function (response, status, error) {
            logErrors(response, status, error, 'Ocorreu um erro ao carregar os módulos ATI de todas as plantas da obra.');
        }
    });

    for (var i = 0, n = nodes.length; i < n; i++)
        for (var j = 0, m = result.length; j < m; j++)
            if (nodes[i]['originalId'] == result[j]['originalId'])
                result.splice(j, 1);
    return result;
}


/**
 * load all the CC nodes in a Obra
 * @param id_obra - Obra id
 * @param id_planta - Planta id
 * @param async - true for async request, false for sync request
 */
function loadCC(id_obra, id_planta, async) {

    if (typeof async == 'undefined')
        async = true;

    // perform ajax request
    var result = null;
    $.ajax({
        type: 'POST',
        url: '/planta/' + id_planta + '/load_cc',
        crossDomain: true,
        data: {'id': id_obra},
        dataType: 'json',
        async: async,
        success: function (response) {
            result = response.nodes;
        },
        error: function (response, status, error) {
            logErrors(response, status, error, 'Ocorreu um erro ao carregar os módulos CC de todas as plantas da obra.');
        }
    });

    for (var i = 0, n = nodes.length; i < n; i++)
        for (var j = 0, m = result.length; j < m; j++)
            if (nodes[i]['originalId'] == result[j]['originalId'])
                result.splice(j, 1);
    return result;
}

/**
 * Insere os tipos de componentes
 * @param tipos array de objetos de tipos de componentes
 */
function insertTypes(tipos) {
    for (var i = 0, n = tipos.length; i < n; i++) {

        var propriedades = [];

        // inserir propriedades com base no tipo de componente
        switch (tipos[i]['nome'].toLowerCase()) {
            case 'amp':
                propriedades.push({nome: 'atenuador', label: 'Atenuador', tipo: 'number', unidades: 'dB'});
                propriedades.push({nome: 'atenuador1', label: 'Atenuador 1', tipo: 'number', unidades: 'dB'});
                propriedades.push({nome: 'atenuador2', label: 'Atenuador 2', tipo: 'number', unidades: 'dB'});
                propriedades.push({nome: 'equalizador', label: 'Equalizador', tipo: 'number', unidades: 'dB'});
                propriedades.push({nome: 'ganho', label: 'Ganho', tipo: 'number', unidades: 'dB'});
                propriedades.push({nome: 'ganho1', label: 'Ganho 1', tipo: 'number', unidades: 'dB'});
                propriedades.push({nome: 'ganho2', label: 'Ganho 2', tipo: 'number', unidades: 'dB'});
                propriedades.push({nome: 'nivelSaida', label: 'Nível de saída', tipo: 'number', unidades: 'dB µV'});
                propriedades.push({
                    nome: 'nivelSaidaRetorno',
                    label: 'Nível de saída de retorno',
                    tipo: 'number',
                    unidades: 'dB µV'
                });
                propriedades.push({nome: 'preAcentuador', label: 'Pré-acentuador', tipo: 'number', unidades: 'dB'});
                break;
            case 'ati':
            case 'cc':
                propriedades.push({nome: 'amplificacao', label: 'Amplificação', tipo: 'number', unidades: 'dB'});
                propriedades.push({nome: 'nivelSinal', label: 'Nível de sinal', tipo: 'number', unidades: 'dB µV'});
                break;
            case 'derivador':
                propriedades.push({
                    nome: 'atenuacaoDerivacao',
                    label: 'Atenuação de derivação',
                    tipo: 'number',
                    unidades: 'dB'
                });
                propriedades.push({
                    nome: 'atenuacaoInsercao',
                    label: 'Atenuação de inserção',
                    tipo: 'number',
                    unidades: 'dB'
                });
                break;
        }

        tiposComponente.push({
            default: null,
            description: tipos[i]['descricao'],
            hidden: (vertical && tipos[i]['esconderVertical']) || (!vertical && tipos[i]['esconderHorizontal']),
            id: tipos[i]['id'],
            name: tipos[i]['nome'],
            properties: propriedades,
            svg: tipos[i]['svg']
        });
    }

    buildDraggables();
}

/**
 * insert nodes in the svg
 * @param data - node array
 */
function insertNodes(data) {
    for (var i = 0, n = data.length; i < n; i++) {

        var originalId = (vertical && data[i]['idOrigem'] != null) ? data[i]['idOrigem'] : null;
        var modeloAplicacao = getModeloAplicacao(data[i]['idModeloAplicacao']);
        var tipoComponente = getTipoComponente(modeloAplicacao['idTipoComponente']);
        var tipoAplicacao = getTipoAplicacao(modeloAplicacao['idTipoAplicacao']);
        var component = (data[i]['component']) ? getComponent(data[i]['component']) : null;
        var subcomponents = [];
        if (data[i].hasOwnProperty('subcomponents'))
            for (var j = 0, m = data[i]['subcomponents'].length; j < m; j++)
                subcomponents.push(getComponent(data[i]['subcomponents'][j]))

        // build node
        var node = {
            application: tipoAplicacao,
            component: component,
            componentType: tipoComponente,
            dbId: data[i]['id'],
            entries: 0,
            exits: 0,
            fixed: true,
            fixedEntries: data[i]['entries'] || 0,
            fixedExits: data[i]['exits'] || 0,
            height: data[i]['altura'],
            id: ++lastNodeId,
            label: data[i]['label'],
            originalId: originalId,
            properties: {},
            subcomponents: subcomponents,
            x: data[i]['x'],
            y: data[i]['y']
        };

        // add dynamic properties
        switch (tipoComponente['name'].toLowerCase()) {
            case 'amp':
                node.properties['atenuador'] = data[i]['atenuador'] || 0;
                node.properties['atenuador1'] = data[i]['atenuador1'] || 0;
                node.properties['atenuador2'] = data[i]['atenuador2'] || 0;
                node.properties['equalizador'] = data[i]['equalizador'] || 0;
                node.properties['ganho'] = data[i]['ganho'] || 0;
                node.properties['ganho1'] = data[i]['ganho1'] || 0;
                node.properties['ganho2'] = data[i]['ganho2'] || 0;
                node.properties['nivelSaida'] = data[i]['nivelSaida'] || 0;
                node.properties['nivelSaidaRetorno'] = data[i]['nivelSaidaRetorno'] || 0;
                node.properties['preAcentuador'] = data[i]['preAcentuador'] || 0;
                break;
            case 'ati':
            case 'cc':
                node.properties['amplificacao'] = data[i]['amplificacao'] || 0;
                node.properties['nivelSinal'] = data[i]['nivelSinal'] || 0;
                break;
            case 'derivador':
                node.properties['atenuacaoInsercao'] = data[i]['atenuacaoInsercao'] || 0;
                node.properties['atenuacaoDerivacao'] = data[i]['atenuacaoDerivacao'] || 0;
                break;
        }

        // add node
        nodes.push(node);
    }

    updateMatrix();
}

/**
 * insert links in the svg
 * @param data - link array
 */
function insertLinks(data) {
    for (var i = 0, n = data.length; i < n; i++) {
        // find nodes by id
        var node1 = -1;
        var node2 = -1;
        for (var j = 0, m = nodes.length; j < m; j++) {
            if (data[i]['idNo1'] == nodes[j].dbId)
                node1 = nodes[j];
            if (data[i]['idNo2'] == nodes[j].dbId)
                node2 = nodes[j];
            if (node1 != -1 && node2 != -1)
                break;
        }
        // add link
        links.push({
            source: node1,
            target: node2,
            distance: data[i]['comprimento']
        });
    }
}

/**
 * insert tubes in the svg
 * @param data - tube array
 */
function insertTubes(data) {

    for (var i = 0, n = data.length; i < n; i++) {
        for (var j = 0, m = links.length; j < m; j++) {
            // find tube link
            if (data[i]['idNo1'] == links[j]['source']['dbId'] && data[i]['idNo2'] == links[j]['target']['dbId']) {
                var link = links[j];
                break;
            }
        }

        // insert tube
        tubes.push({
            diametro: data[i]['diametro'],
            id: data[i]['id'],
            link: link
        });
    }
}

/**
 * load the attenuation from the planta vertical until the ati nodes
 * @param data ati node attenuation
 */
function insertBackwardsAttenuation(data) {
    for (var i = 0, n = nodes.length; i < n; i++) {
        for (var j = 0, m = data.length; j < m; j++) {
            if (nodes[i]['dbId'] == data[j]['idNo']) {
                nodes[i]['componentsAttenuation'] = data[j]['aComponentes'];
                nodes[i]['linkDistance'] = data[j]['cLigacao'];
            }
        }
    }
}

/**
 * apply layout changes to show vertical blueprints tools
 */
function verticalTheme() {

    $('#loader').attr('class', 'hidden');

    if (!vertical) {
        // hide toogle grid option
        $('#toggle_grid').parent().remove();

        // build scale Planta tools html
        $('#toolbox').append(
            '<!-- scale Planta up -->' +
            '<button class="btn" title="Aumentar planta" onclick="scalePlanta(.1)">' +
            '<img src="../../../bundles/ieetaited/images/icons/expand.png">' +
            '</button>' +
            '<!-- scale Planta down -->' +
            '<button class="btn" title="Reduzir planta" onclick="scalePlanta(-.1)">' +
            '<img src="../../../bundles/ieetaited/images/icons/contract.png">' +
            '</button>'
        );
    } else {
        // hide scale bar tool
        $('#btn-scalebar').remove();

        // build vertical Planta tools html
        $('#toolbox').append(
            '<!-- reload CC nodes -->' +
            '<button class="btn" title="carregar CC de todas as planta" onclick="reloadCCNodes()">' +
            '<img src="../../../bundles/ieetaited/images/icons/download_cc.png">' +
            '</button>' +
            '<!-- floor info -->' +
            '<button class="btn" title="Gerir andares" onclick="manageFloors()">' +
            '<img src="../../../bundles/ieetaited/images/icons/floor.png">' +
            '</button>'
        );
    }
}

/**
 * show/hide the grid on vertical Planta
 */
function toggleGrid() {
    if (!hideGrid) {
        hideGrid = true;
        $('#svgGrid').find('rect').attr('fill', 'white');
    } else {
        hideGrid = false;
        $('#svgGrid').find('rect').attr('fill', 'url(#grid)');
    }
}

/**
 * make the id of nodes and completely sequential to avoid issues when inserting them into the database
 */
function correctID() {
    if (nodes.length) {
        for (var i = 0, n = nodes.length; i < n; i++)
            if (nodes[i].id > (i + 1))
                nodes[i].id = i + 1;
        lastNodeId = nodes[nodes.length - 1].id;
    } else
        lastNodeId = 0;
}

/**
 * update layout items
 */
function update() {
    // init D3 force layout
    force = d3.layout.force()
        .nodes(nodes)
        .links(links)
        .size([width, height])
        .on('tick', layout_tick);
}

/**
 * log errors from an ajax request to the console and display an error message to the user
 * @param response ajax request response
 * @param status ajax request status
 * @param error ajax request error
 * @param message message to the user
 */
function logErrors(response, status, error, message) {
    alert(message);
    // log error to console
    console.log('Response data', response);
    console.log('Text status', status);
    console.log('Error thrown', error);
    console.log('Response', response.responseText);
}

// TEST FUNCTIONS -----------------------------------------------------------------------------------------------------

/**
 * switch the source and target nodes in a link
 * @param link link to switch nodes
 * @returns {*} corrected link
 */
function switchLinks(link) {
    var aux = link.source;
    link.source = link.target;
    link.target = aux;
    return link;
}

/**
 * fix the orientation in links based on the node priority and on the paths from the ATI to TT
 */
function setLinkOrientation() {

    for (var i = 0, n = links.length; i < n; i++) {
        if (vertical) {
            // vertical scheme
            /*switch (getTipoNo(links[i].target)) {
             // CVM && PAT priority is highest
             case 'CVM':
             case 'PAT':
             links[i] = switchLinks(links[i]);
             break;
             // ATE && CEMU priority is second highest
             case 'ATE':
             if (getTipoNo(links[i].source) != 'CVM' || getTipoNo(links[i].source) != 'PAT' || getTipoNo(links[i].source) != 'CP')
             links[i] = switchLinks(links[i]);
             break;
             case 'CEMU':
             if (getTipoNo(links[i].source) == 'CVM' || getTipoNo(links[i].source) == 'PAT' || getTipoNo(links[i].source) == 'CP')
             links[i] = switchLinks(links[i]);
             break;
             // CP priority is third highest
             case 'CP':
             if (getTipoNo(links[i].source) != 'CVM' || getTipoNo(links[i].source) != 'PAT')
             links[i] = switchLinks(links[i]);
             break;
             // CC priority is fourth highest
             case 'CC':
             if (getTipoNo(links[i].source) != 'ATE' || getTipoNo(links[i].source) == 'CP')
             links[i] = switchLinks(links[i]);
             break;
             }*/

            switch (getTipoNo(links[i].source)) {
                // CVM && PAT priority is highest
                case 'CVM':
                case 'PAT':
                    if (getTipoNo(links[i].target) != 'CP' && getTipoNo(links[i].target) != 'ATE')
                        links[i] = switchLinks(links[i]);
                    break;
                // ATE && CEMU priority is second highest
                case 'ATE':
                    if (getTipoNo(links[i].target) != 'CC')
                        links[i] = switchLinks(links[i]);
                    break;
                case 'CEMU':
                    if (getTipoNo(links[i].target) == 'CVM' && getTipoNo(links[i].source) == 'PAT' && getTipoNo(links[i].source) == 'CP')
                        links[i] = switchLinks(links[i]);
                    break;
                // CP priority is third highest
                case 'CP':
                    if (getTipoNo(links[i].target) != 'CC' && getTipoNo(links[i].target) != 'ATE')
                        links[i] = switchLinks(links[i]);
                    break;
                // CC priority is third highest
                case 'CC':
                    links[i] = switchLinks(links[i]);
                    break;
            }
        } else {
            // horizontal scheme
            switch (getTipoNo(links[i]['target'])) {
                // CVM && PAT priority is highest
                case 'CVM':
                case 'PAT':
                    links[i] = switchLinks(links[i]);
                    break;
                // ATE && CEMU priority is second highest
                case 'ATE':
                case 'CEMU':
                    if (getTipoNo(links[i].source) == 'CVM' || getTipoNo(links[i].source) == 'PAT')
                        links[i] = switchLinks(links[i]);
                    break;
                // ATI priority is third highest
                //case 'ATI':
                // CC priority is third highest
                case 'CC':
                    if (getTipoNo(links[i].source) == 'CVM' || getTipoNo(links[i].source) == 'PAT' || getTipoNo(links[i].source) == 'ATE')
                        links[i] = switchLinks(links[i]);
                    break;
            }
        }
    }

    // compute paths to endpoints
    if (links.length > 0) {

        // select the source node
        var start = firstOfType('CVM');
        if (start == -1)
            start = firstOfType('ATE');
        //if (start == -1)
        //    start = firstOfType('ATI');
        if (start == -1)
            start = firstOfType('CC');
        if (start != -1) {

            for (i = 0, n = nodes.length; i < n; i++) {
                if (neighbourNodes(i, []).length == 1 && getTipoNo(nodes[i]) == 'CP' || getTipoNo(nodes[i]) == 'TT') {

                    // get the path from the ati to the node
                    var path = findPath(start, nodes[i].id - 1, neighbourNodes(start, []), []);

                    // update source and target
                    for (var j = 0, m = path.length - 1; j < m; j++)
                        for (var k = 0; k < links.length; k++)
                            if (compareNodes(links[k].source, nodes[path[j]]) && compareNodes(links[k].target, nodes[path[j + 1]]))
                                switchLinks(links[k]);
                }
            }
        }
    }

    // PAT -> [ATE,ATI]
    for (i = 0, n = nodes.length; i < n; i++) {
        if (getTipoNo(nodes[i]) == 'PAT') {

            // find ATE or ATI
            for (j = 0; j < nodes.length; j++) {
                if (getTipoNo(nodes[j]) == 'ATE' || getTipoNo(nodes[j]) == 'ATI') {

                    // get path to ATE/ATI
                    path = findPath(i, j, neighbourNodes(i, []), []).reverse();

                    // stop if ATI is found (for ATE targets)
                    for (k = 0; k < path.length; k++)
                        if (getTipoNo(nodes[path[k]]) == 'ATI')
                            path.splice(k + 1, path.length - k - 1);

                    // find links in path
                    for (k = 1; k < path.length; k++)
                        for (var l = 0; l < links.length; l++)
                            if (compareNodes(nodes[path[k]], links[l].source) && compareNodes(nodes[path[k - 1]], links[l].target))
                                switchLinks(links[l]);
                }
            }
        }
    }
}

/**
 * compute the number of entries and exits in each node
 */
function computeIO() {

    // correct link orientation
    setLinkOrientation();

    // reset values
    for (var i = 0, n = nodes.length; i < n; i++) {
        nodes[i].entries = 0;
        nodes[i].exits = 0;
    }

    // set values
    for (i = 0, n = links.length; i < n; i++) {
        if (getTipoNo(links[i].source) != 'QE' && getTipoNo(links[i].target) != 'QE') {

            // sum cable count regardless of type
            var count = countCablesInLink(links[i]);
            links[i].source.exits += count;
            links[i].target.entries += count;
        }
    }
}

/**
 * compute the input and output cables on a node
 * @param cable cable type
 * @param node componente to compute I/O
 * @returns {{in: number, out: number}} I/O object for the node
 */
function countByCable(cable, node) {
    var count = {in: 0, out: 0};
    var cables;
    for (var i = 0, n = links.length; i < n; i++) {
        cables = countCablesInLinkByType(links[i]);
        if (compareNodes(links[i].target, node))
            count.in += cables[cable];
        else if (compareNodes(links[i].source, node))
            count.out += cables[cable];
    }
    return count;
}

/**
 * getter da Qualidade
 * @param id id da Qualidade
 * @returns {*}
 */
function getQualidade(id) {
    for (var i = 0, n = qualities.length; i < n; i++)
        if (qualities[i]['id'] == id)
            return qualities[i];
}

/**
 * ModeloAplicacao getter
 * @param id ModeloAplicacao id
 * @returns {*}
 */
function getModeloAplicacao(id) {
    for (var i = 0, n = applicationModels.length; i < n; i++)
        if (applicationModels[i]['id'] == id)
            return applicationModels[i];
}

/**
 * TipoComponente getter
 * @param id TipoComponente id
 * @returns {*}
 */
function getTipoComponente(id) {
    for (var i = 0, n = tiposComponente.length; i < n; i++)
        if (tiposComponente[i]['id'] == id)
            return tiposComponente[i];
}

/**
 * TipoAplicacao getter
 * @param id TipoAplicacao id
 * @returns {*}
 */
function getTipoAplicacao(id) {
    for (var i = 0, n = applications.length; i < n; i++)
        if (applications[i]['id'] == id)
            return applications[i];
}

/**
 * component getter
 * @param id component id
 * @returns {*}
 */
function getComponent(id) {
    for (var i = 0, n = components.length; i < n; i++)
        if (components[i]['id'] == id)
            return components[i];
}

/**
 * cable getter
 * @param id cable id
 * @returns {*} cable object
 */
function getCable(id) {
    for (var i = 0, n = cables.length; i < n; i++)
        if (cables[i]['id'] == id)
            return cables[i];
}

/**
 * link getter
 * @param source nó de origem
 * @param target nó de destino
 * @returns {*} link object
 */
function getLink(source, target) {
    for (var i = 0, n = links.length; i < n; i++)
        if ((compareNodes(links[i]['source'], source) && compareNodes(links[i]['target'], target)) || (compareNodes(links[i]['source'], target) && compareNodes(links[i]['target'], source)))
            return links[i];
}

/**
 * calcula o diâmtro mínimo de um tubo face aos cabos que por ele passam
 * @param tube objeto do tubo
 * @returns {number} diametro minimo em mm
 */
function minTubeDiameter(tube) {
    var cablesDiameter = 0;
    for (var i = 0, n = cables.length; i < n; i++)
        if (cables[i]['idTubo'] == tube['id'])
            cablesDiameter += Math.pow(getQualidade(cables[i]['idQualidade'])['diametro'], 2);
    return 2 * Math.sqrt(cablesDiameter);
}

/**
 * tube getter
 * @param id tube id
 * @returns {*} tube object
 */
function getTubo(id) {
    for (var i = 0, n = tubes.length; i < n; i++)
        if (tubes[i]['id'] == id)
            return tubes[i];
}

/**
 * devolve o nome do tipo de componente de um nó
 * @param node nó a consultar
 * @returns {*} nome do tipo de componente do nó
 */
function getTipoNo(node) {
    return node['componentType']['name'];
}

/**
 * atualiza a interface da fase de "Inventário e diagramas"
 * @param graphType opção do menu na interface
 * @param elementIndex id do elemento HTML onde a interface vai ser renderizada
 */
function updateCheckoutGUI(graphType, elementIndex) {

    typeGraph = graphType;

    $('#checkout-left').find('.list-group-item.active').removeClass('active');
    $('#checkout-left-' + elementIndex).addClass('active');

    var rightColumn = $('#checkout-right');

    // Diagrama
    if (graphType != 'inventario') {

        var html =
            '<!-- Save SVG -->' +
            '<button class="btn btn-primary" onclick="saveSVG(\'' + graphType + '\', null)" id="btn-svg-download" title="Descarregar">' +
            '<img src="../../../bundles/ieetaited/images/icons/svg.png" width="20">' +
            '</button>' +

            '<!-- Fullscreen -->' +
            '<button class="btn btn-primary" onclick="maximizeSVG()" id="btn-svg-fullscreen" title="Ecrã inteiro">' +
            '<img src="../../../bundles/ieetaited/images/icons/fullscreen.png" width="20">' +
            '</button>' +

            '<!-- Map -->' +
            '<svg id="map">' +
            '<g></g>' +
            '</svg>';

        rightColumn.html(html);
        rightColumn.css('overflow-y', 'hidden');
        grafo('map', graphType);

        // zoom
        applyPanZoom('#map');

        // copy svg to fullscreen DIV
        var fullscreen = $('#fullscreen');
        fullscreen.html($('#map').clone());
        fullscreen.find('svg').attr('id', 'fullscreenSVG');
        fullscreen.prepend('<button type="button" class="btn btn-sm btn-danger" title="Fechar" onclick="minimizeSVG()">×</button>');
    }
    // Inventario
    else {
        var total = 0; // total price

        html =
            '<!-- Fullscreen -->' +
            '<div style="height: 55px;">' +
            '<button class="btn btn-primary" onclick="exportFileModal()" id="btn-svg-export" title="Guardar em ficheiro Excel">' +
            '<img src="../../../bundles/ieetaited/images/icons/excel.png" width="20">' +
            '</button>' +
            '</div>' +
            '<!-- Tubes -->' +
            '<table class="table table-striped">' +
            '<tr>' +
            '<th colspan="2">Tubagem</th>' +
            '</tr>' +
            '<tr>' +
            '<th>Diâmetro</th>' +
            '<th>Comprimento</th>' +
            '</tr>';

        if (tubes.length == 0)
            html += '<tr class="bg-danger"><td colspan="3" class="bg-danger">Não existem tubos instalados...</td></tr>';
        else {
            var tubesDist = tubesDistance();

            for (var key in tubesDist)
                if (tubesDist.hasOwnProperty(key))
                    if (tubesDist[key] > 0)
                        html += '<tr><td>' + key + ' mm</td><td>' + tubesDist[key].toFixed(2) + ' m</td></tr>';
        }

        html +=
            '</table>' +
            '<!-- Cables -->' +
            '<table class="table">' +
            '<tr>' +
            '<th colspan="3">Cablagem</th>' +
            '</tr>' +
            '<tr>' +
            '<th>Tipo</th>' +
            '<th>Referência</th>' +
            '<th>Comprimento</th>';

        // compute the total cable length by type
        var hasCables = false;
        for (var i = 0, n = cableTypes.length; i < n; i++) {
            for (var j = 0, m = qualities.length; j < m; j++) {
                if (cableTypes[i]['id'] == qualities[j]['idCabo']) {
                    var cableLength = computeCableLengthByQuality(qualities[j]['id']);

                    if (cableLength > 0) {
                        hasCables = true;

                        html +=
                            '<tr>' +
                            '<td>' + cableTypes[i]['tipo'] + '</td>' +
                            '<td>' + qualities[j]['nome'] + '</td>' +
                            '<td>' + cableLength.toFixed(2) + ' m</td>' +
                            '</tr>';
                    }
                }
            }
        }
        if (!hasCables)
            html +=
                '<tr class="bg-danger">' +
                '<td colspan="3" class="bg-danger">Não existem cabos instalados...</td>' +
                '</tr>';

        html +=
            '</table>' +
            '<!-- Checkout -->' +
            '<table class="table">' +
            '<tr>' +
            '<th colspan="14">Equipamento</th>' +
            '</tr>' +
            '<tr>' +
            '<th>Nó</th>' +
            '<th>Label</th>' +
            '<th class="hidden-xs hidden-sm">Código</th>' +
            '<th class="hidden-xs">Descrição</th>' +
            '<th class="hidden-xs hidden-sm">Aplicação</th>' +
            '<th class="hidden-xs hidden-sm hidden-md">Atenuação</th>' +
            '<th class="hidden-xs hidden-sm hidden-md">Espaço (o/r)</th>' +
            '<th class="hidden-xs">CC (e/s)</th>' +
            '<th class="hidden-xs">FO (e/s)</th>' +
            '<th class="hidden-xs">PC (e/s)</th>' +
            '<th>Preço</th>' +
            '<th class="hidden-xs hidden-sm">Dimensões (LxAxP)</th>' +
            '<th class="hidden-xs hidden-sm hidden-md">Localização</th>' +
            '<th class="hidden-xs hidden-sm">Observações</th>' +
            '</tr>';

        for (i = 0, n = nodes.length; i < n; i++) {

            // fetch the node by it's ID
            var node = nodes[i];

            if (!node['component'])
                continue;

            var list = [node['component']];
            for (j = 0, m = node['subcomponents'].length; j < m; j++)
                list.push(node['subcomponents'][j]);

            for (j = 0, m = list.length; j < m; j++) {

                var component = list[j];

                if (!component)
                    continue;

                total += parseFloat(component['preco']);

                var modeloAplicacao = getModeloAplicacao(component['idModeloAplicacao']);
                var applicationType = getTipoAplicacao(modeloAplicacao['idTipoAplicacao'])['nome'];
                var observacoes = (component['observacoes']) ? component['observacoes'].substr(0, 147) + '...' : 'nenhuma';

                html +=
                    '<tr>' +
                    '<td>' + getTipoNo(node) + ' nº.' + numberByType(nodes.indexOf(node)) + '</td>' +
                    '<td class="hidden-xs hidden-sm">' + (node.label || 'nenhuma') + '</td>' +
                    '<td>' + component['codigo'] + '</td>' +
                    '<td class="hidden-xs">' + component['descricao'] + '</td>' +
                    '<td class="hidden-xs hidden-sm">' + applicationType + '</td>' +
                    '<td class="hidden-xs hidden-sm hidden-md">' + component['atenuacao'] + ' dB</td>' +
                    '<td class="hidden-xs hidden-sm hidden-md">' + component['ocupado_Us'] + '/' + component['reservado_Us'] + '</td>' +
                    '<td class="hidden-xs">' + component['entradas_CC'] + '/' + component['saidas_CC'] + '</td>' +
                    '<td class="hidden-xs">' + component['entradas_FO'] + '/' + component['saidas_FO'] + '</td>' +
                    '<td class="hidden-xs">' + component['entradas_PC'] + '/' + component['saidas_PC'] + '</td>' +
                    '<td>' + component['preco'].toFixed(2) + ' €</td>' +
                    '<td class="hidden-xs hidden-sm">' + component['dimensao_L'] + '&times;' + component['dimensao_A'] + '&times;' + component['dimensao_P'] + ' cm</td>' +
                    '<td class="hidden-xs hidden-sm hidden-md">' + (component['localizacao'] || 'nenhuma') + '</td>' +
                    '<td class="hidden-xs hidden-sm">' + observacoes + '</td>' +
                    '</tr>';
            }
        }

        // print the final price
        html +=
            '<tr>' +
            '<th>Total</th>' +
            '<td colspan="13">' + total.toFixed(2) + ' €</td>' +
            '</tr>' +
            '</table>' +
            '<!-- Close -->' +
            '</div>' +
            '</div>' +
            '</div>';

        rightColumn.html(html);
        rightColumn.css('overflow-y', '');
    }

    resizeWorkspace();
}

/**
 * Navega na interface para a fase de "Inventário e diagramas"
 */
function checkout() {

    // reconstrói a interface do slider de navegação
    $('#slider').html(
        '<div class="col-lg-12 col-md-12 col-sm-12 col-xs-12">\n' +
        '<h1>Inventário e diagramas</h1>\n' +
        '<div class="carousel">\n' +
        '<ol class="carousel-indicators">\n' +
        '<a href="#" onclick="closeCheckout()" title="Desenho do diagrama"><span class="glyphicon glyphicon-triangle-left"></span></a>\n' +
        '<li title="Desenho do diagrama"></li>\n' +
        '<li title="Inventário e diagrama final" class="active"></li>\n' +
        '<a href="#" class="disabled"><span class="glyphicon glyphicon-triangle-right"></span></a>\n' +
        '</ol>\n' +
        '</div>\n' +
        '</div>\n'
    );

    // esconde a interface de "Desenho do diagrama" e apresenta a interface de "Inventário e diagramas"
    $('#topToolbar').addClass('hidden');
    $('#toolbox').addClass('hidden');
    $('#studio').addClass('hidden');
    $('#checkout').removeClass('hidden');

    // constrói o diagrama de tubagem a apresentar inicialmente consoante o tipo de planta
    //(vertical) ? verticalDiagram('tubos', 1) : updateCheckoutGUI('tubos', 1);
    updateCheckoutGUI('tubos', 1);
}

/**
 * Navega na interface para a fase de "Desenho do diagrama"
 */
function closeCheckout() {

    // reconstrói a interface do slider de navegação
    $('#slider').html(
        '<div class="col-lg-12 col-md-12 col-sm-12 col-xs-12">\n' +
        '<h1>Desenho do diagrama</h1>\n' +
        '<div class="carousel">\n' +
        '<ol class="carousel-indicators">\n' +
        '<a href="#" class="disabled"><span class="glyphicon glyphicon-triangle-left"></span></a>\n' +
        '<li title="Desenho do diagrama" class="active"></li>\n' +
        '<li title="Inventário e diagrama final"></li>\n' +
        '<a href="#" onclick="checkout()" title="Inventário e diagrama final"><span class="glyphicon glyphicon-triangle-right"></span></a>\n' +
        '</ol>\n' +
        '</div>\n' +
        '</div>\n'
    );

    // esconde a interface de "Inventário e diagramas" e apresenta a interface de "Desenho do diagrama"
    $('#topToolbar').removeClass('hidden');
    $('#toolbox').removeClass('hidden');
    $('#studio').removeClass('hidden');
    $('#checkout').addClass('hidden');
}

/**
 * compute the distance between 2 given points
 * @param start start point
 * @param end end point
 * @returns {number} distance between the start and end node
 */
function computeDistance(start, end) {
    return Math.sqrt(Math.pow(end.x - start.x, 2) + Math.pow(end.y - start.y, 2))
}

/**
 * update the distance for every link
 */
function updateDistances() {
    var start, end;
    for (var i = 0, n = links.length; i < n; i++) {
        start = {x: links[i].source.x, y: links[i].source.y};
        end = {x: links[i].target.x, y: links[i].target.y};
        links[i].distance = computeDistance(start, end);
    }
}

/**
 * get the index position of the first node of a given type
 * @returns {number} node index position
 */
function firstOfType(type) {
    for (var i = 0, n = nodes.length; i < n; i++)
        if (getTipoNo(nodes[i]) == type)
            return i;
    return -1;
}

/**
 * remove the info box
 */
function removeInfoBox() {
    var info = $('div.info');
    if (info.length)
        info.remove();
    showing_tooltip = false;
}

/**
 * close the modal box
 */
function closeModal() {
    var modal = $('#modal');
    if (modal.hasClass('in'))
        modal.modal('hide');

    grafo('map', typeGraph);
}

/**
 * set the initial parameters and loads the studio
 * @param id_obra
 * @param id_planta
 */
function setObra(id_obra, id_planta) {
    obraID = id_obra;
    plantaID = id_planta;
    load(id_planta);
}

/**
 * update a selected node info
 */
function updateNodeInfo() {

    var hasErrors = false;

    // input elements
    var heightElement = $('#nodeHeight');
    var amplificacaoElement = $('#amplificacao');
    var atenuacaoDerivacaoElement = $('#atenuacaoDerivacao');
    var atenuacaoInsercaoElement = $('#atenuacaoInsercao');
    var nivelSinalElement = $('#nivelSinal');

    // input values
    var height = parseInt(heightElement.val());
    var amplificacao = (!amplificacaoElement.val()) ? null : parseInt(amplificacaoElement.val());
    var atenuacaoDerivacao = (!atenuacaoDerivacaoElement.val()) ? null : parseInt(atenuacaoDerivacaoElement.val());
    var atenuacaoInsercao = (!atenuacaoInsercaoElement.val()) ? null : parseInt(atenuacaoInsercaoElement.val());
    var nivelSinal = (!nivelSinalElement.val()) ? null : parseInt(nivelSinalElement.val());
    var applicationId = $('#nodeApplication').val() || null;
    var application = (applicationId) ? getTipoAplicacao(applicationId) : null;
    var label = $('#labelValue').val();

    // amp elements
    var atenuadorElement = $('#atenuador');
    var atenuador1Element = $('#atenuador1');
    var atenuador2Element = $('#atenuador2');
    var equalizadorElement = $('#equalizador');
    var ganhoElement = $('#ganho');
    var ganho1Element = $('#ganho1');
    var ganho2Element = $('#ganho2');
    var nivelSaidaElement = $('#nivelSaida');
    var nivelSaidaRetornoElement = $('#nivelSaidaRetorno');
    var preAcentuadorElement = $('#preAcentuador');

    // amp values
    var atenuador = (!atenuadorElement.val()) ? null : parseInt(atenuadorElement.val());
    var atenuador1 = (!atenuador1Element.val()) ? null : parseInt(atenuador1Element.val());
    var atenuador2 = (!atenuador2Element.val()) ? null : parseInt(atenuador2Element.val());
    var equalizador = (!equalizadorElement.val()) ? null : parseInt(equalizadorElement.val());
    var ganho = (!ganhoElement.val()) ? null : parseInt(ganhoElement.val());
    var ganho1 = (!ganho1Element.val()) ? null : parseInt(ganho1Element.val());
    var ganho2 = (!ganho2Element.val()) ? null : parseInt(ganho2Element.val());
    var nivelSaida = (!nivelSaidaElement.val()) ? null : parseInt(nivelSaidaElement.val());
    var nivelSaidaRetorno = (!nivelSaidaRetornoElement.val()) ? null : parseInt(nivelSaidaRetornoElement.val());
    var preAcentuador = (!preAcentuadorElement.val()) ? null : parseInt(preAcentuadorElement.val());

    // verifica erros no amplificador

    // verifica se há erros (atenuador)
    if (isNaN(atenuador) && atenuador != null) {
        atenuadorElement.parent().addClass('has-error');
        hasErrors = true;
    } else
        atenuadorElement.parent().removeClass('has-error');

    // verifica se há erros (atenuador1)
    if (isNaN(atenuador1) && atenuador1 != null) {
        atenuador1Element.parent().addClass('has-error');
        hasErrors = true;
    } else
        atenuador1Element.parent().removeClass('has-error');

    // verifica se há erros (atenuador2)
    if (isNaN(atenuador2) && atenuador2 != null) {
        atenuador2Element.parent().addClass('has-error');
        hasErrors = true;
    } else
        atenuador2Element.parent().removeClass('has-error');

    // verifica se há erros (equalizador)
    if (isNaN(equalizador) && equalizador != null) {
        equalizadorElement.parent().addClass('has-error');
        hasErrors = true;
    } else
        equalizadorElement.parent().removeClass('has-error');

    // verifica se há erros (ganho)
    if (isNaN(ganho) && ganho != null) {
        ganhoElement.parent().addClass('has-error');
        hasErrors = true;
    } else
        ganhoElement.parent().removeClass('has-error');

    // verifica se há erros (ganho1)
    if (isNaN(ganho1) && ganho1 != null) {
        ganho1Element.parent().addClass('has-error');
        hasErrors = true;
    } else
        ganho1Element.parent().removeClass('has-error');

    // verifica se há erros (ganho2)
    if (isNaN(ganho2) && ganho2 != null) {
        ganho2Element.parent().addClass('has-error');
        hasErrors = true;
    } else
        ganho2Element.parent().removeClass('has-error');

    // verifica se há erros (nivelSaida)
    if (isNaN(nivelSaida) && nivelSaida != null) {
        nivelSaidaElement.parent().addClass('has-error');
        hasErrors = true;
    } else
        nivelSaidaElement.parent().removeClass('has-error');

    // verifica se há erros (nivelSaidaRetorno)
    if (isNaN(nivelSaidaRetorno) && nivelSaidaRetorno != null) {
        nivelSaidaRetornoElement.parent().addClass('has-error');
        hasErrors = true;
    } else
        nivelSaidaRetornoElement.parent().removeClass('has-error');

    // verifica se há erros (preAcentuador)
    if (isNaN(preAcentuador) && preAcentuador != null) {
        preAcentuadorElement.parent().addClass('has-error');
        hasErrors = true;
    } else
        preAcentuadorElement.parent().removeClass('has-error');

    ////////////////////////////////////////////////////////

    // verifica se há erros (altura)
    if (isNaN(parseInt(height))) {
        heightElement.parent().addClass('has-error');
        hasErrors = true;
    } else
        heightElement.parent().removeClass('has-error');

    // verifica se há erros (nivel de sinal)
    if (isNaN(nivelSinal) && nivelSinal != null) {
        nivelSinalElement.parent().addClass('has-error');
        hasErrors = true;
    } else
        nivelSinalElement.parent().removeClass('has-error');

    // verifica se há erros (ajuste de amplificacao)
    if (isNaN(amplificacao) && amplificacao != null) {
        amplificacaoElement.parent().addClass('has-error');
        hasErrors = true;
    } else
        amplificacaoElement.parent().removeClass('has-error');

    // verifica se há erros (atenuação de derivação))
    if (isNaN(atenuacaoDerivacao) && atenuacaoDerivacao != null) {
        atenuacaoDerivacaoElement.parent().addClass('has-error');
        hasErrors = true;
    } else
        atenuacaoDerivacaoElement.parent().removeClass('has-error');

    // verifica se há erros (atenuação de inserção)
    if (isNaN(atenuacaoInsercao) && atenuacaoInsercao != null) {
        atenuacaoInsercaoElement.parent().addClass('has-error');
        hasErrors = true;
    } else
        atenuacaoInsercaoElement.parent().removeClass('has-error');

    // cancela atualização de houver erros
    if (hasErrors)
        return;

    // check if changes were made
    var save = (
        // amplificador
        atenuador != selected_node['properties']['atenuador'] ||
        atenuador1 != selected_node['properties']['atenuador1'] ||
        atenuador2 != selected_node['properties']['atenuador2'] ||
        equalizador != selected_node['properties']['equalizador'] ||
        ganho != selected_node['properties']['ganho'] ||
        ganho1 != selected_node['properties']['ganho1'] ||
        ganho2 != selected_node['properties']['ganho2'] ||
        nivelSaida != selected_node['properties']['nivelSaida'] ||
        nivelSaidaRetorno != selected_node['properties']['nivelSaidaRetorno'] ||
        preAcentuador != selected_node['properties']['preAcentuador'] ||
            // ati
        amplificacao != selected_node['properties']['amplificacao'] ||
        nivelSinal != selected_node['properties']['nivelSinal'] ||
            // derivador
        atenuacaoDerivacao != selected_node['properties']['atenuacaoDerivacao'] ||
        atenuacaoInsercao != selected_node['properties']['atenuacaoInsercao'] ||
            // geral
        height != selected_node.height ||
        application != selected_node.application ||
        label != selected_node.label
    );

    // atualizar altura
    if (height)
        selected_node.height = height;

    // atualizar ajuste de amplificação
    if (amplificacao)
        selected_node['properties']['amplificacao'] = amplificacao;

    // atualizar atenuação de derivação
    if (atenuacaoDerivacao)
        selected_node['properties']['atenuacaoDerivacao'] = atenuacaoDerivacao;

    // atualizar atenuação de inserção
    if (atenuacaoInsercao)
        selected_node['properties']['atenuacaoInsercao'] = atenuacaoInsercao;

    // atualizar nivel de sinal
    if (nivelSinal)
        selected_node['properties']['nivelSinal'] = nivelSinal;

    ///////////////////////////////////////////////////////////
    // atualizar info dos amplificadores

    // atualizar atenuador
    if (atenuador)
        selected_node['properties']['atenuador'] = atenuador;

    // atualizar atenuador1
    if (atenuador1)
        selected_node['properties']['atenuador1'] = atenuador1;

    // atualizar atenuador2
    if (atenuador2)
        selected_node['properties']['atenuador2'] = atenuador2;

    // atualizar equalizador
    if (equalizador)
        selected_node['properties']['equalizador'] = equalizador;

    // atualizar ganho
    if (ganho)
        selected_node['properties']['ganho'] = ganho;

    // atualizar ganho1
    if (ganho1)
        selected_node['properties']['ganho1'] = ganho1;

    // atualizar ganho2
    if (ganho2)
        selected_node['properties']['ganho2'] = ganho2;

    // atualizar nivel de saida
    if (nivelSaida)
        selected_node['properties']['nivelSaida'] = nivelSaida;

    // atualizar nivel de saída de retorno
    if (nivelSaidaRetorno)
        selected_node['properties']['nivelSaidaRetorno'] = nivelSaidaRetorno;

    // atualizar pre acentuador
    if (preAcentuador)
        selected_node['properties']['preAcentuador'] = preAcentuador;

    ///////////////////////////////////////////////////////////

    // atualizar  tipo de aplicação
    if (applicationId)
        selected_node.application = application;

    // atualizar label
    if (label.trim() == '')
        selected_node.label = null;
    else
        selected_node.label = label;

    // guardar alterações
    if (save) {
        saveOperation();
        restart();
    }

    closeModal();
}

/**
 * devolve um objeto com a contagem de cabos numa ligação, por tipo de cabo (ex. CC, FO, PC)
 * @param link objeto da ligação
 * @returns {{}} objeto com a contagem de cabos numa ligação, por tipo de cabo
 */
function countCablesInLinkByType(link) {
    // adiciona os tipos de cabo dinâmicamente
    var count = {};
    for (var i = 0, n = cableTypes.length; i < n; i++)
        count[cableTypes[i]['tipo']] = 0;

    // adiciona a contagem de cabos por tipo
    for (i = 0, n = tubes.length; i < n; i++) {
        if (compareLinks(tubes[i]['link'], link))
            for (var j = 0, m = cables.length; j < m; j++)
                if (cables[j]['idTubo'] == tubes[i]['id'])
                    count[cables[j]['tipo']]++;
    }
    return count;
}

/**
 * devolve um objeto com a contagem de cabos num tubo, por tipo de cabo (ex. CC, FO, PC)
 * @param tubeId id do tubo
 * @returns {{}} objeto com a contagem de cabos num tubo, por tipo de cabo
 */
function countCablesInTube(tubeId) {

    // adicionar os tipos de cabo dinâmicamente
    var count = {};
    for (var i = 0, n = cableTypes.length; i < n; i++)
        count[cableTypes[i]['tipo']] = 0;

    // contar o número de cabos por tipo
    for (i = 0, n = cables.length; i < n; i++)
        if (cables[i]['idTubo'] == tubeId)
            count[cables[i]['tipo']]++;

    return count;
}

/**
 * conta os cabos de determinado tipo, por qualidade
 * @param idNo1 id do nó de origem
 * @param idNo2 id do nó de destino
 * @param tipo tecnologia dos cabos
 * @returns {{}} contagem de cabos por qualidade
 */
function countCablesByLinkAndType(idNo1, idNo2, tipo) {

    var ligacao; // ligação
    var tubo = []; // tubos
    var cabo = []; // cables
    var resultado = {};
    tipo = tipo.toUpperCase();

    // encontra a ligação
    for (var i = 0, n = links.length; i < n; i++) {
        if ((links[i]['source']['id'] == idNo1 && links[i]['target']['id'] == idNo2) || (links[i]['source']['id'] == idNo2 && links[i]['target']['id'] == idNo1)) {
            ligacao = links[i];
            break;
        }
    }

    // encontra os tubos da ligação
    for (i = 0, n = tubes.length; i < n; i++)
        if (ligacao == tubes[i]['link'])
            tubo.push(tubes[i]['id']);

    // encontra os cabos dos tubos
    for (i = 0, n = tubo.length; i < n; i++)
        for (var j = 0, m = cables.length; j < m; j++)
            if (cables[j]['idTubo'] == tubo[i] && cables[j]['tipo'] == tipo)
                cabo.push(cables[j]);

    // conta os cabos por qualidade
    for (i = 0, n = cabo.length; i < n; i++) {
        var idQualidade = getQualidade(cabo[i]['idQualidade'])['id'];
        if (resultado.hasOwnProperty(idQualidade))
            resultado[idQualidade]++;
        else
            resultado[idQualidade] = 1;
    }

    // devolve o resultado
    return resultado;
}

/**
 * delete all cables inside a tube
 * @param tubeId tube ID
 */
function deleteCablesInTube(tubeId) {
    for (var i = 0; i < cables.length; i++) {
        if (cables[i]['idTubo'] == tubeId) {
            cables.splice(i, 1);
            i--;
        }
    }
}

/**
 * delete a tube
 * @param tubeId tube ID
 */
function deleteTube(tubeId) {
    for (var i = 0, n = tubes.length; i < n; i++) {
        if (tubes[i]['id'] == tubeId) {
            deleteCablesInTube(tubeId);
            tubes.splice(i, 1);
            return;
        }
    }
}

/**
 * show the delete tube dialog
 * @param tubeId tube ID
 */
function deleteTubeDialog(tubeId) {
    var element = $('#delete_tube_' + tubeId);
    element.prev().addClass('hidden');
    element.removeClass('hidden');
}

/**
 * cancel the delete tube dialog
 * @param tubeId tube ID
 */
function cancelDeleteTube(tubeId) {
    var element = $('#delete_tube_' + tubeId);
    element.prev().removeClass('hidden');
    element.addClass('hidden');
}

/**
 * delete the tube and all it's cables and erases them from the dialog
 * @param tubeId tube ID
 */
function confirmDeleteTube(tubeId) {
    deleteTube(tubeId);
    var element = $('#delete_tube_' + tubeId);
    element.prev().remove();
    element.next().remove();
    element.remove();

    restart();
}

/**
 * show the edit tube window
 * @param tubeId target tube ID
 */
function editTube(tubeId) {
    var element = $('#edit_tube_' + tubeId);
    var option = $('#tube-diameter-' + tubeId);

    if (element.hasClass('hidden')) {
        element.removeClass('hidden');
        option.removeAttr('disabled');
    } else {
        element.addClass('hidden');
        option.attr('disabled', true);
    }
}

/**
 * return an object array of qualities associated with a cable type
 * @param cableTypeId cable type id
 */
function getQualitiesByCableType(cableTypeId) {
    var results = [];
    for (var i = 0, n = qualities.length; i < n; i++)
        if (qualities[i]['idCabo'] == cableTypeId)
            results.push(qualities[i]);
    return results;
}

/**
 * update the options of qualities associated with a cable type
 * @param tubeId tube ID
 */
function updateNewQualityOptions(tubeId) {
    var cableTypeId = parseInt($('#new-cable-type-' + tubeId).val());
    var element = $('#new-cable-quality-' + tubeId);
    element.empty();
    $.each(getQualitiesByCableType(cableTypeId), function (key, value) {
        element.append($('<option></option>')
                .attr('value', value['id'])
                .text(value['nome'])
        );
    });
}

/**
 * update the options of qualities associated with a cable type
 * @param cableId cable ID
 */
function updateQualityOptions(cableId) {

    // fetch selected options
    var idTipo = parseInt($('#cable-type-' + cableId).val());

    // update the options
    var element = $('#cable-quality-' + cableId);
    element.empty();
    $.each(getQualitiesByCableType(idTipo), function (key, value) {
        element.append($('<option></option>')
                .attr('value', value['id'])
                .text(value['nome'])
        );
    });

    // update the cable values
    var cable = getCable(cableId);
    cable['tipo'] = $('#cable-type-' + cableId + ' option:selected').text();
    cable['idQualidade'] = parseInt($('#cable-quality-' + cableId + ' option:selected').val());

    restart();
}

/**
 * updates the quality of a cable
 * @param cableId cable id
 */
function changeQuality(cableId) {
    getCable(cableId)['idQualidade'] = parseInt($('#cable-quality-' + cableId + ' option:selected').val());
}

/**
 * update the diameter of a tube
 * @param tubeId tube ID
 */
function changeTubeDiameter(tubeId) {
    for (var i = 0, n = tubes.length; i < n; i++) {
        if (tubes[i]['id'] == tubeId) {
            for (var j = 0, m = diameters.length; j < m; j++) {
                var diameterId = $('#tube-diameter-' + tubeId).val();
                if (diameters[j]['id'] == diameterId) {
                    tubes[i]['diametro'] = diameters[j]['diametro'];
                    return;
                }
            }
        }
    }
}

/**
 * add a new tube
 */
function addTube() {
    var element = $('#new-tube');
    var option = $('#new-tube-diameter').val();
    var tubeId = 1;
    if (tubes.length > 0)
        tubeId = $(tubes).last()[0]['id'] + 1;

    // get diameter
    var diametro;
    for (var j = 0, m = diameters.length; j < m; j++)
        if (diameters[j]['id'] == option)
            diametro = diameters[j];

    var tubeQuantity = parseInt($('#tubeQuantity').val());
    var html = '';

    for (var i = 0, n = tubeQuantity; i < n; i++) {

        // push tube
        tubes.push({
            id: tubeId,
            idNo1: selected_link.source.id,
            idNo2: selected_link.target.id,
            link: selected_link,
            diametro: diametro.diametro
        });

        html +=
            '<!-- informação do tubo -->' +
            '<tr id="tubo-' + tubeId + '">' +
            '<td>' + tubeId + '</td>' +
            '<td><select class="form-control input-sm" id="tube-diameter-' + tubeId + '" disabled="">';

        // build diameter select/option
        for (j = 0, m = diameters.length; j < m; j++) {
            if (diameters[j]['id'] == option)
                html += '<option value="' + diameters[j]['id'] + '" selected>' + diameters[j]['diametro'] + ' mm</option>';
            else
                html += '<option value="' + diameters[j]['id'] + '">' + diameters[j]['diametro'] + ' mm</option>';
        }

        html += '</select></td>';

        for (i = 0, n = cableTypes.length; i < n; i++)
            html += '<td>0</td>';

        html +=
            '<td>-</td>' +
            '<td>' +
            '<button type="button" class="btn btn-default" title="Editar" onclick="editTube(' + tubeId + ')"><span class="glyphicon glyphicon-pencil"></span></button>' +
            '<button type="button" class="btn btn-danger" title="Apagar" onclick="deleteTubeDialog(' + tubeId + ')"><span class="glyphicon glyphicon-trash"></span></button>' +
            '</td>' +
            '</tr>' +

            '<!-- apagar tubo -->' +
            '<tr class="bg-danger hidden" id="delete_tube_' + tubeId + '">' +
            '<td colspan="' + (cableTypes.length + 3) + '">Confirmar eliminar?</td>' +
            '<td>' +
            '<button type="button" class="btn btn-default" title="Confirmar" onclick="confirmDeleteTube(' + tubeId + ')"><span class="glyphicon glyphicon-ok"></span></button>' +
            '<button type="button" class="btn btn-danger" title="Cancelar" onclick="cancelDeleteTube(' + tubeId + ')"><span class="glyphicon glyphicon-ban-circle"></span></button>' +
            '</td>' +
            '</tr>' +

            '<!-- editar tubo -->' +
            '<tr class="table hidden" id="edit_tube_' + tubeId + '">' +
            '<td colspan="' + (cableTypes.length + 4) + '" class="tube-edit">' +
            '<table class="table">' +
            '<!-- cabos -->' +
            '<tr>' +
            '<th>Cabo</th>' +
            '<th>Tipo</th>' +
            '<th>Referência</th>' +
            '<th>Quantidade</th>' +
            '<th>Ações</th>' +
            '</tr>' +
            '<!-- adicionar cabo -->' +
            '<tr class="bg-success" id="new-cable-' + tubeId + '">' +
            '<td>Novo</td>' +
            '<td><select class="form-control input-sm" id="new-cable-type-' + tubeId + '" onchange="updateNewQualityOptions(' + tubeId + ')">';

        // add cables
        for (j = 0, m = cableTypes.length; j < m; j++)
            html += '<option value="' + cableTypes[j]['id'] + '">' + cableTypes[j]['tipo'] + '</option>';

        html +=
            '</select></td>' +
            '<td><select class="form-control input-sm" id="new-cable-quality-' + tubeId + '">';

        // add qualities
        for (j = 0, m = qualities.length; j < m; j++)
            html += '<option value="' + qualities[j]['id'] + '">' + qualities[j]['nome'] + '</option>';

        html +=
            '</select></td>' +
            '<td><input class="form-control input-sm" type="number" placeholder="Quantidade" value="1" min="1" id="new-cable-quantity-' + tubeId + '"></td>' +
            '<td><button type="button" class="btn btn-default" title="Guardar" onclick="addCable(' + tubeId + ')"><span class="glyphicon glyphicon-plus"></span></button></td>' +
            '</tr>' +
            '<!-- fechar tabela -->' +
            '</table>' +
            '</td>' +
            '</tr>';

        tubeId++;
    }

    $(html).insertBefore(element);

    restart();
}

/**
 * add a new cable to a tube
 * @param tubeId tube ID
 */
function addCable(tubeId) {

    var element = $('#new-cable-' + tubeId);
    var cableId = 1;
    if (cables.length > 0)
        cableId = $(cables).last()[0]['id'] + 1;

    var cableTypeId = parseInt($('#new-cable-type-' + tubeId).val());
    var qualityId = parseInt($('#new-cable-quality-' + tubeId).val());
    var cableQuantity = parseInt($('#new-cable-quantity-' + tubeId).val());
    var html = '';

    for (var i = 0; i < cableQuantity; i++) {

        // push a new cable
        cables.push({
            id: cableId,
            idTubo: tubeId,
            idQualidade: $('#new-cable-quality-' + tubeId + ' option:selected').val(),
            tipo: $('#new-cable-type-' + tubeId + ' option:selected').text()
        });


        // ----------------------
        // -----add cable id-----
        // ----------------------

        html += '<tr id="cable-' + cableId + '"><td>' + cableId + '</td>';

        // -------------------------
        // -----add cable types-----
        // -------------------------

        html += '<td><select class="form-control input-sm" id="cable-type-' + cableId + '" onchange="updateQualityOptions(' + cableId + ')">';

        for (var j = 0, m = cableTypes.length; j < m; j++) {
            if (cableTypes[j]['id'] == cableTypeId)
                html += '<option value="' + cableTypes[j]['id'] + '" selected>' + cableTypes[j]['tipo'] + '</option>';
            else
                html += '<option value="' + cableTypes[j]['id'] + '">' + cableTypes[j]['tipo'] + '</option>';
        }

        html += '</select></td>';

        // -----------------------------
        // -----add cable qualities-----
        // -----------------------------

        html += '<td><select class="form-control input-sm" id="cable-quality-' + cableId + '">';

        for (j = 0, m = qualities.length; j < m; j++) {
            if (qualities[j]['idCabo'] == cableTypeId && qualities[j]['id'] == qualityId)
                html += '<option value="' + qualities[j]['id'] + '" selected>' + qualities[j]['nome'] + '</option>';
            else if (qualities[j]['idCabo'] == cableTypeId)
                html += '<option value="' + qualities[j]['id'] + '">' + qualities[j]['nome'] + '</option>';
        }

        html +=
            '</select></td>' +
            '<td>-</td>' +
            '<td><button type="button" class="btn btn-danger" title="Apagar" onclick="deleteCable(' + cableId + ')"><span class="glyphicon glyphicon-trash"></span></button></td>' +
            '</tr>';

        cableId++;
    }

    $(html).insertBefore(element);

    // atualizar contagem de cabos
    var childNumber = 3;
    var cableCount = countCablesInTube(tubeId);
    for (var key in cableCount)
        if (cableCount.hasOwnProperty(key))
            $('#tubo-' + tubeId + ' td:nth-child(' + childNumber++ + ')').text(cableCount[key]);

    restart();
}

/**
 * delete a cable
 * @param cableId cable ID
 */
function deleteCable(cableId) {

    var cabo = getCable(cableId);
    var tubo = getTubo(cabo.idTubo);

    $('#cable-' + cableId).remove();

    for (var i = 0, n = cables.length; i < n; i++) {
        if (cables[i]['id'] == cableId) {
            cables.splice(i, 1);
            break;
        }
    }

    // atualizar contagem de cabos
    var childNumber = 3;
    var cableCount = countCablesInTube(tubo.id);
    for (var key in cableCount)
        if (cableCount.hasOwnProperty(key))
            $('#tubo-' + tubo.id + ' td:nth-child(' + childNumber++ + ')').text(cableCount[key]);

    restart();
}

/**
 * return the IDs of tubes in a link
 * @param link link
 * @returns {Array} id of tubes in link
 */
function tubesInLink(link) {
    var id = [];
    for (var i = 0, n = tubes.length; i < n; i++)
        if (compareLinks(tubes[i]['link'], link))
            id.push(tubes[i]['id']);
    return id;
}

/**
 * Atualiza a lista de equipamento na janela de seleção de equipamento
 * @param nodeId id do nó
 * @param subcomponentIndex indíce do subcomponente no array de subcomponentes do nó
 */
function updateEquipmentList(nodeId, subcomponentIndex) {

    subcomponentIndex = (typeof subcomponentIndex == 'undefined' || subcomponentIndex == null) ? -1 : subcomponentIndex;

    var node = nodes[nodeId];

    var equipmentElement = $('#equipment');
    var value = equipmentElement.val();
    var list = $('#equipmentList');

    if (value == -1) {
        list.empty();
        return;
    }

    if (node['component'] == null || node['component'] != components[value])
        node['component'] = components[value];

    // obter e preparar informação
    var equipamento = (subcomponentIndex == -1) ? components[value] : node['subcomponents'][subcomponentIndex];
    var modeloAplicacao = getModeloAplicacao(equipamento['idModeloAplicacao']);
    var tipoAplicacao = getTipoAplicacao(modeloAplicacao['idTipoAplicacao']);
    var aplicacao = tipoAplicacao['nome'] || 'nenhuma';
    var espaco = equipamento['ocupado_Us'] + '/' + equipamento['reservado_Us'];
    var cc = equipamento['entradas_CC'] + '/' + equipamento['saidas_CC'];
    var fo = equipamento['entradas_FO'] + '/' + equipamento['saidas_FO'];
    var pc = equipamento['entradas_PC'] + '/' + equipamento['saidas_PC'];
    var dimensoes = equipamento['dimensao_L'] + 'x' + equipamento['dimensao_A'] + 'x' + equipamento['dimensao_P'];
    var modulos = equipamento['minSub'] + '/' + equipamento['maxSub'];

    // construir estrutura da informação
    var info = [
        {nome: 'Código', valor: equipamento['codigo']},
        {nome: 'Descrição', valor: equipamento['descricao']},
        {nome: 'Aplicação', valor: aplicacao},
        {nome: 'Atenuação', valor: equipamento['atenuacao'], label: 'dB'},
        {nome: 'Espaço (o/r)', valor: espaco},
        {nome: 'CC (e/s)', valor: cc},
        {nome: 'FO (e/s)', valor: fo},
        {nome: 'PC (e/s)', valor: pc},
        {nome: 'Dimensões (LxAxP)', valor: dimensoes, label: 'mm'},
        {nome: 'Preço', valor: equipamento['preco'], label: '€'},
        {nome: 'Localização', valor: equipamento['localizacao'] || 'N/A'},
        {nome: 'Link', valor: equipamento['link'] || 'N/A'},
        {nome: 'Min./Máx. módulos', valor: modulos}
    ];

    // construir interface da informação
    var temPropriedades = (!$.isEmptyObject(node['properties']) || (subcomponentIndex != -1 && node['subcomponents'][subcomponentIndex]['properties'].length > 0));
    var colunas = (temPropriedades && subcomponentIndex == -1)
        ? 4
        : 6;
    var classeGrid = 'col-lg-' + colunas + ' col-md-' + colunas + ' col-sm-' + colunas + ' col-xs-12';
    var html =
        '<div class="row" style="margin-top: 20px;">' +
        '<!-- Características -->' +
        '<div class="' + classeGrid + '">' +
        '<h4>Características</h4>' +
        '<table class="table">';

    for (var i = 0, n = info.length; i < n; i++) {
        html += '<tr>';
        for (var key in info[i]) {
            if (info[i].hasOwnProperty(key)) {
                switch (key) {
                    case 'nome':
                        html += '<th>' + info[i][key] + '</th>';
                        break;
                    case 'valor':
                        html += '<td>' + info[i][key];
                        break;
                    case 'label':
                        html += ' ' + info[i][key];
                        break;
                }
            }
        }
        html += '</td></tr>';
    }

    html += '</table></div>';

    console.log("temPropriedades: " + temPropriedades);

    // apresentar propriedades do componente
    if (temPropriedades) {
        html +=
            '<!-- Propriedades -->' +
            '<div class="' + classeGrid + '">' +
            '<h4>Propriedades</h4>' +
            '<table class="table">';

        if (subcomponentIndex == -1) {
            // apresentar propriedades dinâmicas (componente)
            for (key in node['properties'])
                if (node['properties'].hasOwnProperty(key))
                    html += '<tr><td>' + key + '</td><td><input id="' + key + '" type="number" class="form-control input-sm" value="' + node['properties'][key] + '"></td></tr>';
        } else {
            // apresentar propriedades dinâmicas (módulo)
            var propriedades = node['subcomponents'][subcomponentIndex]['properties'];

            for (i = 0, n = propriedades.length; i < n; i++) {
                html +=
                    '<tr>' +
                    '<td>' + propriedades[i]['label'] + '</td>' +
                    '<td>' +
                    '<div class="input-group input-group-sm">' +
                    '<input type="' + propriedades[i]['tipo'] + '" min="0" class="form-control input-sm" id="' + propriedades[i]['nome'] + '" placeholder="' + propriedades[i]['label'] + '">' +
                    ((propriedades[i]['unidades']) ? '<span class="input-group-addon">' + propriedades[i]['unidades'] + '</span>' : null) +
                    '</div>' +
                    '</td></tr>';
            }

            if (propriedades.length == 0)
                html += '<tr><td class="bg-danger">Este componente não tem propriedades editáveis...</td></tr>';
        }
        html += '</table></div>';
    }

    // apresentar módulos do equipamento
    if (subcomponentIndex == -1) {
        html +=
            '<!-- Módulos -->' +
            '<div class="' + classeGrid + '">' +
            '<h4>Módulos</h4>' +
            '<table class="table">' +
            '<!-- Adicionar módulo -->' +
            '<tr class="bg-success">' +
            '<td>Novo</td>' +
            '<td>' +
            '<select class="form-control input-sm" id="novoModulo">';

        // adicionar opções à lista
        for (i = 0, n = tiposComponente.length; i < n; i++)
            html += '<option value="' + tiposComponente[i]['id'] + '">' + tiposComponente[i]['description'] + '</option>';

        html +=
            '</select>' +
            '</td>' +
            '<td>' +
            '<button type="button" class="btn btn-sm btn-default" onclick="novoModulo(' + nodeId + ')"><span class="glyphicon glyphicon-plus"></span></button>' +
            '</td>' +
            '</tr>';

        // apresentar módulos
        for (i = 0, n = node['subcomponents'].length; i < n; i++) {

            var subcomponente = node['subcomponents'][i];
            var tipoComponente = getTipoComponente(getModeloAplicacao(subcomponente['idModeloAplicacao'])['idTipoComponente'])['name'];

            html +=
                '<tr>' +
                '<td>' + tipoComponente + '</td>' +
                '<td><select class="form-control input-sm">';

            for (var j = 0, m = components.length; j < m; j++) {
                if (tipoComponente == getTipoComponente(getModeloAplicacao(components[j]['idModeloAplicacao'])['idTipoComponente'])['name'])
                    html += (components[j] == subcomponente)
                        ? '<option value="' + components[j]['id'] + '" selected>' + components[j]['codigo'] + '</option>'
                        : '<option value="' + components[j]['id'] + '">' + components[j]['codigo'] + '</option>';
            }

            html +=
                '</td>' +
                '<td class="fit">' +
                '<button type="button" class="btn btn-sm btn-default" onclick="updateEquipmentList(' + nodeId + ',' + i + ')"><span class="glyphicon glyphicon-pencil"></span></button>&nbsp;' +
                '<button type="button" class="btn btn-sm btn-danger" onclick="removeEquipmentList(' + nodeId + ',' + i + ')"><span class="glyphicon glyphicon-trash"></span></button>' +
                '</td>' +
                '</tr>';
        }

        html +=
            '</table>' +
            '</div>';

        equipmentElement.removeClass('hidden');
        $('#equipmentMenu').addClass('hidden');
    } else {
        equipmentElement.addClass('hidden');
        $('#equipmentMenu').removeClass('hidden');
        $('#equipmentName').html(
            '<ol class="breadcrumb text-left">' +
            '<li><a href="#" onclick="updateEquipmentList(' + nodeId + ', null)">' + node['component']['codigo'] + '</a></li>' +
            '<li class="active">' + equipamento['codigo'] + '</li>' +
            '</ol>'
        );
    }

    // aplicar html ao elemento
    list.html(html);
}

/**
 * Remove da lista de equipamentos o equipamento seleccionado
 */
function removeEquipmentList(nodeId, subcomponentIndex) {

    var node = nodes[nodeId];
    node['subcomponents'].splice(subcomponentIndex, 1);
    updateEquipmentList(nodeId);

    $(this).parent().parent().remove();
}


/**
 * Adiciona um módulo a um equipamento
 * @param nodeId id do nó
 */
function novoModulo(nodeId) {
    var node = nodes[nodeId];
    var novoModuloElement = $('#novoModulo');
    var idTipoComponente = novoModuloElement.val();

    // encontrar o 1º componente do tipo de componente escolhido
    for (var i = 0, n = components.length; i < n; i++) {
        var modeloAplicacaoEquipamento = getModeloAplicacao(components[i]['idModeloAplicacao']);
        var idTipoComponenteEquipamento = modeloAplicacaoEquipamento['idTipoComponente'];
        if (idTipoComponente == idTipoComponenteEquipamento) {
            var tipoComponente = getTipoComponente(idTipoComponente);
            var subcomponente = deepCopy(components[i]);
            subcomponente['properties'] = tipoComponente['properties'];
            node['subcomponents'].push(subcomponente);
            break;
        }
    }

    updateEquipmentList(nodeId);
}


/**
 * assigns an equipment to a node
 * @param nodeIndex node index
 */
function selectEquipment(nodeIndex) {

    var node = nodes[nodeIndex];
    var option = $('#equipment').val();

    if (option == -1) {
        node['component'] = null;
        node['subcomponents'] = [];
    } else {
        node['component'] = components[option];
        var amplificacao = $('#amplificacao').val();
        var nivelSinal = $('#nivelSinal').val();
        node['properties']['amplificacao'] = amplificacao;
        node['properties']['nivelSinal'] = nivelSinal;
    }
    //shoppingCart.push(node);

    closeModal();
}

/**
 * load a specific version of a Planta into the studio
 * @param versionId version ID
 */
function loadVersion(versionId) {
    // perform ajax request
    $.ajax({
        type: 'POST',
        url: '/planta/' + plantaID + '/loadVersion',
        crossDomain: true,
        data: {'versao': versionId},
        dataType: 'json',
        async: true,
        success: function (response) {
            resetStudio();
            cables = response['cables'];
            floors = response['floors'];
            size = response['size'];
            insertNodes(response['nodes']);
            insertLinks(response['links']);
            insertTubes(response['tubes']);
            updateMatrix();
            scalePlanta(0);
            restart();
            panZoom.resetZoom();
        },
        error: function (response, status, error) {
            logErrors(response, status, error, 'Ocorreu um erro ao carregar a versão do projeto.');
        },
        complete: function () {
            closeModal();
        }
    });
}

/**
 * show the confirm delete element
 * @param versionId version id
 */
function deleteVersion(versionId) {
    $('#version-delete-' + versionId).removeClass('hidden');
    $('#version-info-' + versionId).addClass('hidden');
}

/**
 * delete the version and the HTML element
 * @param versionId version id
 */
function confirmDeleteVersion(versionId) {
    $('#version-delete-' + versionId).remove();
    $('#version-info-' + versionId).remove();

    // perform ajax request
    $.ajax({
        type: 'POST',
        url: '/planta/' + plantaID + '/deleteVersion',
        crossDomain: true,
        data: {'versao': versionId},
        dataType: 'json',
        async: true,
        error: function (response, status, error) {
            logErrors(response, status, error, 'Ocorreu um erro ao apagar a versão do projeto.');
        },
        success: function (response) {
            for (var i = 0, n = versions.length; i < n; i++) {
                if (response.version == versions[i]['id']) {
                    versions.splice(i, 1);
                    break;
                }
            }
        }
    });
}

/**
 * cancel the deletion of the version and reshow the previous interface
 * @param versionId version id
 */
function cancelDeleteVersion(versionId) {
    $('#version-delete-' + versionId).addClass('hidden');
    $('#version-info-' + versionId).removeClass('hidden');
}

/**
 * reload the ati nodes from an Obra into a Planta
 */
function reloadATINodes() {

    var newNodes = loadAti(obraID, plantaID, false) || [];
    if (newNodes.length == 0) {
        alert('Nada a carregar...');
        return;
    }

    insertNodes(newNodes);
    restart();
}

/**
 * reload the ati nodes from an Obra into a Planta
 */
function reloadCCNodes() {

    var newNodes = loadCC(obraID, plantaID, false) || [];
    if (newNodes.length == 0) {
        alert('Nada a carregar...');
        return;
    }

    insertNodes(newNodes);
    restart();
}

/**
 * update the SVG's stroke width
 */
function updateStrokeWidth() {
    var g = $('#planta');
    g.attr('stroke-width', (0.1 / scale));
    g.attr('transform', 'scale(' + size + ')');
}

/**
 * computes the length of all cables of a certain quality and the nodes height where the cables are attatched
 * @param qualityId cable quality id
 * @returns {number} cable length
 */
function computeCableLengthByQuality(qualityId) {

    var targetCables = [];
    var targetTubes = [];
    var targetNodes = [];
    var length = 0;
    var qualidade = getQualidade(qualityId)['id'];

    // fetch cables with quality
    for (var i = 0, n = cables.length; i < n; i++)
        if (cables[i]['idQualidade'] == qualidade)
            targetCables.push(cables[i]);

    // fetch tubes with cables
    for (i = 0, n = targetCables.length; i < n; i++)
        for (var j = 0, m = tubes.length; j < m; j++)
            if (targetCables[i]['idTubo'] == tubes[j]['id'])
                targetTubes.push(tubes[j]);

    // fetch links with tubes
    for (i = 0, n = targetTubes.length; i < n; i++) {
        length += targetTubes[i]['link']['distance'] * scale;
        if ($.inArray(targetTubes[i]['link']['source'], targetNodes) == -1)
            length += targetTubes[i]['link']['source']['height'] / 100;
        if ($.inArray(targetTubes[i]['link']['target'], targetNodes) == -1)
            length += targetTubes[i]['link']['target']['height'] / 100;
    }

    return length;
}

/**
 * maximize the svg graph
 */
function maximizeSVG() {
    $('#fullscreen').removeClass('hidden');
    applyPanZoom('#fullscreenSVG');
}

/**
 * minimize the svg graph
 */
function minimizeSVG() {
    $('#fullscreen').addClass('hidden');
    applyPanZoom('#map');
}

/**
 * apply the panZoom tool on a selected element
 * @param element element identifier
 */
function applyPanZoom(element) {

    if (panZoom != null)
        delete panZoom;

    panZoom = svgPanZoom(element, {
        panEnabled: true,
        zoomEnabled: true,
        dblClickZoomEnabled: false,
        controlIconsEnabled: true,
        center: true,
        fit: true,
        minZoom: 0,
        maxZoom: 9999
    });

    panZoom.resize();
    panZoom.fit();
    panZoom.center();
    panZoom.zoomOut();
}

/**
 * filters the equipment list to match a node's contraints
 * @param nodeIndex node index
 * @returns {Array} list of assignable equipment
 */
function filterEquipment(nodeIndex) {

    var inventory = [];
    var node = nodes[nodeIndex];

    // don't show recommendations for certain node types
    if ($.inArray(getTipoNo(node), excludeList) != -1)
        return inventory;

    // fetch application model id
    var idTipoComponente = node['componentType']['id'];
    var idTipoAplicacao = node['application']['id'];
    var idModeloAplicacao;

    for (var i = 0, n = applicationModels.length; i < n; i++) {
        if (applicationModels[i]['idTipoComponente'] == idTipoComponente && applicationModels[i]['idTipoAplicacao'] == idTipoAplicacao) {
            idModeloAplicacao = applicationModels[i]['id'];
            break;
        }
    }

    // select aproppriate components
    for (i = 0, n = components.length; i < n; i++)
        if (
            idModeloAplicacao == getModeloAplicacao(components[i]['idModeloAplicacao'])['id'] &&
                //(countByCable('CATV', node).in + countByCable('MATV', node).in) <= components[i]['entradas_CC'] &&
                //(countByCable('CATV', node).out + countByCable('MATV', node).out) <= components[i]['saidas_CC'] &&
            countByCable('CC', node).in <= components[i]['entradas_CC'] &&
            countByCable('CC', node).out <= components[i]['saidas_CC'] &&
            countByCable('FO', node).in <= components[i]['entradas_FO'] &&
            countByCable('FO', node).out <= components[i]['saidas_FO'] &&
            countByCable('PC', node).in <= components[i]['entradas_PC'] &&
            countByCable('PC', node).out <= components[i]['saidas_PC']
        )
            inventory.push(components[i]); // add result

    return inventory;
}

/**
 * update the list of recommendations for the selected node
 * @param nodeIndex node index
 */
function updateRecommendations(nodeIndex) {

    // set status of each node in the list
    $('#shopping').find('li.list-group-item').each(function () {
        var thisNodeIndex = parseInt($(this).attr('id').substr(5));
        if (nodeIndex == thisNodeIndex)
            $(this).addClass('active'); // activate selected node
        else
            $(this).removeClass('active'); // deactivate node
        // check if node has component
        if (!nodes[thisNodeIndex].component)
            $(this).css('color', '#a94442'); // true
        else
            $(this).css('color', ''); // false
    });

    var equipment = $('#equipment-list');
    equipment.find('table tr:gt(0)').remove(); // remove previous recommendations

    var html;

    // list solutions
    // check if node has solutions
    if (basket[nodeIndex].length > 0) {

        // get the default component
        var defaultId = nodes[nodeIndex]['componentType']['default'];

        if (defaultId) {
            var result = getComponent(defaultId);

            // get application type variables
            modeloAplicacao = getModeloAplicacao(result['idModeloAplicacao']);
            tipoAplicacao = getTipoAplicacao(modeloAplicacao['idTipoAplicacao']);
            var observacoes = (result['observacoes']) ? result['observacoes'].substr(0, 147) + '...' : 'nenhuma';

            html =
                '<tr class="bg-info">' +
                '<td class="hidden-xs">' + (result['codigo'] || 'nenhum') + '</td>' +
                '<td>' + (result['descricao'] || 'nenhuma') + '</td>' +
                '<td>' + tipoAplicacao['nome'] + '</td>' +
                '<td class="hidden-xs hidden-sm">' + result['atenuacao'] + ' dB</td>' +
                '<td class="hidden-xs hidden-sm">' + result['ocupado_Us'] + '/' + result['reservado_Us'] + ' U</td>' +
                '<td class="hidden-xs">' + result['entradas_CC'] + '/' + result['saidas_CC'] + '</td>' +
                '<td class="hidden-xs">' + result['entradas_FO'] + '/' + result['saidas_FO'] + '</td>' +
                '<td class="hidden-xs">' + result['entradas_PC'] + '/' + result['saidas_PC'] + '</td>' +
                '<td>' + result['preco'] + ' €</td>' +
                '<td class="hidden-xs hidden-sm">' + result['dimensao_L'] + '&times;' + result['dimensao_A'] + '&times;' + result['dimensao_P'] + ' cm</td>' +
                '<td class="hidden-xs hidden-sm hidden-md">' + (result['localizacao'] || 'nenhuma') + '</td>' +
                '<td class="hidden-xs hidden-sm">' + observacoes + '</td>';
            if (nodes[nodeIndex]['component'] == result)
                html += '<td><button class="btn btn-sm btn-success select-component" id="component-' + result.id + '" title="Selecionar" onclick="saveComponent(' + result.id + ')"><span class="glyphicon glyphicon-ok"></span></button></td>';
            else
                html += '<td><button class="btn btn-sm btn-default select-component" id="component-' + result.id + '" title="Selecionar" onclick="saveComponent(' + result.id + ')"><span class="glyphicon glyphicon-ok"></span></button></td>';
            html += '</tr>';
        }

        // print every solution for a certain node
        for (var j = 0, m = basket[nodeIndex].length; j < m; j++) {

            // fetch results
            result = basket[nodeIndex][j];

            // avoid duplicates if default is defined
            if (defaultId && defaultId == result['id'])
                continue;

            // get modelo e tipo de aplicacao
            var modeloAplicacao = getModeloAplicacao(result['idModeloAplicacao']);
            var tipoAplicacao = getTipoAplicacao(modeloAplicacao['idTipoAplicacao']);
            observacoes = (result['observacoes']) ? result['observacoes'].substr(0, 147) + '...' : 'nenhuma';

            html +=
                '<tr>' +
                '<td class="hidden-xs">' + (result['codigo'] || 'nenhum') + '</td>' +
                '<td>' + (result['descricao'] || 'nenhuma') + '</td>' +
                '<td>' + tipoAplicacao['nome'] + '</td>' +
                '<td class="hidden-xs hidden-sm">' + result['atenuacao'] + ' dB</td>' +
                '<td class="hidden-xs hidden-sm">' + result['ocupado_Us'] + '/' + result['reservado_Us'] + ' U</td>' +
                '<td class="hidden-xs">' + result['entradas_CC'] + '/' + result['saidas_CC'] + '</td>' +
                '<td class="hidden-xs">' + result['entradas_FO'] + '/' + result['saidas_FO'] + '</td>' +
                '<td class="hidden-xs">' + result['entradas_PC'] + '/' + result['saidas_PC'] + '</td>' +
                '<td>' + result['preco'] + ' €</td>' +
                '<td class="hidden-xs hidden-sm">' + result['dimensao_L'] + '&times;' + result['dimensao_A'] + '&times;' + result['dimensao_P'] + ' cm</td>' +
                '<td class="hidden-xs hidden-sm hidden-md">' + (result['localizacao'] || 'nenhuma') + '</td>' +
                '<td class="hidden-xs hidden-sm">' + observacoes + '</td>';
            if (nodes[nodeIndex]['component'] == result)
                html += '<td><button class="btn btn-sm btn-success select-component" id="component-' + result.id + '" title="Selecionar" onclick="saveComponent(' + result.id + ')"><span class="glyphicon glyphicon-ok"></span></button></td>';
            else
                html += '<td><button class="btn btn-sm btn-default select-component" id="component-' + result.id + '" title="Selecionar" onclick="saveComponent(' + result.id + ')"><span class="glyphicon glyphicon-ok"></span></button></td>';
            html += '</tr>';
        }
    }
    // no solutions found
    else {
        html =
            '<tr>' +
            '<td class="bg-danger visible-xs" colspan="4">Não foram encontrados equipamentos para este nó...</td>' +
            '<td class="bg-danger visible-sm" colspan="8">Não foram encontrados equipamentos para este nó...</td>' +
            '<td class="bg-danger visible-md" colspan="12">Não foram encontrados equipamentos para este nó...</td>' +
            '<td class="bg-danger visible-lg" colspan="13">Não foram encontrados equipamentos para este nó...</td>' +
            '</tr>';
    }

    equipment.find('table').append(html);

    // toggle subequiment visible
    if (nodes[nodeIndex]['component'])
        $('#subequipment-list').removeClass('hidden');
    else
        $('#subequipment-list').addClass('hidden');

    // show selected equipment info
    if (nodes[nodeIndex]['component']) {
        var component = nodes[nodeIndex]['component'];
        observacoes = (component['observacoes']) ? component['observacoes'].substr(0, 147) + '...' : 'nenhuma';
        modeloAplicacao = getModeloAplicacao(component['idModeloAplicacao']);
        var aplicacao = getTipoAplicacao(modeloAplicacao['idTipoAplicacao'])['nome'];

        var imagem = (component['imagem'])
            ? ('/bundles/ieetaited/images/equipamentos/' + component['imagem'])
            : ('/bundles/ieetaited/images/placeholders/' + (getTipoNo(nodes[nodeIndex]).toLowerCase() + '.png'));

        html =
            '<h2>Equipamento selecionado</h2>' +
            '<table class="table hidden-xs">' +
            '<!-- row -->' +
            '<tr>' +
            '<td class="hidden-sm hidden-xs" rowspan="4"><img class="img-thumbnail" src="' + imagem + '"></td>' +
            '<td><strong>Código:</strong> ' + component['codigo'] + '</td>' +
            '<td><strong>Espaço (o/r):</strong> ' + component['ocupado_Us'] + '/' + component['reservado_Us'] + ' U</td>' +
            '<td><strong>Dimensões (L&times;A&times;P):</strong> ' + component['dimensao_L'] + '&times;' + component['dimensao_A'] + '&times;' + component['dimensao_P'] + ' cm</td>' +
            '<td><strong>Min. módulos:</strong> ' + component['minSub'] + '</td>' +
            '</tr>' +
            '<!-- row -->' +
            '<tr>' +
            '<td><strong>Descrição:</strong> ' + component['descricao'] + '</td>' +
            '<td><strong>CC (e/s):</strong> ' + component['entradas_CC'] + '/' + component['saidas_CC'] + '</td>' +
            '<td><strong>Preço:</strong> ' + component['preco'] + ' €</td>' +
            '<td><strong>Máx. módulos:</strong> ' + component['maxSub'] + '</td>' +
            '</tr>' +
            '<!-- row -->' +
            '<tr>' +
            '<td><strong>Aplicação:</strong> ' + aplicacao + '</td>' +
            '<td><strong>FO (e/s):</strong> ' + component['entradas_FO'] + '/' + component['saidas_FO'] + '</td>' +
            '<td><strong>Localização:</strong> ' + (component['localizacao'] || 'nenhuma') + '</td>' +
            '<td rowspan="2"><strong>Observações:</strong> ' + observacoes + '</td>' +
            '</tr>' +
            '<!-- row -->' +
            '<tr>' +
            '<td><strong>Atenuação:</strong> ' + component['atenuacao'] + ' dB</td>' +
            '<td><strong>PC (e/s):</strong> ' + component['entradas_PC'] + '/' + component['saidas_PC'] + '</td>' +
            '<td><strong>Link:</strong> ' + (component['link'] || 'nenhum') + '</td>' +
            '</tr>' +
            '</table>';

        html +=
            '<div class="visible-xs testFields">' +
            '<div class="input-group input-group-sm"><span class="input-group-addon"><label>Código</label></span><span class="form-control">' + component['codigo'] + '</span></div>' +
            '<div class="input-group input-group-sm"><span class="input-group-addon"><label>Descrição</label></span><span class="form-control">' + component['descricao'] + '</span></div>' +
            '<div class="input-group input-group-sm"><span class="input-group-addon"><label>Aplicação</label></span><span class="form-control">' + (component['aplicacao'] || 'nenhuma') + '</span></div>' +
            '<div class="input-group input-group-sm"><span class="input-group-addon"><label>Atenuação</label></span><span class="form-control">' + component['atenuacao'] + '</span><span class="input-group-addon">dB</span></div>' +
            '<div class="input-group input-group-sm"><span class="input-group-addon"><label>Espaço (o/r)</label></span><span class="form-control">' + component['ocupado_Us'] + '/' + component['reservado_Us'] + '</span></div>' +
            '<div class="input-group input-group-sm"><span class="input-group-addon"><label>CC (e/s)</label></span><span class="form-control">' + component['entradas_CC'] + '/' + component['saidas_CC'] + '</span></div>' +
            '<div class="input-group input-group-sm"><span class="input-group-addon"><label>FO (e/s)</label></span><span class="form-control">' + component['entradas_FO'] + '/' + component['saidas_FO'] + '</span></div>' +
            '<div class="input-group input-group-sm"><span class="input-group-addon"><label>PC (e/s)</label></span><span class="form-control">' + component['entradas_PC'] + '/' + component['saidas_PC'] + '</span></div>' +
            '<div class="input-group input-group-sm"><span class="input-group-addon"><label>Dimensões (L&times;A&times;P)</label></span><span class="form-control">' + component['dimensao_L'] + '&times;' + component['dimensao_A'] + '&times;' + component['dimensao_P'] + '</span><span class="input-group-addon">mm</span></div>' +
            '<div class="input-group input-group-sm"><span class="input-group-addon"><label>Preço</label></span><span class="form-control">' + component['preco'] + '</span><span class="input-group-addon">€</span></div>' +
            '<div class="input-group input-group-sm"><span class="input-group-addon"><label>Localização</label></span><span class="form-control">' + (component['localizacao'] || 'nenhuma') + '</span></div>' +
            '<div class="input-group input-group-sm"><span class="input-group-addon"><label>Link</label></span><span class="form-control">' + (component['link'] || 'nenhum') + '</span></div>' +
            '<div class="input-group input-group-sm"><span class="input-group-addon"><label>Min./Máx. módulos</label></span><span class="form-control">' + component['minSub'] + '/' + component['maxSub'] + '</span></div>' +
            '<div class="input-group input-group-sm"><span class="input-group-addon"><label>Observações</label></span><span class="form-control">' + (component['observacoes'] || 'nenhuma') + '</span></div>' +
            '</div>';

        $('#selected-equipment-info').html(html);

        // show modules
        if (component['maxSub'] > 0) {

            // table header
            html =
                '<tr>' +
                '<th>Componente</th>' +
                '<th class="shrink">Ação</th>' +
                '<th class="shrink"><span class="hidden-xs">Obrigatório</span><span class="visible-xs" style="font-size: 20px;">*</span></th>' +
                '</tr>';

            // table body
            for (var i = 0, n = component['maxSub']; i < n; i++) {
                html +=
                    '<tr>' +
                    '<td><select class="form-control input-sm" id="subcomponent-' + i + '">' +
                    '<option value="">Nenhum</option>';

                var hasComponent = false;

                for (j = 0, m = components.length; j < m; j++)
                    if (nodes[nodeIndex]['subcomponents'][i] == components[j]) {
                        hasComponent = true;
                        html += '<option value="' + components.indexOf(components[j]) + '" selected>' + components[j]['descricao'] + '</option>';
                    }
                    else if (components[j]['subcomponente'])
                        html += '<option value="' + components.indexOf(components[j]) + '">' + components[j]['descricao'] + '</option>';

                html +=
                    '</select>' +
                    '</td>' +
                    '<td>' +
                    '<button class="btn btn-sm btn-default' + ((!hasComponent) ? '' : ' hidden') + '" id="save-sub-' + i + '" onclick="saveSubcomponent(' + i + ')"><span class="glyphicon glyphicon-ok"></span></button>' +
                    '<button class="btn btn-sm btn-danger' + ((hasComponent) ? '' : ' hidden') + '" id="remove-sub-' + i + '" onclick="removeSubcomponent(' + i + ')"><span class="glyphicon glyphicon-trash"></span></button>' +
                    '</td>';

                if (i < component['minSub'])
                    html += '<td class="text-danger" style="font-size: 20px;">*</td></tr>';
                else
                    html += '<td></td></tr>';
            }

            // inject table html
            var modules = $('#modules');
            modules.find('table').html(html);
            modules.removeClass('hidden');
        }
    }

    resizeWorkspace();
}

/**
 * save node main component
 * @param componentIndex component index
 */
function saveComponent(componentIndex) {
    var nodeIndex = parseInt($('#node-list').find('.list-group-item.active').attr('id').substr(5));
    nodes[nodeIndex]['component'] = components[componentIndex - 1];
    nodes[nodeIndex]['subcomponents'] = []; // reset subcomponent list
    updateRecommendations(nodeIndex);

    $('.select-component').each(function (index) {
        if ($(this).attr('id') == ('component-' + componentIndex))
            $(this).attr('class', 'select-component btn btn-sm btn-success');
        else
            $(this).attr('class', 'select-component btn btn-sm btn-default');
    });
}

/**
 * save node subcomponent
 * @param index subcomponent index in node
 */
function saveSubcomponent(index) {
    var nodeIndex = parseInt($('#node-list').find('.list-group-item.active').attr('id').substr(5));
    var componentIndex = parseInt($('#subcomponent-' + index).val());

    if (componentIndex) {
        nodes[nodeIndex]['subcomponents'][index] = components[componentIndex];
        $('#save-sub-' + index).addClass('hidden');
        $('#remove-sub-' + index).removeClass('hidden');
    }
    else
        nodes[nodeIndex]['subcomponents'][index] = null;
}

/**
 * remove um subcomponente de um nó
 * @param index índice do subcomponente
 */
function removeSubcomponent(index) {
    $('#subcomponent-' + index).val($('#subcomponent-' + index + ' option:first').val());
    $('#save-sub-' + index).removeClass('hidden');
    $('#remove-sub-' + index).addClass('hidden');

    var nodeIndex = parseInt($('#node-list').find('.list-group-item.active').attr('id').substr(5));
    nodes[nodeIndex]['subcomponents'].splice(index, 1);
}

/**
 * compara dois objetos
 * @param o1 primeiro objeto
 * @param o2 segundo objeto
 * @returns {boolean} resultado da comparação: true = iguais; false = diferentes
 */
function compareObjects(o1, o2) {
    return o1 != null && o2 != null && JSON.stringify(o1) == JSON.stringify(o2);
}

/**
 * compara duas ligações
 * @param l1 primeira ligação
 * @param l2 segunda ligação
 * @returns {boolean} resultado da comparação: true = iguais; false = diferentes
 */
function compareLinks(l1, l2) {
    return l1 != null && l2 != null && l1.source.id == l2.source.id && l1.target.id == l2.target.id;
}

/**
 * compara dois nós
 * @param n1 primeiro nó
 * @param n2 segundo nó
 * @returns {boolean} resultado da comparação: true = iguais; false = diferentes
 */
function compareNodes(n1, n2) {
    return n1 != null && n2 != null && n1.id == n2.id;
}

/**
 * atualiza a interface da gestão de pisos
 */
function updateFloorsInterface() {

    // cria a estrutura da tabela
    var body =
        '<div class="list-group">' +
        '<!-- mostrar -->' +
        '<div class="list-group-item" style="padding: 0">' +
        '<table class="table">' +
        '<tr>' +
        '<th>Número</th>' +
        '<th>Nome</th>' +
        '<th>Altura</th>' +
        '<th>Ações</th>' +
        '</tr>';

    // adiciona pisos
    for (var i = floors.length - 1, n = 0; i >= n; i--) {

        body +=
            '<!-- informação do piso -->' +
            '<tr id="floor-' + i + '">' +
            '<td>' + floors[i]['numero'] + '</td>' + // número do piso
            '<td>' + (floors[i]['nome'] || '-') + '</td>' + // nome do piso
            '<td>' + floors[i]['altura'] + ' cm</td>' + // altura do piso
            '<td>' +
            '<button type="button" class="btn btn-default" title="Editar" onclick="editFloor(this)"><span class="glyphicon glyphicon-pencil"></span></button>' + // editar
            '<button type="button" class="btn btn-danger" title="Apagar" onclick="deleteFloor(this)"><span class="glyphicon glyphicon-trash"></span></button>' + // apagar
            '</td>' +
            '</tr>' +
            '<!-- apagar piso -->' +
            '<tr class="bg-danger hidden" id="delete-floor-' + i + '">' +
            '<td colspan="3">Confirmar eliminar?</td>' +
            '<td>' +
            '<button type="button" class="btn btn-default" title="Confirmar" onclick="confirmDeleteFloor(this)"><span class="glyphicon glyphicon-ok"></span></button>' +
            '<button type="button" class="btn btn-danger" title="Cancelar" onclick="cancelDeleteFloor(this)"><span class="glyphicon glyphicon-ban-circle"></span></button>' +
            '</td>' +
            '</tr>' +
            '<!-- editar piso -->' +
            '<tr class="table hidden" id="edit-floor-' + i + '">' +
            '<td>' + floors[i]['numero'] + '</td>' +
            '<td><input class="form-control input-sm" name="nome" type="text" placeholder="Nome do piso" value="' + (floors[i]['nome'] || '') + '"></td>' +
            '<td><input class="form-control input-sm" name="altura" type="number" placeholder="Altura do piso (cm)" value="' + floors[i]['altura'] + '"></td>' +
            '<td>' +
            '<button type="button" class="btn btn-default" title="Guardar" onclick="saveEditFloor(this)"><span class="glyphicon glyphicon-ok"></span></button>' +
            '<button type="button" class="btn btn-danger" title="Cancelar" onclick="cancelEditFloor(this)"><span class="glyphicon glyphicon-ban-circle"></span></button>' +
            '</td>' +
            '</tr>';
    }

    // termina a tabela
    body +=
        '<!-- adicionar piso -->' +
        '<tr class="bg-success" id="new-floor">' +
        '<td>Novo</td>' +
        '<td><input class="form-control input-sm" name="nome" type="text" placeholder="Nome do piso"></td>' +
        '<td><input class="form-control input-sm" name="altura" type="number" min="0" placeholder="Altura do piso (cm)"></td>' +
        '<td>' +
        '<button type="button" class="btn btn-default" title="Adicionar andar superior" onclick="addFloor(true)"><span class="glyphicon glyphicon glyphicon-triangle-top"></span></button>' +
        '<button type="button" class="btn btn-default" title="Adicionar andar inferiror" onclick="addFloor(false)"><span class="glyphicon glyphicon glyphicon-triangle-bottom"></span></button>' +
        '</td>' +
        '</tr>' +
        '<!-- fechar tabela -->' +
        '</table>' +
        '</div>' +
        '</div>';

    return body;
}

/**
 * cria uma interface para gerir pisos numa planta vertical
 */
function manageFloors() {

    status = 'editting floor';

    // opções da janela Modal
    var title = 'Gerir andares';
    var modalClass = 'modal-md modal-cable';
    var footer = '<button type="button" class="btn btn-sm btn-default" data-dismiss="modal">Fechar</button>';
    var body = updateFloorsInterface();

    buildModal(title, body, footer, modalClass);
}

/**
 * mostra a interface de confirmação da remoção de um piso
 * @param object botão de remoção do piso
 */
function deleteFloor(object) {

    // obter id do Piso
    var parent = $(object).parent().parent();
    var floorIndex = parseInt(parent.attr('id').replace('floor-', ''));

    $('#floor-' + floorIndex).addClass('hidden');
    $('#delete-floor-' + floorIndex).removeClass('hidden');
}

/**
 * cancela a remoção de um piso
 * @param object botão
 */
function cancelDeleteFloor(object) {

    // obter id do Piso
    var parent = $(object).parent().parent();
    var floorIndex = parseInt(parent.attr('id').replace('delete-floor-', ''));

    $('#floor-' + floorIndex).removeClass('hidden');
    $('#delete-floor-' + floorIndex).addClass('hidden');
}

/**
 * apaga um piso
 * @param object botão de confirmar remoção do piso
 */
function confirmDeleteFloor(object) {

    // obter id do Piso
    var parent = $(object).parent().parent();
    var floorIndex = parseInt(parent.attr('id').replace('delete-floor-', ''));

    if (floors[floorIndex]['numero'] < 0) {
        // puxa andares de baixo um piso acima
        floors.splice(floorIndex, 1);
        for (var i = 0, n = floorIndex; i < n; i++)
            floors[i]['numero']++;
    } else {
        floors.splice(floorIndex, 1);
        // puxa andares de cima um piso abaixo
        for (i = floorIndex, n = floors.length; i < n; i++)
            floors[i]['numero']--;
    }

    $('.modal-body').html(updateFloorsInterface());

    updateFloorsSVG(); // atualiza a planta SVG
}

/**
 * mostra a interface de edição de um piso
 * @param object botão de edição do piso
 */
function editFloor(object) {

    // obter id do Piso
    var parent = $(object).parent().parent();
    var floorIndex = parseInt(parent.attr('id').replace('floor-', ''));

    $('#floor-' + floorIndex).addClass('hidden');
    $('#edit-floor-' + floorIndex).removeClass('hidden');
}

/**
 * cancela a edição de um piso
 * @param object botão de cancelar edição do piso
 */
function cancelEditFloor(object) {

    // obter id do Piso
    var parent = $(object).parent().parent();
    var floorIndex = parseInt(parent.attr('id').replace('edit-floor-', ''));

    $('#floor-' + floorIndex).removeClass('hidden');
    $('#edit-floor-' + floorIndex).addClass('hidden');
}

/**
 * guarda as alterações da edição de um piso
 * @param object botão de guardar alterações do piso
 */
function saveEditFloor(object) {

    // obtem o id do Piso
    var parentElement = $(object).parent().parent();
    var floorIndex = parseInt(parentElement.attr('id').replace('edit-floor-', ''));

    // obtem os dados atualizados
    var altura = parseInt(parentElement.find('input[name="altura"]').val());
    var nome = parentElement.find('input[name="nome"]').val();

    // limpa a cor dos inputs
    parentElement.find('td').removeClass('has-error');

    // verifica se os inputs têm erros e dá feedback
    if (isNaN(altura)) {
        parentElement.find('input[name="altura"]').parent().addClass('has-error');
        return;
    }

    // atualiza os dados
    floors[floorIndex]['altura'] = altura;
    floors[floorIndex]['nome'] = nome;

    // atualiza a interface com os dados atualizados
    $('.modal-body').html(updateFloorsInterface());

    // guarda alterações
    saveOperation();

    // atualiza a planta SVG
    updateFloorsSVG();
}

/**
 * adiciona um novo piso
 * @param top posição do novo andar: true = superior; false = inferior
 */
function addFloor(top) {

    top = (typeof top === 'undefined') ? true : top; // valor por defeito

    // obtém valores
    var parentElement = $('#new-floor');
    var nome = parentElement.find('input[name="nome"]').val();
    var altura = parseInt(parentElement.find('input[name="altura"]').val());
    var numero;

    // limpa a cor dos inputs
    parentElement.find('td').removeClass('has-error');

    // verifica se os inputs têm erros e dá feedback
    if (isNaN(altura)) {
        parentElement.find('input[name="altura"]').focus();
        parentElement.find('input[name="altura"]').parent().addClass('has-error').focus();
        return;
    }

    // adiciona um andar superior
    if (top) {
        numero = (floors.length > 0) ? floors[floors.length - 1]['numero'] + 1 : 0;
        floors.push({altura: altura, nome: nome, numero: numero});
    }
    // adiciona um andar inferior
    else {
        numero = (floors.length > 0) ? floors[0]['numero'] - 1 : 0;
        floors.unshift({altura: altura, nome: nome, numero: numero});
    }

    $('.modal-body').html(updateFloorsInterface());

    // atualiza a planta SVG
    updateFloorsSVG();
}

/**
 * remove a floor from the Planta
 * @param above true -> remove from the top, false -> remove from the bottom
 */
function removeFloor(above) {

    var svg = $('#svgGrid');
    var rect, text;

    if (planta['pisos'] > 1) {

        // decrement floor
        planta['pisos']--;

        // remove top floor
        if (above) {
            // remove rect and text
            svg.find('rect:first-of-type').remove();
            svg.find('text:first-of-type').remove();
        }
        // remove bottom floor
        else {
            // increment base floor
            planta['base']++;

            // remove rect and text
            svg.find('rect:last-of-type').remove();
            svg.find('text:last-of-type').remove();
        }

        // get the top floor number
        var count = planta['base'] + planta['pisos'];

        // update the floor numbers
        svg.find('text').each(function () {
            if (--count == 0)
                $(this)[0].textContent = 'Rés-do-chão';
            else
                $(this)[0].textContent = 'Piso ' + count;
        });
    }
}

/**
 * calcula a coordenada Y onde o retângulo do piso começa
 * @param index índice do andar
 * @returns {number} coordenada Y do ínicio do piso
 */
function floorStartHeight(index) {
    var y = 0;
    for (var i = 0; i < index; i++)
        y -= floors[i]['altura'];
    return y;
}

/**
 * atualiza o desenho da planta vertical com informação atualizada
 */
function updateFloorsSVG() {

    var svg = $('#svgGrid'), rect, text, y, floorSVG = '';

    for (var i = 0, n = floors.length; i < n; i++) {
        var floorLabel = (floors[i]['nome']) ? floors[i]['nome'] : floors[i]['numero'];
        floorSVG += '<rect x="0" y="' + (floorStartHeight(i) - floors[i]['altura']) + '" width="' + (planta['largura']) + '" height="' + floors[i]['altura'] + '" fill="url(#grid)" style=" stroke: black; stroke-width: 3px;"></rect>';
        floorSVG += '<text x="5" y="' + (floorStartHeight(i) - 5) + '" fill="black" style="font-size: 20px;">' + floorLabel + '</text>';
    }

    svg.html(floorSVG);
}

/**
 * verifica se o browser do utilizador é o Internet Explorer
 * @returns {boolean} true se for; false se não for
 */
function isInternetExplorer() {
    if (navigator.appName == 'Microsoft Internet Explorer')
        return true;
    else if (navigator.appName == 'Netscape')
        if (navigator.userAgent.indexOf('Trident') != -1)
            return true;
    return false;
}

/**
 * Export File Modal
 */
function exportFileModal() {
    var title = "Exportar";
    var body = '<div class="input-group input-group-sm" id="typeDataExport">' +
        '<label class="checkbox-inline"><input type="checkbox" value="atenuacoes">Atenuação</label>' +
        '<label class="checkbox-inline"><input type="checkbox" value="nivelSinal">Nivel de Sinal</label>' +
        '<label class="checkbox-inline"><input type="checkbox" value="listaMaterial">Inventário</label>' +
        '</div>' +
        '<div class="input-group input-group-sm">' +
        '<span class="input-group-addon"><label for="nodeHeight">Ficheiro</label></span>' +
        '<input type="text" class="form-control" id="nameFileExport" placeholder="Nome do Ficheiro">' +
        '<span class="input-group-addon">' +
        '<select id="typeFileExport">' +
        '<option>xlsx</option>' +
        '<option>xml</option>' +
        '<option>json</option>' +
        '</select>' +
        '</span>' +
        '</div>';
    var footer =
        '<button type="button" class="btn btn-sm btn-default" data-dismiss="modal">Cancelar</button>' +
        '<button type="button" class="btn btn-sm btn-primary" onclick="exportFile(\'#typeDataExport\', \'#nameFileExport\',\'#typeFileExport\')">' + title + '</button>';
    var modalClass = 'modal-sm';

    buildModal(title, body, footer, modalClass);
}

/**
 * Export Data
 * @param typeDataId id tipo de informação
 * @param typeFileId id extensão do ficheiro de saída [xlsx, csv, json].
 * @param nameFileId id nome do ficheiro de saída
 */
function exportFile(typeDataId, nameFileId, typeFileId) {

    var typeData = [];
    $(typeDataId + " input[type=checkbox]:checked").map(function () {
        typeData.push($(this).attr('value'));
    });
    var typeFile = $(typeFileId).val();
    var nameFile = $(nameFileId).val();

    var dataAtenuacoes = [];
    var dataNiveisSinal = [];
    var dataListaMaterial = [];
    if (typeData.indexOf("atenuacoes") != -1 || typeData.indexOf("nivelSinal") != -1) {

        var filtered = filterData('CC', ['CP', 'Curva', 'ATI'], true);
        var tomada = melhorPiorTomada(filtered);

        var index, componentsAttenuation;

        for (var i = 0, n = filtered.fn.length; i < n; i++) {

            index = filtered.fn[i]; // corrigir indice

            // tentar encontrar caminho
            var pathId = null;
            for (var j = 0, m = pathToCC.length; j < m; j++) {
                if (pathToCC[j].startNode == index) {
                    pathId = j;
                    break;
                }
            }

            if (pathId == null) // caminho encontrado
                continue;

            // calcula a atenuação do caminho ATI->TT
            componentsAttenuation = 0;
            for (j = 0, m = pathToCC[pathId].path.length; j < m; j++) {
                var defaultAttenuation = 1;
                for (var k = 0, o = shoppingCart.length; k < o; k++)
                    if (nodes[pathToCC[pathId].path[j]].dbId == shoppingCart[k]['nodeID'])
                        for (var l = 0, p = components.length; l < p; l++)
                            if (components[l].id == shoppingCart[k]['componentID'])
                                defaultAttenuation = parseFloat(components[l]['atenuacao']);
                componentsAttenuation += defaultAttenuation;
            }
        }
    }
    if (typeData.indexOf("atenuacoes") != -1) {

        dataAtenuacoes.push(["Atenuações e Tilt"]);
        var path;
        for (i = 0, n = filtered.fn.length; i < n; i++) {
            path = pathToCC[i];
            dataAtenuacoes.push(['Tomada', numberByType(filtered.fn[i]), ((tomada.pior == filtered.fn[i]) ? '-F' : ((tomada.melhor == filtered.fn[i]) ? '+F' : ""))]);
            dataAtenuacoes.push(['Frequência', 'Atenuação', 'Tilt']);
            dataAtenuacoes.push(['47 MHz', attenuation(path.path, componentsAttenuation, 47) + ' dB', '']);
            dataAtenuacoes.push(['862 MHz', attenuation(path.path, componentsAttenuation, 862) + ' dB',
                (attenuation(path.path, componentsAttenuation, 47) - attenuation(path.path, componentsAttenuation, 862)).toFixed(2) + ' dB']);
            dataAtenuacoes.push(['950 MHz', attenuation(path.path, componentsAttenuation, 950) + ' dB', '']);
            dataAtenuacoes.push(['2150 MHz', attenuation(path.path, componentsAttenuation, 2150) + ' dB',
                (attenuation(path.path, componentsAttenuation, 950) - attenuation(path.path, componentsAttenuation, 2150)).toFixed(2) + ' dB']);
            dataAtenuacoes.push(['']);
        }
    }
    if (typeData.indexOf("nivelSinal") != -1) {
        dataNiveisSinal.push(["Niveis de Sinal"]);
        var path;
        for (i = 0, n = filtered.fn.length; i < n; i++) {
            path = pathToCC[i];
            dataNiveisSinal.push(['Tomada', numberByType(filtered.fn[i]), ((tomada.pior == filtered.fn[i]) ? '-F' : ((tomada.melhor == filtered.fn[i]) ? '+F' : ""))]);
            dataNiveisSinal.push(['Frequência', 'Nível de sinal']);
            dataNiveisSinal.push(['47 MHz', (nodes[firstOfType('ATI')]['properties']['nivelSinal'] - attenuation(path.path, componentsAttenuation, 47)).toFixed(2) + ' dB µV']);
            dataNiveisSinal.push(['862 MHz', (nodes[firstOfType('ATI')]['properties']['nivelSinal'] - attenuation(path.path, componentsAttenuation, 862)).toFixed(2) + ' dB µV']);
            dataNiveisSinal.push(['950 MHz', (nodes[firstOfType('ATI')]['properties']['nivelSinal'] - attenuation(path.path, componentsAttenuation, 950)).toFixed(2) + ' dB µV']);
            dataNiveisSinal.push(['2150 MHz', (nodes[firstOfType('ATI')]['properties']['nivelSinal'] - attenuation(path.path, componentsAttenuation, 2150)).toFixed(2) + ' dB µV']);
            dataNiveisSinal.push(['']);
        }
    }
    if (typeData.indexOf("listaMaterial") != -1) {
        var total = 0; // total price

        //Tubes
        dataListaMaterial.push(["Tubagem"]);
        dataListaMaterial.push(["Diâmetro", "Comprimento"]);
        if (tubes.length == 0)
            dataListaMaterial.push(["Não existem tubos instalados..."]);
        else {
            var tubesDist = tubesDistance();
            for (var key in tubesDist)
                if (tubesDist.hasOwnProperty(key))
                    if (tubesDist[key] > 0)
                        dataListaMaterial.push([key + " mm", tubesDist[key].toFixed(2) + " m"]);
        }
        dataListaMaterial.push([]);

        //Cables
        dataListaMaterial.push(["Cablagem"]);
        dataListaMaterial.push(["Tipo", "Referência", "Comprimento"]);

        // compute the total cable length by type
        var hasCables = false;
        for (i = 0, n = cableTypes.length; i < n; i++) {
            for (j = 0, m = qualities.length; j < m; j++) {
                if (cableTypes[i]['id'] == qualities[j]['idCabo']) {
                    var cableLength = computeCableLengthByQuality(qualities[j]['id']);

                    if (cableLength > 0) {
                        hasCables = true;
                        dataListaMaterial.push([cableTypes[i]['tipo'], qualities[j]['nome'], cableLength.toFixed(2) + " m"]);
                    }
                }
            }
        }
        if (!hasCables) {
            dataListaMaterial.push(["Não existem cabos instalados..."]);
        }
        dataListaMaterial.push([]);

        //Checkout
        dataListaMaterial.push(["Equipamento"]);
        dataListaMaterial.push(["Nó", "Label", "Código", "Descrição", "Aplicação", "Atenuação", "Espaço (o/r)", "CC (e/s)", "FO (e/s)", "PC (e/s)", "Preço", "Dimensões (LxAxP)", "Localização", "Observações"]);

        for (i = 0, n = nodes.length; i < n; i++) {
            // fetch the node by it's ID
            var node = nodes[i];
            if (!node['component'])
                continue;

            var list = [node['component']];
            for (j = 0, m = node['subcomponents'].length; j < m; j++)
                list.push(node['subcomponents'][j]);

            for (j = 0, m = list.length; j < m; j++) {
                var component = list[j];
                if (!component)
                    continue;

                total += parseFloat(component['preco']);
                var modeloAplicacao = getModeloAplicacao(component['idModeloAplicacao']);
                var applicationType = getTipoAplicacao(modeloAplicacao['idTipoAplicacao'])['nome'];
                var observacoes = (component['observacoes']) ? component['observacoes'].substr(0, 147) + '...' : 'nenhuma';

                dataListaMaterial.push([getTipoNo(node) + " nº." + numberByType(nodes.indexOf(node)), (node.label || 'nenhuma'),
                    component['codigo'], component['descricao'], applicationType, component['atenuacao'] + " dB",
                    component['ocupado_Us'] + "/" + component['reservado_Us'], component['entradas_CC'] + "/" + component['saidas_CC'],
                    component['entradas_FO'] + "/" + component['saidas_FO'], component['entradas_PC'] + "/" + component['saidas_PC'],
                    component['preco'].toFixed(2) + " €", component['dimensao_L'] + "x" + component['dimensao_A'] + "x" + component['dimensao_P'] + " cm",
                    (component['localizacao'] || 'nenhuma'), observacoes]);
            }
        }
        dataListaMaterial.push([]);
        // print the final price
        dataListaMaterial.push(["Total", total.toFixed(2) + " €"]);
    }

    switch (typeFile) {
        case "xlsx":
        {
            function Workbook() {
                if (!(this instanceof Workbook)) return new Workbook();
                this.SheetNames = [];
                this.Sheets = {};
            }

            var ws_name, wb, ws, wbout;
            wb = new Workbook();
            if (typeData.indexOf("atenuacoes") != -1) {
                ws_name = "atenuacoes";
                ws = exportArrayToExcel(dataAtenuacoes, null);
                /* add worksheet to workbook */
                wb.SheetNames.push(ws_name);
                wb.Sheets[ws_name] = ws;
            }
            if (typeData.indexOf("nivelSinal") != -1) {
                ws_name = "nivelSinal";
                ws = exportArrayToExcel(dataNiveisSinal, null);
                /* add worksheet to workbook */
                wb.SheetNames.push(ws_name);
                wb.Sheets[ws_name] = ws;
            }
            if (typeData.indexOf("listaMaterial") != -1) {
                ws_name = "listaMaterial";
                ws = exportArrayToExcel(dataListaMaterial, null);
                /* add worksheet to workbook */
                wb.SheetNames.push(ws_name);
                wb.Sheets[ws_name] = ws;
            }

            wbout = XLSX.write(wb, {bookType: typeFile, bookSST: true, type: 'binary'});

            saveAs(new Blob([stringToBuffer(wbout)], {type: "application/octet-stream"}), (nameFile + "." + typeFile));
            break;
        }
        case "csv":
        {
            break;
        }
        case "json":
        {
            break;
        }
        default:
        {
            break;
        }
    }
}

/**
 * Convert date format to excel format
 * @param date
 * @param date1904
 * @returns {number}
 */
function exportDateNumConvert(date, date1904) {
    if (date1904) date += 1462;
    var epoch = Date.parse(date);
    return (epoch - new Date(Date.UTC(1899, 11, 30))) / (24 * 60 * 60 * 1000);
}

/**
 * Convert Array format to Excel format
 * @param data
 * @param opts
 * @returns {Object} result
 */
function exportArrayToExcel(data, opts) {

    var ws = {};
    var range = {s: {c: 10000000, r: 10000000}, e: {c: 0, r: 0}};
    for (var R = 0; R != data.length; ++R) {
        for (var C = 0; C != data[R].length; ++C) {
            if (range.s.r > R) range.s.r = R;
            if (range.s.c > C) range.s.c = C;
            if (range.e.r < R) range.e.r = R;
            if (range.e.c < C) range.e.c = C;
            var cell = {v: data[R][C]};
            if (cell.v == null) continue;
            var cell_ref = XLSX.utils.encode_cell({c: C, r: R});

            if (typeof cell.v === 'number') cell.t = 'n';
            else if (typeof cell.v === 'boolean') cell.t = 'b';
            else if (cell.v instanceof Date) {
                cell.t = 'n';
                cell.z = XLSX.SSF._table[14];
                cell.v = exportDateNumConvert(cell.v, null);
            }
            else cell.t = 's';

            ws[cell_ref] = cell;
        }
    }
    if (range.s.c < 10000000) ws['!ref'] = XLSX.utils.encode_range(range);
    return ws;
}

/**
 * Convert String to Buffer
 * @param dataString
 * @returns {ArrayBuffer}
 */
function stringToBuffer(dataString) {
    var buf = new ArrayBuffer(dataString.length);
    var view = new Uint8Array(buf);
    for (var i = 0; i != dataString.length; ++i) view[i] = dataString.charCodeAt(i) & 0xFF;
    return buf;
}