import 'dart:async';
import 'dart:math';
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
    final program = await FragmentProgram.fromAsset('assets/shaders/wave.frag');

    shader = program.fragmentShader();
    // shader!.setFloat(3, 0);
    // shader!.setFloat(4, 0);
    final imageData = await rootBundle.load('assets/images/hello.webp');
    image = await decodeImageFromList(imageData.buffer.asUint8List());
    setState(() {});
  }

  Offset mousePosition = Offset.zero;

  @override
  Widget build(BuildContext context) {
    final size = MediaQuery.of(context).size;
    return Stack(
      children: [
        GestureDetector(
          onTap: () {
            random = Random().nextInt(5).toDouble() + 3;
            double value = (random - 1) / 5;
            Future.doWhile(() async {
              await Future.delayed(const Duration(milliseconds: 200));
              random -= value;
              final next = random > 1.0;
              if (!next) {
                random = 1.0;
              }
              return next;
            });
          },
          child: Align(
            alignment: Alignment.bottomCenter,
            child: Container(
              color: Colors.green,
              width: size.width,
              height: 100,
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
          ),
        ),
      ],
    );
  }
}

int count = 0;
double random = 1.0;

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
    // if (count % 30 == 0) {
    //   random = Random().nextDouble();
    // }
    count++;
    shader
      ..setFloat(0, size.width)
      ..setFloat(1, size.height)
      ..setFloat(2, time)
      ..setFloat(3, random);
    //   ..setFloat(3, mousePosition.dx)
    //   ..setFloat(4, mousePosition.dy)
    //   ..setFloat(5, 0.0);
    // // ..setImageSampler(0, image);
    canvas.drawRect(
        Rect.fromLTWH(0, 0, size.width, size.height), Paint()..shader = shader);
  }

  @override
  bool shouldRepaint(covariant CustomPainter oldDelegate) {
    return true;
  }
}
