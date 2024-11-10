import 'dart:async';
import 'dart:ui';
import 'dart:ui' as ui;
import 'package:flutter/scheduler.dart';

import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:flutter_shaders/flutter_shaders.dart';
import 'package:image/image.dart' as img;

class ShaderTest extends StatefulWidget {
  const ShaderTest({super.key});

  @override
  State<ShaderTest> createState() => _ShaderTestState();
}

class _ShaderTestState extends State<ShaderTest> with TickerProviderStateMixin {
  ui.Image? uiImage;
  Ticker? _ticker;
  double time = 0;
  FragmentShader? shader;

  @override
  void initState() {
    super.initState();
    // _ticker = createTicker((elapsed) {
    //   print('elapsed: $elapsed');
    //   time = elapsed.inMilliseconds / 1000;
    //   // setState(() {});
    // });
    // _ticker?.start();
  }

  @override
  void dispose() {
    // _ticker?.stop();
    super.dispose();
  }

  @override
  void didChangeDependencies() {
    super.didChangeDependencies();
    _initShader();
  }

  void _initShader() async {
    ByteData imageData = await rootBundle.load('assets/images/hello.webp');
    final imgImage = img.decodeImage(imageData.buffer.asUint8List());
    uiImage = await imgImageToUiImage(imgImage!);

    final program =
        await FragmentProgram.fromAsset('assets/shaders/flutter_seascape.frag');
    shader = program.fragmentShader();
    final size = MediaQuery.of(context).size;
    // set time
    shader!.setFloat(0, time);
    // set resolution
    shader!.setFloat(1, size.width);
    shader!.setFloat(2, size.height);
    // set mouse
    shader!.setFloat(3, size.width / 2);
    shader!.setFloat(4, size.height / 2);
    setState(() {});
    Future.doWhile(() async {
      const elapsed = 16;
      await Future.delayed(const Duration(milliseconds: elapsed));
      time += elapsed / 1000;
      // shader!.setFloat(0, time);
      shader?.setFloat(0, time);
      setState(() {});
      return true;
    });
  }

  Future<ui.Image> imgImageToUiImage(img.Image image) async {
    ui.ImmutableBuffer buffer =
        await ui.ImmutableBuffer.fromUint8List(image.getBytes());
    ui.ImageDescriptor id = ui.ImageDescriptor.raw(buffer,
        height: image.height,
        width: image.width,
        pixelFormat: ui.PixelFormat.rgba8888);
    ui.Codec codec = await id.instantiateCodec(
        targetHeight: image.height, targetWidth: image.width);
    ui.FrameInfo fi = await codec.getNextFrame();
    ui.Image uiImage = fi.image;
    return uiImage;
  }

  @override
  Widget build(BuildContext context) {
    final size = MediaQuery.of(context).size;
    return Scaffold(
        appBar: AppBar(title: const Text('Shader Test')),
        body: uiImage == null
            ? Container(color: Colors.green)
            : Center(
                child:
                    // ShaderBuilder((context, shader, child) =>
                    //     Container(
                    //       width: size.width,
                    //       height: size.height,
                    //       child: CustomPaint(
                    //           painter: BreathShader(shader: shader, time: time))),
                    // assetKey: 'assets/shaders/flutter_breath.frag')
                    // Container(
                    //     width: size.width,
                    //     height: size.height,
                    //     color: Colors.red,
                    //     child: CustomPaint(
                    //         painter:
                    //             SeascapeShader(shader: shader!, time: time))),
                ShaderBuilder(
                  (context, shader, child) {
                    final size = MediaQuery.of(context).size;
                    return Container(
                      width: size.width,
                      height: size.height,
                      color: Colors.red,
                      child: CustomPaint(
                          painter: SeascapeShader(shader: shader, time: time)),
                    );
                  },
                  assetKey: 'assets/shaders/flutter_seascape.frag',
                ),
              ));
  }
}

class BreathShader extends CustomPainter {
  final FragmentShader shader;
  final double time;
  BreathShader({required this.shader, required this.time});

  @override
  void paint(Canvas canvas, Size size) {
    shader.setFloat(0, time);
    shader.setFloat(1, size.width);
    shader.setFloat(2, size.height);
  }

  @override
  bool shouldRepaint(covariant CustomPainter oldDelegate) {
    return true;
  }
}

class SeascapeShader extends CustomPainter {
  final FragmentShader shader;
  final double time;
  SeascapeShader({required this.shader, required this.time});

  @override
  void paint(Canvas canvas, Size size) {
    // set time
    // shader.setFloat(0, time);
    // // set resolution
    // shader.setFloat(1, size.width);
    // shader.setFloat(2, size.height);
    // // set mouse
    // shader.setFloat(3, size.width / 2);
    // shader.setFloat(4, size.height / 2);

    canvas.drawRect(
        Rect.fromLTWH(0, 0, size.width, size.height), Paint()..shader = shader);
  }

  @override
  bool shouldRepaint(covariant CustomPainter oldDelegate) {
    return true;
  }
}

@override
class ShaderPainter extends CustomPainter {
  final FragmentShader shader;
  final ui.Image uiImage;
  ShaderPainter({required this.shader, required this.uiImage});

  @override
  void paint(Canvas canvas, Size size) {
    print('大小: $size');
    shader.setFloat(0, size.width / 2);
    shader.setFloat(1, size.height / 2);
    shader.setImageSampler(0, uiImage);
    return canvas.drawRect(
        Rect.fromLTWH(0, 0, size.width, size.height), Paint()..shader = shader);
  }

  @override
  bool shouldRepaint(covariant CustomPainter oldDelegate) {
    return false;
  }
}
