import 'package:flutter/material.dart';

class PopTestPage extends StatelessWidget {
  const PopTestPage({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: Text('pop test')),
      body: Center(
        child: Column(
          children: [
            ElevatedButton(
                onPressed: () {
                  Navigator.pop(context);
                },
                child: Text('退出')),
            ElevatedButton(
                onPressed: () {
                  Navigator.maybePop(context);
                },
                child: Text('安全退出')),
            ElevatedButton(
                onPressed: () {
                  Navigator.push(context,
                      MaterialPageRoute(builder: (_) => PopTestSecondWidget()));
                },
                child: Text('跳转到页面2')),
          ],
        ),
      ),
    );
  }
}

class PopTestSecondWidget extends StatelessWidget {
  const PopTestSecondWidget({super.key});

  @override
  Widget build(BuildContext context) {
    return PopScope(
      canPop: false,
      child: Scaffold(
        body: Center(
          child: Column(
            children: [
              CloseButton(),
              OutlinedButton(
                  onPressed: () {
                    pop(context);
                  },
                  child: Text('普通pop')),
              OutlinedButton(
                  onPressed: () {
                    popCurrent(context);
                  },
                  child: Text('安全pop'))
            ],
          ),
        ),
      ),
    );
  }

  void pop(BuildContext context) {
    print('pop: context mounted: ${context.mounted}');
    Navigator.pop(context);
    print('pop: context mounted: ${context.mounted}');
    Navigator.pop(context);
    Future.delayed(Duration(seconds: 2), () {
      print('pop: context mounted: ${context.mounted}');
      Navigator.pop(context);
    });
  }

  void safePop(BuildContext context) {
    print('safePop: context mounted: ${context.mounted}');
    // Navigator.maybePop(context);
    if (Navigator.canPop(context)) {
      Navigator.pop(context);
    }
  }

  void popCurrent(BuildContext context) {
    safePop(context);
    safePop(context);
    Future.delayed(Duration(seconds: 2), () {
      safePop(context);
    });
  }
}
