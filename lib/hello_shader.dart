import 'dart:ui';
import 'dart:ui' as ui;

import 'package:flutter/material.dart';
import 'package:flutter/scheduler.dart';
import 'package:flutter/services.dart';

class HelloShader extends StatefulWidget {
  const HelloShader({super.key});

  @override
  State<HelloShader> createState() => _HelloShaderState();
}

class _HelloShaderState extends State<HelloShader>
    with TickerProviderStateMixin {
  FragmentShader? shader;
  late AnimationController controller;
  late Ticker ticker;
  double time = 0;
  ui.Image? image;
  @override
  void initState() {
    super.initState();
    controller =
        AnimationController(vsync: this, duration: const Duration(seconds: 5))
          ..repeat();
    ticker = Ticker((duration) {
      print(duration);
      time = duration.inMilliseconds / 1000;
    });
    ticker.start();
    _initShader();
  }

  @override
  void dispose() {
    controller.dispose();
    ticker.dispose();
    super.dispose();
  }

  void _initShader() async {
    final program =
        await FragmentProgram.fromAsset('assets/shaders/sin_wave.frag');

    shader = program.fragmentShader();
    final imageData = await rootBundle.load('assets/images/hello.webp');
    image = await decodeImageFromList(imageData.buffer.asUint8List());
    setState(() {});
  }

  Offset mousePosition = Offset.zero;

  @override
  Widget build(BuildContext context) {
    final size = MediaQuery.of(context).size;
    return Center(
      child: SizedBox(
        width: size.width,
        height: size.height,
        child: shader == null
            ? const SizedBox.shrink()
            : AnimatedBuilder(
                animation: controller,
                builder: (context, child) => MouseRegion(
                      onHover: (event) {
                        setState(() {
                          mousePosition = event.position;
                        });
                      },
                      child: CustomPaint(
                          painter: HelloPainter(shader!,
                              value: controller.value,
                              image: image!,
                              time: time,
                              mousePosition: mousePosition)),
                    )),
      ),
    );
  }
}

class HelloPainter extends CustomPainter {
  final FragmentShader shader;
  final double value;
  final double time;
  final ui.Image image;
  final Offset mousePosition;
  HelloPainter(this.shader,
      {required this.value,
      required this.image,
      required this.time,
      required this.mousePosition});
  @override
  void paint(Canvas canvas, Size size) {
    shader
      ..setFloat(0, size.width)
      ..setFloat(1, size.height)
      ..setFloat(2, time);
    // ..setFloat(3, mousePosition.dx)
    // ..setFloat(4, mousePosition.dy)
    // ..setFloat(5, 0.0);
    // ..setImageSampler(0, image);
    canvas.drawRect(
        Rect.fromLTWH(0, 0, size.width, size.height), Paint()..shader = shader);
  }

  @override
  bool shouldRepaint(covariant CustomPainter oldDelegate) {
    return true;
  }
}
