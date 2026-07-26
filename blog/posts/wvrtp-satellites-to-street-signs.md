# From Satellites to Street Signs: How the WVRTP App Finds You

*July 26, 2026 · 5 min read*

---

In industrial maintenance at the West Virginia Regional Technology Park (WVRTP), data integrity is the difference between a safe facility and a catastrophic failure. The WVRTP inspection app is a static React SPA built to solve a specific human problem: proving that inspectors are physically standing at the equipment they're documenting.

## Why location matters

The core driver for location tracking is accountability. By capturing GPS coordinates the moment a form is submitted, the system provides proof of presence — it prevents "pencil-whipping," the practice of checking off inspection boxes from a desk or breakroom without visiting the boilers, HVAC units, or pressure vessels in question.

To do that, the app has to bridge the gap between satellite data and a human-readable location.

## Two languages of location

A phone understands the world through precise numerical grids; managers and auditors need human context. The app captures both:

| Data type | Primary user | Format example |
| --- | --- | --- |
| GPS coordinates | Machines / computers | 38.3500° N, 81.7133° W |
| Street address | Human admins / inspectors | 1740 Union Carbide Dr, South Charleston, WV |

The technical process always starts with the raw numerical coordinates from the phone's hardware.

## Phase 1: capturing the raw data

Because the app is a static SPA running in the mobile browser, it doesn't need to be installed to access location hardware — it uses the browser Geolocation API directly. `navigator.geolocation.getCurrentPosition` is configured with a high-accuracy flag and a 10-second timeout so the app never hangs on a weak signal.

The sequence: an inspector scans a QR code, the page load triggers the location request, the browser prompts for permission, and it locks onto latitude/longitude via GPS and Wi-Fi positioning. At this point the app has the numbers but not the name of the building or street.

## Phase 2: reverse geocoding

To translate coordinates into a readable address, the app calls **Nominatim**, an OpenStreetMap-powered reverse-geocoding service. Nominatim was chosen because it's free and requires no API key — ideal for a lightweight industrial tool — though its usage policy requires a specific `User-Agent` header (`WVRTPInspectionApp/1.0`).

A sample response looks like:

```json
{
  "lat": "38.3500",
  "lon": "-81.7133",
  "display_name": "1740 Union Carbide Dr, South Charleston, Kanawha County, West Virginia, 25303, United States",
  "address": {
    "road": "Union Carbide Dr",
    "city": "South Charleston",
    "state": "West Virginia",
    "postcode": "25303"
  }
}
```

## From phone to spreadsheet

When the inspector submits, the app bundles the inspection results and location data into a **flat JSON payload**: timestamp, equipment ID (pre-filled from the QR code), latitude/longitude, and the human-readable address from Nominatim.

Because the payload is flat rather than nested, Power Automate needs no complex parsing logic — it performs a 1:1 field mapping straight into a shared Excel spreadsheet. No backend database, no server to maintain, and the whole pipeline stays inside WVRTP's existing Microsoft 365 tenant.

## Accuracy and limitations

Field technology has constraints a lab doesn't:

- **Indoor accuracy** — GPS is often obstructed by industrial roofing; indoors, accuracy typically drops to 50–100 meters. Enough to prove the inspector is on-campus, not enough for room-level precision.
- **HTTPS requirement** — the Geolocation API is a secure-context feature and only works over HTTPS.
- **Non-blocking failure** — if a user denies permission or the signal fails, the form still submits so the inspection record isn't lost, even with blank location fields.
- **Photo omissions** — the payload currently captures only the photo's filename, not the binary file; image storage is a planned enhancement.

By layering satellite data, an open-source reverse-geocoder, and low-code cloud automation, the WVRTP app creates a seamless path from a physical boiler to a digital record in a spreadsheet — without a backend, an ops team, or a procurement cycle.

---

*Built for [Readyfuels](https://readyfuels.com). More on the delivery side of this project is in [Projects](/projects).*
