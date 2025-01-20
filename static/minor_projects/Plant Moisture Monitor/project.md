---
Put together a simple capacitive moisture sensor using an ESP32-C3, that allows me to monitor my plants' moisture at all times.

<img src="/static/minor_projects/Plant Moisture Monitor/esp32&moisture_sensor.jpg" alr="drawing" style="width:400px;"/>

The ESP is connected to the moisture sensor through a rotary potentiometer which can adjust the sensitivity of the sensor by changing the resistance between the ESP and sensor.

<img src="/static/minor_projects/Plant Moisture Monitor/side_of_pot.jpg" alr="drawing" style="width:400px;"/>

The ESP is wirelessly connected to our network, allowing it to send the readings to Home Assistant where it is converted into a Gauge that indicates when it requires watering (Yellow) and when it is starting to dry out (Red).

<img src="/static/minor_projects/Plant Moisture Monitor/homeassistantdial.jpg" alr="drawing" style="width:400px;"/>

The sensor has the following YAML configuration:

```
sensor:
  - platform: adc
    pin: GPIO02
    name: "Analog Sensor"
    update_interval: 30s
    attenuation: 11db     # Attenuation for 3.3v
    filters: 
      - calibrate_linear:
          - 0.0 -> 100
          - 3.3 -> 0
      - sliding_window_moving_average:
          window_size: 15
          send_every: 5
      - lambda: return x;
```

calibrate_linear: Converts the voltage to a percentage 'moisture' where 100% is totally emersed in water and 0 is dry.
sliding_window_moving_average: Records the last 15 readings in memory and displays the average, outputting value to Home Assistant every 5 readings.

### (1/15/24)