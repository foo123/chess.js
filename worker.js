"use strict";

importScripts('./src/ChessGame.js');
importScripts('./src/ChessSearch.js');

const algo = {
    ab:   {algo:"ab", iterativedeepening:true, depth:245, time:10000},
    mtdf: {algo:"mtdf", iterativedeepening:true, depth:245, time:10000},
    bns:  {algo:"bns", depth:7, time:10000},
    mcts: {algo:"mcts", iterations:500, uct:4, depth:25, time:10000}
};
let _stopped = false;

onmessage = function(e) {
    if (e.data.bestmove && e.data.algo && algo[e.data.algo])
    {
        const game = new ChessGame(e.data.fen);
        const opts = algo[e.data.algo];
        opts.stopped = function() {return _stopped;};
        opts.cb = function(move) {game.dispose(); postMessage({move:move});};
        _stopped = false;
        (new ChessSearch.HybridSearch(game, opts)).bestMove(game.getBoard().turn);
    }
    else if (e.data.stop)
    {
        _stopped = true;
    }
};
