import 'dart:async';
import 'dart:math';
import 'dart:ui';
import 'package:flutter/material.dart';

/// !swift原效果: https://github.com/metasidd/Prototype-Siri-Screen-Animation
class SwiftIntelligencePage extends StatefulWidget {
  const SwiftIntelligencePage({super.key});

  @override
  State<SwiftIntelligencePage> createState() => _SwiftIntelligencePageState();
}

class _SwiftIntelligencePageState extends State<SwiftIntelligencePage>
    with TickerProviderStateMixin {
  double t = .0;

  // late Ticker ticker;
  late Timer timer;
  double angle = .0;
  @override
  void initState() {
    super.initState();
    timer = Timer.periodic(Duration(milliseconds: (1000 / 30).round()), (_) {
      t += 0.1;
      angle += 1 / 30;
      setState(() {});
    });
  }

  @override
  void dispose() {
    timer.cancel();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final size = MediaQuery.of(context).size;
    return Scaffold(
      body: SizedBox(
        width: size.width,
        height: size.height,
        child: SizedBox.expand(
          child: CustomPaint(
            painter: IntelligencePainter(t: t, angle: angle),
          ),
        ),
      ),
    );
  }
}

class IntelligencePainter extends CustomPainter {
  final double t;
  final double angle;

  IntelligencePainter({required this.t, required this.angle});

  @override
  void paint(Canvas canvas, Size size) {
    AnimatedRectangle animatedRectangle =
        AnimatedRectangle(size: size, cornerRadius: 48.0, t: t);

// 全局路径（整个画布区域）
    Path globalPath = Path()
      ..addRect(Rect.fromLTWH(0, 0, size.width, size.height));

    final path = animatedRectangle.path(size);

    Path invertedPath =
        Path.combine(PathOperation.difference, globalPath, path);

    Rect rect = Rect.fromLTWH(0, 0, size.width, size.height);
    final paint = Paint();
    // 绘制模糊效果
    canvas.saveLayer(rect, paint);

    Paint blurPaint = Paint()
      ..imageFilter = ImageFilter.blur(sigmaX: 20, sigmaY: 20)
      ..shader = SweepGradient(
        colors: const [
          Color.fromARGB(255, 255, 150, 208),
          Color.fromARGB(255, 255, 181, 236),
          Color.fromARGB(255, 255, 139, 139),
          Color.fromARGB(255, 255, 192, 55),
          Color.fromARGB(255, 255, 158, 93),
          Color.fromARGB(255, 252, 255, 91),
          Color.fromARGB(255, 255, 150, 208),
        ],
        startAngle: angle,
        endAngle: angle + 2 * pi,
        tileMode: TileMode.repeated,
      ).createShader(rect);

    canvas.drawPath(invertedPath, blurPaint);

    canvas.restore();
  }

  @override
  bool shouldRepaint(covariant CustomPainter oldDelegate) => true;
}

class AnimatedRectangle {
  final Size size;
  final double padding;
  final double cornerRadius;
  final double t;

  AnimatedRectangle(
      {required this.size,
      this.padding = 18.0,
      required this.cornerRadius,
      required this.t});

  Path path(Size rect) {
    Path p = Path();

    double width = size.width;
    double height = size.height;

    double radius = cornerRadius;

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
        .map((point) => Point(point.x + 10 * sin(t + point.y * 0.1),
            point.y + 10 * sin(t + point.y * 0.1)))
        .toList();

    p.moveTo(padding, padding + radius);

    // Top-left corner
    //  p.addArc(center: arcCenters[0], radius: radius, startAngle: .degrees(180), endAngle: .degrees(270), clockwise: false);

    // Top edge
    for (final point in points.sublist(0, 3)) {
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
}
