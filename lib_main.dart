
import 'package:flutter/material.dart';
import 'package:adhan/adhan.dart';
import 'dart:async';
import 'package:flutter_local_notifications/flutter_local_notifications.dart';
import 'package:android_alarm_manager_plus/android_alarm_manager_plus.dart';

void main() async {
  WidgetsFlutterBinding.ensureInitialized();
  await AndroidAlarmManager.initialize();
  runApp(MyApp());
}

class MyApp extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      home: PrayerTimesScreen(),
    );
  }
}

class PrayerTimesScreen extends StatefulWidget {
  @override
  _PrayerTimesScreenState createState() => _PrayerTimesScreenState();
}

class _PrayerTimesScreenState extends State<PrayerTimesScreen> {
  final FlutterLocalNotificationsPlugin flutterLocalNotificationsPlugin =
      FlutterLocalNotificationsPlugin();

  @override
  void initState() {
    super.initState();
    _initializeNotifications();
    _setAdhanAlarms();
  }

  Future<void> _initializeNotifications() async {
    const AndroidInitializationSettings initializationSettingsAndroid =
        AndroidInitializationSettings('@mipmap/ic_launcher');

    final InitializationSettings initializationSettings =
        InitializationSettings(android: initializationSettingsAndroid);

    await flutterLocalNotificationsPlugin.initialize(initializationSettings);
  }

  void _setAdhanAlarms() async {
    final Coordinates coordinates = Coordinates(30.0444, 31.2357); // Cairo
    final params = CalculationMethod.egyptian.getParameters();
    final prayerTimes = PrayerTimes.today(coordinates, params);

    _scheduleAdhan(prayerTimes.fajr, 0);
    _scheduleAdhan(prayerTimes.dhuhr, 1);
    _scheduleAdhan(prayerTimes.asr, 2);
    _scheduleAdhan(prayerTimes.maghrib, 3);
    _scheduleAdhan(prayerTimes.isha, 4);
  }

  void _scheduleAdhan(DateTime time, int id) async {
    await AndroidAlarmManager.oneShotAt(
      time,
      id,
      () => _showAdhanNotification(),
      exact: true,
      wakeup: true,
    );
  }

  static Future<void> _showAdhanNotification() async {
    final FlutterLocalNotificationsPlugin notificationsPlugin =
        FlutterLocalNotificationsPlugin();
    const AndroidNotificationDetails androidPlatformChannelSpecifics =
        AndroidNotificationDetails(
      'adhan_channel',
      'Adhan Notifications',
      importance: Importance.max,
      priority: Priority.high,
      sound: RawResourceAndroidNotificationSound('adhan'),
    );
    const NotificationDetails platformChannelSpecifics =
        NotificationDetails(android: androidPlatformChannelSpecifics);
    await notificationsPlugin.show(
      0,
      'وقت الصلاة',
      'حان الآن موعد الأذان',
      platformChannelSpecifics,
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: Text("مواقيت الصلاة")),
      body: Center(child: Text("ستظهر هنا أوقات الصلاة حسب الموقع")),
    );
  }
}
