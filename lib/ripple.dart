import 'package:flutter/material.dart';
import 'dart:math';

class RipplePainter extends CustomPainter {
  final double amplitude;
  final double frequency;
  final double decay;
  final double time;

  RipplePainter({
    required this.amplitude,
    required this.frequency,
    required this.decay,
    required this.time,
  });

  @override
  void paint(Canvas canvas, Size size) {
    final Paint paint = Paint()..color = Colors.blue.withOpacity(0.5);
    final double centerX = size.width / 2;
    final double centerY = size.height / 2;

    for (double i = 0; i < 2 * pi; i += 0.1) {
      double rippleAmount = amplitude * sin(frequency * time - i) * exp(-decay * time);
      double x = centerX + rippleAmount * cos(i);
      double y = centerY + rippleAmount * sin(i);
      canvas.drawCircle(Offset(x, y), 5, paint);
    }
  }

  @override
  bool shouldRepaint(covariant CustomPainter oldDelegate) {
    return true;
  }
}

class RippleEffect extends StatefulWidget {
  @override
  _RippleEffectState createState() => _RippleEffectState();
}

class _RippleEffectState extends State<RippleEffect> with SingleTickerProviderStateMixin {
  late AnimationController _controller;
  double amplitude = 50.0;
  double frequency = 2.0;
  double decay = 0.1;

  @override
  void initState() {
    super.initState();
    _controller = AnimationController(
      duration: const Duration(seconds: 2),
      vsync: this,
    )..repeat(reverse: true);
  }

  @override
  Widget build(BuildContext context) {
    return AnimatedBuilder(
      animation: _controller,
      builder: (context, child) {
        return CustomPaint(
          painter: RipplePainter(
            amplitude: amplitude,
            frequency: frequency,
            decay: decay,
            time: _controller.value * 2 * pi,
          ),
          size: Size.infinite,
        );
      },
    );
  }

  @override
  void dispose() {
    _controller.dispose();
    super.dispose();
  }
}