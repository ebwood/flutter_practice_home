import 'dart:ui';
import 'dart:ui' as ui;

import 'package:flutter/material.dart';
import 'package:flutter/scheduler.dart';
import 'package:flutter/services.dart';

class HelloBaseShader extends StatefulWidget {
  const HelloBaseShader({super.key});

  @override
  State<HelloBaseShader> createState() => _HelloBaseShaderState();
}

class _HelloBaseShaderState extends State<HelloBaseShader>
    with SingleTickerProviderStateMixin {
  FragmentShader? shader;
  late Ticker ticker;
  double time = 0;
  ui.Image? image;

  @override
  void initState() {
    super.initState();
    ticker = Ticker((duration) {
      time = duration.inMilliseconds / 1000;
      setState(() {});
    });
    ticker.start();
    () async {
      final program = await FragmentProgram.fromAsset(
          'assets/shaders/flutter_hello_hsb.frag');
      shader = program.fragmentShader();
      image = await rootBundle
          .load('assets/images/hello.webp')
          .then((value) => decodeImageFromList(value.buffer.asUint8List()));
      setState(() {});
    }();
  }

  @override
  void dispose() {
    ticker.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final size = MediaQuery.of(context).size;
    return Scaffold(
      backgroundColor: Colors.lightBlue,
      body: Stack(
        children: [
          const Center(
              child: Text('你好，shader',
                  style: TextStyle(color: Colors.lightGreen))),
          Center(
            child: SizedBox(
                width: size.width,
                height: size.height,
                child: shader == null || image == null
                    ? const SizedBox.shrink()
                    : MouseRegion(
                        onHover: (event) {
                          setState(() {
                            shader!.setFloat(3, event.localPosition.dx);
                            shader!.setFloat(4, event.localPosition.dy);
                          });
                        },
                        child: CustomPaint(
                          painter: HelloPainter(shader!, time, image!),
                        ),
                      )),
          ),
        ],
      ),
    );
  }
}

class HelloPainter extends CustomPainter {
  final FragmentShader shader;
  final double time;
  final ui.Image image;
  HelloPainter(this.shader, this.time, this.image);
  @override
  void paint(Canvas canvas, Size size) {
    shader
      ..setFloat(0, size.width)
      ..setFloat(1, size.height)
      ..setFloat(2, time)
      ..setImageSampler(0, image);
    return canvas.drawRect(Rect.fromLTWH(.0, .0, size.width, size.height),
        Paint()..shader = shader);
  }

  @override
  bool shouldRepaint(HelloPainter oldDelegate) =>
      oldDelegate.shader != shader || oldDelegate.time != time;
}
