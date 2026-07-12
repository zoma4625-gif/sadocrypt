'use strict';
// 復号Worker: 逐次2乗計算をメインスレッドから分離する
// BigIntはstructured cloneで素通しされるためそのままpostMessageできる
//
// main→worker: { cmd:'start', x:BigInt, N:BigInt, startIter:Number, total:Number }
// worker→main:
//   { type:'progress',    i:Number, x:BigInt }      … 約150msごと（beforeunload用にxを含む）
//   { type:'checkpoint',  i:Number, x:BigInt }      … 約1秒ごと（localStorage保存用）
//   { type:'done',        x:BigInt }                … 完了時
//
// 重要: 計算ループは setTimeout に一切依存しない自走ループにすること。
// 旧実装は 50ms 計算 → setTimeout(chunk,0) で次チャンクを繋ぐ方式だったが、
// タブを裏に回すとブラウザのバックグラウンドタイマースロットリング
// （Chrome: 背景タブのタイマーを最短1000msにクランプ、5分以上背景だと
// 約1分に1回まで間引く「Intensive Throttling」／Safari・iOSも同様に
// 背景タブのタイマーを大幅に間引く）の対象になり、「裏タブに置くと
// 復号計算がほぼ進まない」不具合の直接原因になっていた
// （setTimeoutが1秒に1回しか発火しなくなり、その1回で50ms分しか
// 計算しないため、実質1/20以下の速度に低下する）。
// postMessage はタイマーではなくメッセージキューへの即時投函であり、
// このスロットリングの影響を受けない。よって計算ループ自体は
// setTimeoutを使わずtotalまで一気に回し切り、progress/checkpointの
// 間引き送信だけをDate.now()で行う。
// Workerスレッドを長時間ブロックし続けても、メインスレッド（UI）の
// 応答性は損なわれない（Workerは別スレッドで動くため「ページが
// 応答していません」の対象にもならない。ブロッキングは意図した挙動）。
// なお iOS Safari 等 OS都合でページ自体が完全サスペンドされ本当に
// 実行が止まるケースは、このWorkerの努力だけでは解決できない領域
// のため、resume機構（RESUME_KEY・checkpoint保存からの再開）で
// 復帰後に続きから計算する前提でカバーする。

var _x, _N;
var _i = 0;       // Number ループカウンタ
var _total = 0;   // Number 総回数

var _lastProgress = 0;
var _lastCheckpoint = 0;

function run() {
  while (_i < _total) {
    _x = (_x * _x) % _N;
    _i++;
    // 1000回に1回だけ時刻を確認して間引き送信（Date.now()呼び出しコスト削減）
    if (_i % 1000 === 0) {
      var now = Date.now();
      // 約150msごとにprogress送信（beforeunload保存用にx付き）
      if (now - _lastProgress >= 150) {
        self.postMessage({ type: 'progress', i: _i, x: _x });
        _lastProgress = now;
      }
      // 約1秒ごとにcheckpoint送信（localStorage保存用）
      if (now - _lastCheckpoint >= 1000) {
        self.postMessage({ type: 'checkpoint', i: _i, x: _x });
        _lastCheckpoint = now;
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
  run();
};
