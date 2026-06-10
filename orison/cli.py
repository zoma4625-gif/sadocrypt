"""
Orison CLI - ターミナルで使うタイムロック暗号ツール
"""

import argparse
import json
import sys
from . import core


def main():
    parser = argparse.ArgumentParser(
        description="Orison - タイムロック暗号システム",
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog="""
使用例:
  # URLを60秒ロック
  python -m orison.cli encrypt "https://example.com" --time 60

  # URLを5分ロック
  python -m orison.cli encrypt "https://secret.example.com" --time 300

  # 暗号化URLを復号
  python -m orison.cli decrypt <encrypted_url> --x0 <x0> --N <N> --chain <count>

  # ベンチマーク実行
  python -m orison.cli benchmark
        """
    )
    
    subparsers = parser.add_subparsers(dest="command", help="コマンド")
    
    # encrypt コマンド
    enc_parser = subparsers.add_parser("encrypt", help="URLをタイムロック暗号化")
    enc_parser.add_argument("url", help="暗号化するURL")
    enc_parser.add_argument("--time", "-t", type=int, default=60,
                           help="ロックする時間（秒）")
    enc_parser.add_argument("--output", "-o",
                           help="出力JSONファイル（省略時は標準出力）")
    
    # decrypt コマンド
    dec_parser = subparsers.add_parser("decrypt", help="タイムロックを解読")
    dec_parser.add_argument("encrypted_url", help="暗号化されたURL")
    dec_parser.add_argument("--x0", type=int, required=True, help="初期値 x0")
    dec_parser.add_argument("--N", type=int, required=True, help="RSAモジュラス N")
    dec_parser.add_argument("--chain", "-c", type=int, required=True,
                           help="2乗チェーン回数")
    
    # benchmark コマンド
    subparsers.add_parser("benchmark", help="ベンチマーク実行")
    
    # info コマンド
    info_parser = subparsers.add_parser("info", help="暗号化URLの情報を表示")
    info_parser.add_argument("puzzle_file", help="パズルJSONファイル")
    
    args = parser.parse_args()
    
    if args.command == "encrypt":
        cmd_encrypt(args)
    elif args.command == "decrypt":
        cmd_decrypt(args)
    elif args.command == "benchmark":
        cmd_benchmark()
    elif args.command == "info":
        cmd_info(args)
    else:
        parser.print_help()


def cmd_encrypt(args):
    """暗号化コマンド"""
    print(f"🔐 Orison タイムロック暗号化")
    print(f"URL: {args.url}")
    print(f"目標時間: {args.time}秒")
    print()
    
    puzzle = core.generate_puzzle(args.url, args.time)
    
    # 出力
    output = {
        "version": core.__version__,
        "encrypted_url": puzzle["encrypted_url"],
        "puzzle": {
            "x0": puzzle["puzzle"]["x0"],
            "N": puzzle["puzzle"]["N"],
            "chain_count": puzzle["puzzle"]["chain_count"],
        },
        "target_seconds": puzzle["target_seconds"]
    }
    
    output_json = json.dumps(output, indent=2, ensure_ascii=False)
    
    if args.output:
        with open(args.output, "w") as f:
            f.write(output_json + "\n")
        print(f"\n✅ 結果を保存: {args.output}")
    else:
        print("\n" + "=" * 60)
        print("🔐 暗号化結果")
        print("=" * 60)
        print(output_json)


def cmd_decrypt(args):
    """復号コマンド"""
    print(f"🔓 Orison タイムロック解読")
    print(f"チェーン回数: {args.chain}")
    print()
    
    url = core.decrypt_url(args.encrypted_url, args.x0, args.N, args.chain)
    
    print("\n" + "=" * 60)
    print("🔓 復号結果")
    print("=" * 60)
    print(f"復号されたURL: {url}")


def cmd_benchmark():
    """ベンチマークコマンド"""
    print("⚡ Orison ベンチマーク")
    print("=" * 60)
    speed = core.benchmark_chain_speed(500000)
    print()
    print(f"⚡ 処理速度: {speed:.0f} 回/秒")
    
    # 目標時間ごとの目安
    print()
    print("📊 目標時間の目安:")
    for seconds in [10, 30, 60, 300, 600, 3600]:
        count = int(seconds * speed)
        if seconds < 60:
            label = f"{seconds}秒"
        elif seconds < 3600:
            label = f"{seconds // 60}分"
        else:
            label = f"{seconds // 3600}時間"
        print(f"   {label}: {count}回")


def cmd_info(args):
    """情報表示コマンド"""
    with open(args.puzzle_file) as f:
        puzzle = json.load(f)
    
    print("📋 Orison パズル情報")
    print("=" * 60)
    print(f"暗号化URL: {puzzle['encrypted_url'][:60]}...")
    print(f"N (RSAモジュラス): {str(puzzle['puzzle']['N'])[:50]}...")
    print(f"Nの桁数: {len(str(puzzle['puzzle']['N']))}桁")
    print(f"x0 (初期値): {str(puzzle['puzzle']['x0'])[:30]}...")
    print(f"チェーン回数: {puzzle['puzzle']['chain_count']:,}回")
    print(f"目標時間: {puzzle['target_seconds']}秒")
    
    # 時間換算
    sec = puzzle['target_seconds']
    if sec < 60:
        print(f"  = {sec}秒")
    elif sec < 3600:
        print(f"  = {sec // 60}分{sec % 60}秒")
    else:
        print(f"  = {sec // 3600}時間{(sec % 3600) // 60}分")


if __name__ == "__main__":
    main()