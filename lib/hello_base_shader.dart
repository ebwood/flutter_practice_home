import 'dart:ui';

import 'package:flutter/material.dart';
import 'package:flutter/scheduler.dart';

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
          'assets/shaders/flutter_hello_shape.frag');
      shader = program.fragmentShader();
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
          Center(
            child: SizedBox(
                width: size.width - 500,
                height: size.width - 500,
                child: shader == null
                    ? const SizedBox.shrink()
                    : CustomPaint(
                        painter: HelloPainter(shader!, time),
                      )),
          ),
          const Center(
              child: Text('你好，shader',
                  style: TextStyle(color: Colors.lightGreen))),
        ],
      ),
    );
  }
}

class HelloPainter extends CustomPainter {
  final FragmentShader shader;
  final double time;
  HelloPainter(this.shader, this.time);
  @override
  void paint(Canvas canvas, Size size) {
    print('大小: $size');
    shader
      ..setFloat(0, size.width)
      ..setFloat(1, size.height)
      ..setFloat(2, time);
    return canvas.drawRect(Rect.fromLTWH(.0, .0, size.width, size.height),
        Paint()..shader = shader);
  }

  @override
  bool shouldRepaint(HelloPainter oldDelegate) =>
      oldDelegate.shader != shader || oldDelegate.time != time;
}
