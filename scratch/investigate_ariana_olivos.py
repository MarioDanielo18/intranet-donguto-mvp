import urllib.request
import json
from datetime import datetime

def main():
    # 1. Fetch punches from sync-zk API
    punches_res = json.loads(urllib.request.urlopen("https://intranet-livid.vercel.app/api/sync-zk").read().decode('utf-8'))
    all_punches = punches_res.get('punches', [])
    
    # Filter punches for Ariana Olivos (biometric_id '147242')
    ariana_punches = [p for p in all_punches if str(p['biometric_id']).strip() == '147242']
    
    print(f"Total punches for Ariana Olivos (147242): {len(ariana_punches)}")
    
    # 2. Fetch all schedules
    # Get earliest date and latest date from punches
    dates = sorted(list(set(p['date'] for p in ariana_punches)))
    print("Dates with punches:", dates)
    
    min_date = dates[0] if dates else '2026-07-01'
    max_date = dates[-1] if dates else '2026-07-31'
    
    sched_url = f"https://intranet-livid.vercel.app/api/manage-schedules?startDate={min_date}&endDate={max_date}&store=Todas"
    sched_res = json.loads(urllib.request.urlopen(sched_url).read().decode('utf-8'))
    schedules = sched_res.get('schedules', [])
    
    sched_map = {(s['username'].lower(), s['fecha']): s['hora_entrada'] for s in schedules}
    
    # Group punches by date -> earliest punch of the day
    punches_by_date = {}
    for p in ariana_punches:
        dt = p['date']
        ts = p['timestamp']
        if 'T' in ts:
            dt_obj = datetime.fromisoformat(ts.replace('Z', '+00:00'))
        else:
            dt_obj = datetime.strptime(ts, "%Y-%m-%d %H:%M:%S")
            
        if dt not in punches_by_date or dt_obj < punches_by_date[dt]['datetime']:
            punches_by_date[dt] = {
                'datetime': dt_obj,
                'time_str': dt_obj.strftime("%H:%M"),
                'raw_time': p['time'],
                'all_punches_count': sum(1 for x in ariana_punches if x['date'] == dt)
            }
            
    print("\n--- DETALLE DE MARCACIONES Y RETRASO DE ARIANA OLIVOS ---")
    total_delay_min = 0
    total_days = len(punches_by_date)
    
    for dt in sorted(punches_by_date.keys()):
        p_info = punches_by_date[dt]
        actual_time = p_info['time_str']
        
        # Check schedule
        expected_time = sched_map.get(('aolivosdg', dt))
        
        # Default role schedule for Servicio if no dynamic schedule entry exists:
        # For Servicio, default opening is 07:00, default closing is 14:30.
        # Let's see what expected_time was resolved!
        default_used = False
        if not expected_time:
            # If actual time is in afternoon (>=12:00), default closing shift entry is 14:30
            # If actual time is in morning (<12:00), default opening shift entry is 07:00
            exp_h = 14 if int(actual_time.split(':')[0]) >= 12 else 7
            exp_m = 30 if exp_h == 14 else 0
            expected_time = f"{exp_h:02d}:{exp_m:02d}"
            default_used = True

        delay = 0
        if expected_time not in ["OFF", "BARRANCO", "DESCANSO"]:
            exp_h, exp_m = map(int, expected_time.split(':'))
            act_h, act_m = map(int, actual_time.split(':'))
            exp_mins = exp_h * 60 + exp_m
            act_mins = act_h * 60 + act_m
            diff = act_mins - exp_mins
            if diff > 5:
                delay = diff
                total_delay_min += delay
                
        h_delay = delay // 60
        m_delay = delay % 60
        delay_fmt = f"{h_delay}h {m_delay}min" if h_delay > 0 else f"{m_delay} min"
        
        print(f"Fecha: {dt} | Marcó: {actual_time} (Display: {p_info['raw_time']}) | Esp: {expected_time}{' (def)' if default_used else ''} | Retraso: {delay_fmt}")

    avg_min = round(total_delay_min / total_days, 1) if total_days > 0 else 0
    avg_h = int(avg_min // 60)
    avg_m = int(round(avg_min % 60))
    
    print(f"\nTotal retraso acumulado: {total_delay_min} min")
    print(f"Días con marcaciones: {total_days}")
    print(f"Promedio de retraso: {avg_min} min/día -> {avg_h} hr {avg_m} min")

if __name__ == "__main__":
    main()
