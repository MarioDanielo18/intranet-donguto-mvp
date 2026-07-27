import urllib.request
import json

def main():
    url = "https://intranet-livid.vercel.app/api/manage-schedules"
    
    # Schedule for 2026-07-27 to 2026-08-02
    raw_schedules = [
        # ALEXANDER (avasquezdg)
        {"username": "avasquezdg", "schedules": {
            "2026-07-27": ("07:00", "15:00"),
            "2026-07-28": ("14:30", "22:30"),
            "2026-07-29": ("12:00", "20:00"),
            "2026-07-30": ("07:00", "15:00"),
            "2026-07-31": ("OFF", "OFF"),
            "2026-08-01": ("14:30", "22:30"),
            "2026-08-02": ("14:30", "22:30"),
        }},
        # MONICA (mbravodg)
        {"username": "mbravodg", "schedules": {
            "2026-07-27": ("14:30", "22:30"),
            "2026-07-28": ("07:00", "15:00"),
            "2026-07-29": ("07:00", "15:00"),
            "2026-07-30": ("OFF", "OFF"),
            "2026-07-31": ("07:00", "15:00"),
            "2026-08-01": ("07:00", "15:00"),
            "2026-08-02": ("07:00", "15:00"),
        }},
        # ARIANA OLIVOS (aolivosdg)
        {"username": "aolivosdg", "schedules": {
            "2026-07-27": ("OFF", "OFF"),
            "2026-07-28": ("OFF", "OFF"),
            "2026-07-29": ("14:30", "22:30"),
            "2026-07-30": ("14:30", "22:30"),
            "2026-07-31": ("14:30", "22:30"),
            "2026-08-01": ("OFF", "OFF"),
            "2026-08-02": ("OFF", "OFF"),
        }},
        # FRANCHESCA SOTO (fsotodg)
        {"username": "fsotodg", "schedules": {
            "2026-07-27": ("07:00", "15:00"),
            "2026-07-28": ("07:00", "15:00"),
            "2026-07-29": ("OFF", "OFF"),
            "2026-07-30": ("14:30", "22:30"),
            "2026-07-31": ("14:30", "22:30"),
            "2026-08-01": ("14:30", "22:30"),
            "2026-08-02": ("14:30", "22:30"),
        }},
        # CHRISTIAN CUEVA (ccuevadg)
        {"username": "ccuevadg", "schedules": {
            "2026-07-27": ("OFF", "OFF"),
            "2026-07-28": ("OFF", "OFF"),
            "2026-07-29": ("OFF", "OFF"),
            "2026-07-30": ("07:00", "15:00"),
            "2026-07-31": ("07:00", "15:00"),
            "2026-08-01": ("07:00", "15:00"),
            "2026-08-02": ("07:00", "15:00"),
        }},
        # VIDAL IGNACIO (cvidaldg)
        {"username": "cvidaldg", "schedules": {
            "2026-07-27": ("14:30", "22:30"),
            "2026-07-28": ("14:30", "22:30"),
            "2026-07-29": ("07:00", "22:30"),
            "2026-07-30": ("OFF", "OFF"),
            "2026-07-31": ("12:00", "20:00"),
            "2026-08-01": ("12:00", "20:00"),
            "2026-08-02": ("BARRANCO", "BARRANCO"),
        }},
        # JESUS AYMA (jaymadg)
        {"username": "jaymadg", "schedules": {
            "2026-07-27": ("OFF", "OFF"),
            "2026-07-28": ("14:30", "22:30"),
            "2026-07-29": ("07:00", "15:00"),
            "2026-07-30": ("14:30", "22:30"),
            "2026-07-31": ("14:30", "22:30"),
            "2026-08-01": ("14:30", "22:30"),
            "2026-08-02": ("07:00", "15:00"),
        }},
        # GISSELL (gisselldg)
        {"username": "gisselldg", "schedules": {
            "2026-07-27": ("07:00", "15:00"),
            "2026-07-28": ("07:00", "15:00"),
            "2026-07-29": ("OFF", "OFF"),
            "2026-07-30": ("07:00", "15:00"),
            "2026-07-31": ("07:00", "15:00"),
            "2026-08-01": ("07:00", "15:00"),
            "2026-08-02": ("14:30", "22:30"),
        }},
        # GUS (gusdg)
        {"username": "gusdg", "schedules": {
            "2026-07-27": ("14:30", "22:30"),
            "2026-07-28": ("OFF", "OFF"),
            "2026-07-29": ("14:30", "22:30"),
            "2026-07-30": ("12:00", "20:00"),
            "2026-07-31": ("12:00", "20:00"),
            "2026-08-01": ("12:00", "20:00"),
            "2026-08-02": ("12:00", "20:00"),
        }}
    ]

    schedules_list = []
    for item in raw_schedules:
        uname = item["username"]
        for fecha, (h_in, h_out) in item["schedules"].items():
            schedules_list.append({
                "username": uname,
                "fecha": fecha,
                "hora_entrada": h_in,
                "hora_salida": h_out,
                "store": "28 de Julio Miraflores"
            })

    print(f"Submitting {len(schedules_list)} schedule records for week July 27 - August 02...")

    payload = {
        "action": "upsert",
        "schedules": schedules_list
    }

    headers = {"Content-Type": "application/json"}
    try:
        req = urllib.request.Request(
            url,
            data=json.dumps(payload).encode('utf-8'),
            headers=headers,
            method='POST'
        )
        with urllib.request.urlopen(req) as res:
            resp_data = json.loads(res.read().decode('utf-8'))
            print("Response:", resp_data)
            if resp_data.get('status') == 'success':
                print("[OK] New week schedule (Jul 27 - Aug 02) saved successfully!")
            else:
                print("[FAIL] Failed to save schedules:", resp_data)
    except Exception as e:
        print("[ERROR] Exception saving schedules:", e)

if __name__ == "__main__":
    main()
