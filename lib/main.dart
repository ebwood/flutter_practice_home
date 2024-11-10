import 'package:flutter/material.dart';
import 'package:flutter_practice/hello_base_shader.dart';
import 'package:flutter_practice/hello_shader.dart';
import 'package:flutter_practice/ripple.dart';
import 'package:flutter_practice/shader.dart';

import 'click_shader.dart';

void main() {
  runApp(const MyApp());
}

class MyApp extends StatelessWidget {
  const MyApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Flutter Demo',
      theme: ThemeData(
        colorScheme: ColorScheme.fromSeed(seedColor: Colors.deepPurple),
        useMaterial3: true,
      ),
      home: const HelloBaseShader(),
      //const ShaderTest(), //RippleEffect(),//const MyHomePage(title: 'Flutter Demo Home Page'),
    );
  }
}

class MyHomePage extends StatefulWidget {
  const MyHomePage({super.key, required this.title});

  final String title;

  @override
  State<MyHomePage> createState() => _MyHomePageState();
}

class _MyHomePageState extends State<MyHomePage> {
  int _counter = 0;

  void _incrementCounter() {
    setState(() {
      _counter++;
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text(widget.title),
      ),
      body: const SingleChildScrollView(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: <Widget>[
            Text(
              '你好啊，你在干什么呢 L',
              style: TextStyle(
                fontFamily: 'OPPOSans',
                fontWeight: FontWeight.w300,
                fontFamilyFallback: ['AlimamaFangYuanTiVF'],
                fontSize: 15,
                // fontVariations: [FontVariation.weight(900), FontVariation('BEVL', 1.0)]
              ),
            ),
            Text(
              '你好啊，你在干什么呢 R',
              style: TextStyle(
                fontFamily: 'OPPOSans',
                fontWeight: FontWeight.w400,
                fontFamilyFallback: ['AlimamaFangYuanTiVF'],
                // fontFamily: 'AlimamaFangYuanTiVF',
                fontSize: 15,
                // fontVariations: [
                //   FontVariation.weight(900),
                //   FontVariation('BEVL', 10.0)
                // ]
              ),
            ),
            Text(
              '你好啊，你在干什么呢 M',
              style: TextStyle(
                // fontFamily: 'AlimamaFangYuanTiVF',
                fontFamily: 'OPPOSans',
                fontWeight: FontWeight.w500,
                fontFamilyFallback: ['AlimamaFangYuanTiVF'],
                fontSize: 15,
                // fontVariations: [
                //   FontVariation.weight(900),
                //   FontVariation('BEVL', 20.0)
                // ]
              ),
            ),
            Text(
              '你好啊，你在干什么呢 B',
              style: TextStyle(
                fontFamily: 'OPPOSans',
                fontWeight: FontWeight.w700,
                fontFamilyFallback: ['AlimamaFangYuanTiVF'],
                // fontFamily: 'AlimamaFangYuanTiVF',
                fontSize: 15,
                // fontVariations: [
                //   FontVariation.weight(900),
                //   FontVariation('BEVL', 30.0)
                // ],
              ),
            ),
            Text(
              '你好啊，你在干什么呢 40',
              style: TextStyle(
                  fontFamily: 'AlimamaFangYuanTiVF',
                  fontSize: 40,
                  fontVariations: [
                    FontVariation.weight(900),
                    FontVariation('BEVL', 40.0)
                  ]),
            ),
            Text(
              '你好啊，你在干什么呢 50',
              style: TextStyle(
                  fontFamily: 'AlimamaFangYuanTiVF',
                  fontSize: 40,
                  fontVariations: [
                    FontVariation.weight(900),
                    FontVariation('BEVL', 50.0)
                  ]),
            ),
            Text(
              '你好啊，你在干什么呢 60',
              style: TextStyle(
                  fontFamily: 'AlimamaFangYuanTiVF',
                  fontSize: 40,
                  fontVariations: [
                    FontVariation.weight(900),
                    FontVariation('BEVL', 60.0)
                  ]),
            ),
            Text(
              '你好啊，你在干什么呢 70',
              style: TextStyle(
                  fontFamily: 'AlimamaFangYuanTiVF',
                  fontSize: 40,
                  fontVariations: [
                    FontVariation.weight(900),
                    FontVariation('BEVL', 70.0)
                  ]),
            ),
            Text(
              '你好啊，你在干什么呢 80',
              style: TextStyle(
                  fontFamily: 'AlimamaFangYuanTiVF',
                  fontSize: 40,
                  fontVariations: [
                    FontVariation.weight(900),
                    FontVariation('BEVL', 80.0)
                  ]),
            ),
            Text(
              '你好啊，你在干什么呢 90',
              style: TextStyle(
                  fontFamily: 'AlimamaFangYuanTiVF',
                  fontSize: 40,
                  fontVariations: [
                    FontVariation.weight(900),
                    FontVariation('BEVL', 90.0)
                  ]),
            ),
            Text(
              '你好啊，你在干什么呢 100',
              style: TextStyle(
                  fontFamily: 'AlimamaFangYuanTiVF',
                  fontSize: 40,
                  fontVariations: [
                    FontVariation.weight(900),
                    FontVariation('BEVL', 100.0)
                  ]),
            ),
          ],
        ),
      ),
      floatingActionButton: FloatingActionButton(
        onPressed: _incrementCounter,
        tooltip: 'Increment',
        child: const Icon(Icons.add),
      ),
    );
  }
}
