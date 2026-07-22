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

    print("=== REPORTE SOLO CON FECHAS DE HORARIO REGISTRADO POR ADMIN (JULIO 06 EN ADELANTE) ===\n")
    
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
        
        # ONLY calculate delay if an admin schedule entry exists for this date and user!
        delay = 0
        scheduled_days_worked = 0
        
        if expected_str and expected_str not in ["OFF", "BARRANCO", "DESCANSO"]:
            eh, em = map(int, expected_str.split(':'))
            exp_mins = eh * 60 + em
            diff = act_mins - exp_mins
            if diff > 5:
                delay = diff
            scheduled_days_worked = 1
        elif expected_str in ["OFF", "BARRANCO", "DESCANSO"]:
            scheduled_days_worked = 0
        else:
            # Dates before July 06 (no admin schedule provided) -> 0 delay, ignore from punctuality penalty
            scheduled_days_worked = 0
                
        if name not in user_totals:
            user_totals[name] = {'total_delay': 0, 'scheduled_worked': 0, 'total_punches': 0}
            
        user_totals[name]['total_delay'] += delay
        user_totals[name]['scheduled_worked'] += scheduled_days_worked
        user_totals[name]['total_punches'] += 1

    ranking = []
    for name, data in user_totals.items():
        sw = data['scheduled_worked']
        avg = data['total_delay'] / sw if sw > 0 else 0
        ranking.append((name, avg, data['total_delay'], sw, data['total_punches']))
        
    ranking.sort(key=lambda x: x[1], reverse=True)
    
    print(f"{'Colaborador':<32} | {'Promedio Tardanza':<18} | {'Min Totales':<12} | {'Días Prog. Marcados':<20} | {'Total Marcaciones'}")
    print("-" * 105)
    for name, avg, tot, sw, tp in ranking:
        hrs = int(avg // 60)
        mins = int(round(avg % 60))
        fmt = f"{hrs} hr {mins} min" if hrs > 0 else f"{mins} min"
        print(f"{name:<32} | {fmt:<18} | {tot:<12} | {sw:<20} | {tp}")

if __name__ == "__main__":
    main()
