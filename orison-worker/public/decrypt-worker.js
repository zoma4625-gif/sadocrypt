'use strict';
// 復号Worker: 逐次2乗計算をメインスレッドから分離する
// BigIntはstructured cloneで素通しされるためそのままpostMessageできる
//
// main→worker: { cmd:'start', x:BigInt, N:BigInt, startIter:Number, total:Number }
// worker→main:
//   { type:'progress',    i:Number }               … 約150msごと
//   { type:'checkpoint',  i:Number, x:BigInt }      … 約5秒ごと（レジューム保存用）
//   { type:'done',        x:BigInt }                … 完了時

var _x, _N;
var _i = 0;       // Number ループカウンタ
var _total = 0;   // Number 総回数

var _lastProgress = 0;
var _lastCheckpoint = 0;

function chunk() {
  var chunkStart = Date.now();
  var c = 0;

  while (_i < _total) {
    _x = (_x * _x) % _N;
    _i++;
    if (++c >= 1000) {
      c = 0;
      var now = Date.now();
      // 約150msごとにprogress送信
      if (now - _lastProgress >= 150) {
        self.postMessage({ type: 'progress', i: _i });
        _lastProgress = now;
      }
      // 約5秒ごとにcheckpoint送信（レジューム保存用）
      if (now - _lastCheckpoint >= 5000) {
        self.postMessage({ type: 'checkpoint', i: _i, x: _x });
        _lastCheckpoint = now;
      }
      // 約50ms経過したらイベントループに制御を返す（メッセージ受信余地確保）
      if (now - chunkStart >= 50) {
        setTimeout(chunk, 0);
        return;
      }
    }
  }

  // 完了
  self.postMessage({ type: 'done', x: _x });
}

self.onmessage = function(e) {
  var msg = e.data;
  if (msg.cmd !== 'start') return;
  _x = msg.x;            // BigInt（startX）
  _N = msg.N;            // BigInt
  _i = msg.startIter;    // Number（レジューム時は途中値、新規は0）
  _total = msg.total;    // Number（総回数cc）
  var now = Date.now();
  _lastProgress = now;
  _lastCheckpoint = now;
  chunk();
};
