import 'dart:math';
import 'dart:typed_data';

import 'package:fftea/fftea.dart';
import 'package:flutter/material.dart';
import 'package:flutter/scheduler.dart';
import 'dart:ui' as ui;

import 'package:flutter_shaders/flutter_shaders.dart';

class IntelligenceShader extends StatefulWidget {
  const IntelligenceShader({super.key});

  @override
  State<IntelligenceShader> createState() => _IntelligenceShaderState();
}

late ui.FragmentProgram perlinShader;
late ui.FragmentProgram shockwaveShader;

class _IntelligenceShaderState extends State<IntelligenceShader>
    with TickerProviderStateMixin {
  List<({FrequencySpectrum spectrum, double value})> data2Animation = [];
  Ticker? _ticker;
  double _elapsed = .0;
  int fps = 120;
  @override
  void initState() {
    super.initState();
    _frequencies();
    _initShader();
  }

  void _frequencies() {
    final buffer =
        Float32List.fromList(List.generate(10, (i) => Random().nextDouble()));
    final fft = FFT(buffer.length);

    final freq = fft.realFft(buffer);
    final freqList = freq.discardConjugates().magnitudes().toList();
    final frequencies = [
      FrequencySpectrum(0, 20),
      FrequencySpectrum(20, 25),
      FrequencySpectrum(25, 31),
      FrequencySpectrum(31, 40),
      FrequencySpectrum(40, 50),
      FrequencySpectrum(50, 63),
      FrequencySpectrum(63, 80),
      FrequencySpectrum(80, 100),
      FrequencySpectrum(100, 125),
      FrequencySpectrum(125, 160),
      FrequencySpectrum(160, 200),
      FrequencySpectrum(200, 250),
      FrequencySpectrum(250, 315),
      FrequencySpectrum(315, 400),
      FrequencySpectrum(400, 500),
      FrequencySpectrum(500, 630),
      FrequencySpectrum(630, 800),
      FrequencySpectrum(800, 1000),
      FrequencySpectrum(1000, 1250),
      FrequencySpectrum(1250, 1600),
      FrequencySpectrum(1600, 2000),
      FrequencySpectrum(2000, 2500),
      FrequencySpectrum(2500, 3150),
      FrequencySpectrum(3150, 4000),
      FrequencySpectrum(4000, 5000),
      FrequencySpectrum(5000, 6300),
      FrequencySpectrum(6300, 8000),
      FrequencySpectrum(8000, 10000),
      FrequencySpectrum(10000, 12500),
      FrequencySpectrum(12500, 16000),
      FrequencySpectrum(16000, 22000),
    ];
    List<({FrequencySpectrum spectrum, double value})> frequencyValues =
        frequencies.map((e) {
      final min = fft.indexOfFrequency(e.min.toDouble(), 44000);
      final max = fft.indexOfFrequency(e.max.toDouble(), 44000);

      return (
        spectrum: e,
        value:
            freqList.sublist(min.floor(), max.ceil()).reduce((a, b) => a + b),
      );
    }).toList();
    data2Animation.addAll(frequencyValues);
  }

  void _initShader() async {
    perlinShader =
        await ui.FragmentProgram.fromAsset('assets/shaders/perlin.frag');
    shockwaveShader =
        await ui.FragmentProgram.fromAsset('assets/shaders/shockwave.frag');

    _ticker = createTicker((elapsed) {
      double duration = (1000 / fps);
      if (elapsed.inMilliseconds - _elapsed >= duration) {
        print('刷新: ${elapsed.inMilliseconds}');
        _elapsed = elapsed.inMilliseconds.toDouble();
        setState(() {});
      }
    })
      ..start();
  }

  @override
  void dispose() {
    _ticker?.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Stack(
        children: [
          FrequencyAnimationShader(
            listening: true,
            elapsed: _elapsed / 1000,
            data2Animation: data2Animation,
            child: Container(
              decoration: const BoxDecoration(color: Colors.black),
            ),
          ),
          Center(
            child: Wrap(
              spacing: 10,
              runSpacing: 10,
              children: [120, 60, 30, 24, 16, 10, 5]
                  .map((e) => GestureDetector(
                        onTap: () {
                          setState(() {
                            fps = e;
                          });
                        },
                        child: Container(
                          width: 100,
                          height: 100,
                          decoration: BoxDecoration(
                              color: e == fps ? Colors.red : Colors.green,
                              shape: BoxShape.circle),
                          child: Center(
                              child: Text(
                            e.toString(),
                            style: const TextStyle(color: Colors.white),
                          )),
                        ),
                      ))
                  .toList(),
            ),
          ),
        ],
      ),
    );
  }
}

class ShockwaveShader extends StatelessWidget {
  const ShockwaveShader(
      {super.key,
      required this.elapsed,
      required this.shockwaveAnimationStart,
      required this.child});

  final double elapsed;
  final double shockwaveAnimationStart;
  final Widget child;

  @override
  Widget build(BuildContext context) {
    return AnimatedSampler(
      key: const Key("AnimatedSampler"),
      (image, size, canvas) {
        final paint = Paint();
        final shader = shockwaveShader.fragmentShader();
        shader.setFloat(0, size.width);
        shader.setFloat(1, size.height);
        shader.setFloat(2, min(elapsed - shockwaveAnimationStart, 1));

        shader.setImageSampler(0, image);
        paint.shader = shader;
        canvas.drawRect(Rect.fromLTWH(0, 0, size.width, size.height), paint);
      },
      child: child,
    );
  }
}

class FrequencyAnimationShader extends StatelessWidget {
  const FrequencyAnimationShader({
    super.key,
    required this.listening,
    required this.elapsed,
    required this.data2Animation,
    required this.child,
  });

  final bool listening;
  final double elapsed;
  final List<({FrequencySpectrum spectrum, double value})> data2Animation;
  final Widget child;

  @override
  Widget build(BuildContext context) {
    return AnimatedSampler(
      key: const Key("AnimatedSampler2"),
      enabled: listening,
      (image, size, canvas) {
        final paint = Paint();
        final shader = perlinShader.fragmentShader();
        shader.setFloat(0, size.width);
        shader.setFloat(1, size.height);
        shader.setFloat(2, elapsed);
        final indexFactor = data2Animation.length ~/ 6;

        if (data2Animation.isNotEmpty) {
          shader.setFloat(
              3, getDbfromFft(data2Animation[1 * indexFactor].value));
          shader.setFloat(
              4, getDbfromFft(data2Animation[2 * indexFactor].value));
          shader.setFloat(
              5, getDbfromFft(data2Animation[3 * indexFactor].value));
          shader.setFloat(
              6, getDbfromFft(data2Animation[4 * indexFactor].value));
          shader.setFloat(
              7, getDbfromFft(data2Animation[5 * indexFactor].value));
          shader.setFloat(
              8, getDbfromFft(data2Animation[6 * indexFactor].value));
        }

        shader.setImageSampler(0, image);
        paint.shader = shader;
        canvas.drawRect(
          Rect.fromLTWH(0, 0, size.width, size.height),
          paint,
        );
      },
      child: child,
    );
  }
}

double getDbfromFft(double value) {
  return 10 * log(value) / log(10);
}

class FrequencySpectrum {
  FrequencySpectrum(this.min, this.max);

  final int min;
  final int max;
}
