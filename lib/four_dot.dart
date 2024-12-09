import 'dart:async';

import 'package:flutter/material.dart';
import 'package:flutter_animate/flutter_animate.dart';
import 'package:shorebird_code_push/shorebird_code_push.dart';

class FourDotWidget extends StatefulWidget {
  const FourDotWidget({super.key});

  @override
  State<FourDotWidget> createState() => _FourDotWidgetState();
}

class _FourDotWidgetState extends State<FourDotWidget>
    with SingleTickerProviderStateMixin {
  late AnimationController _controller;

  @override
  void initState() {
    super.initState();
    _controller = AnimationController(vsync: this, duration: 2.seconds)
      ..repeat();
  }

  @override
  void dispose() {
    _controller.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return true
        ? MovingDotsScreen()
        : Scaffold(
            backgroundColor: Colors.greenAccent,
            body: Center(
                child: AnimatedBuilder(
                    animation: _controller,
                    builder: (context, child) {
                      int index = (_controller.value * 4 % 4).toInt();

                      return Row(
                        mainAxisSize: MainAxisSize.min,
                        children: [
                          DotCircleWidget(
                              size: 6,
                              color: index == 0
                                  ? Colors.white
                                  : Colors.white.withOpacity(0.3)),
                          const SizedBox(width: 6),
                          DotCircleWidget(
                              size: 8,
                              color: index == 1
                                  ? Colors.white
                                  : Colors.white.withOpacity(0.3)),
                          const SizedBox(width: 4),
                          DotCircleWidget(
                              size: 6,
                              color: index == 2
                                  ? Colors.white
                                  : Colors.white.withOpacity(0.3)),
                          const SizedBox(width: 6),
                          DotCircleWidget(
                              size: 4,
                              color: index == 3
                                  ? Colors.white
                                  : Colors.white.withOpacity(0.3)),
                        ],
                      );
                    })),
          );
  }
}

class DotCircleWidget extends StatelessWidget {
  const DotCircleWidget({super.key, this.size = 6, this.color = Colors.white});
  final double size;
  final Color color;

  @override
  Widget build(BuildContext context) {
    return Container(
      width: size * 1,
      height: size * 1,
      decoration: BoxDecoration(
        color: color,
        shape: BoxShape.circle,
      ),
    );
  }
}

class MovingDotsScreen extends StatefulWidget {
  @override
  _MovingDotsScreenState createState() => _MovingDotsScreenState();
}

class _MovingDotsScreenState extends State<MovingDotsScreen> {
  int whiteDotIndex = 0;

  @override
  void initState() {
    super.initState();
    // 每隔 200ms 更新白色圆点的位置
    Timer.periodic(const Duration(milliseconds: 300), (timer) {
      setState(() {
        whiteDotIndex = (whiteDotIndex + 1) % 3; // 循环更新索引
      });
    });
    getResult();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.greenAccent,
      appBar: AppBar(title: const Text('Moving Dots')),
      body: Center(
        child: Stack(
          alignment: Alignment.center,
          children: [
            ...List.generate(3, (index) {
              return AnimatedPositioned(
                duration: const Duration(milliseconds: 300),
                left: 5.0 + index * 10.0,
                top: 0,
                child: CircleAvatar(
                  radius: index == whiteDotIndex ? 4 : 3, // 白色点半径为 40，其余为 30
                  backgroundColor: index == whiteDotIndex
                      ? Colors.white
                      : Colors.white.withOpacity(0.3),
                ),
              );
            }),
            TextButton(
              child: Text('数据: $result'),
              onPressed: () async {
                await getResult();
                setState(() {});
              },
            )
          ],
        ),
      ),
    );
  }

  ShorebirdUtil util = ShorebirdUtil();
  String? result;
  Future getResult() async {
    result =
        'shorebird: isAvailable = ${util.isAvailable}, currentPatch = ${await util.currentPatch}, nextPatch = ${await util.nextPatch}';
  }
}

class ShorebirdUtil {
  final _updater = ShorebirdUpdater();

  bool get isAvailable => _updater.isAvailable;

  Future<int?> get currentPatch async {
    final patch = await _updater.readCurrentPatch();
    await _updater.checkForUpdate();
    return patch?.number;
  }

  Future<int?> get nextPatch async {
    final patch = await _updater.readNextPatch();
    return patch?.number;
  }

  Future<void> update() => _updater.update();
}
