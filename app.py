from flask import Flask, render_template, jsonify
import requests

app = Flask(__name__)


@app.route("/")
def home():
    return render_template("index.html")


@app.route("/api/latest-launch")
def latest_launch():
    try:
        response = requests.get(
            "https://ll.thespacedevs.com/2.2.0/launch/",
            params={
                "search": "SpaceX",
                "limit": 1,
                "ordering": "-net"
            },
            timeout=10
        )

        response.raise_for_status()
        data = response.json()
        launch = data["results"][0]

        mission = launch.get("mission") or {}
        status = launch.get("status") or {}

        return jsonify({
            "name": launch.get("name", "Unknown mission"),
            "date": launch.get("net", "Unknown date"),
            "status": status.get("name", "Unknown status"),
            "details": mission.get(
                "description",
                "No mission details available."
            )
        })

    except requests.RequestException as error:
        return jsonify({
            "error": "The launch-data API could not be reached.",
            "details": str(error)
        }), 502

    except (ValueError, IndexError, KeyError):
        return jsonify({
            "error": "The API returned unexpected data."
        }), 502

@app.route("/api/nasa-photo")
def nasa_photo():
    try:
        response = requests.get(
            "https://api.nasa.gov/planetary/apod",
            params={"api_key": "DEMO_KEY"},
            timeout=10
        )

        response.raise_for_status()
        photo = response.json()

        return jsonify({
            "title": photo.get("title", "NASA Astronomy Picture"),
            "date": photo.get("date", "Unknown date"),
            "explanation": photo.get("explanation", "No explanation available."),
            "image_url": photo.get("url"),
            "media_type": photo.get("media_type")
        })

    except requests.RequestException as error:
        return jsonify({
            "error": "The NASA API could not be reached.",
            "details": str(error)
        }), 502

if __name__ == "__main__":
    app.run(debug=True)