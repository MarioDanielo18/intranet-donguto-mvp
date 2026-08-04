import { createClient } from '@supabase/supabase-js';

const EXCLUDED_BIOMETRIC_IDS = ['60979426']; // Jesus Ayma removed staff

const INITIAL_REPORT_PUNCHES = [
  { punch_id: 'RPT-72306939-2026-07-02-1', biometric_id: '72306939', date: '2026-07-02', time: '10:27 PM', timestamp: '2026-07-02T22:27:00Z', device_id: 'DEV-001', device_name: 'ZKTeco M1' },
  { punch_id: 'RPT-72306939-2026-07-03-1', biometric_id: '72306939', date: '2026-07-03', time: '02:34 PM', timestamp: '2026-07-03T14:34:00Z', device_id: 'DEV-001', device_name: 'ZKTeco M1' },
  { punch_id: 'RPT-72306939-2026-07-03-2', biometric_id: '72306939', date: '2026-07-03', time: '10:08 PM', timestamp: '2026-07-03T22:08:00Z', device_id: 'DEV-001', device_name: 'ZKTeco M1' },
  { punch_id: 'RPT-72306939-2026-07-04-1', biometric_id: '72306939', date: '2026-07-04', time: '02:31 PM', timestamp: '2026-07-04T14:31:00Z', device_id: 'DEV-001', device_name: 'ZKTeco M1' },
  { punch_id: 'RPT-72306939-2026-07-04-2', biometric_id: '72306939', date: '2026-07-04', time: '10:03 PM', timestamp: '2026-07-04T22:03:00Z', device_id: 'DEV-001', device_name: 'ZKTeco M1' },
  { punch_id: 'RPT-72306939-2026-07-05-1', biometric_id: '72306939', date: '2026-07-05', time: '07:02 AM', timestamp: '2026-07-05T07:02:00Z', device_id: 'DEV-001', device_name: 'ZKTeco M1' },
  { punch_id: 'RPT-72306939-2026-07-05-2', biometric_id: '72306939', date: '2026-07-05', time: '03:06 PM', timestamp: '2026-07-05T15:06:00Z', device_id: 'DEV-001', device_name: 'ZKTeco M1' },
  { punch_id: 'RPT-72306939-2026-07-07-1', biometric_id: '72306939', date: '2026-07-07', time: '02:36 PM', timestamp: '2026-07-07T14:36:00Z', device_id: 'DEV-001', device_name: 'ZKTeco M1' },
  { punch_id: 'RPT-72306939-2026-07-07-2', biometric_id: '72306939', date: '2026-07-07', time: '10:04 PM', timestamp: '2026-07-07T22:04:00Z', device_id: 'DEV-001', device_name: 'ZKTeco M1' },
  { punch_id: 'RPT-72306939-2026-07-08-1', biometric_id: '72306939', date: '2026-07-08', time: '02:42 PM', timestamp: '2026-07-08T14:42:00Z', device_id: 'DEV-001', device_name: 'ZKTeco M1' },
  { punch_id: 'RPT-72306939-2026-07-08-2', biometric_id: '72306939', date: '2026-07-08', time: '10:16 PM', timestamp: '2026-07-08T22:16:00Z', device_id: 'DEV-001', device_name: 'ZKTeco M1' },
  { punch_id: 'RPT-72306939-2026-07-09-1', biometric_id: '72306939', date: '2026-07-09', time: '02:45 PM', timestamp: '2026-07-09T14:45:00Z', device_id: 'DEV-001', device_name: 'ZKTeco M1' },
  { punch_id: 'RPT-72306939-2026-07-09-2', biometric_id: '72306939', date: '2026-07-09', time: '10:06 PM', timestamp: '2026-07-09T22:06:00Z', device_id: 'DEV-001', device_name: 'ZKTeco M1' },
  { punch_id: 'RPT-72306939-2026-07-10-1', biometric_id: '72306939', date: '2026-07-10', time: '02:49 PM', timestamp: '2026-07-10T14:49:00Z', device_id: 'DEV-001', device_name: 'ZKTeco M1' },
  { punch_id: 'RPT-72306939-2026-07-10-2', biometric_id: '72306939', date: '2026-07-10', time: '10:15 PM', timestamp: '2026-07-10T22:15:00Z', device_id: 'DEV-001', device_name: 'ZKTeco M1' },
  { punch_id: 'RPT-72306939-2026-07-12-1', biometric_id: '72306939', date: '2026-07-12', time: '07:04 AM', timestamp: '2026-07-12T07:04:00Z', device_id: 'DEV-001', device_name: 'ZKTeco M1' },
  { punch_id: 'RPT-72306939-2026-07-12-2', biometric_id: '72306939', date: '2026-07-12', time: '03:06 PM', timestamp: '2026-07-12T15:06:00Z', device_id: 'DEV-001', device_name: 'ZKTeco M1' },
  { punch_id: 'RPT-72306939-2026-07-14-1', biometric_id: '72306939', date: '2026-07-14', time: '02:37 PM', timestamp: '2026-07-14T14:37:00Z', device_id: 'DEV-001', device_name: 'ZKTeco M1' },
  { punch_id: 'RPT-72306939-2026-07-14-2', biometric_id: '72306939', date: '2026-07-14', time: '10:22 PM', timestamp: '2026-07-14T22:22:00Z', device_id: 'DEV-001', device_name: 'ZKTeco M1' },
  { punch_id: 'RPT-72306939-2026-07-15-1', biometric_id: '72306939', date: '2026-07-15', time: '02:36 PM', timestamp: '2026-07-15T14:36:00Z', device_id: 'DEV-001', device_name: 'ZKTeco M1' },
  { punch_id: 'RPT-72306939-2026-07-15-2', biometric_id: '72306939', date: '2026-07-15', time: '10:18 PM', timestamp: '2026-07-15T22:18:00Z', device_id: 'DEV-001', device_name: 'ZKTeco M1' },
  { punch_id: 'RPT-72306939-2026-07-16-1', biometric_id: '72306939', date: '2026-07-16', time: '02:34 PM', timestamp: '2026-07-16T14:34:00Z', device_id: 'DEV-001', device_name: 'ZKTeco M1' },
  { punch_id: 'RPT-72306939-2026-07-16-2', biometric_id: '72306939', date: '2026-07-16', time: '10:34 PM', timestamp: '2026-07-16T22:34:00Z', device_id: 'DEV-001', device_name: 'ZKTeco M1' },
  { punch_id: 'RPT-72306939-2026-07-17-1', biometric_id: '72306939', date: '2026-07-17', time: '02:42 PM', timestamp: '2026-07-17T14:42:00Z', device_id: 'DEV-001', device_name: 'ZKTeco M1' },
  { punch_id: 'RPT-72306939-2026-07-17-2', biometric_id: '72306939', date: '2026-07-17', time: '10:19 PM', timestamp: '2026-07-17T22:19:00Z', device_id: 'DEV-001', device_name: 'ZKTeco M1' },
  { punch_id: 'RPT-72306939-2026-07-18-1', biometric_id: '72306939', date: '2026-07-18', time: '03:06 PM', timestamp: '2026-07-18T15:06:00Z', device_id: 'DEV-001', device_name: 'ZKTeco M1' },
  { punch_id: 'RPT-72306939-2026-07-18-2', biometric_id: '72306939', date: '2026-07-18', time: '10:09 PM', timestamp: '2026-07-18T22:09:00Z', device_id: 'DEV-001', device_name: 'ZKTeco M1' },
  { punch_id: 'RPT-72306939-2026-07-19-1', biometric_id: '72306939', date: '2026-07-19', time: '06:58 AM', timestamp: '2026-07-19T06:58:00Z', device_id: 'DEV-001', device_name: 'ZKTeco M1' },
  { punch_id: 'RPT-72306939-2026-07-19-2', biometric_id: '72306939', date: '2026-07-19', time: '03:01 PM', timestamp: '2026-07-19T15:01:00Z', device_id: 'DEV-001', device_name: 'ZKTeco M1' },
  { punch_id: 'RPT-72306939-2026-07-21-1', biometric_id: '72306939', date: '2026-07-21', time: '07:22 AM', timestamp: '2026-07-21T07:22:00Z', device_id: 'DEV-001', device_name: 'ZKTeco M1' },
  { punch_id: 'RPT-72306939-2026-07-21-2', biometric_id: '72306939', date: '2026-07-21', time: '03:12 PM', timestamp: '2026-07-21T15:12:00Z', device_id: 'DEV-001', device_name: 'ZKTeco M1' },
  { punch_id: 'RPT-72306939-2026-07-22-1', biometric_id: '72306939', date: '2026-07-22', time: '05:15 PM', timestamp: '2026-07-22T17:15:00Z', device_id: 'DEV-001', device_name: 'ZKTeco M1' },
  { punch_id: 'RPT-72306939-2026-07-22-2', biometric_id: '72306939', date: '2026-07-22', time: '10:13 PM', timestamp: '2026-07-22T22:13:00Z', device_id: 'DEV-001', device_name: 'ZKTeco M1' },
  { punch_id: 'RPT-72306939-2026-07-23-1', biometric_id: '72306939', date: '2026-07-23', time: '02:29 PM', timestamp: '2026-07-23T14:29:00Z', device_id: 'DEV-001', device_name: 'ZKTeco M1' },
  { punch_id: 'RPT-72306939-2026-07-23-2', biometric_id: '72306939', date: '2026-07-23', time: '10:14 PM', timestamp: '2026-07-23T22:14:00Z', device_id: 'DEV-001', device_name: 'ZKTeco M1' },
  { punch_id: 'RPT-72306939-2026-07-24-1', biometric_id: '72306939', date: '2026-07-24', time: '02:27 PM', timestamp: '2026-07-24T14:27:00Z', device_id: 'DEV-001', device_name: 'ZKTeco M1' },
  { punch_id: 'RPT-72306939-2026-07-25-1', biometric_id: '72306939', date: '2026-07-25', time: '07:22 AM', timestamp: '2026-07-25T07:22:00Z', device_id: 'DEV-001', device_name: 'ZKTeco M1' },
  { punch_id: 'RPT-72306939-2026-07-25-2', biometric_id: '72306939', date: '2026-07-25', time: '02:59 PM', timestamp: '2026-07-25T14:59:00Z', device_id: 'DEV-001', device_name: 'ZKTeco M1' },
  { punch_id: 'RPT-72306939-2026-07-26-1', biometric_id: '72306939', date: '2026-07-26', time: '06:59 AM', timestamp: '2026-07-26T06:59:00Z', device_id: 'DEV-001', device_name: 'ZKTeco M1' },
  { punch_id: 'RPT-72306939-2026-07-26-2', biometric_id: '72306939', date: '2026-07-26', time: '03:07 PM', timestamp: '2026-07-26T15:07:00Z', device_id: 'DEV-001', device_name: 'ZKTeco M1' },
  { punch_id: 'RPT-72306939-2026-07-27-1', biometric_id: '72306939', date: '2026-07-27', time: '02:26 PM', timestamp: '2026-07-27T14:26:00Z', device_id: 'DEV-001', device_name: 'ZKTeco M1' },
  { punch_id: 'RPT-72306939-2026-07-28-1', biometric_id: '72306939', date: '2026-07-28', time: '06:58 AM', timestamp: '2026-07-28T06:58:00Z', device_id: 'DEV-001', device_name: 'ZKTeco M1' },
  { punch_id: 'RPT-72306939-2026-07-28-2', biometric_id: '72306939', date: '2026-07-28', time: '03:03 PM', timestamp: '2026-07-28T15:03:00Z', device_id: 'DEV-001', device_name: 'ZKTeco M1' },
  { punch_id: 'RPT-72306939-2026-07-30-1', biometric_id: '72306939', date: '2026-07-30', time: '06:59 AM', timestamp: '2026-07-30T06:59:00Z', device_id: 'DEV-001', device_name: 'ZKTeco M1' },
  { punch_id: 'RPT-72306939-2026-07-30-2', biometric_id: '72306939', date: '2026-07-30', time: '03:18 PM', timestamp: '2026-07-30T15:18:00Z', device_id: 'DEV-001', device_name: 'ZKTeco M1' },
  { punch_id: 'RPT-72306939-2026-07-31-1', biometric_id: '72306939', date: '2026-07-31', time: '02:29 PM', timestamp: '2026-07-31T14:29:00Z', device_id: 'DEV-001', device_name: 'ZKTeco M1' },
  { punch_id: 'RPT-72306939-2026-07-31-2', biometric_id: '72306939', date: '2026-07-31', time: '10:41 PM', timestamp: '2026-07-31T22:41:00Z', device_id: 'DEV-001', device_name: 'ZKTeco M1' },
  { punch_id: 'RPT-72306939-2026-08-01-1', biometric_id: '72306939', date: '2026-08-01', time: '02:32 PM', timestamp: '2026-08-01T14:32:00Z', device_id: 'DEV-001', device_name: 'ZKTeco M1' },
  { punch_id: 'RPT-72306939-2026-08-01-2', biometric_id: '72306939', date: '2026-08-01', time: '10:09 PM', timestamp: '2026-08-01T22:09:00Z', device_id: 'DEV-001', device_name: 'ZKTeco M1' },
  { punch_id: 'RPT-61268415-2026-07-02-1', biometric_id: '61268415', date: '2026-07-02', time: '09:59 PM', timestamp: '2026-07-02T21:59:00Z', device_id: 'DEV-001', device_name: 'ZKTeco M1' },
  { punch_id: 'RPT-61268415-2026-07-06-1', biometric_id: '61268415', date: '2026-07-06', time: '02:26 PM', timestamp: '2026-07-06T14:26:00Z', device_id: 'DEV-001', device_name: 'ZKTeco M1' },
  { punch_id: 'RPT-61268415-2026-07-09-1', biometric_id: '61268415', date: '2026-07-09', time: '10:00 PM', timestamp: '2026-07-09T22:00:00Z', device_id: 'DEV-001', device_name: 'ZKTeco M1' },
  { punch_id: 'RPT-61268415-2026-07-10-1', biometric_id: '61268415', date: '2026-07-10', time: '10:08 PM', timestamp: '2026-07-10T22:08:00Z', device_id: 'DEV-001', device_name: 'ZKTeco M1' },
  { punch_id: 'RPT-61268415-2026-07-11-1', biometric_id: '61268415', date: '2026-07-11', time: '10:13 PM', timestamp: '2026-07-11T22:13:00Z', device_id: 'DEV-001', device_name: 'ZKTeco M1' },
  { punch_id: 'RPT-61268415-2026-07-12-1', biometric_id: '61268415', date: '2026-07-12', time: '02:11 PM', timestamp: '2026-07-12T14:11:00Z', device_id: 'DEV-001', device_name: 'ZKTeco M1' },
  { punch_id: 'RPT-61268415-2026-07-13-1', biometric_id: '61268415', date: '2026-07-13', time: '10:05 PM', timestamp: '2026-07-13T22:05:00Z', device_id: 'DEV-001', device_name: 'ZKTeco M1' },
  { punch_id: 'RPT-61268415-2026-07-15-1', biometric_id: '61268415', date: '2026-07-15', time: '10:17 PM', timestamp: '2026-07-15T22:17:00Z', device_id: 'DEV-001', device_name: 'ZKTeco M1' },
  { punch_id: 'RPT-61268415-2026-07-20-1', biometric_id: '61268415', date: '2026-07-20', time: '10:19 PM', timestamp: '2026-07-20T22:19:00Z', device_id: 'DEV-001', device_name: 'ZKTeco M1' },
  { punch_id: 'RPT-61268415-2026-07-21-1', biometric_id: '61268415', date: '2026-07-21', time: '10:32 PM', timestamp: '2026-07-21T22:32:00Z', device_id: 'DEV-001', device_name: 'ZKTeco M1' },
  { punch_id: 'RPT-61268415-2026-07-24-1', biometric_id: '61268415', date: '2026-07-24', time: '01:28 PM', timestamp: '2026-07-24T13:28:00Z', device_id: 'DEV-001', device_name: 'ZKTeco M1' },
  { punch_id: 'RPT-61268415-2026-07-25-1', biometric_id: '61268415', date: '2026-07-25', time: '02:36 PM', timestamp: '2026-07-25T14:36:00Z', device_id: 'DEV-001', device_name: 'ZKTeco M1' },
  { punch_id: 'RPT-61268415-2026-07-28-1', biometric_id: '61268415', date: '2026-07-28', time: '02:50 PM', timestamp: '2026-07-28T14:50:00Z', device_id: 'DEV-001', device_name: 'ZKTeco M1' },
  { punch_id: 'RPT-06587622-2026-07-04-1', biometric_id: '06587622', date: '2026-07-04', time: '07:11 AM', timestamp: '2026-07-04T07:11:00Z', device_id: 'DEV-001', device_name: 'ZKTeco M1' },
  { punch_id: 'RPT-06587622-2026-07-04-2', biometric_id: '06587622', date: '2026-07-04', time: '03:10 PM', timestamp: '2026-07-04T15:10:00Z', device_id: 'DEV-001', device_name: 'ZKTeco M1' },
  { punch_id: 'RPT-06587622-2026-07-05-1', biometric_id: '06587622', date: '2026-07-05', time: '07:12 AM', timestamp: '2026-07-05T07:12:00Z', device_id: 'DEV-001', device_name: 'ZKTeco M1' },
  { punch_id: 'RPT-06587622-2026-07-05-2', biometric_id: '06587622', date: '2026-07-05', time: '03:13 PM', timestamp: '2026-07-05T15:13:00Z', device_id: 'DEV-001', device_name: 'ZKTeco M1' },
  { punch_id: 'RPT-06587622-2026-07-06-1', biometric_id: '06587622', date: '2026-07-06', time: '02:23 PM', timestamp: '2026-07-06T14:23:00Z', device_id: 'DEV-001', device_name: 'ZKTeco M1' },
  { punch_id: 'RPT-06587622-2026-07-06-2', biometric_id: '06587622', date: '2026-07-06', time: '10:08 PM', timestamp: '2026-07-06T22:08:00Z', device_id: 'DEV-001', device_name: 'ZKTeco M1' },
  { punch_id: 'RPT-06587622-2026-07-07-1', biometric_id: '06587622', date: '2026-07-07', time: '07:49 AM', timestamp: '2026-07-07T07:49:00Z', device_id: 'DEV-001', device_name: 'ZKTeco M1' },
  { punch_id: 'RPT-06587622-2026-07-07-2', biometric_id: '06587622', date: '2026-07-07', time: '03:44 PM', timestamp: '2026-07-07T15:44:00Z', device_id: 'DEV-001', device_name: 'ZKTeco M1' },
  { punch_id: 'RPT-06587622-2026-07-08-1', biometric_id: '06587622', date: '2026-07-08', time: '06:59 AM', timestamp: '2026-07-08T06:59:00Z', device_id: 'DEV-001', device_name: 'ZKTeco M1' },
  { punch_id: 'RPT-06587622-2026-07-08-2', biometric_id: '06587622', date: '2026-07-08', time: '02:59 PM', timestamp: '2026-07-08T14:59:00Z', device_id: 'DEV-001', device_name: 'ZKTeco M1' },
  { punch_id: 'RPT-06587622-2026-07-09-1', biometric_id: '06587622', date: '2026-07-09', time: '07:07 AM', timestamp: '2026-07-09T07:07:00Z', device_id: 'DEV-001', device_name: 'ZKTeco M1' },
  { punch_id: 'RPT-06587622-2026-07-09-2', biometric_id: '06587622', date: '2026-07-09', time: '03:15 PM', timestamp: '2026-07-09T15:15:00Z', device_id: 'DEV-001', device_name: 'ZKTeco M1' },
  { punch_id: 'RPT-06587622-2026-07-11-1', biometric_id: '06587622', date: '2026-07-11', time: '06:57 AM', timestamp: '2026-07-11T06:57:00Z', device_id: 'DEV-001', device_name: 'ZKTeco M1' },
  { punch_id: 'RPT-06587622-2026-07-11-2', biometric_id: '06587622', date: '2026-07-11', time: '03:29 PM', timestamp: '2026-07-11T15:29:00Z', device_id: 'DEV-001', device_name: 'ZKTeco M1' },
  { punch_id: 'RPT-06587622-2026-07-12-1', biometric_id: '06587622', date: '2026-07-12', time: '07:16 AM', timestamp: '2026-07-12T07:16:00Z', device_id: 'DEV-001', device_name: 'ZKTeco M1' },
  { punch_id: 'RPT-06587622-2026-07-12-2', biometric_id: '06587622', date: '2026-07-12', time: '03:09 PM', timestamp: '2026-07-12T15:09:00Z', device_id: 'DEV-001', device_name: 'ZKTeco M1' },
  { punch_id: 'RPT-06587622-2026-07-13-1', biometric_id: '06587622', date: '2026-07-13', time: '02:29 PM', timestamp: '2026-07-13T14:29:00Z', device_id: 'DEV-001', device_name: 'ZKTeco M1' },
  { punch_id: 'RPT-06587622-2026-07-13-2', biometric_id: '06587622', date: '2026-07-13', time: '10:07 PM', timestamp: '2026-07-13T22:07:00Z', device_id: 'DEV-001', device_name: 'ZKTeco M1' },
  { punch_id: 'RPT-06587622-2026-07-14-1', biometric_id: '06587622', date: '2026-07-14', time: '07:05 AM', timestamp: '2026-07-14T07:05:00Z', device_id: 'DEV-001', device_name: 'ZKTeco M1' },
  { punch_id: 'RPT-06587622-2026-07-14-2', biometric_id: '06587622', date: '2026-07-14', time: '03:06 PM', timestamp: '2026-07-14T15:06:00Z', device_id: 'DEV-001', device_name: 'ZKTeco M1' },
  { punch_id: 'RPT-06587622-2026-07-15-1', biometric_id: '06587622', date: '2026-07-15', time: '07:03 AM', timestamp: '2026-07-15T07:03:00Z', device_id: 'DEV-001', device_name: 'ZKTeco M1' },
  { punch_id: 'RPT-06587622-2026-07-15-2', biometric_id: '06587622', date: '2026-07-15', time: '03:08 PM', timestamp: '2026-07-15T15:08:00Z', device_id: 'DEV-001', device_name: 'ZKTeco M1' },
  { punch_id: 'RPT-06587622-2026-07-16-1', biometric_id: '06587622', date: '2026-07-16', time: '07:04 AM', timestamp: '2026-07-16T07:04:00Z', device_id: 'DEV-001', device_name: 'ZKTeco M1' },
  { punch_id: 'RPT-06587622-2026-07-16-2', biometric_id: '06587622', date: '2026-07-16', time: '03:41 PM', timestamp: '2026-07-16T15:41:00Z', device_id: 'DEV-001', device_name: 'ZKTeco M1' },
  { punch_id: 'RPT-06587622-2026-07-18-1', biometric_id: '06587622', date: '2026-07-18', time: '07:04 AM', timestamp: '2026-07-18T07:04:00Z', device_id: 'DEV-001', device_name: 'ZKTeco M1' },
  { punch_id: 'RPT-06587622-2026-07-18-2', biometric_id: '06587622', date: '2026-07-18', time: '02:44 PM', timestamp: '2026-07-18T14:44:00Z', device_id: 'DEV-001', device_name: 'ZKTeco M1' },
  { punch_id: 'RPT-06587622-2026-07-20-1', biometric_id: '06587622', date: '2026-07-20', time: '02:32 PM', timestamp: '2026-07-20T14:32:00Z', device_id: 'DEV-001', device_name: 'ZKTeco M1' },
  { punch_id: 'RPT-06587622-2026-07-20-2', biometric_id: '06587622', date: '2026-07-20', time: '10:29 PM', timestamp: '2026-07-20T22:29:00Z', device_id: 'DEV-001', device_name: 'ZKTeco M1' },
  { punch_id: 'RPT-06587622-2026-07-21-1', biometric_id: '06587622', date: '2026-07-21', time: '07:10 AM', timestamp: '2026-07-21T07:10:00Z', device_id: 'DEV-001', device_name: 'ZKTeco M1' },
  { punch_id: 'RPT-06587622-2026-07-21-2', biometric_id: '06587622', date: '2026-07-21', time: '03:13 PM', timestamp: '2026-07-21T15:13:00Z', device_id: 'DEV-001', device_name: 'ZKTeco M1' },
  { punch_id: 'RPT-06587622-2026-07-22-1', biometric_id: '06587622', date: '2026-07-22', time: '08:08 AM', timestamp: '2026-07-22T08:08:00Z', device_id: 'DEV-001', device_name: 'ZKTeco M1' },
  { punch_id: 'RPT-06587622-2026-07-22-2', biometric_id: '06587622', date: '2026-07-22', time: '03:35 PM', timestamp: '2026-07-22T15:35:00Z', device_id: 'DEV-001', device_name: 'ZKTeco M1' },
  { punch_id: 'RPT-06587622-2026-07-23-1', biometric_id: '06587622', date: '2026-07-23', time: '06:56 AM', timestamp: '2026-07-23T06:56:00Z', device_id: 'DEV-001', device_name: 'ZKTeco M1' },
  { punch_id: 'RPT-06587622-2026-07-23-2', biometric_id: '06587622', date: '2026-07-23', time: '03:07 PM', timestamp: '2026-07-23T15:07:00Z', device_id: 'DEV-001', device_name: 'ZKTeco M1' },
  { punch_id: 'RPT-06587622-2026-07-25-1', biometric_id: '06587622', date: '2026-07-25', time: '07:22 AM', timestamp: '2026-07-25T07:22:00Z', device_id: 'DEV-001', device_name: 'ZKTeco M1' },
  { punch_id: 'RPT-06587622-2026-07-25-2', biometric_id: '06587622', date: '2026-07-25', time: '03:00 PM', timestamp: '2026-07-25T15:00:00Z', device_id: 'DEV-001', device_name: 'ZKTeco M1' },
  { punch_id: 'RPT-06587622-2026-07-26-1', biometric_id: '06587622', date: '2026-07-26', time: '06:58 AM', timestamp: '2026-07-26T06:58:00Z', device_id: 'DEV-001', device_name: 'ZKTeco M1' },
  { punch_id: 'RPT-06587622-2026-07-26-2', biometric_id: '06587622', date: '2026-07-26', time: '03:06 PM', timestamp: '2026-07-26T15:06:00Z', device_id: 'DEV-001', device_name: 'ZKTeco M1' },
  { punch_id: 'RPT-06587622-2026-07-27-1', biometric_id: '06587622', date: '2026-07-27', time: '02:23 PM', timestamp: '2026-07-27T14:23:00Z', device_id: 'DEV-001', device_name: 'ZKTeco M1' },
  { punch_id: 'RPT-06587622-2026-07-27-2', biometric_id: '06587622', date: '2026-07-27', time: '10:45 PM', timestamp: '2026-07-27T22:45:00Z', device_id: 'DEV-001', device_name: 'ZKTeco M1' },
  { punch_id: 'RPT-06587622-2026-07-28-1', biometric_id: '06587622', date: '2026-07-28', time: '07:04 AM', timestamp: '2026-07-28T07:04:00Z', device_id: 'DEV-001', device_name: 'ZKTeco M1' },
  { punch_id: 'RPT-06587622-2026-07-28-2', biometric_id: '06587622', date: '2026-07-28', time: '02:59 PM', timestamp: '2026-07-28T14:59:00Z', device_id: 'DEV-001', device_name: 'ZKTeco M1' },
  { punch_id: 'RPT-06587622-2026-07-29-1', biometric_id: '06587622', date: '2026-07-29', time: '07:08 AM', timestamp: '2026-07-29T07:08:00Z', device_id: 'DEV-001', device_name: 'ZKTeco M1' },
  { punch_id: 'RPT-06587622-2026-07-29-2', biometric_id: '06587622', date: '2026-07-29', time: '03:06 PM', timestamp: '2026-07-29T15:06:00Z', device_id: 'DEV-001', device_name: 'ZKTeco M1' },
  { punch_id: 'RPT-06587622-2026-07-31-1', biometric_id: '06587622', date: '2026-07-31', time: '07:23 AM', timestamp: '2026-07-31T07:23:00Z', device_id: 'DEV-001', device_name: 'ZKTeco M1' },
  { punch_id: 'RPT-06587622-2026-07-31-2', biometric_id: '06587622', date: '2026-07-31', time: '03:25 PM', timestamp: '2026-07-31T15:25:00Z', device_id: 'DEV-001', device_name: 'ZKTeco M1' },
  { punch_id: 'RPT-06587622-2026-08-01-1', biometric_id: '06587622', date: '2026-08-01', time: '07:18 AM', timestamp: '2026-08-01T07:18:00Z', device_id: 'DEV-001', device_name: 'ZKTeco M1' },
  { punch_id: 'RPT-06587622-2026-08-01-2', biometric_id: '06587622', date: '2026-08-01', time: '03:04 PM', timestamp: '2026-08-01T15:04:00Z', device_id: 'DEV-001', device_name: 'ZKTeco M1' },
  { punch_id: 'RPT-43588725-2026-07-02-1', biometric_id: '43588725', date: '2026-07-02', time: '10:27 PM', timestamp: '2026-07-02T22:27:00Z', device_id: 'DEV-001', device_name: 'ZKTeco M1' },
  { punch_id: 'RPT-43588725-2026-07-08-1', biometric_id: '43588725', date: '2026-07-08', time: '02:35 PM', timestamp: '2026-07-08T14:35:00Z', device_id: 'DEV-001', device_name: 'ZKTeco M1' },
  { punch_id: 'RPT-43801971-2026-07-01-1', biometric_id: '43801971', date: '2026-07-01', time: '09:19 AM', timestamp: '2026-07-01T09:19:00Z', device_id: 'DEV-001', device_name: 'ZKTeco M1' },
  { punch_id: 'RPT-43801971-2026-07-01-2', biometric_id: '43801971', date: '2026-07-01', time: '09:39 PM', timestamp: '2026-07-01T21:39:00Z', device_id: 'DEV-001', device_name: 'ZKTeco M1' },
  { punch_id: 'RPT-43801971-2026-07-09-1', biometric_id: '43801971', date: '2026-07-09', time: '10:40 AM', timestamp: '2026-07-09T10:40:00Z', device_id: 'DEV-001', device_name: 'ZKTeco M1' },
  { punch_id: 'RPT-61096401-2026-07-01-1', biometric_id: '61096401', date: '2026-07-01', time: '05:47 PM', timestamp: '2026-07-01T17:47:00Z', device_id: 'DEV-001', device_name: 'ZKTeco M1' },
  { punch_id: 'RPT-61096401-2026-07-01-2', biometric_id: '61096401', date: '2026-07-01', time: '08:02 PM', timestamp: '2026-07-01T20:02:00Z', device_id: 'DEV-001', device_name: 'ZKTeco M1' },
  { punch_id: 'RPT-61096401-2026-07-02-1', biometric_id: '61096401', date: '2026-07-02', time: '06:47 AM', timestamp: '2026-07-02T06:47:00Z', device_id: 'DEV-001', device_name: 'ZKTeco M1' },
  { punch_id: 'RPT-61096401-2026-07-02-2', biometric_id: '61096401', date: '2026-07-02', time: '03:13 PM', timestamp: '2026-07-02T15:13:00Z', device_id: 'DEV-001', device_name: 'ZKTeco M1' },
  { punch_id: 'RPT-61096401-2026-07-03-1', biometric_id: '61096401', date: '2026-07-03', time: '02:15 PM', timestamp: '2026-07-03T14:15:00Z', device_id: 'DEV-001', device_name: 'ZKTeco M1' },
  { punch_id: 'RPT-61096401-2026-07-03-2', biometric_id: '61096401', date: '2026-07-03', time: '10:26 PM', timestamp: '2026-07-03T22:26:00Z', device_id: 'DEV-001', device_name: 'ZKTeco M1' },
  { punch_id: 'RPT-61096401-2026-07-05-1', biometric_id: '61096401', date: '2026-07-05', time: '03:10 PM', timestamp: '2026-07-05T15:10:00Z', device_id: 'DEV-001', device_name: 'ZKTeco M1' },
  { punch_id: 'RPT-61096401-2026-07-05-2', biometric_id: '61096401', date: '2026-07-05', time: '06:48 PM', timestamp: '2026-07-05T18:48:00Z', device_id: 'DEV-001', device_name: 'ZKTeco M1' },
  { punch_id: 'RPT-61096401-2026-07-06-1', biometric_id: '61096401', date: '2026-07-06', time: '08:08 AM', timestamp: '2026-07-06T08:08:00Z', device_id: 'DEV-001', device_name: 'ZKTeco M1' },
  { punch_id: 'RPT-61096401-2026-07-06-2', biometric_id: '61096401', date: '2026-07-06', time: '03:42 PM', timestamp: '2026-07-06T15:42:00Z', device_id: 'DEV-001', device_name: 'ZKTeco M1' },
  { punch_id: 'RPT-61096401-2026-07-07-1', biometric_id: '61096401', date: '2026-07-07', time: '02:36 PM', timestamp: '2026-07-07T14:36:00Z', device_id: 'DEV-001', device_name: 'ZKTeco M1' },
  { punch_id: 'RPT-61096401-2026-07-07-2', biometric_id: '61096401', date: '2026-07-07', time: '10:11 PM', timestamp: '2026-07-07T22:11:00Z', device_id: 'DEV-001', device_name: 'ZKTeco M1' },
  { punch_id: 'RPT-61096401-2026-07-08-1', biometric_id: '61096401', date: '2026-07-08', time: '12:05 PM', timestamp: '2026-07-08T12:05:00Z', device_id: 'DEV-001', device_name: 'ZKTeco M1' },
  { punch_id: 'RPT-61096401-2026-07-08-2', biometric_id: '61096401', date: '2026-07-08', time: '08:16 PM', timestamp: '2026-07-08T20:16:00Z', device_id: 'DEV-001', device_name: 'ZKTeco M1' },
  { punch_id: 'RPT-61096401-2026-07-10-1', biometric_id: '61096401', date: '2026-07-10', time: '07:02 AM', timestamp: '2026-07-10T07:02:00Z', device_id: 'DEV-001', device_name: 'ZKTeco M1' },
  { punch_id: 'RPT-61096401-2026-07-10-2', biometric_id: '61096401', date: '2026-07-10', time: '03:07 PM', timestamp: '2026-07-10T15:07:00Z', device_id: 'DEV-001', device_name: 'ZKTeco M1' },
  { punch_id: 'RPT-61096401-2026-07-12-1', biometric_id: '61096401', date: '2026-07-12', time: '03:29 PM', timestamp: '2026-07-12T15:29:00Z', device_id: 'DEV-001', device_name: 'ZKTeco M1' },
  { punch_id: 'RPT-61096401-2026-07-12-2', biometric_id: '61096401', date: '2026-07-12', time: '10:05 PM', timestamp: '2026-07-12T22:05:00Z', device_id: 'DEV-001', device_name: 'ZKTeco M1' },
  { punch_id: 'RPT-61096401-2026-07-13-1', biometric_id: '61096401', date: '2026-07-13', time: '06:57 AM', timestamp: '2026-07-13T06:57:00Z', device_id: 'DEV-001', device_name: 'ZKTeco M1' },
  { punch_id: 'RPT-61096401-2026-07-14-1', biometric_id: '61096401', date: '2026-07-14', time: '02:25 PM', timestamp: '2026-07-14T14:25:00Z', device_id: 'DEV-001', device_name: 'ZKTeco M1' },
  { punch_id: 'RPT-61096401-2026-07-14-2', biometric_id: '61096401', date: '2026-07-14', time: '10:51 PM', timestamp: '2026-07-14T22:51:00Z', device_id: 'DEV-001', device_name: 'ZKTeco M1' },
  { punch_id: 'RPT-61096401-2026-07-15-1', biometric_id: '61096401', date: '2026-07-15', time: '11:57 AM', timestamp: '2026-07-15T11:57:00Z', device_id: 'DEV-001', device_name: 'ZKTeco M1' },
  { punch_id: 'RPT-61096401-2026-07-15-2', biometric_id: '61096401', date: '2026-07-15', time: '08:36 PM', timestamp: '2026-07-15T20:36:00Z', device_id: 'DEV-001', device_name: 'ZKTeco M1' },
  { punch_id: 'RPT-61096401-2026-07-17-1', biometric_id: '61096401', date: '2026-07-17', time: '07:03 AM', timestamp: '2026-07-17T07:03:00Z', device_id: 'DEV-001', device_name: 'ZKTeco M1' },
  { punch_id: 'RPT-61096401-2026-07-17-2', biometric_id: '61096401', date: '2026-07-17', time: '03:22 PM', timestamp: '2026-07-17T15:22:00Z', device_id: 'DEV-001', device_name: 'ZKTeco M1' },
  { punch_id: 'RPT-61096401-2026-07-18-1', biometric_id: '61096401', date: '2026-07-18', time: '02:37 PM', timestamp: '2026-07-18T14:37:00Z', device_id: 'DEV-001', device_name: 'ZKTeco M1' },
  { punch_id: 'RPT-61096401-2026-07-18-2', biometric_id: '61096401', date: '2026-07-18', time: '10:18 PM', timestamp: '2026-07-18T22:18:00Z', device_id: 'DEV-001', device_name: 'ZKTeco M1' },
  { punch_id: 'RPT-61096401-2026-07-19-1', biometric_id: '61096401', date: '2026-07-19', time: '02:54 PM', timestamp: '2026-07-19T14:54:00Z', device_id: 'DEV-001', device_name: 'ZKTeco M1' },
  { punch_id: 'RPT-61096401-2026-07-19-2', biometric_id: '61096401', date: '2026-07-19', time: '10:09 PM', timestamp: '2026-07-19T22:09:00Z', device_id: 'DEV-001', device_name: 'ZKTeco M1' },
  { punch_id: 'RPT-61096401-2026-07-20-1', biometric_id: '61096401', date: '2026-07-20', time: '07:02 AM', timestamp: '2026-07-20T07:02:00Z', device_id: 'DEV-001', device_name: 'ZKTeco M1' },
  { punch_id: 'RPT-61096401-2026-07-20-2', biometric_id: '61096401', date: '2026-07-20', time: '03:13 PM', timestamp: '2026-07-20T15:13:00Z', device_id: 'DEV-001', device_name: 'ZKTeco M1' },
  { punch_id: 'RPT-61096401-2026-07-21-1', biometric_id: '61096401', date: '2026-07-21', time: '02:26 PM', timestamp: '2026-07-21T14:26:00Z', device_id: 'DEV-001', device_name: 'ZKTeco M1' },
  { punch_id: 'RPT-61096401-2026-07-21-2', biometric_id: '61096401', date: '2026-07-21', time: '10:56 PM', timestamp: '2026-07-21T22:56:00Z', device_id: 'DEV-001', device_name: 'ZKTeco M1' },
  { punch_id: 'RPT-61096401-2026-07-24-1', biometric_id: '61096401', date: '2026-07-24', time: '07:15 AM', timestamp: '2026-07-24T07:15:00Z', device_id: 'DEV-001', device_name: 'ZKTeco M1' },
  { punch_id: 'RPT-61096401-2026-07-24-2', biometric_id: '61096401', date: '2026-07-24', time: '05:51 PM', timestamp: '2026-07-24T17:51:00Z', device_id: 'DEV-001', device_name: 'ZKTeco M1' },
  { punch_id: 'RPT-61096401-2026-07-25-1', biometric_id: '61096401', date: '2026-07-25', time: '02:29 PM', timestamp: '2026-07-25T14:29:00Z', device_id: 'DEV-001', device_name: 'ZKTeco M1' },
  { punch_id: 'RPT-61096401-2026-07-25-2', biometric_id: '61096401', date: '2026-07-25', time: '10:54 PM', timestamp: '2026-07-25T22:54:00Z', device_id: 'DEV-001', device_name: 'ZKTeco M1' },
  { punch_id: 'RPT-61096401-2026-07-26-1', biometric_id: '61096401', date: '2026-07-26', time: '02:26 PM', timestamp: '2026-07-26T14:26:00Z', device_id: 'DEV-001', device_name: 'ZKTeco M1' },
  { punch_id: 'RPT-61096401-2026-07-26-2', biometric_id: '61096401', date: '2026-07-26', time: '10:09 PM', timestamp: '2026-07-26T22:09:00Z', device_id: 'DEV-001', device_name: 'ZKTeco M1' },
  { punch_id: 'RPT-61096401-2026-07-27-1', biometric_id: '61096401', date: '2026-07-27', time: '06:59 AM', timestamp: '2026-07-27T06:59:00Z', device_id: 'DEV-001', device_name: 'ZKTeco M1' },
  { punch_id: 'RPT-61096401-2026-07-27-2', biometric_id: '61096401', date: '2026-07-27', time: '03:12 PM', timestamp: '2026-07-27T15:12:00Z', device_id: 'DEV-001', device_name: 'ZKTeco M1' },
  { punch_id: 'RPT-61096401-2026-07-28-1', biometric_id: '61096401', date: '2026-07-28', time: '02:18 PM', timestamp: '2026-07-28T14:18:00Z', device_id: 'DEV-001', device_name: 'ZKTeco M1' },
  { punch_id: 'RPT-61096401-2026-07-28-2', biometric_id: '61096401', date: '2026-07-28', time: '10:35 PM', timestamp: '2026-07-28T22:35:00Z', device_id: 'DEV-001', device_name: 'ZKTeco M1' },
  { punch_id: 'RPT-61096401-2026-07-29-1', biometric_id: '61096401', date: '2026-07-29', time: '11:50 AM', timestamp: '2026-07-29T11:50:00Z', device_id: 'DEV-001', device_name: 'ZKTeco M1' },
  { punch_id: 'RPT-61096401-2026-07-29-2', biometric_id: '61096401', date: '2026-07-29', time: '08:00 PM', timestamp: '2026-07-29T20:00:00Z', device_id: 'DEV-001', device_name: 'ZKTeco M1' },
  { punch_id: 'RPT-61096401-2026-07-30-1', biometric_id: '61096401', date: '2026-07-30', time: '07:00 AM', timestamp: '2026-07-30T07:00:00Z', device_id: 'DEV-001', device_name: 'ZKTeco M1' },
  { punch_id: 'RPT-61096401-2026-07-30-2', biometric_id: '61096401', date: '2026-07-30', time: '03:01 PM', timestamp: '2026-07-30T15:01:00Z', device_id: 'DEV-001', device_name: 'ZKTeco M1' },
  { punch_id: 'RPT-61096401-2026-08-01-1', biometric_id: '61096401', date: '2026-08-01', time: '02:35 PM', timestamp: '2026-08-01T14:35:00Z', device_id: 'DEV-001', device_name: 'ZKTeco M1' },
  { punch_id: 'RPT-71608726-2026-07-01-1', biometric_id: '71608726', date: '2026-07-01', time: '09:25 AM', timestamp: '2026-07-01T09:25:00Z', device_id: 'DEV-001', device_name: 'ZKTeco M1' },
  { punch_id: 'RPT-71608726-2026-07-03-1', biometric_id: '71608726', date: '2026-07-03', time: '06:59 AM', timestamp: '2026-07-03T06:59:00Z', device_id: 'DEV-001', device_name: 'ZKTeco M1' },
  { punch_id: 'RPT-71608726-2026-07-04-1', biometric_id: '71608726', date: '2026-07-04', time: '06:57 AM', timestamp: '2026-07-04T06:57:00Z', device_id: 'DEV-001', device_name: 'ZKTeco M1' },
  { punch_id: 'RPT-71608726-2026-07-04-2', biometric_id: '71608726', date: '2026-07-04', time: '03:37 PM', timestamp: '2026-07-04T15:37:00Z', device_id: 'DEV-001', device_name: 'ZKTeco M1' },
  { punch_id: 'RPT-71608726-2026-07-06-1', biometric_id: '71608726', date: '2026-07-06', time: '07:46 AM', timestamp: '2026-07-06T07:46:00Z', device_id: 'DEV-001', device_name: 'ZKTeco M1' },
  { punch_id: 'RPT-71608726-2026-07-06-2', biometric_id: '71608726', date: '2026-07-06', time: '03:54 PM', timestamp: '2026-07-06T15:54:00Z', device_id: 'DEV-001', device_name: 'ZKTeco M1' },
  { punch_id: 'RPT-71608726-2026-07-07-1', biometric_id: '71608726', date: '2026-07-07', time: '06:56 AM', timestamp: '2026-07-07T06:56:00Z', device_id: 'DEV-001', device_name: 'ZKTeco M1' },
  { punch_id: 'RPT-71608726-2026-07-07-2', biometric_id: '71608726', date: '2026-07-07', time: '03:07 PM', timestamp: '2026-07-07T15:07:00Z', device_id: 'DEV-001', device_name: 'ZKTeco M1' },
  { punch_id: 'RPT-71608726-2026-07-08-1', biometric_id: '71608726', date: '2026-07-08', time: '06:57 AM', timestamp: '2026-07-08T06:57:00Z', device_id: 'DEV-001', device_name: 'ZKTeco M1' },
  { punch_id: 'RPT-71608726-2026-07-09-1', biometric_id: '71608726', date: '2026-07-09', time: '06:59 AM', timestamp: '2026-07-09T06:59:00Z', device_id: 'DEV-001', device_name: 'ZKTeco M1' },
  { punch_id: 'RPT-71608726-2026-07-10-1', biometric_id: '71608726', date: '2026-07-10', time: '06:57 AM', timestamp: '2026-07-10T06:57:00Z', device_id: 'DEV-001', device_name: 'ZKTeco M1' },
  { punch_id: 'RPT-71608726-2026-07-10-2', biometric_id: '71608726', date: '2026-07-10', time: '03:07 PM', timestamp: '2026-07-10T15:07:00Z', device_id: 'DEV-001', device_name: 'ZKTeco M1' },
  { punch_id: 'RPT-71608726-2026-07-11-1', biometric_id: '71608726', date: '2026-07-11', time: '06:57 AM', timestamp: '2026-07-11T06:57:00Z', device_id: 'DEV-001', device_name: 'ZKTeco M1' },
  { punch_id: 'RPT-71608726-2026-07-11-2', biometric_id: '71608726', date: '2026-07-11', time: '03:28 PM', timestamp: '2026-07-11T15:28:00Z', device_id: 'DEV-001', device_name: 'ZKTeco M1' },
  { punch_id: 'RPT-71608726-2026-07-13-1', biometric_id: '71608726', date: '2026-07-13', time: '07:06 AM', timestamp: '2026-07-13T07:06:00Z', device_id: 'DEV-001', device_name: 'ZKTeco M1' },
  { punch_id: 'RPT-71608726-2026-07-14-1', biometric_id: '71608726', date: '2026-07-14', time: '07:05 AM', timestamp: '2026-07-14T07:05:00Z', device_id: 'DEV-001', device_name: 'ZKTeco M1' },
  { punch_id: 'RPT-71608726-2026-07-15-1', biometric_id: '71608726', date: '2026-07-15', time: '06:56 AM', timestamp: '2026-07-15T06:56:00Z', device_id: 'DEV-001', device_name: 'ZKTeco M1' },
  { punch_id: 'RPT-71608726-2026-07-16-1', biometric_id: '71608726', date: '2026-07-16', time: '07:00 AM', timestamp: '2026-07-16T07:00:00Z', device_id: 'DEV-001', device_name: 'ZKTeco M1' },
  { punch_id: 'RPT-71608726-2026-07-17-1', biometric_id: '71608726', date: '2026-07-17', time: '07:03 AM', timestamp: '2026-07-17T07:03:00Z', device_id: 'DEV-001', device_name: 'ZKTeco M1' },
  { punch_id: 'RPT-71608726-2026-07-18-1', biometric_id: '71608726', date: '2026-07-18', time: '07:00 AM', timestamp: '2026-07-18T07:00:00Z', device_id: 'DEV-001', device_name: 'ZKTeco M1' },
  { punch_id: 'RPT-71608726-2026-07-20-1', biometric_id: '71608726', date: '2026-07-20', time: '07:02 AM', timestamp: '2026-07-20T07:02:00Z', device_id: 'DEV-001', device_name: 'ZKTeco M1' },
  { punch_id: 'RPT-71608726-2026-07-20-2', biometric_id: '71608726', date: '2026-07-20', time: '03:13 PM', timestamp: '2026-07-20T15:13:00Z', device_id: 'DEV-001', device_name: 'ZKTeco M1' },
  { punch_id: 'RPT-41670259-2026-07-03-1', biometric_id: '41670259', date: '2026-07-03', time: '06:59 AM', timestamp: '2026-07-03T06:59:00Z', device_id: 'DEV-001', device_name: 'ZKTeco M1' },
  { punch_id: 'RPT-41670259-2026-07-04-1', biometric_id: '41670259', date: '2026-07-04', time: '09:33 AM', timestamp: '2026-07-04T09:33:00Z', device_id: 'DEV-001', device_name: 'ZKTeco M1' },
  { punch_id: 'RPT-41670259-2026-07-06-1', biometric_id: '41670259', date: '2026-07-06', time: '07:00 AM', timestamp: '2026-07-06T07:00:00Z', device_id: 'DEV-001', device_name: 'ZKTeco M1' },
  { punch_id: 'RPT-41670259-2026-07-22-1', biometric_id: '41670259', date: '2026-07-22', time: '07:03 AM', timestamp: '2026-07-22T07:03:00Z', device_id: 'DEV-001', device_name: 'ZKTeco M1' },
  { punch_id: 'RPT-147242-2026-07-01-1', biometric_id: '147242', date: '2026-07-01', time: '05:44 PM', timestamp: '2026-07-01T17:44:00Z', device_id: 'DEV-001', device_name: 'ZKTeco M1' },
  { punch_id: 'RPT-147242-2026-07-01-2', biometric_id: '147242', date: '2026-07-01', time: '11:06 PM', timestamp: '2026-07-01T23:06:00Z', device_id: 'DEV-001', device_name: 'ZKTeco M1' },
  { punch_id: 'RPT-147242-2026-07-02-1', biometric_id: '147242', date: '2026-07-02', time: '02:32 PM', timestamp: '2026-07-02T14:32:00Z', device_id: 'DEV-001', device_name: 'ZKTeco M1' },
  { punch_id: 'RPT-147242-2026-07-02-2', biometric_id: '147242', date: '2026-07-02', time: '10:28 PM', timestamp: '2026-07-02T22:28:00Z', device_id: 'DEV-001', device_name: 'ZKTeco M1' },
  { punch_id: 'RPT-147242-2026-07-04-1', biometric_id: '147242', date: '2026-07-04', time: '02:35 PM', timestamp: '2026-07-04T14:35:00Z', device_id: 'DEV-001', device_name: 'ZKTeco M1' },
  { punch_id: 'RPT-147242-2026-07-04-2', biometric_id: '147242', date: '2026-07-04', time: '10:30 PM', timestamp: '2026-07-04T22:30:00Z', device_id: 'DEV-001', device_name: 'ZKTeco M1' },
  { punch_id: 'RPT-147242-2026-07-08-1', biometric_id: '147242', date: '2026-07-08', time: '02:34 PM', timestamp: '2026-07-08T14:34:00Z', device_id: 'DEV-001', device_name: 'ZKTeco M1' },
  { punch_id: 'RPT-147242-2026-07-08-2', biometric_id: '147242', date: '2026-07-08', time: '10:17 PM', timestamp: '2026-07-08T22:17:00Z', device_id: 'DEV-001', device_name: 'ZKTeco M1' },
  { punch_id: 'RPT-147242-2026-07-09-1', biometric_id: '147242', date: '2026-07-09', time: '10:17 PM', timestamp: '2026-07-09T22:17:00Z', device_id: 'DEV-001', device_name: 'ZKTeco M1' },
  { punch_id: 'RPT-147242-2026-07-10-1', biometric_id: '147242', date: '2026-07-10', time: '02:30 PM', timestamp: '2026-07-10T14:30:00Z', device_id: 'DEV-001', device_name: 'ZKTeco M1' },
  { punch_id: 'RPT-147242-2026-07-10-2', biometric_id: '147242', date: '2026-07-10', time: '10:30 PM', timestamp: '2026-07-10T22:30:00Z', device_id: 'DEV-001', device_name: 'ZKTeco M1' },
  { punch_id: 'RPT-147242-2026-07-15-1', biometric_id: '147242', date: '2026-07-15', time: '02:25 PM', timestamp: '2026-07-15T14:25:00Z', device_id: 'DEV-001', device_name: 'ZKTeco M1' },
  { punch_id: 'RPT-147242-2026-07-15-2', biometric_id: '147242', date: '2026-07-15', time: '10:56 PM', timestamp: '2026-07-15T22:56:00Z', device_id: 'DEV-001', device_name: 'ZKTeco M1' },
  { punch_id: 'RPT-147242-2026-07-16-1', biometric_id: '147242', date: '2026-07-16', time: '02:35 PM', timestamp: '2026-07-16T14:35:00Z', device_id: 'DEV-001', device_name: 'ZKTeco M1' },
  { punch_id: 'RPT-147242-2026-07-16-2', biometric_id: '147242', date: '2026-07-16', time: '11:06 PM', timestamp: '2026-07-16T23:06:00Z', device_id: 'DEV-001', device_name: 'ZKTeco M1' },
  { punch_id: 'RPT-147242-2026-07-17-1', biometric_id: '147242', date: '2026-07-17', time: '02:35 PM', timestamp: '2026-07-17T14:35:00Z', device_id: 'DEV-001', device_name: 'ZKTeco M1' },
  { punch_id: 'RPT-147242-2026-07-17-2', biometric_id: '147242', date: '2026-07-17', time: '10:45 PM', timestamp: '2026-07-17T22:45:00Z', device_id: 'DEV-001', device_name: 'ZKTeco M1' },
  { punch_id: 'RPT-147242-2026-07-22-1', biometric_id: '147242', date: '2026-07-22', time: '02:31 PM', timestamp: '2026-07-22T14:31:00Z', device_id: 'DEV-001', device_name: 'ZKTeco M1' },
  { punch_id: 'RPT-147242-2026-07-22-2', biometric_id: '147242', date: '2026-07-22', time: '10:11 PM', timestamp: '2026-07-22T22:11:00Z', device_id: 'DEV-001', device_name: 'ZKTeco M1' },
  { punch_id: 'RPT-147242-2026-07-23-1', biometric_id: '147242', date: '2026-07-23', time: '02:27 PM', timestamp: '2026-07-23T14:27:00Z', device_id: 'DEV-001', device_name: 'ZKTeco M1' },
  { punch_id: 'RPT-147242-2026-07-23-2', biometric_id: '147242', date: '2026-07-23', time: '10:17 PM', timestamp: '2026-07-23T22:17:00Z', device_id: 'DEV-001', device_name: 'ZKTeco M1' },
  { punch_id: 'RPT-147242-2026-07-24-1', biometric_id: '147242', date: '2026-07-24', time: '05:48 PM', timestamp: '2026-07-24T17:48:00Z', device_id: 'DEV-001', device_name: 'ZKTeco M1' },
  { punch_id: 'RPT-147242-2026-07-24-2', biometric_id: '147242', date: '2026-07-24', time: '10:30 PM', timestamp: '2026-07-24T22:30:00Z', device_id: 'DEV-001', device_name: 'ZKTeco M1' },
  { punch_id: 'RPT-147242-2026-07-29-1', biometric_id: '147242', date: '2026-07-29', time: '02:32 PM', timestamp: '2026-07-29T14:32:00Z', device_id: 'DEV-001', device_name: 'ZKTeco M1' },
  { punch_id: 'RPT-147242-2026-07-29-2', biometric_id: '147242', date: '2026-07-29', time: '10:55 PM', timestamp: '2026-07-29T22:55:00Z', device_id: 'DEV-001', device_name: 'ZKTeco M1' },
  { punch_id: 'RPT-147242-2026-07-30-1', biometric_id: '147242', date: '2026-07-30', time: '02:34 PM', timestamp: '2026-07-30T14:34:00Z', device_id: 'DEV-001', device_name: 'ZKTeco M1' },
  { punch_id: 'RPT-147242-2026-07-30-2', biometric_id: '147242', date: '2026-07-30', time: '10:28 PM', timestamp: '2026-07-30T22:28:00Z', device_id: 'DEV-001', device_name: 'ZKTeco M1' },
  { punch_id: 'RPT-147242-2026-07-31-1', biometric_id: '147242', date: '2026-07-31', time: '02:27 PM', timestamp: '2026-07-31T14:27:00Z', device_id: 'DEV-001', device_name: 'ZKTeco M1' },
  { punch_id: 'RPT-147242-2026-07-31-2', biometric_id: '147242', date: '2026-07-31', time: '11:00 PM', timestamp: '2026-07-31T23:00:00Z', device_id: 'DEV-001', device_name: 'ZKTeco M1' },
];

export default async function handler(req, res) {
  // CORS Headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Cache-Control');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // 1. TRY SUPABASE Persistent Sync
  const supabaseUrl = process.env.SUPABASE_URL || '';
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY || '';

  if (supabaseUrl && supabaseKey) {
    try {
      const supabase = createClient(supabaseUrl, supabaseKey);
      
      // Auto-seed initial report punches to Supabase if not present
      try {
        await supabase
          .from('asistencia_biometrica')
          .upsert(
            INITIAL_REPORT_PUNCHES.map(p => ({
              punch_id: p.punch_id,
              biometric_id: p.biometric_id,
              timestamp: p.timestamp,
              device_id: p.device_id,
              device_name: p.device_name
            })),
            { onConflict: 'punch_id', ignoreDuplicates: true }
          );
      } catch (seedErr) {
        console.warn('[sync-zk] Auto-seed note:', seedErr.message);
      }

      // Query latest attendance punches
      const { data: records, error } = await supabase
        .from('asistencia_biometrica')
        .select('*')
        .order('timestamp', { ascending: false })
        .limit(1000);

      if (error) throw error;

      // Filter out removed personnel and map records
      const punches = (records || [])
        .filter(r => !EXCLUDED_BIOMETRIC_IDS.includes(String(r.biometric_id)))
        .map(r => {
          const punchTime = new Date(r.timestamp);
          const hours = punchTime.getHours();
          const minutes = punchTime.getMinutes();
          const displayHours = hours > 12 ? hours - 12 : (hours === 0 ? 12 : hours);
          const displayMinutes = minutes.toString().padStart(2, '0');
          const ampm = hours >= 12 ? 'PM' : 'AM';
          const timeStr = `${displayHours.toString().padStart(2, '0')}:${displayMinutes} ${ampm}`;
          const dateStr = punchTime.toISOString().split('T')[0];

          return {
            punch_id: r.punch_id,
            biometric_id: String(r.biometric_id),
            time: timeStr,
            date: dateStr,
            timestamp: r.timestamp,
            device_id: r.device_id || 'DEV-001',
            device_name: r.device_name || 'ZKTeco M1'
          };
        });

      return res.status(200).json({
        status: 'success',
        message: 'Successfully synced punches from Supabase cloud database.',
        punches: punches
      });
    } catch (dbError) {
      console.error('[sync-zk] Supabase query failed, falling back to report punches:', dbError);
    }
  }

  // 2. FALLBACK IN-MEMORY / STATIC REPORT PUNCHES (If Supabase not reachable)
  global.latestPunches = global.latestPunches || [];
  
  const liveMemoryPunches = [...global.latestPunches].map(p => {
    const parts = p.timestamp.split(' ');
    const dateStr = parts[0];
    const timePart = parts[1];
    const [hStr, mStr] = timePart.split(':');
    let hours = parseInt(hStr, 10);
    const minutes = mStr;
    const ampm = hours >= 12 ? 'PM' : 'AM';
    const displayHours = hours > 12 ? hours - 12 : (hours === 0 ? 12 : hours);
    const timeStr = `${displayHours.toString().padStart(2, '0')}:${minutes} ${ampm}`;

    let localIso = '';
    try {
      localIso = new Date(`${dateStr}T${timePart}`).toISOString();
    } catch (err) {
      localIso = new Date().toISOString();
    }

    return {
      punch_id: p.punch_id,
      biometric_id: String(p.biometric_id),
      time: timeStr,
      date: dateStr,
      timestamp: localIso,
      device_id: p.device_id,
      device_name: p.device_name
    };
  });

  const combinedPunches = [...INITIAL_REPORT_PUNCHES, ...liveMemoryPunches]
    .filter(p => !EXCLUDED_BIOMETRIC_IDS.includes(String(p.biometric_id)));

  return res.status(200).json({
    status: 'success',
    message: 'Synced punches from active personnel report (Fallback Mode).',
    punches: combinedPunches
  });
}

  try {
    // 1. AUTHENTICATE WITH ZKBIO ZLINK (MINERVA IoT)
    // ZKBio Zlink uses token-based authentication. First, request a token:
    const authUrl = 'https://api.minervaiot.com/oauth/token'; // standard Minerva IoT OAuth URL
    
    // We make a request to ZLink auth endpoint
    const authResponse = await fetch(authUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        grant_type: 'client_credentials',
        client_id: appKey,
        client_secret: appSecret,
        tenant_id: tenantId || ''
      })
    });

    if (!authResponse.ok) {
      const errText = await authResponse.text();
      throw new Error(`Authentication with ZKBio Zlink failed: ${errText}`);
    }

    const authData = await authResponse.json();
    const accessToken = authData.access_token; // token valid for session queries

    // 2. FETCH LATEST PUNCH RECORDS FOR TODAY
    const now = new Date();
    const todayStr = now.toISOString().split('T')[0]; // format YYYY-MM-DD
    
    // ZKBio Zlink API endpoint to query attendance logs
    // Query parameters normally specify start_time, end_time, page and limit
    const punchUrl = `https://api.minervaiot.com/v1/attendance/punch-records?date=${todayStr}&limit=50`;

    const punchResponse = await fetch(punchUrl, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      }
    });

    if (!punchResponse.ok) {
      const errText = await punchResponse.text();
      throw new Error(`Failed to fetch punch records: ${errText}`);
    }

    const punchData = await punchResponse.json();
    
    // Parse the records to match the intranet structure
    // ZLink returns fields: person_id (biometric_id), punch_time, device_id, device_name
    const punches = (punchData.records || []).map(r => {
      const punchTime = new Date(r.punch_time);
      const hours = punchTime.getHours();
      const minutes = punchTime.getMinutes();
      const displayHours = hours > 12 ? hours - 12 : (hours === 0 ? 12 : hours);
      const displayMinutes = minutes.toString().padStart(2, '0');
      const ampm = hours >= 12 ? 'PM' : 'AM';
      const timeStr = `${displayHours.toString().padStart(2, '0')}:${displayMinutes} ${ampm}`;

      return {
        punch_id: r.id || `ZK-${r.person_id}-${punchTime.getTime()}`,
        biometric_id: String(r.person_id),
        username: r.username || '',
        time: timeStr,
        date: r.punch_time.split('T')[0],
        timestamp: r.punch_time,
        device_id: r.device_id || 'DEV-001',
        device_name: r.device_name || 'ZKTeco M1'
      };
    });

    return res.status(200).json({
      status: 'success',
      message: 'Successfully synced punches from ZKBio Zlink AWS Cloud.',
      punches: punches
    });

  } catch (error) {
    console.error('Error in sync-zk function:', error);
    return res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
}
