import 'package:flutter/material.dart';
import 'package:get_it/get_it.dart';
import 'package:injectable/injectable.dart';
import 'dep.config.dart';

final getIt = GetIt.instance;

@InjectableInit(
    initializerName: 'init', preferRelativeImports: false, asExtension: true)
void configDI() {
  getIt.init();
}

@singleton
class Config {
  Config() {
    debugPrint('config constructor');
  }
}

@Singleton()
class Apis {
  Apis() {
    print('apis constructor');
    _init();
  }

  void _init() {
    final config = getIt<Config>();
    print('_init config: ${config.hashCode}');
  }
}
