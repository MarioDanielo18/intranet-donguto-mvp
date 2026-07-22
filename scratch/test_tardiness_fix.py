import urllib.request
import json
from datetime import datetime

def main():
    punches_res = json.loads(urllib.request.urlopen("https://intranet-livid.vercel.app/api/sync-zk").read().decode('utf-8'))
    all_punches = punches_res.get('punches', [])
    
    users_res = json.loads(urllib.request.urlopen("https://intranet-livid.vercel.app/api/manage-users").read().decode('utf-8'))
    users = users_res.get('users', [])
    bio_to_user = {str(u.get('biometricId')).strip(): u for u in users if u.get('biometricId')}
    
    sched_url = "https://intranet-livid.vercel.app/api/manage-schedules?startDate=2026-07-01&endDate=2026-07-31&store=Todas"
    sched_res = json.loads(urllib.request.urlopen(sched_url).read().decode('utf-8'))
    schedules = sched_res.get('schedules', [])
    sched_map = {(s['username'].lower(), s['fecha']): s['hora_entrada'] for s in schedules}

    punches_by_user_date = {}
    for p in all_punches:
        bio_id = str(p['biometric_id']).strip()
        user_info = bio_to_user.get(bio_id)
        if not user_info:
            continue
        uname = user_info['username'].lower()
        dt = p['date']
        
        ts = p['timestamp']
        if 'T' in ts:
            dt_obj = datetime.fromisoformat(ts.replace('Z', '+00:00'))
        else:
            dt_obj = datetime.strptime(ts, "%Y-%m-%d %H:%M:%S")
            
        key = (uname, dt)
        if key not in punches_by_user_date or dt_obj < punches_by_user_date[key]['datetime']:
            punches_by_user_date[key] = {
                'user': user_info,
                'datetime': dt_obj,
                'time_str': dt_obj.strftime("%H:%M"),
                'raw_time': p['time'],
                'hour': dt_obj.hour,
                'minute': dt_obj.minute
            }

    print("=== RECALCULATION WITH SMART SHIFT DETECTION ===\n")
    
    user_totals = {}
    
    for (uname, dt), p_data in sorted(punches_by_user_date.items(), key=lambda x: x[0][1]):
        user_info = p_data['user']
        name = user_info['name']
        role = user_info['role']
        if role in ['Gerente', 'Técnico']:
            continue
            
        act_h, act_m = p_data['hour'], p_data['minute']
        act_mins = act_h * 60 + act_m
        
        expected_str = sched_map.get((uname, dt))
        
        if expected_str:
            if expected_str in ["OFF", "BARRANCO", "DESCANSO"]:
                exp_mins = None
            else:
                eh, em = map(int, expected_str.split(':'))
                exp_mins = eh * 60 + em
        else:
            # Smart default based on actual punch time of day:
            # If actual punch is >= 13:00 (afternoon), default shift is Closing (14:30)
            # If actual punch is < 13:00 (morning), default shift is Opening (07:00 or 08:00)
            if act_h >= 13:
                exp_mins = 14 * 60 + 30 # 14:30
            else:
                exp_mins = 7 * 60 + 0 # 07:00
                
        delay = 0
        if exp_mins is not None:
            diff = act_mins - exp_mins
            # Only count delay if punch is after expected time (with 5 min tolerance)
            # And if diff > 240 mins (4 hrs) without dynamic schedule, ignore outlier checkout-only punches
            if 5 < diff <= 240 or (expected_str and diff > 5):
                delay = diff
                
        if name not in user_totals:
            user_totals[name] = {'total_delay': 0, 'count': 0}
            
        user_totals[name]['total_delay'] += delay
        user_totals[name]['count'] += 1

    ranking = []
    for name, data in user_totals.items():
        avg = data['total_delay'] / data['count'] if data['count'] > 0 else 0
        ranking.append((name, avg, data['total_delay'], data['count']))
        
    ranking.sort(key=lambda x: x[1], reverse=True)
    
    print(f"{'Colaborador':<35} | {'Promedio':<15} | {'Total':<12} | {'Marcaciones'}")
    print("-" * 75)
    for name, avg, tot, count in ranking:
        hrs = int(avg // 60)
        mins = int(round(avg % 60))
        fmt = f"{hrs} hr {mins} min" if hrs > 0 else f"{mins} min"
        print(f"{name:<35} | {fmt:<15} | {tot:<12} | {count}")

if __name__ == "__main__":
    main()
