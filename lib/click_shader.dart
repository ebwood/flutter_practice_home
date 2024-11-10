import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:flutter_shaders/flutter_shaders.dart';
import 'dart:ui' as ui;

class ClickShader extends StatefulWidget {
  const ClickShader({super.key});

  @override
  State<ClickShader> createState() => _ClickShaderState();
}

class _ClickShaderState extends State<ClickShader> {
  double time = 0;
  ui.Image? image;

  @override
  void initState() {
    super.initState();
    _initData();
  }

  void _initData() async {
    final imageData = await rootBundle.load('assets/images/hello.webp');
    image = await decodeImageFromList(imageData.buffer.asUint8List());

    Future.doWhile(() async {
      const elapsed = 16;
      await Future.delayed(const Duration(milliseconds: elapsed));
      time += elapsed / 1000;
      setState(() {});
      return true;
    });
  }

  @override
  Widget build(BuildContext context) {
    final size = MediaQuery.of(context).size;
    return Scaffold(
      appBar: AppBar(title: const Text('Click Shader')),
      body: image == null
          ? Container()
          : ShaderBuilder(
              (context, shader, child) => Center(
                child: Container(
                  color: Colors.red,
                  width: size.width,
                  height: size.height,
                  child: Center(
                    child: SizedBox(
                      width: size.width / 2,
                      height: size.height / 2,
                      child: CustomPaint(
                        painter: ClickShaderPainter(
                            shader: shader, time: time, image: image!),
                      ),
                    ),
                  ),
                ),
              ),
              assetKey: 'assets/shaders/flutter_click.frag',
            ),
    );
  }
}

class ClickShaderPainter extends CustomPainter {
  final FragmentShader shader;
  final double time;
  final ui.Image image;
  ClickShaderPainter(
      {required this.shader, required this.time, required this.image});
  @override
  void paint(Canvas canvas, Size size) {
    shader.setFloat(0, time);
    shader.setFloat(1, size.width / 2);
    shader.setFloat(2, size.height / 2);
    shader.setImageSampler(0, image);
    canvas.drawRect(
        Rect.fromPoints(Offset.zero, Offset(size.width, size.height)),
        Paint()..shader = shader);
  }

  @override
  bool shouldRepaint(covariant CustomPainter oldDelegate) => true;
}
