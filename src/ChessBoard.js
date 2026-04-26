/**
*  ChessBoard
*  A chess board for HTML
*  https://github.com/foo123/Chess
*  @VERSION: 1.0.0
*
**/
!function(root, name, factory) {
"use strict";
if ('object' === typeof exports)
    // CommonJS module
    module.exports = factory();
else if ('function' === typeof define && define.amd)
    // AMD. Register as an anonymous module.
    define(function(req) {return factory();});
else
    root[name] = factory();
}('undefined' !== typeof self ? self : this, 'ChessBoard', function(undef) {
"use strict";

function ChessBoard(container, container_moves)
{
    var self = this, squares = null;
    self.make = function(get_piece_at, moves)  {
        var nt, nb, nl, nr, span, i, j, square, piece;
        container.textContent = '';
        addClass(container, 'chessboard');
        squares = $$('div');
        addClass(squares, 'chessboard-squares');
        container.appendChild(squares);
        if (container_moves && moves)
        {
            addClass(moves, 'chessboard-moves');
            container_moves.textContent = '';
            container_moves.appendChild(moves);
        }
        nt = $$('div');
        addClass(nt, 'chessboard-numbers');
        addClass(nt, 'top');
        container.appendChild(nt);
        nb = $$('div');
        addClass(nb, 'chessboard-numbers');
        addClass(nb, 'bottom');
        container.appendChild(nb);
        nl = $$('div');
        addClass(nl, 'chessboard-numbers');
        addClass(nl, 'left');
        container.appendChild(nl);
        nr = $$('div');
        addClass(nr, 'chessboard-numbers');
        addClass(nr, 'right');
        container.appendChild(nr);
        for (i=8; i>=1; --i)
        {
            span = $$('span');
            span.textContent = String(i);
            span.style.setProperty('--x', '0');
            span.style.setProperty('--y', String(8-i));
            nl.appendChild(span);

            span = $$('span');
            span.textContent = String(i);
            span.style.setProperty('--x', '0');
            span.style.setProperty('--y', String(8-i));
            nr.appendChild(span);

            span = $$('span');
            span.textContent = String.fromCharCode('a'.charCodeAt(0) + 8-i);
            span.style.setProperty('--y', '0');
            span.style.setProperty('--x', String(8-i));
            nt.appendChild(span);

            span = $$('span');
            span.textContent = String.fromCharCode('a'.charCodeAt(0) + 8-i);
            span.style.setProperty('--y', '0');
            span.style.setProperty('--x', String(8-i));
            nb.appendChild(span);

            for (j=0; j<8; ++j)
            {
                square = $$('div');
                square.id = String.fromCharCode('a'.charCodeAt(0) + j)+''+String(i);
                square.style.setProperty('--x', String(j));
                square.style.setProperty('--y', String(8-i));
                addClass(square, 'square');
                addClass(square, i & 1 ? (j & 1 ? 'white' : 'black') : (j & 1 ? 'black' : 'white'));
                if (get_piece_at) self.add(square, get_piece_at(square.id));
                squares.appendChild(square);
            }
        }
    };
    self.container = function() {
        return container;
    };
    self.squares = function() {
        return squares;
    };
    self.empty = function(square) {
        if (square)
        {
            removeClass(square, 'piece');
            removeClass(square, 'w-pawn');
            removeClass(square, 'b-pawn');
            removeClass(square, 'w-rook');
            removeClass(square, 'b-rook');
            removeClass(square, 'w-knight');
            removeClass(square, 'b-knight');
            removeClass(square, 'w-bishop');
            removeClass(square, 'b-bishop');
            removeClass(square, 'w-queen');
            removeClass(square, 'b-queen');
            removeClass(square, 'w-king');
            removeClass(square, 'b-king');
        }
    };
    self.add = function(square, piece) {
        if (square)
        {
            piece = get_piece(piece);
            if (piece)
            {
                addClass(square, ('BLACK' === piece.color ? 'b-' : 'w-') + piece.type.toLowerCase());
                addClass(square, 'piece');
            }
        }
    };
    self.move = function(piece, square1, square2) {
        self.empty(square1);
        self.empty(square2);
        self.add(square2, piece);
    };
    self.maybe_remove = function(square, piece) {
        if (square && !piece) self.empty(square);
    };
    self.show_possible_moves = function(moves) {
        moves.forEach(function(m) {addClass(el(m), 'active');});
    };
    self.clear_possible_moves = function() {
        $('.square.active', container).forEach(function(s) {removeClass(s, 'active');});
    };
}

// utils
function get_piece(piece)
{
    if (piece)
    {
        if ("string" === typeof piece)
        {
            switch (piece.toUpperCase())
            {
                case 'P':
                piece = {color:'p' === piece ? 'BLACK' : 'WHITE', type:'PAWN'};
                break;

                case 'R':
                piece = {color:'r' === piece ? 'BLACK' : 'WHITE', type:'ROOK'};
                break;

                case 'N':
                piece = {color:'n' === piece ? 'BLACK' : 'WHITE', type:'KNIGHT'};
                break;

                case 'B':
                piece = {color:'b' === piece ? 'BLACK' : 'WHITE', type:'BISHOP'};
                break;

                case 'Q':
                piece = {color:'q' === piece ? 'BLACK' : 'WHITE', type:'QUEEN'};
                break;

                case 'K':
                piece = {color:'k' === piece ? 'BLACK' : 'WHITE', type:'KING'};
                break;

                default:
                piece = null;
                break;
            }
        }
        else if (!piece.type || (-1 === (['KING','QUEEN','BISHOP','KNIGHT','ROOK','PAWN']).indexOf(String(piece.type).toUpperCase())))
        {
            piece = null;
        }
    }
    return piece || null;
}
function el(id)
{
    return document.getElementById(id);
}
function $(sel, el)
{
    return Array.prototype.slice.call((el || document).querySelectorAll(sel) || []);
}
function $$(tag)
{
    return document.createElement(tag);
}
function hasClass(el, className)
{
    if (el)
    {
        return el.classList
            ? el.classList.contains(className)
            : -1 !== (' ' + el.className + ' ').indexOf(' ' + className + ' ')
        ;
    }
}
function addClass(el, className)
{
    if (el)
    {
        if (el.classList) el.classList.add(className);
        else if (!hasClass(el, className)) el.className = '' === el.className ? className : (el.className + ' ' + className);
    }
    return el;
}
function removeClass(el, className)
{
    if (el)
    {
        if (el.classList) el.classList.remove(className);
        else el.className = ((' ' + el.className + ' ').replace(' ' + className + ' ', ' ')).trim();
    }
    return el;
}

// export it
ChessBoard.VERSION = "1.0.0";
return ChessBoard;
});
