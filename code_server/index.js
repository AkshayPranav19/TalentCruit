

const express    = require("express");
const bodyParser = require("body-parser");
const cors       = require("cors");
const { execFile } = require("child_process");
const path       = require("path");

const app = express();
app.use(cors());
app.use(bodyParser.json());

const PYTHON_TIMEOUT_MS = 5000;


app.get('/ping', (req, res) => {
  res.status(200).json({ status: 'ok' });
});


app.post("/run-tests", (req, res) => {
  const { questionId, code } = req.body;
  if (!questionId || !code) {
    return res.status(400).json({ error: "questionId and code are required" });
  }

  const pythonCmd  = process.platform === "win32" ? "python" : "python3";
  const scriptPath = path.join(__dirname, "pythonRunner.py");

  const child = execFile(
    pythonCmd,
    [scriptPath],
    { timeout: PYTHON_TIMEOUT_MS, maxBuffer: 10 * 1024 * 1024 },
    (err, stdout, stderr) => {
      if (err && err.killed && err.signal === "SIGTERM") {
        return res
          .status(408)
          .json({ error: "Execution timed out (possible infinite loop)" });
      }

      if (err) {
        return res.status(500).json({ error: err.message });
      }

      if (stderr) {
        return res.status(500).json({ error: stderr });
      }

      let result;
      try {
        result = JSON.parse(stdout);
      } catch (parseErr) {
        return res
          .status(500)
          .json({ error: "Invalid JSON from Python runner", details: stdout });
      }

      if (result.error) {
        return res.status(400).json(result);
      }

      return res.json(result);
    }
  );


  child.stdin.write(JSON.stringify({ questionId, code }));
  child.stdin.end();
});

const PORT = process.env.PORT || 5002;
app.listen(PORT, () => {
  console.log(`Test runner listening on http://localhost:${PORT}`);
});
