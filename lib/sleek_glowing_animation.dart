import 'dart:async';
import 'dart:math';
import 'dart:ui';

import 'package:flutter/material.dart';

class SleekGlowingAnimationWidget extends StatelessWidget {
  const SleekGlowingAnimationWidget({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: true
          ? const SineWavePathExample()
          : Center(
              child: Column(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  Container(
                    decoration: BoxDecoration(
                      borderRadius: BorderRadius.circular(10.0),
                      color: Colors.orange,
                    ),
                    child: const SizedBox(
                      width: 200.0,
                      height: 200.0,
                      child: Center(
                        child: Text(
                          'Hello, World!',
                          style: TextStyle(
                            color: Colors.white,
                            fontSize: 20.0,
                          ),
                        ),
                      ),
                    ),
                  ),
                  const SizedBox(height: 20.0),
                  PhysicalShape(
                    elevation: 5.0,
                    shadowColor: Colors.red,
                    clipper: ShapeBorderClipper(
                      shape: RoundedRectangleBorder(
                        borderRadius: BorderRadius.circular(10.0),
                      ),
                    ),
                    color: Colors.orange,
                    child: const SizedBox(
                      height: 200.0,
                      width: 200.0,
                      child: Center(
                        child: Text(
                          'Hello, World!',
                          style: TextStyle(
                            color: Colors.white,
                            fontSize: 20.0,
                          ),
                        ),
                      ),
                    ),
                  ),
                ],
              ),
            ),
    );
  }
}

class SineWavePainter extends CustomPainter {
  SineWavePainter();

  @override
  void paint(Canvas canvas, Size size) {
    final rect = Offset.zero & size;
    // 创建矩形路径（覆盖整个画布）
    final rectPath = Path()..addRect(rect);

    final path = Path();

    const padding = 20.0;
    const smallAmplitude = 20.0;
    const bigAmplitude = 40.0;

    const leftTopPoint = Offset(padding, 2 * padding);
    const topLeftPoint = Offset(2 * padding, padding);

    const topPoint1 = Offset(3 * padding, padding);
    const topPoint2 = Offset(6 * padding, padding);

    const topPoint3 = Offset(11 * padding, padding);
    const topPoint4 = Offset(18 * padding, padding);

    path.moveTo(leftTopPoint.dx, leftTopPoint.dy);
    path.arcToPoint(topLeftPoint, radius: const Radius.circular(padding));
    path.addLineTo(topPoint1);
    path.addBezierTo(topPoint1, topPoint2, amplitude: -smallAmplitude);
    path.addLineTo(topPoint3);
    path.addBezierTo(topPoint3, topPoint4, amplitude: bigAmplitude);

    final topRightPoint = Offset(size.width - 2 * padding, padding);
    final rightTopPoint = Offset(size.width - padding, 2 * padding);
    final rightBottomPoint =
        Offset(size.width - padding, size.height - 2 * padding);
    final bottomRightPoint =
        Offset(size.width - 2 * padding, size.height - padding);
    final bottomLeftPoint = Offset(2 * padding, size.height - padding);
    final leftBottomPoint = Offset(padding, size.height - 2 * padding);

    path.addLineTo(topRightPoint);
    path.arcToPoint(rightTopPoint, radius: const Radius.circular(padding));
    path.lineTo(rightBottomPoint.dx, rightBottomPoint.dy);
    path.arcToPoint(bottomRightPoint, radius: const Radius.circular(padding));
    path.lineTo(bottomLeftPoint.dx, bottomLeftPoint.dy);
    path.arcToPoint(leftBottomPoint, radius: const Radius.circular(padding));

    path.close();

    final invertedPath = Path.combine(PathOperation.difference, rectPath, path);

    // 画路径, 反向填充
    final paint = Paint()
      ..shader = const SweepGradient(
              colors: [Colors.yellow, Colors.green, Colors.red, Colors.yellow],
              tileMode: TileMode.repeated)
          .createShader(rect)
      ..maskFilter = const MaskFilter.blur(BlurStyle.normal, 4.0);

    canvas.drawPath(invertedPath, paint);
  }

  @override
  bool shouldRepaint(covariant CustomPainter oldDelegate) {
    return false;
  }
}

extension on Path {
  void addLineTo(Offset point) {
    lineTo(point.dx, point.dy);
  }

  void addBezierTo(Offset startPoint, Offset endPoint,
      {int waveCount = 1, required double amplitude}) {
    final waveLength = (endPoint.dx - startPoint.dx) / waveCount;
    final midY = (startPoint.dy + endPoint.dy) / 2;

    // 生成正弦曲线
    for (int i = 0; i < waveCount; i++) {
      final controlPointX = startPoint.dx + waveLength * (i + 0.5);
      final controlPointY =
          midY + (i % 2 == 0 ? amplitude : -amplitude); // 控制点上下波动
      final endPointX = startPoint.dx + waveLength * (i + 1);

      quadraticBezierTo(controlPointX, controlPointY, endPointX, midY);
    }
  }
}

class SineWavePathExample extends StatelessWidget {
  const SineWavePathExample({super.key});

  @override
  Widget build(BuildContext context) {
    return Center(
      child: Padding(
        padding: const EdgeInsets.all(8.0),
        child: Row(
          mainAxisAlignment: MainAxisAlignment.spaceBetween,
          children: [
            SizedBox(
              width: 400,
              height: 400,
              child: Stack(
                children: [
                  // 背景绿色部分
                  Container(
                    color: Colors.greenAccent,
                  ),
                  // 模糊部分
                  Positioned.fill(
                    child: CustomPaint(
                      painter: SineWavePainter(),
                      child: BackdropFilter(
                        filter: ImageFilter.blur(sigmaX: 0.0, sigmaY: 0.0),
                        child: Container(
                          color: Colors.transparent, // 必须加一个透明层，不影响背景
                          child: const Center(child: Text('hello')),
                        ),
                      ),
                    ),
                  ),
                ],
              ),
            ),
            SizedBox(
                width: 800,
                height: 800,
                child: Stack(
                  children: [
                    Container(
                      color: Colors.green,
                      child: Center(
                          child: Container(
                              width: 200, height: 200, color: Colors.red)),
                    ),
                    SwiftIntelligenceView(),
                  ],
                ))
          ],
        ),
      ),
    );
  }
}

/// * Swift示例的flutter实现: https://github.com/metasidd/Prototype-Siri-Screen-Animation
class SwiftIntelligenceView extends StatefulWidget {
  const SwiftIntelligenceView(
      {super.key, this.isWarmColor = true, this.amplitude = 4.0, this.colors})
      : assert(colors == null || colors.length > 2,
            'colors length must be greater than 2 if not null');

  /// 是否为暖色
  final bool isWarmColor;

  /// 振幅
  final double amplitude;

  /// 颜色, 大小必须大于2
  final List<Color>? colors;

  @override
  State<SwiftIntelligenceView> createState() => _SwiftIntelligenceViewState();
}

class _SwiftIntelligenceViewState extends State<SwiftIntelligenceView>
    with TickerProviderStateMixin {
  // 暖色系
  final warmColors = const [
    Color.fromARGB(255, 255, 150, 208),
    Color.fromARGB(255, 255, 181, 236),
    Color.fromARGB(255, 255, 139, 139),
    Color.fromARGB(255, 255, 192, 55),
    Color.fromARGB(255, 255, 158, 93),
    Color.fromARGB(255, 252, 255, 91),
    Color.fromARGB(255, 255, 150, 208),
  ];
  // 冷色系
  final coldColors = [
    const Color.fromARGB(255, 214, 179, 233),
    const Color.fromARGB(255, 198, 178, 239),
    const Color.fromARGB(255, 191, 178, 243),
    const Color.fromARGB(255, 170, 203, 245),
    const Color.fromARGB(255, 167, 212, 240),
    const Color.fromARGB(255, 166, 226, 234),
    const Color.fromARGB(255, 214, 179, 233),
  ];

  Timer? _timer;
  double _time = .0;
  double _angle = .0;

  List<Color> colors = [];

  @override
  void initState() {
    super.initState();
    colors = widget.colors ?? (widget.isWarmColor ? warmColors : coldColors);

    /// fps限制为30
    _timer = Timer.periodic(Duration(milliseconds: (1000 / 30).round()), (_) {
      _time += 0.048;
      _angle += 0.03;
      setState(() {});
    });
  }

  @override
  void dispose() {
    _timer?.cancel();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final size = MediaQuery.of(context).size;
    return Stack(
      children: [
        // ImageFiltered(
        //   imageFilter: ImageFilter.blur(sigmaX: 4, sigmaY: 4),
        //   child: Container(
        //     decoration: BoxDecoration(
        //       borderRadius: BorderRadius.circular(52),
        //       border: Border.all(
        //           color: ColorRes.chatBg, width: 4, style: BorderStyle.solid),
        //     ),
        //   ),
        // ),
        SizedBox(
          width: size.width,
          height: size.height,
          child: CustomPaint(
            painter: SwiftIntelligencePainter(
                time: _time,
                angle: _angle,
                colors: colors,
                amplitude: widget.amplitude),
          ),
        ),
      ],
    );
  }
}

class SwiftIntelligencePainter extends CustomPainter {
  final double amplitude;
  final double time;
  final double angle;
  final List<Color> colors;

  SwiftIntelligencePainter(
      {this.amplitude = 4.0,
      required this.time,
      required this.angle,
      required this.colors});

  @override
  void paint(Canvas canvas, Size size) {
    Rect rect = Rect.fromLTWH(0, 0, size.width, size.height);
    // 全局路径（整个画布区域）
    Path globalPath = Path()..addRect(rect);

    final animatedPath = _createPath(size: size, t: time);

    final invertedPath =
        Path.combine(PathOperation.difference, globalPath, animatedPath);

    final paint = Paint();
    // 绘制模糊效果
    canvas.saveLayer(rect, paint);

    Paint blurPaint = Paint()
      ..imageFilter = ImageFilter.blur(sigmaX: 6, sigmaY: 6)
      ..shader = SweepGradient(
        colors: colors,
        startAngle: angle,
        endAngle: angle + 2 * pi,
        tileMode: TileMode.repeated,
      ).createShader(rect);

    canvas.drawPath(invertedPath, blurPaint);

    canvas.restore();
  }

  Path _createPath(
      {required Size size,
      double padding = 8.0,
      double cornerRadius = 24.0,
      required double t}) {
    Path p = Path();

    double width = size.width;
    double height = size.height;

    double radius = cornerRadius * 9 / 10;

    final initialPoints = [
      Point(padding + radius, padding),
      Point(width * 0.25 + padding, padding),
      Point(width * 0.75 + padding, padding),
      Point(width - padding - radius, padding),
      Point(width - padding, padding + radius),
      Point(width - padding, height * 0.25 - padding),
      Point(width - padding, height * 0.75 - padding),
      Point(width - padding, height - padding - radius),
      Point(width - padding - radius, height - padding),
      Point(width * 0.75 - padding, height - padding),
      Point(width * 0.25 - padding, height - padding),
      Point(padding + radius, height - padding),
      Point(padding, height - padding - radius),
      Point(padding, height * 0.75 - padding),
      Point(padding, height * 0.25 - padding),
      Point(padding, padding + radius)
    ];

    final initialArcCenters = [
      Point(padding + radius, padding + radius), // Top-left
      Point(width - padding - radius, padding + radius), // Top-right
      Point(
          width - padding - radius, height - padding - radius), // Bottom-right
      Point(padding + radius, height - padding - radius) // Bottom-left
    ];

    final points = initialPoints
        .map((point) => Point(point.x + amplitude * sin(t * 4 + point.y * 0.1),
            point.y + amplitude * sin(t * 4 + point.x * 0.1)))
        .toList();

    p.moveTo(padding, padding + radius);

    // Top-left corner
    //  p.addArc(center: arcCenters[0], radius: radius, startAngle: .degrees(180), endAngle: .degrees(270), clockwise: false);

    // Top edge
    for (final point in points.sublist(0, 4)) {
      p.lineTo(point.x, point.y);
    }

    // Top-right corner
    //  p.addArc(center: arcCenters[1], radius: radius, startAngle: .degrees(270), endAngle: .degrees(0), clockwise: false);

    // Right edge
    for (final point in points.sublist(4, 8)) {
      p.lineTo(point.x, point.y);
    }

    // Bottom-right corner
    //  p.addArc(center: arcCenters[2], radius: radius, startAngle: .degrees(0), endAngle: .degrees(90), clockwise: false);

    // Bottom edge
    for (final point in points.sublist(8, 11)) {
      p.lineTo(point.x, point.y);
    }

    // Bottom-left corner
    //  p.addArc(center: arcCenters[3], radius: radius, startAngle: .degrees(90), endAngle: .degrees(180), clockwise: false);

    // Left edge
    for (final point in points.sublist(11, 15)) {
      p.lineTo(point.x, point.y);
    }

    p.close();
    return p;
  }

  @override
  bool shouldRepaint(covariant CustomPainter oldDelegate) => true;
}
