from flask import Flask, render_template, request, jsonify
import json

app = Flask(__name__)

@app.route("/")
def home():
    with open("snippets.json") as f:
        snippets = json.load(f)

    return render_template("index.html", snippets=snippets)

@app.route("/tools")
def tools():
    return render_template("tools.html")


# update JSON file 

@app.route("/update-snippet", methods=["POST"])
def update_snippet():
    data = request.get_json()

    snippet_id = int(data["id"])
    new_title = data.get("title", "")
    new_content = data["content"]
    new_tags = data.get("tags", [])

    with open("snippets.json", "r") as f:
        snippets = json.load(f)

    for snippet in snippets:
        if snippet["id"] == snippet_id:
            snippet["title"] = new_title
            snippet["content"] = new_content
            snippet["tags"] = new_tags
            break

    with open("snippets.json", "w") as f:
        json.dump(snippets, f, indent=4)

    return jsonify({"status": "success"})

@app.route("/delete-snippet", methods=["POST"])
def delete_snippet():
    data = request.get_json()

    snippet_id = int(data["id"])

    with open("snippets.json", "r") as f:
        snippets = json.load(f)

    # Remove snippet with matching ID
    snippets = [s for s in snippets if s["id"] != snippet_id]

    with open("snippets.json", "w") as f:
        json.dump(snippets, f, indent=4)

    return jsonify({"status": "success"})

@app.route("/duplicate-snippet", methods=["POST"])
def duplicate_snippet():
    data = request.get_json()

    snippet_id = int(data["id"])

    with open("snippets.json", "r") as f:
        snippets = json.load(f)

    # Find the original snippet
    original = None
    for s in snippets:
        if s["id"] == snippet_id:
            original = s
            break

    if not original:
        return jsonify({"status": "error", "message": "Snippet not found"}), 404

    # Generate new ID
    if snippets:
        new_id = max(s["id"] for s in snippets) + 1
    else:
        new_id = 1

    # Create copy
    new_snippet = {
        "id": new_id,
        "title": original["title"] + " (Copy)",
        "content": original["content"],
        "tags": original.get("tags", [])
    }

    snippets.append(new_snippet)

    with open("snippets.json", "w") as f:
        json.dump(snippets, f, indent=4)

    return jsonify({"status": "success"})







# Run debugger everytiem
if __name__ == "__main__":
    app.run(debug=True)